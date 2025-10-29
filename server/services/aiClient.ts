/**
 * AI Services Client
 * HTTP client to communicate with Python AI services
 */

import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { logger } from '../utils/logger';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001';

interface ChatRequest {
  user_id: string;
  message: string;
  context?: Record<string, any>;
  language?: string;
  age_group?: string;
  current_level?: string;
}

interface FeedbackRequest {
  user_id: string;
  game_session: Record<string, any>;
  language?: string;
  age_group?: string;
  current_level?: string;
}

interface AIResponse {
  response: string;
  confidence: number;
  suggested_actions?: string[];
  next_difficulty?: string;
}

interface FeedbackResponse {
  strengths: string[];
  improvements: string[];
  insights: string[];
  aiSummary: string;
  nextDifficulty?: string;
}

interface TranscriptionResponse {
  transcription: string;
  detected_language: string;
  duration: number;
  confidence: number;
}

interface EmotionResponse {
  emotion: string;
  confidence: number;
  probabilities?: Record<string, number>;
  recommendations?: string[];
}

class AIClient {
  private client: AxiosInstance;
  private isAvailable: boolean = false;

  constructor() {
    this.client = axios.create({
      baseURL: AI_SERVICE_URL,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check availability on initialization
    this.checkAvailability();
  }

  /**
   * Check if AI services are available
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/ai/health');
      this.isAvailable = response.data.status === 'healthy';
      logger.info(`AI Services status: ${this.isAvailable ? 'Available' : 'Unavailable'}`);
      return this.isAvailable;
    } catch (error) {
      logger.warn('AI Services unavailable:', error.message);
      this.isAvailable = false;
      return false;
    }
  }

  /**
   * Chat with AI agent
   */
  async chat(request: ChatRequest): Promise<AIResponse> {
    try {
      if (!this.isAvailable) {
        await this.checkAvailability();
      }

      const response = await this.client.post<AIResponse>('/api/ai/chat', request);
      return response.data;
    } catch (error) {
      logger.error('AI chat error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  /**
   * Generate personalized feedback for game session
   */
  async generateFeedback(request: FeedbackRequest): Promise<FeedbackResponse> {
    try {
      if (!this.isAvailable) {
        await this.checkAvailability();
      }

      const response = await this.client.post<FeedbackResponse>('/api/ai/feedback', request);
      return response.data;
    } catch (error) {
      logger.error('AI feedback generation error:', error);
      // Return fallback feedback
      return this.generateFallbackFeedback(request.game_session);
    }
  }

  /**
   * Transcribe audio file
   */
  async transcribeAudio(
    audioPath: string,
    language?: string,
    translateTo?: string
  ): Promise<TranscriptionResponse> {
    try {
      if (!this.isAvailable) {
        await this.checkAvailability();
      }

      const formData = new FormData();
      formData.append('audio_file', fs.createReadStream(audioPath));
      
      if (language) {
        formData.append('language', language);
      }
      
      if (translateTo) {
        formData.append('translate_to', translateTo);
      }

      const response = await this.client.post<TranscriptionResponse>(
        '/api/ai/transcribe',
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 60000, // 60 seconds for audio processing
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Audio transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  /**
   * Detect emotion from audio
   */
  async detectEmotionFromAudio(audioPath: string): Promise<EmotionResponse> {
    try {
      if (!this.isAvailable) {
        await this.checkAvailability();
      }

      const formData = new FormData();
      formData.append('audio_file', fs.createReadStream(audioPath));

      const response = await this.client.post<EmotionResponse>(
        '/api/ai/emotion/audio',
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 30000,
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Audio emotion detection error:', error);
      return {
        emotion: 'neutral',
        confidence: 0.0,
      };
    }
  }

  /**
   * Detect emotion from text
   */
  async detectEmotionFromText(text: string): Promise<EmotionResponse> {
    try {
      if (!this.isAvailable) {
        await this.checkAvailability();
      }

      const response = await this.client.post<EmotionResponse>('/api/ai/emotion/text', {
        text,
      });

      return response.data;
    } catch (error) {
      logger.error('Text emotion detection error:', error);
      return {
        emotion: 'neutral',
        confidence: 0.0,
      };
    }
  }

  /**
   * Complete analysis pipeline (transcribe + emotion + AI response)
   */
  async analyzeComplete(
    userId: string,
    audioPath?: string,
    text?: string
  ): Promise<any> {
    try {
      if (!this.isAvailable) {
        await this.checkAvailability();
      }

      const formData = new FormData();
      formData.append('user_id', userId);

      if (audioPath) {
        formData.append('audio_file', fs.createReadStream(audioPath));
      }

      if (text) {
        formData.append('text', text);
      }

      const response = await this.client.post('/api/ai/analyze-complete', formData, {
        headers: formData.getHeaders(),
        timeout: 60000,
      });

      return response.data;
    } catch (error) {
      logger.error('Complete analysis error:', error);
      throw new Error('Failed to complete analysis');
    }
  }

  /**
   * Generate fallback feedback when AI is unavailable
   */
  private generateFallbackFeedback(gameSession: Record<string, any>): FeedbackResponse {
    const correctAnswers = gameSession.correctAnswers || 0;
    const totalQuestions = gameSession.totalQuestions || 1;
    const accuracy = (correctAnswers / totalQuestions) * 100;

    let summary: string;
    let strengths: string[];
    let improvements: string[];

    if (accuracy >= 80) {
      summary = '¡Excelente trabajo! Estás progresando muy bien.';
      strengths = ['Demuestras un gran dominio del tema', 'Tu precisión es sobresaliente'];
      improvements = ['Mantén este ritmo de aprendizaje'];
    } else if (accuracy >= 60) {
      summary = 'Buen esfuerzo. Con un poco más de práctica, mejorarás aún más.';
      strengths = ['Muestras dedicación en tu aprendizaje'];
      improvements = ['Practica los conceptos más difíciles', 'Revisa los errores cometidos'];
    } else {
      summary = 'Sigue intentándolo. Cada error es una oportunidad para aprender.';
      strengths = ['Completaste la actividad con perseverancia'];
      improvements = [
        'Dedica más tiempo a comprender los conceptos básicos',
        'No dudes en pedir ayuda cuando la necesites',
      ];
    }

    return {
      strengths,
      improvements,
      insights: [
        `Precisión: ${accuracy.toFixed(0)}%`,
        `Respuestas correctas: ${correctAnswers}/${totalQuestions}`,
      ],
      aiSummary: summary,
      nextDifficulty: accuracy >= 80 ? 'intermediate' : 'beginner',
    };
  }
}

// Singleton instance
export const aiClient = new AIClient();
