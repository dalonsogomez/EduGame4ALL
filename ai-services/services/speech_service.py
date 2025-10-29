"""
Speech Recognition Service using OpenAI Whisper
Supports multilingual transcription and translation
"""

import os
import logging
from typing import Dict, Optional, Tuple
import torch
import whisper
import numpy as np
import soundfile as sf
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SpeechTranscriber:
    """
    Multilingual speech transcription service using Whisper Large V3
    Supports 100+ languages with automatic language detection
    """
    
    def __init__(self, model_size: str = None):
        """
        Initialize Whisper model
        
        Args:
            model_size: Whisper model size (tiny, base, small, medium, large, large-v3)
        """
        self.model_size = model_size or os.getenv("WHISPER_MODEL", "large-v3")
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        logger.info(f"Initializing Whisper {self.model_size} on {self.device}")
        self._load_model()
    
    def _load_model(self):
        """Load Whisper model with optimizations"""
        try:
            cache_dir = os.getenv("CACHE_DIR", "./models")
            self.model = whisper.load_model(
                self.model_size,
                device=self.device,
                download_root=cache_dir
            )
            
            # Apply optimizations if available
            if self.device == "cuda":
                try:
                    self.model = torch.compile(self.model)
                    logger.info("Applied torch.compile optimization")
                except Exception as e:
                    logger.warning(f"Could not apply torch.compile: {e}")
            
            logger.info
