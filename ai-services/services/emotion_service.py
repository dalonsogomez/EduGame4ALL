"""
Emotion Detection Service
Detects emotions from audio and text to adapt learning experience
"""

import os
import logging
from typing import Dict, List, Tuple
import torch
import torchaudio
from transformers import (
    Wav2Vec2ForSequenceClassification,
    Wav2Vec2FeatureExtractor,
    AutoTokenizer,
    AutoModelForSequenceClassification
)
import numpy as np

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AudioEmotionDetector:
    """
    Detect emotions from audio using Wav2Vec2
    Emotions: angry, calm, disgust, fearful, happy, neutral, sad, surprised
    """
    
    def __init__(self, model_name: str = None):
        """
        Initialize audio emotion detector
        
        Args:
            model_name: HuggingFace model name for audio emotion recognition
        """
        self.model_name = model_name or os.getenv(
            "EMOTION_MODEL_AUDIO",
            "ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition"
        )
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = None
        self.feature_extractor = None
        self.emotion_labels = ["angry", "calm", "disgust", "fearful", "happy", "neutral", "sad", "surprised"]
        
        logger.info(f"Initializing Audio Emotion Detector on {self.device}")
        self._load_model()
    
    def _load_model(self):
        """Load emotion detection model"""
        try:
            cache_dir = os.getenv("CACHE_DIR", "./models")
            
            self.feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained(
                self.model_name,
                cache_dir=cache_dir
            )
            
            self.model = Wav2Vec2ForSequenceClassification.from_pretrained(
                self.model_name,
                cache_dir=cache_dir
            ).to(self.device)
            
            self.model.eval()
            logger.info("Audio emotion model loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading audio emotion model: {e}")
            raise
    
    def detect(self, audio_path: str) -> Dict[str, any]:
        """
        Detect emotion from audio file
        
        Args:
            audio_path: Path to audio file
            
        Returns:
            Dict with dominant emotion, confidence, and all probabilities
        """
        try:
            # Load and preprocess audio
            waveform, sample_rate = torchaudio.load(audio_path)
            
            # Resample to 16kHz if needed
            if sample_rate != 16000:
                resampler = torchaudio.transforms.Resample(sample_rate, 16000)
                waveform = resampler(waveform)
            
            # Convert to mono if stereo
            if waveform.shape[0] > 1:
                waveform = torch.mean(waveform, dim=0, keepdim=True)
            
            # Normalize
            waveform = waveform.squeeze().numpy()
            waveform = (waveform - np.mean(waveform)) / (np.std(waveform) + 1e-5)
            
            # Extract features
            inputs = self.feature_extractor(
                waveform,
                sampling_rate=16000,
                return_tensors="pt",
                padding=True
            )
            
            # Move to device
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # Predict
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
                probabilities = torch.nn.functional.softmax(logits, dim=-1)
            
            # Get results
            probs = probabilities.cpu().numpy()[0]
            dominant_idx = np.argmax(probs)
            dominant_emotion = self.emotion_labels[dominant_idx] if dominant_idx < len(self.emotion_labels) else "neutral"
            confidence = float(probs[dominant_idx])
            
            # Create probability dict
            prob_dict = {
                label: float(probs[i]) if i < len(probs) else 0.0
                for i, label in enumerate(self.emotion_labels)
            }
            
            result = {
                "emotion": dominant_emotion,
                "confidence": confidence,
                "probabilities": prob_dict,
                "recommendations": self.get_pedagogical_recommendation(dominant_emotion, confidence)
            }
            
            logger.info(f"Detected emotion: {dominant_emotion} (confidence: {confidence:.2f})")
            return result
            
        except Exception as e:
            logger.error(f"Error detecting emotion from audio: {e}")
            return {
                "emotion": "neutral",
                "confidence": 0.0,
                "error": str(e),
                "recommendations": []
            }
    
    def get_pedagogical_recommendation(self, emotion: str, confidence: float) -> List[str]:
        """
        Get pedagogical recommendations based on detected emotion
        
        Args:
            emotion: Detected emotion
            confidence: Confidence score
            
        Returns:
            List of recommendations
        """
        if confidence < 0.5:
            return ["Continue with current approach"]
        
        recommendations = {
            "angry": [
                "Take a short break",
                "Simplify the content temporarily",
                "Provide more encouragement"
            ],
            "fearful": [
                "Offer more support and examples",
                "Reduce difficulty level",
                "Provide step-by-step guidance"
            ],
            "sad": [
                "Show motivational content",
                "Simplify current task",
                "Highlight recent achievements"
            ],
            "frustrated": [
                "Offer hints or tips",
                "Break down the problem",
                "Suggest alternative approach"
            ],
            "happy": [
                "Maintain current difficulty",
                "Consider slight increase in challenge",
                "Reinforce positive behavior"
            ],
            "calm": [
                "Maintain current pace",
                "Introduce new concepts gradually"
            ],
            "surprised": [
                "Provide context for unexpected content",
                "Ensure understanding before proceeding"
            ]
        }
        
        return recommendations.get(emotion, ["Continue with current approach"])


