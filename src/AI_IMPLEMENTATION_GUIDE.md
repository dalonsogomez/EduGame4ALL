# Guía de Implementación de IA - EduGame4ALL

## 🎯 Objetivo

Esta guía proporciona instrucciones paso a paso para integrar modelos de IA reales (Llama-3.1-8B, Whisper, etc.) en EduGame4ALL, reemplazando las simulaciones actuales con capacidades de IA verdaderas.

## 📋 Pre-requisitos

### Hardware Mínimo Recomendado
- **RAM**: 16GB (32GB recomendado)
- **GPU**: NVIDIA con 8GB+ VRAM (Opcional pero recomendado)
- **Almacenamiento**: 50GB libres para modelos
- **CPU**: 8 cores recomendado

### Software
- **Python**: 3.10 o superior
- **Node.js**: 18.x o superior
- **CUDA**: 11.8+ (si usa GPU)
- **Docker**: Opcional pero recomendado

## 🏗️ Paso 1: Configurar Backend FastAPI

### 1.1 Crear estructura de proyecto

```bash
mkdir ai-services
cd ai-services

# Estructura de directorios
mkdir -p {models,services,api,utils,tests}
```

### 1.2 Crear requirements-ai.txt

```txt
# Core ML
transformers==4.35.0
torch==2.1.0
torchaudio==2.1.0
accelerate==0.25.0

# LLM y Agents
langchain==0.1.0
langchain-community==0.0.10
langchain-experimental==0.0.47
langgraph==0.0.20

# Speech
whisper-openai==20231117
soundfile==0.12.1
librosa==0.10.1

# API
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-multipart==0.0.6

# Utilities
numpy==1.24.3
scikit-learn==1.3.2
python-dotenv==1.0.0
redis==5.0.1
```

### 1.3 Instalar dependencias

```bash
pip install -r requirements-ai.txt

# Opcional: Instalar flash-attention para Whisper más rápido
pip install flash-attn --no-build-isolation
```

## 🤖 Paso 2: Implementar Servicio LLM

### 2.1 Crear `services/llm_agent.py`

```python
from langchain_community.llms import HuggingFaceHub
from langchain.agents import AgentExecutor, create_react_agent
from langchain.tools import Tool
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from typing import Dict, List
import os

class EducationalAgent:
    """Agente educativo con Llama-3.1-8B-Instruct"""
    
    def __init__(self, huggingface_token: str):
        self.llm = HuggingFaceHub(
            repo_id="meta-llama/Meta-Llama-3.1-8B-Instruct",
            huggingfacehub_api_token=huggingface_token,
            model_kwargs={
                "temperature": 0.7,
                "max_length": 500,
                "top_p": 0.95
            }
        )
        
        self.tools = self._create_tools()
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        
        self.agent = self._create_agent()
    
    def _create_tools(self) -> List[Tool]:
        """Herramientas disponibles para el agente"""
        
        def update_difficulty(user_id: str, new_difficulty: str) -> str:
            """Actualiza dificultad del usuario"""
            # Aquí conectarías con tu BD
            return f"Difficulty updated to {new_difficulty} for user {user_id}"
        
        def analyze_error(error_pattern: str) -> str:
            """Analiza patrones de error"""
            patterns = {
                "basic_vocabulary": "Usuario necesita refuerzo en vocabulario básico",
                "cultural_context": "Usuario necesita más práctica cultural",
                "advanced_soft_skills": "Usuario necesita ejercicios de soft skills"
            }
            return patterns.get(error_pattern, "Patrón no reconocido")
        
        def recommend_activity(user_profile: Dict) -> str:
            """Recomienda próxima actividad"""
            level = user_profile.get("level", "beginner")
            return f"Recomiendo ejercicios de nivel {level}"
        
        return [
            Tool(
                name="UpdateDifficulty",
                func=update_difficulty,
                description="Actualiza la dificultad del juego para el usuario"
            ),
            Tool(
                name="AnalyzeError",
                func=analyze_error,
                description="Analiza patrones de errores del estudiante"
            ),
            Tool(
                name="RecommendActivity",
                func=recommend_activity,
                description="Recomienda próxima actividad basada en perfil"
            )
        ]
    
    def _create_agent(self) -> AgentExecutor:
        """Crea el agente ReAct"""
        prompt = PromptTemplate(
            input_variables=["input", "agent_scratchpad", "chat_history"],
            template="""Eres un tutor IA educativo especializado en ayudar a personas vulnerables.

Tu objetivo es:
1. Proporcionar feedback educativo constructivo
2. Adaptar dificultad dinámicamente
3. Detectar frustración y cambiar estrategia
4. Generar recomendaciones personalizadas

Historial de conversación:
{chat_history}

Pregunta del estudiante: {input}

Razonamiento:
{agent_scratchpad}

Responde de manera empática y educativa en el idioma del estudiante.
"""
        )
        
        agent = create_react_agent(self.llm, self.tools, prompt)
        return AgentExecutor.from_agent_and_tools(
            agent=agent,
            tools=self.tools,
            memory=self.memory,
            verbose=True
        )
    
    def chat(self, user_input: str, user_context: Dict = None) -> Dict:
        """Interfaz principal de chat"""
        try:
            response = self.agent.invoke({
                "input": user_input,
                "user_context": user_context or {}
            })
            
            return {
                "response": response["output"],
                "confidence": 0.85,  # Calcular basado en respuesta
                "suggested_actions": self._extract_actions(response)
            }
        except Exception as e:
            return {
                "response": "Lo siento, tuve un problema. ¿Puedes reformular?",
                "confidence": 0.0,
                "error": str(e)
            }
    
    def _extract_actions(self, response: Dict) -> List[str]:
        """Extrae acciones sugeridas de la respuesta"""
        # Implementar parsing de acciones
        return ["Continuar practicando", "Revisar conceptos básicos"]
```

