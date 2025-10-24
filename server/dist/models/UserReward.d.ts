import mongoose, { Document } from 'mongoose';
export interface IUserReward extends Document {
    userId: mongoose.Types.ObjectId;
    rewardId: mongoose.Types.ObjectId;
    status: 'active' | 'used' | 'expired';
    redeemedAt: Date;
    usedAt?: Date;
    qrCode: string;
    expiryDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserReward: mongoose.Model<IUserReward, {}, {}, {}, mongoose.Document<unknown, {}, IUserReward, {}, {}> & IUserReward & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=UserReward.d.ts.map