import mongoose, { Schema } from 'mongoose';
const UserRewardSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rewardId: {
        type: Schema.Types.ObjectId,
        ref: 'Reward',
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'used', 'expired'],
        default: 'active',
    },
    redeemedAt: {
        type: Date,
        default: Date.now,
    },
    usedAt: {
        type: Date,
    },
    qrCode: {
        type: String,
        required: true,
        unique: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});
// Indexes for efficient querying
UserRewardSchema.index({ userId: 1, status: 1, redeemedAt: -1 });
UserRewardSchema.index({ qrCode: 1 });
export const UserReward = mongoose.model('UserReward', UserRewardSchema);
//# sourceMappingURL=UserReward.js.map