## 🎤 Paso 3: Implementar Servicio de Voz

### 3.1 Crear `services/speech_service.py`

```python
import whisper
import torch
import soundfile as sf
import numpy as np
from typing import Dict, Optional

class SpeechTranscriber:
    """Servicio de transcripción con Whisper Large V3"""
    
    def __init__(self, model_size: str = "large-v3", device: str = "auto"):
        self.device = self._get_device(device)
        print(f"Loading Whisper {model_size} on {self.device}...")
        self.model = whisper.load_model(model_size, device=self.device)
        print("✓ Whisper model loaded successfully")
    
    def _get_device(self, device: str) -> str:
        """Detecta mejor dispositivo disponible"""
        if device == "auto":
            return "cuda" if torch.cuda.is_available() else "cpu"
        return device
    
    def transcribe(
        self,
        audio_path: str,
        language: Optional[str] = None,
        task: str = "transcribe"
    ) -> Dict:
        """
        Transcribe audio a texto
        
        Args:
            audio_path: Ruta al archivo de audio
            language: Código de idioma (None = auto-detectar)
            task: "transcribe" o "translate" (a inglés)
        
        Returns:
            Dict con transcripción y metadatos
        """
        try:
            result = self.model.transcribe(
                audio_path,
                language=language,
                task=task,
                fp16=self.device == "cuda"
            )
            
            return {
                "transcription": result["text"].strip(),
                "detected_language": result.get("language", "unknown"),
                "confidence": self._calculate_confidence(result),
                "segments": result.get("segments", [])
            }
        except Exception as e:
            return {
                "transcription": "",
                "error": str(e),
                "confidence": 0.0
            }
    
    def transcribe_with_timestamps(self, audio_path: str) -> Dict:
        """Transcripción con timestamps por palabra"""
        result = self.model.transcribe(
            audio_path,
            word_timestamps=True
        )
        
        return {
            "full_text": result["text"],
            "segments": [
                {
                    "text": seg["text"],
                    "start": seg["start"],
                    "end": seg["end"]
                }
                for seg in result["segments"]
            ]
        }
    
    def _calculate_confidence(self, result: Dict) -> float:
        """Calcula confianza promedio de los segmentos"""
        if "segments" not in result:
            return 0.8  # Default
        
        confidences = [
            seg.get("confidence", 0.5)
            for seg in result["segments"]
            if "confidence" in seg
        ]
        
        return sum(confidences) / len(confidences) if confidences else 0.8
```

## 😊 Paso 4: Implementar Detección de Emociones

### 4.1 Crear `services/emotion_service.py`

