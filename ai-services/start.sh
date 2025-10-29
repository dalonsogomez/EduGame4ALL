#!/bin/bash

# Start script for EduGame4All AI Services

echo "========================================="
echo "EduGame4All AI Services"
echo "========================================="
echo ""

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "Python version: $python_version"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements-ai.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Warning: .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "Please edit .env file with your configuration"
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Create models directory
mkdir -p models

echo ""
echo "========================================="
echo "Starting AI Services..."
echo "========================================="
echo "Port: ${AI_SERVICE_PORT:-8001}"
echo "LLM Model: ${LLM_MODEL:-meta-llama/Llama-3.1-8B-Instruct}"
echo "Whisper Model: ${WHISPER_MODEL:-large-v3}"
echo ""

# Start FastAPI server
python api/main.py
