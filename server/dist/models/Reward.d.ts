import mongoose, { Document } from 'mongoose';
export interface IReward extends Document {
    title: string;
    description: string;
    category: 'gift-cards' | 'courses' | 'discounts' | 'events';
    xpCost: number;
    availableQuantity: number;
    totalQuantity: number;
    imageUrl?: string;
    isActive: boolean;
    expiryDate?: Date;
    terms?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Reward: mongoose.Model<IReward, {}, {}, {}, mongoose.Document<unknown, {}, IReward, {}, {}> & IReward & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Reward;
//# sourceMappingURL=Reward.d.ts.map