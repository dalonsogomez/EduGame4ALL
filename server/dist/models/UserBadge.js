import mongoose, { Schema } from 'mongoose';
const UserBadgeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    badgeId: {
        type: Schema.Types.ObjectId,
        ref: 'Badge',
        required: true,
    },
    earnedAt: {
        type: Date,
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
}, {
    timestamps: true,
});
// Compound unique index to prevent duplicate badges
UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });
UserBadgeSchema.index({ userId: 1, earnedAt: -1 });
export const UserBadge = mongoose.model('UserBadge', UserBadgeSchema);
//# sourceMappingURL=UserBadge.js.map