/**
 * AI Services Client
 * HTTP client to communicate with Python AI services
 */
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
declare class AIClient {
    private client;
    private isAvailable;
    constructor();
    /**
     * Check if AI services are available
     */
    checkAvailability(): Promise<boolean>;
    /**
     * Chat with AI agent
     */
    chat(request: ChatRequest): Promise<AIResponse>;
    /**
     * Generate personalized feedback for game session
     */
    generateFeedback(request: FeedbackRequest): Promise<FeedbackResponse>;
    /**
     * Transcribe audio file
     */
    transcribeAudio(audioPath: string, language?: string, translateTo?: string): Promise<TranscriptionResponse>;
    /**
     * Detect emotion from audio
     */
    detectEmotionFromAudio(audioPath: string): Promise<EmotionResponse>;
    /**
     * Detect emotion from text
     */
    detectEmotionFromText(text: string): Promise<EmotionResponse>;
    /**
     * Complete analysis pipeline (transcribe + emotion + AI response)
     */
    analyzeComplete(userId: string, audioPath?: string, text?: string): Promise<any>;
    /**
     * Generate fallback feedback when AI is unavailable
     */
    private generateFallbackFeedback;
}
export declare const aiClient: AIClient;
export {};
//# sourceMappingURL=aiClient.d.ts.map