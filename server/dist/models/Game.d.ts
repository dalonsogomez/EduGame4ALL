import mongoose, { Document } from 'mongoose';
export interface IGame extends Document {
    title: string;
    description: string;
    category: 'language' | 'culture' | 'soft-skills';
    difficulty: number;
    duration: number;
    xpReward: number;
    thumbnailUrl?: string;
    isActive: boolean;
    questions: Array<{
        question: string;
        options: string[];
        correctAnswer: number;
        explanation?: string;
        points: number;
    }>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Game: mongoose.Model<IGame, {}, {}, {}, mongoose.Document<unknown, {}, IGame, {}, {}> & IGame & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Game;
//# sourceMappingURL=Game.d.ts.map