(f"Whisper {self.model_size} loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading Whisper model: {e}")
            raise
    
    def transcribe(
        self,
        audio_path: str,
        language: Optional[str] = None,
        task: str = "transcribe"
    ) -> Dict[str, any]:
        """
        Transcribe audio file
        
        Args:
            audio_path: Path to audio file (wav, mp3, m4a, ogg)
            language: Language code (e.g., 'es', 'en', 'ar'). None for auto-detect
            task: 'transcribe' or 'translate' (to English)
            
        Returns:
            Dict with transcription, language, and confidence
        """
        try:
            # Validate file
            if not os.path.exists(audio_path):
                raise FileNotFoundError(f"Audio file not found: {audio_path}")
            
            file_size = os.path.getsize(audio_path)
            if file_size > 25 * 1024 * 1024:  # 25MB limit
                raise ValueError(f"File too large: {file_size / 1024 / 1024:.1f}MB (max 25MB)")
            
            # Transcribe
            logger.info(f"Transcribing {audio_path} (task: {task}, language: {language})")
            
            options = {
                "task": task,
                "fp16": self.device == "cuda"
            }
            
            if language:
                options["language"] = language
            
            result = self.model.transcribe(audio_path, **options)
            
            return {
                "transcription": result["text"].strip(),
                "detected_language": result.get("language", "unknown"),
                "confidence": self._calculate_confidence(result),
                "duration": self._get_audio_duration(audio_path)
            }
            
        except Exception as e:
            logger.error(f"Error transcribing audio: {e}")
            return {
                "transcription": "",
                "error": str(e),
                "confidence": 0.0
            }
    
    def transcribe_with_timestamps(
        self,
        audio_path: str,
        language: Optional[str] = None
    ) -> Dict[str, any]:
        """
        Transcribe audio with word-level timestamps
        
        Args:
            audio_path: Path to audio file
            language: Language code or None for auto-detect
            
        Returns:
            Dict with segments containing text and timestamps
        """
        try:
            options = {
                "task": "transcribe",
                "fp16": self.device == "cuda",
                "word_timestamps": True
            }
            
            if language:
                options["language"] = language
            
            result = self.model.transcribe(audio_path, **options)
            
            segments = []
            for segment in result.get("segments", []):
                segments.append({
                    "text": segment["text"].strip(),
                    "start": segment["start"],
                    "end": segment["end"],
                    "confidence": segment.get("confidence", 0.0)
                })
            
            return {
                "transcription": result["text"].strip(),
                "segments": segments,
                "detected_language": result.get("language", "unknown"),
                "duration": self._get_audio_duration(audio_path)
            }
            
        except Exception as e:
            logger.error(f"Error transcribing with timestamps: {e}")
            return {
                "transcription": "",
                "segments": [],
                "error": str(e)
            }
    
    def detect_language(self, audio_path: str) -> Tuple[str, float]:
        """
        Detect language of audio file
        
        Args:
            audio_path: Path to audio file
            
        Returns:
            Tuple of (language_code, confidence)
        """
        try:
            # Load audio
            audio = whisper.load_audio(audio_path)
            audio = whisper.pad_or_trim(audio)
            
            # Make log-Mel spectrogram
            mel = whisper.log_mel_spectrogram(audio).to(self.device)
            
            # Detect language
            _, probs = self.model.detect_language(mel)
            detected_lang = max(probs, key=probs.get)
            confidence = probs[detected_lang]
            
            logger.info(f"Detected language: {detected_lang} (confidence: {confidence:.2f})")
            return detected_lang, confidence
            
        except Exception as e:
            logger.error(f"Error detecting language: {e}")
            return "unknown", 0.0
    
    def _calculate_confidence(self, result: Dict) -> float:
        """Calculate average confidence from Whisper result"""
        segments = result.get("segments", [])
        if not segments:
            return 0.5  # Default
        
        confidences = [s.get("no_speech_prob", 0.5) for s in segments]
        # Invert no_speech_prob to get confidence
        avg_confidence = 1.0 - (sum(confidences) / len(confidences))
        return max(0.0, min(1.0, avg_confidence))
    
    def _get_audio_duration(self, audio_path: str) -> float:
        """Get audio duration in seconds"""
        try:
            audio_data, sample_rate = sf.read(audio_path)
            duration = len(audio_data) / sample_rate
            return round(duration, 2)
        except Exception as e:
            logger.warning(f"Could not get audio duration: {e}")
            return 0.0
    
    def process_chunked(
        self,
        audio_path: str,
        chunk_length: int = 30,
        language: Optional[str] = None
    ) -> Dict[str, any]:
        """
        Process long audio files in chunks
        
        Args:
            audio_path: Path to audio file
            chunk_length: Length of each chunk in seconds
            language: Language code or None
            
        Returns:
            Dict with full transcription and chunks
        """
        try:
            # Load full audio
            audio_data, sample_rate = sf.read(audio_path)
            duration = len(audio_data) / sample_rate
            
            if duration <= chunk_length:
                # Process as single file
                return self.transcribe(audio_path, language)
            
            # Split into chunks
            chunk_samples = chunk_length * sample_rate
            chunks = []
            full_transcription = []
            
            for i in range(0, len(audio_data), chunk_samples):
                chunk = audio_data[i:i + chunk_samples]
                
                # Save temporary chunk
                temp_path = f"/tmp/chunk_{i}.wav"
                sf.write(temp_path, chunk, sample_rate)
                
                # Transcribe chunk
                result = self.transcribe(temp_path, language)
                chunks.append({
                    "start": i / sample_rate,
                    "end": min((i + chunk_samples) / sample_rate, duration),
                    "text": result["transcription"]
                })
                full_transcription.append(result["transcription"])
                
                # Clean up
                os.remove(temp_path)
            
            return {
                "transcription": " ".join(full_transcription),
                "chunks": chunks,
                "detected_language": language or "unknown",
                "duration": duration
            }
            
        except Exception as e:
            logger.error(f"Error processing chunked audio: {e}")
            return {
                "transcription": "",
                "error": str(e)
            }


# Singleton instance
_transcriber_instance = None

def get_transcriber() -> SpeechTranscriber:
    """Get or create singleton transcriber instance"""
    global _transcriber_instance
    if _transcriber_instance is None:
        _transcriber_instance = SpeechTranscriber()
    return _transcriber_instance
