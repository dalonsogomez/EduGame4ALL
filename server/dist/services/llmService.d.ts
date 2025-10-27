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
interface WeeklyInsightsParams {
    totalGames: number;
    totalXP: number;
    totalTime: number;
    avgAccuracy: number;
    categoryStats: {
        language: {
            games: number;
            xp: number;
        };
        culture: {
            games: number;
            xp: number;
        };
        'soft-skills': {
            games: number;
            xp: number;
        };
    };
    userLevel: number;
    dailyActivity: Array<{
        date: string;
        games: number;
        xp: number;
    }>;
}
interface WeeklyInsights {
    strengths: string[];
    improvements: string[];
    insights: string[];
    aiGeneratedSummary: string;
}
declare function generateWeeklyInsights(params: WeeklyInsightsParams): Promise<WeeklyInsights>;
export { sendLLMRequest, generateGameFeedback, GameFeedbackParams, GameFeedback, generateWeeklyInsights, WeeklyInsightsParams, WeeklyInsights, };
//# sourceMappingURL=llmService.d.ts.map