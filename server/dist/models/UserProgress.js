import mongoose, { Schema } from 'mongoose';
const UserProgressSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    totalXP: {
        type: Number,
        default: 0,
        min: 0,
    },
    level: {
        type: Number,
        default: 1,
        min: 1,
    },
    streak: {
        type: Number,
        default: 0,
        min: 0,
    },
    lastActivityDate: {
        type: Date,
        default: Date.now,
    },
    weeklyGoal: {
        type: Number,
        default: 5, // 5 games per week
        min: 1,
    },
    weeklyProgress: {
        type: Number,
        default: 0,
        min: 0,
    },
    skills: {
        language: {
            xp: {
                type: Number,
                default: 0,
                min: 0,
            },
            level: {
                type: Number,
                default: 1,
                min: 1,
            },
        },
        culture: {
            xp: {
                type: Number,
                default: 0,
                min: 0,
            },
            level: {
                type: Number,
                default: 1,
                min: 1,
            },
        },
        softSkills: {
            xp: {
                type: Number,
                default: 0,
                min: 0,
            },
            level: {
                type: Number,
                default: 1,
                min: 1,
            },
        },
    },
}, {
    timestamps: true,
});
// Index for efficient querying
// Note: userId index is automatically created by unique: true constraint
UserProgressSchema.index({ totalXP: -1 }); // For leaderboard
export const UserProgress = mongoose.model('UserProgress', UserProgressSchema);
export default UserProgress;
//# sourceMappingURL=UserProgress.js.map