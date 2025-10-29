import mongoose, { Document } from 'mongoose';
export interface IBadge extends Document {
    name: string;
    description: string;
    category: 'language' | 'culture' | 'soft-skills' | 'achievement';
    iconUrl?: string;
    xpRequired: number;
    level: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Badge: mongoose.Model<IBadge, {}, {}, {}, mongoose.Document<unknown, {}, IBadge, {}, {}> & IBadge & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Badge;
//# sourceMappingURL=Badge.d.ts.map