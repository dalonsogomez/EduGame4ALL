/**
 * AI Services API Client
 * Frontend client for AI services (chat, transcription, emotion detection)
 */

import api from './api';

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8001';

export interface ChatRequest {
  user_id: string;
  message: string;
  context?: Record<string, any>;
  language?: string;
  age_group?: string;
  current_level?: string;
}

export interface ChatResponse {
  response: string;
  confidence: number;
  suggested_actions?: string[];
  next_difficulty?: string;
}

export interface TranscriptionResponse {
  transcription: string;
  detected_language: string;
  duration: number;
  confidence: number;
}

export interface EmotionResponse {
  emotion: string;
  confidence: number;
  probabilities?: Record<string, number>;
  recommendations?: string[];
  sentiment_score?: number;
}

/**
 * Chat with AI agent
 */
export const chatWithAI = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    return await response.json();
  } catch (error) {
    console.error('AI chat error:', error);
    throw error;
  }
};

/**
 * Transcribe audio file or blob
 */
export const transcribeAudio = async (
  audio: Blob | File,
  language?: string,
  translateTo?: string
): Promise<TranscriptionResponse> => {
  try {
    const formData = new FormData();
    formData.append('audio_file', audio, 'recording.webm');
    
    if (language) {
      formData.append('language', language);
    }
    
    if (translateTo) {
      formData.append('translate_to', translateTo);
    }

    const response = await fetch(`${AI_SERVICE_URL}/api/ai/transcribe`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to transcribe audio');
    }

    return await response.json();
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};

/**
 * Detect emotion from audio
 */
export const detectEmotionFromAudio = async (audio: Blob | File): Promise<EmotionResponse> => {
  try {
    const formData = new FormData();
    formData.append('audio_file', audio, 'recording.webm');

    const response = await fetch(`${AI_SERVICE_URL}/api/ai/emotion/audio`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to detect emotion');
    }

    return await response.json();
  } catch (error) {
    console.error('Emotion detection error:', error);
    return {
      emotion: 'neutral',
      confidence: 0.0,
    };
  }
};

/**
 * Detect emotion from text
 */
export const detectEmotionFromText = async (text: string): Promise<EmotionResponse> => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/ai/emotion/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to detect emotion');
    }

    return await response.json();
  } catch (error) {
    console.error('Emotion detection error:', error);
    return {
      emotion: 'neutral',
      confidence: 0.0,
    };
  }
};

/**
 * Check if AI services are available
 */
export const checkAIHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/ai/health`);
    const data = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    console.error('AI health check failed:', error);
    return false;
  }
};
