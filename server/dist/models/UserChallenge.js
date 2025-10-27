import mongoose, { Schema } from 'mongoose';
const UserChallengeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    challengeId: {
        type: Schema.Types.ObjectId,
        ref: 'Challenge',
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ['in_progress', 'completed', 'expired'],
        default: 'in_progress',
        index: true,
    },
    progress: {
        current: {
            type: Number,
            default: 0,
            min: 0,
        },
        target: {
            type: Number,
            required: true,
            min: 1,
        },
        percentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
    },
    completedAt: {
        type: Date,
    },
    xpEarned: {
        type: Number,
        default: 0,
        min: 0,
    },
    bonusBadgeAwarded: {
        type: Boolean,
        default: false,
    },
    bonusBadgeId: {
        type: Schema.Types.ObjectId,
        ref: 'Badge',
    },
}, {
    timestamps: true,
});
// Compound index for finding user's active challenges
UserChallengeSchema.index({ userId: 1, status: 1, createdAt: -1 });
// Unique constraint: one user challenge per user per challenge
UserChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });
export const UserChallenge = mongoose.model('UserChallenge', UserChallengeSchema);
//# sourceMappingURL=UserChallenge.js.map