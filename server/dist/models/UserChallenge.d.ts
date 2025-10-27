import mongoose, { Document } from 'mongoose';
export interface IUserChallenge extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    challengeId: mongoose.Types.ObjectId;
    status: 'in_progress' | 'completed' | 'expired';
    progress: {
        current: number;
        target: number;
        percentage: number;
    };
    completedAt?: Date;
    xpEarned: number;
    bonusBadgeAwarded: boolean;
    bonusBadgeId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserChallenge: mongoose.Model<IUserChallenge, {}, {}, {}, mongoose.Document<unknown, {}, IUserChallenge, {}, {}> & IUserChallenge & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=UserChallenge.d.ts.map