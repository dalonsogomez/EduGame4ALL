# Dockerfile for EduGame4All AI Services

FROM python:3.10-slim

LABEL maintainer="EduGame4All Team"
LABEL description="AI Services for EduGame4All - LLM, Speech Recognition, Emotion Detection"

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements-ai.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements-ai.txt

# Copy application code
COPY . .

# Create models directory
RUN mkdir -p models

# Expose port
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5m --retries=3 \
    CMD curl -f http://localhost:8001/api/ai/health || exit 1

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV CACHE_DIR=/app/models

# Start application
CMD ["python", "api/main.py"]
