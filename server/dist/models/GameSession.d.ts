import mongoose, { Document } from 'mongoose';
export interface IGameSession extends Document {
    userId: mongoose.Types.ObjectId;
    gameId: mongoose.Types.ObjectId;
    score: number;
    maxScore: number;
    xpEarned: number;
    timeSpent: number;
    completedAt: Date;
    answers: Array<{
        questionIndex: number;
        selectedAnswer: number;
        isCorrect: boolean;
        pointsEarned: number;
    }>;
    feedback?: {
        strengths: string[];
        improvements: string[];
        tips: string[];
        nextRecommendations: string[];
        personalizedMessage: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const GameSession: mongoose.Model<IGameSession, {}, {}, {}, mongoose.Document<unknown, {}, IGameSession, {}, {}> & IGameSession & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=GameSession.d.ts.map