```python
from transformers import pipeline, AutoModel, AutoTokenizer
import torch
import librosa
import numpy as np
from typing import Dict

class EmotionDetector:
    """Detector de emociones multimodal (audio + texto)"""
    
    def __init__(self):
        # Detector de emoción en texto
        self.text_emotion = pipeline(
            "text-classification",
            model="bhadresh-savani/distilbert-base-uncased-emotion",
            device=0 if torch.cuda.is_available() else -1
        )
        
        # Detector de emoción en audio
        self.audio_emotion = pipeline(
            "audio-classification",
            model="ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition",
            device=0 if torch.cuda.is_available() else -1
        )
    
    def detect_from_text(self, text: str) -> Dict:
        """Detecta emoción en texto"""
        result = self.text_emotion(text)[0]
        
        emotion_map = {
            "joy": "happy",
            "sadness": "frustrated",
            "anger": "frustrated",
            "fear": "confused",
            "surprise": "motivated",
            "love": "happy"
        }
        
        return {
            "emotion": emotion_map.get(result["label"], "neutral"),
            "confidence": result["score"],
            "raw_emotion": result["label"]
        }
    
    def detect_from_audio(self, audio_path: str) -> Dict:
        """Detecta emoción en audio"""
        # Cargar y preprocesar audio
        audio, sr = librosa.load(audio_path, sr=16000)
        
        result = self.audio_emotion(audio)[0]
        
        emotion_map = {
            "happy": "happy",
            "angry": "frustrated",
            "sad": "frustrated",
            "fearful": "confused",
            "calm": "neutral",
            "neutral": "neutral"
        }
        
        return {
            "emotion": emotion_map.get(result["label"], "neutral"),
            "confidence": result["score"],
            "raw_emotion": result["label"],
            "pedagogical_recommendation": self._get_recommendation(
                emotion_map.get(result["label"], "neutral")
            )
        }
    
    def detect_multimodal(self, text: str, audio_path: str) -> Dict:
        """Combina detección de texto y audio"""
        text_result = self.detect_from_text(text)
        audio_result = self.detect_from_audio(audio_path)
        
        # Combinar con pesos (audio tiene más peso para emoción)
        combined_confidence = (
            text_result["confidence"] * 0.3 +
            audio_result["confidence"] * 0.7
        )
        
        # Elegir emoción con mayor confianza
        final_emotion = (
            audio_result["emotion"]
            if audio_result["confidence"] > text_result["confidence"]
            else text_result["emotion"]
        )
        
        return {
            "emotion": final_emotion,
            "confidence": combined_confidence,
            "text_emotion": text_result,
            "audio_emotion": audio_result,
            "recommendation": self._get_recommendation(final_emotion)
        }
    
    def _get_recommendation(self, emotion: str) -> str:
        """Genera recomendación pedagógica"""
        recommendations = {
            "frustrated": "Simplificar contenido y ofrecer más soporte",
            "confused": "Proporcionar explicaciones adicionales y ejemplos",
            "happy": "Incrementar desafío gradualmente",
            "motivated": "Mantener ritmo actual",
            "neutral": "Continuar con contenido actual"
        }
        return recommendations.get(emotion, "Continuar monitoreando")
```

## 🌐 Paso 5: Crear API REST

### 5.1 Crear `api/main.py`

```python
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
import os
from dotenv import load_dotenv

from services.llm_agent import EducationalAgent
from services.speech_service import SpeechTranscriber
from services.emotion_service import EmotionDetector

# Cargar variables de entorno
load_dotenv()

app = FastAPI(title="EduGame4ALL AI Services", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción: especificar origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar servicios (singleton)
educational_agent = None
speech_transcriber = None
emotion_detector = None

@app.on_event("startup")
async def startup_event():
    """Carga modelos al iniciar"""
    global educational_agent, speech_transcriber, emotion_detector
    
    print("🚀 Iniciando servicios de IA...")
    
    hf_token = os.getenv("HUGGINGFACE_TOKEN")
    if not hf_token:
        print("⚠️  WARNING: No HUGGINGFACE_TOKEN found")
    
    # Cargar modelos
    educational_agent = EducationalAgent(hf_token)
    speech_transcriber = SpeechTranscriber(model_size="large-v3")
    emotion_detector = EmotionDetector()
    
    print("✅ Todos los servicios cargados correctamente")

# Modelos de request/response
class ChatRequest(BaseModel):
    user_id: str
    message: str
    context: Optional[dict] = None
    language: Optional[str] = "es"

class ChatResponse(BaseModel):
    response: str
    confidence: float
    suggested_actions: List[str]
    next_difficulty: Optional[str] = None

# Endpoints
@app.post("/api/ai/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """Chat con agente educativo"""
    try:
        result = educational_agent.chat(
            user_input=request.message,
            user_context=request.context
        )
        return ChatResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/transcribe")
async def transcribe_audio(
    audio_file: UploadFile = File(...),
    language: Optional[str] = None,
    translate_to: Optional[str] = None
):
    """Transcribe audio a texto"""
    try:
        # Guardar archivo temporal
        temp_path = f"/tmp/{audio_file.filename}"
        with open(temp_path, "wb") as f:
            f.write(await audio_file.read())
        
        task = "translate" if translate_to == "en" else "transcribe"
        result = speech_transcriber.transcribe(
            temp_path,
            language=language,
            task=task
        )
        
        # Limpiar archivo temporal
        os.remove(temp_path)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/emotion/text")
async def analyze_text_emotion(text: str):
    """Analiza emoción en texto"""
    try:
        result = emotion_detector.detect_from_text(text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/emotion/audio")
async def analyze_audio_emotion(audio_file: UploadFile = File(...)):
    """Analiza emoción en audio"""
    try:
        temp_path = f"/tmp/{audio_file.filename}"
        with open(temp_path, "wb") as f:
            f.write(await audio_file.read())
        
        result = emotion_detector.detect_from_audio(temp_path)
        os.remove(temp_path)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai/health")
async def health_check():
    """Verifica estado de servicios"""
    return {
        "status": "healthy",
        "models_loaded": {
            "llm": educational_agent is not None,
            "speech": speech_transcriber is not None,
            "emotion": emotion_detector is not None
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
```

