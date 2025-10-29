/**
 * AI Services Client
 * HTTP client to communicate with Python AI services
 */
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { logger } from '../utils/logger';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001';
class AIClient {
    constructor() {
        this.isAvailable = false;
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
    async checkAvailability() {
        try {
            const response = await this.client.get('/api/ai/health');
            this.isAvailable = response.data.status === 'healthy';
            logger.info(`AI Services status: ${this.isAvailable ? 'Available' : 'Unavailable'}`);
            return this.isAvailable;
        }
        catch (error) {
            logger.warn('AI Services unavailable:', error.message);
            this.isAvailable = false;
            return false;
        }
    }
    /**
     * Chat with AI agent
     */
    async chat(request) {
        try {
            if (!this.isAvailable) {
                await this.checkAvailability();
            }
            const response = await this.client.post('/api/ai/chat', request);
            return response.data;
        }
        catch (error) {
            logger.error('AI chat error:', error);
            throw new Error('Failed to get AI response');
        }
    }
    /**
     * Generate personalized feedback for game session
     */
    async generateFeedback(request) {
        try {
            if (!this.isAvailable) {
                await this.checkAvailability();
            }
            const response = await this.client.post('/api/ai/feedback', request);
            return response.data;
        }
        catch (error) {
            logger.error('AI feedback generation error:', error);
            // Return fallback feedback
            return this.generateFallbackFeedback(request.game_session);
        }
    }
    /**
     * Transcribe audio file
     */
    async transcribeAudio(audioPath, language, translateTo) {
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
            const response = await this.client.post('/api/ai/transcribe', formData, {
                headers: formData.getHeaders(),
                timeout: 60000, // 60 seconds for audio processing
            });
            return response.data;
        }
        catch (error) {
            logger.error('Audio transcription error:', error);
            throw new Error('Failed to transcribe audio');
        }
    }
    /**
     * Detect emotion from audio
     */
    async detectEmotionFromAudio(audioPath) {
        try {
            if (!this.isAvailable) {
                await this.checkAvailability();
            }
            const formData = new FormData();
            formData.append('audio_file', fs.createReadStream(audioPath));
            const response = await this.client.post('/api/ai/emotion/audio', formData, {
                headers: formData.getHeaders(),
                timeout: 30000,
            });
            return response.data;
        }
        catch (error) {
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
    async detectEmotionFromText(text) {
        try {
            if (!this.isAvailable) {
                await this.checkAvailability();
            }
            const response = await this.client.post('/api/ai/emotion/text', {
                text,
            });
            return response.data;
        }
        catch (error) {
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
    async analyzeComplete(userId, audioPath, text) {
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
        }
        catch (error) {
            logger.error('Complete analysis error:', error);
            throw new Error('Failed to complete analysis');
        }
    }
    /**
     * Generate fallback feedback when AI is unavailable
     */
    generateFallbackFeedback(gameSession) {
        const correctAnswers = gameSession.correctAnswers || 0;
        const totalQuestions = gameSession.totalQuestions || 1;
        const accuracy = (correctAnswers / totalQuestions) * 100;
        let summary;
        let strengths;
        let improvements;
        if (accuracy >= 80) {
            summary = '¡Excelente trabajo! Estás progresando muy bien.';
            strengths = ['Demuestras un gran dominio del tema', 'Tu precisión es sobresaliente'];
            improvements = ['Mantén este ritmo de aprendizaje'];
        }
        else if (accuracy >= 60) {
            summary = 'Buen esfuerzo. Con un poco más de práctica, mejorarás aún más.';
            strengths = ['Muestras dedicación en tu aprendizaje'];
            improvements = ['Practica los conceptos más difíciles', 'Revisa los errores cometidos'];
        }
        else {
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
//# sourceMappingURL=aiClient.js.map