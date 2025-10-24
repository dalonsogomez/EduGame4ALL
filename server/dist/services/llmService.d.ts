declare function sendLLMRequest(provider: string, model: string, message: string): Promise<string>;
interface GameFeedbackParams {
    gameTitle: string;
    gameCategory: string;
    gameDifficulty: number;
    score: number;
    maxScore: number;
    timeSpent: number;
    answers: Array<{
        question: string;
        selectedAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
    }>;
    userLevel: number;
    userTargetLanguage?: string;
}
interface GameFeedback {
    strengths: string[];
    improvements: string[];
    tips: string[];
    nextRecommendations: string[];
    personalizedMessage: string;
}
declare function generateGameFeedback(params: GameFeedbackParams): Promise<GameFeedback>;
export { sendLLMRequest, generateGameFeedback, GameFeedbackParams, GameFeedback, };
//# sourceMappingURL=llmService.d.ts.map