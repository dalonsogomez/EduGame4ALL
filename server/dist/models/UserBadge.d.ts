import mongoose, { Document } from 'mongoose';
export interface IUserBadge extends Document {
    userId: mongoose.Types.ObjectId;
    badgeId: mongoose.Types.ObjectId;
    earnedAt: Date;
    progress: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserBadge: mongoose.Model<IUserBadge, {}, {}, {}, mongoose.Document<unknown, {}, IUserBadge, {}, {}> & IUserBadge & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=UserBadge.d.ts.map