import mongoose, { Schema } from 'mongoose';
const GameSessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    gameId: {
        type: Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
    },
    score: {
        type: Number,
        required: true,
        min: 0,
    },
    maxScore: {
        type: Number,
        required: true,
        min: 0,
    },
    xpEarned: {
        type: Number,
        required: true,
        min: 0,
    },
    timeSpent: {
        type: Number,
        required: true,
        min: 0,
    },
    completedAt: {
        type: Date,
        default: Date.now,
    },
    answers: [
        {
            questionIndex: {
                type: Number,
                required: true,
            },
            selectedAnswer: {
                type: Number,
                required: true,
            },
            isCorrect: {
                type: Boolean,
                required: true,
            },
            pointsEarned: {
                type: Number,
                required: true,
                min: 0,
            },
        },
    ],
    feedback: {
        strengths: {
            type: [String],
            default: [],
        },
        improvements: {
            type: [String],
            default: [],
        },
        tips: {
            type: [String],
            default: [],
        },
        nextRecommendations: {
            type: [String],
            default: [],
        },
        personalizedMessage: {
            type: String,
            default: '',
        },
    },
}, {
    timestamps: true,
});
// Indexes for efficient querying
GameSessionSchema.index({ userId: 1, createdAt: -1 });
GameSessionSchema.index({ gameId: 1 });
GameSessionSchema.index({ userId: 1, gameId: 1 });
export const GameSession = mongoose.model('GameSession', GameSessionSchema);
//# sourceMappingURL=GameSession.js.map