class TextEmotionDetector:
    """
    Detect emotions from text using DistilBERT
    Emotions: joy, sadness, anger, fear, love, surprise
    """
    
    def __init__(self, model_name: str = None):
        """
        Initialize text emotion detector
        
        Args:
            model_name: HuggingFace model name for text emotion classification
        """
        self.model_name = model_name or os.getenv(
            "EMOTION_MODEL_TEXT",
            "bhadresh-savani/distilbert-base-uncased-emotion"
        )
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = None
        self.tokenizer = None
        
        logger.info(f"Initializing Text Emotion Detector on {self.device}")
        self._load_model()
    
    def _load_model(self):
        """Load text emotion model"""
        try:
            cache_dir = os.getenv("CACHE_DIR", "./models")
            
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_name,
                cache_dir=cache_dir
            )
            
            self.model = AutoModelForSequenceClassification.from_pretrained(
                self.model_name,
                cache_dir=cache_dir
            ).to(self.device)
            
            self.model.eval()
            logger.info("Text emotion model loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading text emotion model: {e}")
            raise
    
    def detect(self, text: str) -> Dict[str, any]:
        """
        Detect emotion from text
        
        Args:
            text: Input text
            
        Returns:
            Dict with emotion, confidence, and probabilities
        """
        try:
            if not text or len(text.strip()) == 0:
                return {
                    "emotion": "neutral",
                    "confidence": 0.0,
                    "probabilities": {}
                }
            
            # Tokenize
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                max_length=512,
                padding=True
            ).to(self.device)
            
            # Predict
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
                probabilities = torch.nn.functional.softmax(logits, dim=-1)
            
            # Get results
            probs = probabilities.cpu().numpy()[0]
            dominant_idx = np.argmax(probs)
            
            # Get label
            id2label = self.model.config.id2label
            dominant_emotion = id2label.get(dominant_idx, "neutral")
            confidence = float(probs[dominant_idx])
            
            # Create probability dict
            prob_dict = {
                id2label.get(i, f"label_{i}"): float(probs[i])
                for i in range(len(probs))
            }
            
            result = {
                "emotion": dominant_emotion,
                "confidence": confidence,
                "probabilities": prob_dict,
                "sentiment_score": self._calculate_sentiment(dominant_emotion, confidence)
            }
            
            logger.info(f"Detected text emotion: {dominant_emotion} (confidence: {confidence:.2f})")
            return result
            
        except Exception as e:
            logger.error(f"Error detecting emotion from text: {e}")
            return {
                "emotion": "neutral",
                "confidence": 0.0,
                "error": str(e)
            }
    
    def _calculate_sentiment(self, emotion: str, confidence: float) -> float:
        """
        Calculate sentiment score from -1 (negative) to +1 (positive)
        
        Args:
            emotion: Detected emotion
            confidence: Confidence score
            
        Returns:
            Sentiment score
        """
        sentiment_map = {
            "joy": 1.0,
            "love": 0.8,
            "surprise": 0.3,
            "neutral": 0.0,
            "fear": -0.5,
            "sadness": -0.7,
            "anger": -0.9
        }
        
        base_score = sentiment_map.get(emotion, 0.0)
        return base_score * confidence


