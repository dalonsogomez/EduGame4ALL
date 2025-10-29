import { IGame } from '../models/Game';
import { IGameSession } from '../models/GameSession';
import { GameFeedback } from '../types';
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
        feedback: GameFeedback;
    }>;
    static getUserGameProgress(userId: string, gameId: string): Promise<number>;
    static getGameSession(sessionId: string, userId: string): Promise<IGameSession | null>;
    static getGameSessions(userId: string, filters?: {
        gameId?: string;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }): Promise<IGameSession[]>;
    static createGame(gameData: {
        title: string;
        description: string;
        category: 'language' | 'culture' | 'soft-skills';
        difficulty: number;
        duration: number;
        xpReward: number;
        thumbnailUrl?: string;
        questions: Array<{
            question: string;
            options: string[];
            correctAnswer: number;
            explanation?: string;
            points: number;
        }>;
    }): Promise<IGame>;
    static updateGame(gameId: string, updateData: Partial<{
        title: string;
        description: string;
        category: 'language' | 'culture' | 'soft-skills';
        difficulty: number;
        duration: number;
        xpReward: number;
        thumbnailUrl: string;
        isActive: boolean;
        questions: Array<{
            question: string;
            options: string[];
            correctAnswer: number;
            explanation?: string;
            points: number;
        }>;
    }>): Promise<IGame | null>;
    static deleteGame(gameId: string): Promise<IGame | null>;
    static getAllGames(filters?: {
        category?: string;
        difficulty?: number;
        isActive?: boolean;
    }): Promise<IGame[]>;
}
//# sourceMappingURL=gameService.d.ts.map