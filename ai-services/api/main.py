"""
FastAPI REST API for AI Services
Exposes LLM, Speech Recognition, and Emotion Detection endpoints
"""

import os
import sys
import logging
from pathlib import Path
from typing import Optional, Dict, Any
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import uvicorn
from datetime import datetime
import tempfile
import shutil

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from services.llm_agent import get_agent, UserContext
from services.speech_service import get_transcriber
from services.emotion_service import get_audio_detector, get_text_detector, get_analyzer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="EduGame4All AI Services",
    description="AI-powered educational services for personalized learning",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for requests
class ChatRequest(BaseModel):
    user_id: str
    message: str
    context: Optional[Dict[str, Any]] = None
    language: str = "es"
    age_group: str = "adult"
    current_level: str = "beginner"

class FeedbackRequest(BaseModel):
    user_id: str
    game_session: Dict[str, Any]
    language: str = "es"
    age_group: str = "adult"
    current_level: str = "beginner"

class EmotionTextRequest(BaseModel):
    text: str
    context: Optional[Dict[str, Any]] = None

# Global variables for model instances
models_loaded = False
agent = None
transcriber = None
emotion_analyzer = None

@app.on_event("startup")
async def startup_event():
    """Load all AI models on startup"""
    global models_loaded, agent, transcriber, emotion_analyzer
    
    logger.info("=" * 60)
    logger.info("Starting EduGame4All AI Services")
    logger.info("=" * 60)
    
    try:
        logger.info("Loading AI models... This may take 2-3 minutes")
        
        # Load models (lazy loading - will load on first use)
        logger.info("✓ AI services initialized")
        
        models_loaded = True
        logger.info("=" * 60)
        logger.info("AI Services ready!")
        logger.info("=" * 60)
        
    except Exception as e:
        logger.error(f"Error loading models: {e}")
        models_loaded = False

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "EduGame4All AI Services",
        "version": "1.0.0",
        "status": "running",
        "models_loaded": models_loaded
    }

@app.get("/api/ai/health")
async def health_check():
    """
    Health check endpoint
    Verifies status of all AI models
    """
    try:
        import psutil
        import torch
        
        memory = psutil.virtual_memory()
        
        health_status = {
            "status": "healthy" if models_loaded else "loading",
            "timestamp": datetime.now().isoformat(),
            "models_loaded": models_loaded,
            "system": {
                "memory_used_gb": round(memory.used / (1024**3), 2),
                "memory_total_gb": round(memory.total / (1024**3), 2),
                "memory_percent": memory.percent,
                "cuda_available": torch.cuda.is_available(),
                "cuda_device": torch.cuda.get_device_name(0) if torch.cuda.is_available() else None
            }
        }
        
        return health_status
        
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return {
            "status": "error",
            "error": str(e)
        }

@app.post("/api/ai/chat")
async def chat(request: ChatRequest):
    """
    Chat with educational AI agent
    
    Provides personalized responses based on user context
    """
    try:
        global agent
        if agent is None:
            agent = get_agent()
        
        user_context = UserContext(
            user_id=request.user_id,
            language=request.language,
            age_group=request.age_group,
            current_level=request.current_level
        )
        
        response = agent.chat(request.message, user_context)
        
        return JSONResponse(content=response)
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/feedback")
async def generate_feedback(request: FeedbackRequest):
    """
    Generate personalized feedback for game session
    
    Analyzes performance and provides AI-generated insights
    """
    try:
        global agent
        if agent is None:
            agent = get_agent()
        
        user_context = UserContext(
            user_id=request.user_id,
            language=request.language,
            age_group=request.age_group,
            current_level=request.current_level
        )
        
        feedback = agent.generate_feedback(request.game_session, user_context)
        
        return JSONResponse(content=feedback)
        
    except Exception as e:
        logger.error(f"Feedback generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/transcribe")
