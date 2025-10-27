import mongoose, { Document } from 'mongoose';
export interface IChallenge extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    type: 'play_games' | 'earn_xp' | 'complete_category' | 'perfect_score' | 'streak' | 'skill_focus';
    category?: 'language' | 'culture' | 'soft-skills';
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    date: Date;
    requirements: {
        targetCount?: number;
        targetXP?: number;
        minScore?: number;
        specificGameId?: mongoose.Types.ObjectId;
    };
    rewards: {
        xp: number;
        bonusBadgeId?: mongoose.Types.ObjectId;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Challenge: mongoose.Model<IChallenge, {}, {}, {}, mongoose.Document<unknown, {}, IChallenge, {}, {}> & IChallenge & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Challenge.d.ts.map