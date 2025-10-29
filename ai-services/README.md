# EduGame4All - AI Services

Complete AI stack for personalized educational experiences using LLMs, speech recognition, and emotion detection.

## 🎯 Overview

This module provides advanced AI capabilities to EduGame4All:

- **Educational LLM Agent**: Personalized tutoring and feedback using Llama-3.1-8B or GPT-4
- **Speech Recognition**: Multilingual transcription using Whisper Large V3
- **Emotion Detection**: Audio and text emotion analysis for adaptive learning
- **FastAPI REST API**: Production-ready API for all AI services

## 📁 Project Structure

```
ai-services/
├── api/
│   └── main.py              # FastAPI application
├── services/
│   ├── llm_agent.py         # Educational LLM agent
│   ├── speech_service.py    # Whisper transcription
│   └── emotion_service.py   # Emotion detection
├── models/                  # Cached AI models
├── utils/                   # Utility functions
├── requirements-ai.txt      # Python dependencies
├── .env.example             # Environment variables template
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd ai-services
pip install -r requirements-ai.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

### 3. Start AI Services

```bash
python api/main.py
```

The API will be available at `http://localhost:8001`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `HUGGINGFACE_TOKEN` | HuggingFace API token (required for some models) | - |
| `OPENAI_API_KEY` | OpenAI API key (optional, for GPT models) | - |
| `ANTHROPIC_API_KEY` | Anthropic API key (optional, for Claude) | - |
| `AI_SERVICE_PORT` | Port for AI services | 8001 |
| `LLM_MODEL` | LLM model to use | meta-llama/Llama-3.1-8B-Instruct |
| `WHISPER_MODEL` | Whisper model size | large-v3 |
| `USE_GPU` | Enable GPU acceleration | true |
| `CACHE_DIR` | Directory for model cache | ./models |

### Model Options

#### LLM Models
- `meta-llama/Llama-3.1-8B-Instruct` (default, requires ~16GB RAM)
- `meta-llama/Llama-3.1-1B-Instruct` (lighter, ~4GB RAM)
- `openai` (uses GPT-4o-mini via API)

#### Whisper Models
- `large-v3` (best accuracy, ~10GB)
- `medium` (balanced, ~5GB)
- `small` (fast, ~2GB)

## 📡 API Endpoints

### Health Check
```http
GET /api/ai/health
```

Returns system status and resource usage.

### Chat with AI Agent
```http
POST /api/ai/chat
Content-Type: application/json

{
  "user_id": "user123",
  "message": "¿Cómo se dice 'hello' en español?",
  "language": "es",
  "age_group": "adult",
  "current_level": "beginner"
}
```

### Generate Feedback
```http
POST /api/ai/feedback
Content-Type: application/json

{
  "user_id": "user123",
  "game_session": {
    "gameType": "vocabulary",
    "difficulty": "beginner",
    "correctAnswers": 8,
    "totalQuestions": 10,
    "timeSpent": 300,
    "mistakesPattern": ["gender_articles"]
  },
  "language": "es"
}
```

### Transcribe Audio
```http
POST /api/ai/transcribe
Content-Type: multipart/form-data

audio_file: <file>
language: es (optional)
translate_to: en (optional)
```

### Detect Emotion from Audio
```http
POST /api/ai/emotion/audio
Content-Type: multipart/form-data

audio_file: <file>
```

### Detect Emotion from Text
```http
POST /api/ai/emotion/text
Content-Type: application/json

{
  "text": "Estoy muy feliz de aprender español"
}
```

### Complete Analysis Pipeline
```http
POST /api/ai/analyze-complete
Content-Type: multipart/form-data

user_id: user123
audio_file: <file> (optional)
text: "texto" (optional)
```

## 🧠 AI Models

### 1. Educational LLM Agent

**Model**: Llama-3.1-8B-Instruct or GPT-4o-mini

**Capabilities**:
- Personalized tutoring in 100+ languages
- Adaptive question generation
- Pedagogical feedback
- Learning path recommendations
- Cultural sensitivity

