import mongoose, { Schema } from 'mongoose';
const ChallengeSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['play_games', 'earn_xp', 'complete_category', 'perfect_score', 'streak', 'skill_focus'],
        required: true,
    },
    category: {
        type: String,
        enum: ['language', 'culture', 'soft-skills'],
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
    },
    date: {
        type: Date,
        required: true,
        index: true,
    },
    requirements: {
        targetCount: Number,
        targetXP: Number,
        minScore: Number,
        specificGameId: {
            type: Schema.Types.ObjectId,
            ref: 'Game',
        },
    },
    rewards: {
        xp: {
            type: Number,
            required: true,
            min: 0,
        },
        bonusBadgeId: {
            type: Schema.Types.ObjectId,
            ref: 'Badge',
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// Index for finding today's challenge
ChallengeSchema.index({ date: 1, isActive: 1 });
export const Challenge = mongoose.model('Challenge', ChallengeSchema);
export default Challenge;
//# sourceMappingURL=Challenge.js.map