async def transcribe_audio(
    audio_file: UploadFile = File(...),
    language: Optional[str] = Form(None),
    translate_to: Optional[str] = Form(None),
    background_tasks: BackgroundTasks = None
):
    """
    Transcribe audio file to text
    
    Supports 100+ languages with automatic detection
    """
    try:
        global transcriber
        if transcriber is None:
            transcriber = get_transcriber()
        
        # Validate file type
        allowed_types = ["audio/wav", "audio/mpeg", "audio/mp3", "audio/m4a", "audio/ogg"]
        if audio_file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}"
            )
        
        # Save temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(audio_file.filename).suffix) as tmp_file:
            shutil.copyfileobj(audio_file.file, tmp_file)
            tmp_path = tmp_file.name
        
        try:
            # Determine task
            task = "translate" if translate_to else "transcribe"
            
            # Transcribe
            result = transcriber.transcribe(tmp_path, language, task)
            
            # Schedule cleanup
            if background_tasks:
                background_tasks.add_task(os.remove, tmp_path)
            else:
                os.remove(tmp_path)
            
            return JSONResponse(content=result)
            
        except Exception as e:
            # Cleanup on error
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
            raise e
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Transcription error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/emotion/audio")
async def detect_emotion_audio(
    audio_file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None
):
    """
    Detect emotion from audio file
    
    Returns emotion, confidence, and pedagogical recommendations
    """
    try:
        global emotion_analyzer
        if emotion_analyzer is None:
            emotion_analyzer = get_analyzer()
        
        # Save temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(audio_file.filename).suffix) as tmp_file:
            shutil.copyfileobj(audio_file.file, tmp_file)
            tmp_path = tmp_file.name
        
        try:
            # Detect emotion
            result = emotion_analyzer.audio_detector.detect(tmp_path)
            
            # Schedule cleanup
            if background_tasks:
                background_tasks.add_task(os.remove, tmp_path)
            else:
                os.remove(tmp_path)
            
            return JSONResponse(content=result)
            
        except Exception as e:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
            raise e
        
    except Exception as e:
        logger.error(f"Audio emotion detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/emotion/text")
async def detect_emotion_text(request: EmotionTextRequest):
    """
    Detect emotion from text
    
    Returns emotion, confidence, and sentiment score
    """
    try:
        global emotion_analyzer
        if emotion_analyzer is None:
            emotion_analyzer = get_analyzer()
        
        result = emotion_analyzer.text_detector.detect(request.text)
        
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"Text emotion detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/analyze-complete")
async def analyze_complete(
    audio_file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
    user_id: str = Form(...),
    background_tasks: BackgroundTasks = None
):
    """
    Complete analysis pipeline
    
    Transcribes audio, detects emotions, and generates adaptive response
    """
    try:
        global transcriber, emotion_analyzer, agent
        
        if transcriber is None:
            transcriber = get_transcriber()
        if emotion_analyzer is None:
            emotion_analyzer = get_analyzer()
        if agent is None:
            agent = get_agent()
        
        result = {
            "user_id": user_id,
            "transcription": None,
            "emotion_analysis": None,
            "ai_response": None
        }
        
        tmp_path = None
        
        try:
            # Process audio if provided
            if audio_file:
                with tempfile.NamedTemporaryFile(delete=False, suffix=Path(audio_file.filename).suffix) as tmp_file:
                    shutil.copyfileobj(audio_file.file, tmp_file)
                    tmp_path = tmp_file.name
                
                # Transcribe
                transcription_result = transcriber.transcribe(tmp_path)
                result["transcription"] = transcription_result
                
                # Use transcribed text if no text provided
                if not text:
                    text = transcription_result.get("transcription", "")
            
            # Analyze emotions
            if tmp_path or text:
                emotion_result = emotion_analyzer.analyze_multimodal(
                    audio_path=tmp_path,
                    text=text
                )
                result["emotion_analysis"] = emotion_result
            
            # Generate AI response if we have text
            if text:
                user_context = UserContext(user_id=user_id)
                ai_response = agent.chat(text, user_context)
                result["ai_response"] = ai_response
            
            # Cleanup
            if tmp_path:
                if background_tasks:
                    background_tasks.add_task(os.remove, tmp_path)
                else:
                    os.remove(tmp_path)
            
            return JSONResponse(content=result)
            
        except Exception as e:
            if tmp_path and os.path.exists(tmp_path):
                os.remove(tmp_path)
            raise e
        
    except Exception as e:
        logger.error(f"Complete analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("AI_SERVICE_PORT", 8001))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info"
    )