**Tools**:
- `generate_adaptive_question`: Create personalized questions
- `provide_educational_feedback`: Give pedagogical feedback
- `recommend_learning_path`: Suggest next topics
- `calculate_adaptive_difficulty`: Adjust difficulty

### 2. Speech Recognition (Whisper)

**Model**: Whisper Large V3

**Capabilities**:
- Transcription in 100+ languages
- Automatic language detection
- Translation to English
- Word-level timestamps
- Chunked processing for long audio

**Supported Formats**: WAV, MP3, M4A, OGG

### 3. Emotion Detection

#### Audio Emotions
**Model**: Wav2Vec2 (ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition)

**Emotions**: angry, calm, disgust, fearful, happy, neutral, sad, surprised

**Output**:
- Dominant emotion
- Confidence score
- Probability distribution
- Pedagogical recommendations

#### Text Emotions
**Model**: DistilBERT (bhadresh-savani/distilbert-base-uncased-emotion)

**Emotions**: joy, sadness, anger, fear, love, surprise

**Output**:
- Dominant emotion
- Confidence score
- Sentiment score (-1 to +1)

## 🔗 Integration with Backend

The Node.js backend integrates with AI services through `aiClient.ts`:

```typescript
import { aiClient } from './services/aiClient';

// Generate feedback
const feedback = await aiClient.generateFeedback({
  user_id: userId,
  game_session: sessionData,
  language: 'es'
});

// Transcribe audio
const transcription = await aiClient.transcribeAudio(audioPath, 'es');

// Detect emotion
const emotion = await aiClient.detectEmotionFromText(userMessage);
```

## 🎮 Frontend Integration

React components for AI features:

```tsx
import { VoiceRecorder } from './components/VoiceRecorder';
import { chatWithAI, detectEmotionFromText } from './api/ai';

// Voice recording
<VoiceRecorder
  onTranscription={(text, lang) => console.log(text)}
  language="es"
/>

// AI chat
const response = await chatWithAI({
  user_id: userId,
  message: userMessage,
  language: 'es'
});
```

## 🐳 Docker Deployment

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements-ai.txt .
RUN pip install --no-cache-dir -r requirements-ai.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8001

# Start service
CMD ["python", "api/main.py"]
```

## 📊 Performance Optimization

### GPU Acceleration
- Automatically uses CUDA if available
- Applies `torch.compile()` for 2-4x speedup
- 8-bit quantization reduces memory by 50%

### Caching
- Models cached locally in `./models`
- Responses cached for common queries
- Singleton pattern for model instances

### Scalability
- Async processing with FastAPI
- Background tasks for cleanup
- Multiple workers for production

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:8001/api/ai/health

# Test chat
curl -X POST http://localhost:8001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test",
    "message": "Hola, ¿cómo estás?",
    "language": "es"
  }'

# Test transcription
curl -X POST http://localhost:8001/api/ai/transcribe \
  -F "audio_file=@test.wav" \
  -F "language=es"
```

## 🔒 Security

- CORS configured for production
- Rate limiting (10 requests/min per user)
- File size limits (25MB for audio)
- Input sanitization
- No data logging in production

## 📈 Monitoring

Metrics available at `/api/ai/health`:
- Memory usage
- GPU status
- Model loading status
- Request latency

## 🐛 Troubleshooting

### Models not loading
- Check available RAM (minimum 8GB)
- Verify HuggingFace token if using gated models
- Try smaller models (Llama-3.1-1B, Whisper-medium)

### Slow transcription
- Use smaller Whisper model (medium or small)
- Enable GPU acceleration
- Reduce audio quality before upload

### Out of memory
- Reduce batch size
- Use 8-bit quantization
- Use model offloading to CPU

## 📚 References

- [Llama 3.1 Documentation](https://huggingface.co/meta-llama)
- [Whisper Documentation](https://github.com/openai/whisper)
- [LangChain Documentation](https://python.langchain.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## 📄 License

Part of EduGame4All project - Hack4Edu 2025