class EmotionAnalyzer:
    """
    Orchestrator for multimodal emotion analysis
    Combines audio and text emotion detection
    """
    
    def __init__(self):
        """Initialize emotion analyzer with both detectors"""
        self.audio_detector = AudioEmotionDetector()
        self.text_detector = TextEmotionDetector()
        logger.info("Emotion Analyzer initialized")
    
    def analyze_multimodal(
        self,
        audio_path: Optional[str] = None,
        text: Optional[str] = None
    ) -> Dict[str, any]:
        """
        Analyze emotions from both audio and text
        
        Args:
            audio_path: Path to audio file (optional)
            text: Text content (optional)
            
        Returns:
            Combined emotion analysis with recommendations
        """
        results = {
            "audio_emotion": None,
            "text_emotion": None,
            "combined_emotion": "neutral",
            "confidence": 0.0,
            "recommendations": []
        }
        
        try:
            # Analyze audio
            if audio_path and os.path.exists(audio_path):
                audio_result = self.audio_detector.detect(audio_path)
                results["audio_emotion"] = audio_result
            
            # Analyze text
            if text:
                text_result = self.text_detector.detect(text)
                results["text_emotion"] = text_result
            
            # Combine results
            if results["audio_emotion"] and results["text_emotion"]:
                # Weighted average (audio has more weight for emotion)
                audio_conf = results["audio_emotion"]["confidence"]
                text_conf = results["text_emotion"]["confidence"]
                
                if audio_conf > text_conf:
                    results["combined_emotion"] = results["audio_emotion"]["emotion"]
                    results["confidence"] = audio_conf
                    results["recommendations"] = results["audio_emotion"]["recommendations"]
                else:
                    results["combined_emotion"] = results["text_emotion"]["emotion"]
                    results["confidence"] = text_conf
                    results["recommendations"] = self.audio_detector.get_pedagogical_recommendation(
                        results["text_emotion"]["emotion"],
                        text_conf
                    )
            
            elif results["audio_emotion"]:
                results["combined_emotion"] = results["audio_emotion"]["emotion"]
                results["confidence"] = results["audio_emotion"]["confidence"]
                results["recommendations"] = results["audio_emotion"]["recommendations"]
            
            elif results["text_emotion"]:
                results["combined_emotion"] = results["text_emotion"]["emotion"]
                results["confidence"] = results["text_emotion"]["confidence"]
            
            # Generate pedagogical adjustments
            results["pedagogical_adjustments"] = self._generate_adjustments(
                results["combined_emotion"],
                results["confidence"]
            )
            
            return results
            
        except Exception as e:
            logger.error(f"Error in multimodal analysis: {e}")
            results["error"] = str(e)
            return results
    
    def _generate_adjustments(self, emotion: str, confidence: float) -> Dict[str, any]:
        """
        Generate specific pedagogical adjustments
        
        Args:
            emotion: Detected emotion
            confidence: Confidence score
            
        Returns:
            Dict with adjustment recommendations
        """
        if confidence < 0.5:
            return {
                "difficulty_adjustment": 0,
                "support_level": "normal",
                "encouragement": "standard"
            }
        
        adjustments = {
            "angry": {
                "difficulty_adjustment": -1,
                "support_level": "high",
                "encouragement": "high",
                "break_recommended": True
            },
            "fearful": {
                "difficulty_adjustment": -1,
                "support_level": "very_high",
                "encouragement": "high",
                "hints_enabled": True
            },
            "sad": {
                "difficulty_adjustment": -1,
                "support_level": "high",
                "encouragement": "very_high",
                "show_achievements": True
            },
            "happy": {
                "difficulty_adjustment": 1,
                "support_level": "normal",
                "encouragement": "standard",
                "challenge_increase": True
            },
            "calm": {
                "difficulty_adjustment": 0,
                "support_level": "normal",
                "encouragement": "standard"
            }
        }
        
        return adjustments.get(emotion, {
            "difficulty_adjustment": 0,
            "support_level": "normal",
            "encouragement": "standard"
        })


# Singleton instances
_audio_detector_instance = None
_text_detector_instance = None
_analyzer_instance = None

def get_audio_detector() -> AudioEmotionDetector:
    """Get or create singleton audio detector"""
    global _audio_detector_instance
    if _audio_detector_instance is None:
        _audio_detector_instance = AudioEmotionDetector()
    return _audio_detector_instance

def get_text_detector() -> TextEmotionDetector:
    """Get or create singleton text detector"""
    global _text_detector_instance
    if _text_detector_instance is None:
        _text_detector_instance = TextEmotionDetector()
    return _text_detector_instance

def get_analyzer() -> EmotionAnalyzer:
    """Get or create singleton emotion analyzer"""
    global _analyzer_instance
    if _analyzer_instance is None:
        _analyzer_instance = EmotionAnalyzer()
    return _analyzer_instance