## 🔌 Paso 6: Conectar Frontend con Backend

### 6.1 Crear servicio API en frontend

```typescript
// /services/aiService.ts
const AI_API_URL = process.env.VITE_AI_API_URL || 'http://localhost:8001';

export const aiService = {
  async chat(userId: string, message: string, context?: any) {
    const response = await fetch(`${AI_API_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, message, context })
    });
    return response.json();
  },

  async transcribeAudio(audioBlob: Blob, language?: string) {
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'recording.wav');
    if (language) formData.append('language', language);

    const response = await fetch(`${AI_API_URL}/api/ai/transcribe`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  },

  async analyzeTextEmotion(text: string) {
    const response = await fetch(`${AI_API_URL}/api/ai/emotion/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    return response.json();
  }
};
```

### 6.2 Reemplazar simulaciones

```typescript
// En AIChatPage.tsx
import { aiService } from '../services/aiService';

const handleSend = async () => {
  // En lugar de generateAIResponse()
  const response = await aiService.chat(user!.id, inputValue);
  
  const aiMessage: Message = {
    id: Date.now().toString(),
    role: 'assistant',
    content: response.response,
    timestamp: new Date(),
    emotion: response.emotion
  };
  
  setMessages(prev => [...prev, aiMessage]);
};
```

## 🐳 Paso 7: Dockerizar

### 7.1 Crear `Dockerfile`

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar
COPY requirements-ai.txt .
RUN pip install --no-cache-dir -r requirements-ai.txt

# Copiar código
COPY . .

# Exponer puerto
EXPOSE 8001

# Comando de inicio
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8001"]
```

### 7.2 Crear `docker-compose.yml`

```yaml
version: '3.8'

services:
  ai-backend:
    build: ./ai-services
    ports:
      - "8001:8001"
    environment:
      - HUGGINGFACE_TOKEN=${HUGGINGFACE_TOKEN}
    volumes:
      - ./models:/app/models
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_AI_API_URL=http://ai-backend:8001
    depends_on:
      - ai-backend
```

## 🚀 Paso 8: Deploy en Producción

### Opción A: Replit Deployment

1. **Configurar secrets**:
   - `HUGGINGFACE_TOKEN`: Tu token de HuggingFace
   - `AI_API_URL`: URL del servicio de IA

2. **Modificar `.replit`**:
```toml
run = "cd ai-services && python api/main.py & npm run dev"
```

### Opción B: Railway/Render

1. Subir a GitHub
2. Conectar repo con Railway
3. Configurar variables de entorno
4. Deploy automático

### Opción C: AWS/GCP

1. Crear instancia con GPU (opcional)
2. Instalar Docker
3. Subir imágenes a registry
4. Deploy con docker-compose

## ⚡ Optimizaciones

### Cuantización de Modelos

```python
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

quantization_config = BitsAndBytesConfig(
    load_in_8bit=True,
    llm_int8_threshold=6.0
)

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Meta-Llama-3.1-8B-Instruct",
    quantization_config=quantization_config,
    device_map="auto"
)
```

### Cache de Respuestas

```python
from functools import lru_cache
import hashlib

@lru_cache(maxsize=1000)
def get_cached_response(query_hash: str):
    # Cache respuestas frecuentes
    pass
```

## 🧪 Testing

```python
# tests/test_ai_services.py
import pytest
from services.llm_agent import EducationalAgent

def test_educational_agent():
    agent = EducationalAgent(os.getenv("HF_TOKEN"))
    result = agent.chat("Ayúdame con vocabulario")
    assert "response" in result
    assert result["confidence"] > 0
```

## 📊 Monitoreo

```python
from prometheus_client import Counter, Histogram

chat_requests = Counter('chat_requests_total', 'Total chat requests')
response_time = Histogram('response_time_seconds', 'Response time')

@app.post("/api/ai/chat")
@response_time.time()
async def chat_with_ai(request: ChatRequest):
    chat_requests.inc()
    # ... resto del código
```

---

**¡Implementación completa!** 🎉

Con esta guía, puedes transformar EduGame4ALL de MVP simulado a una aplicación productiva con IA real.
