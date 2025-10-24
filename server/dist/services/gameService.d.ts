import { IGame } from '../models/Game';
import { IGameSession } from '../models/GameSession';
export declare class GameService {
    static getGames(filters?: {
        category?: string;
        difficulty?: number;
    }): Promise<IGame[]>;
    static getGameById(gameId: string): Promise<IGame | null>;
    static submitGameSession(userId: string, gameId: string, sessionData: {
        score: number;
        maxScore: number;
        timeSpent: number;
        answers: Array<{
            questionIndex: number;
            selectedAnswer: number;
            isCorrect: boolean;
            pointsEarned: number;
        }>;
    }): Promise<{
        session: IGameSession;
        xpEarned: number;
        feedback: any;
    }>;
    private static updateUserProgress;
    static getUserGameProgress(userId: string, gameId: string): Promise<number>;
    static getGameSession(sessionId: string, userId: string): Promise<IGameSession | null>;
    static getGameSessions(userId: string, filters?: {
        gameId?: string;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }): Promise<IGameSession[]>;
}
//# sourceMappingURL=gameService.d.ts.map