import mongoose, { Schema } from 'mongoose';
const GameSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['language', 'culture', 'soft-skills'],
        required: true,
    },
    difficulty: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    duration: {
        type: Number,
        required: true,
        min: 1,
    },
    xpReward: {
        type: Number,
        required: true,
        min: 0,
    },
    thumbnailUrl: {
        type: String,
        default: '',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    questions: [
        {
            question: {
                type: String,
                required: true,
            },
            options: {
                type: [String],
                required: true,
                validate: {
                    validator: (v) => v.length >= 2,
                    message: 'At least 2 options are required',
                },
            },
            correctAnswer: {
                type: Number,
                required: true,
            },
            explanation: {
                type: String,
            },
            points: {
                type: Number,
                required: true,
                default: 10,
            },
        },
    ],
}, {
    timestamps: true,
});
// Index for efficient querying
GameSchema.index({ category: 1, difficulty: 1, isActive: 1 });
export const Game = mongoose.model('Game', GameSchema);
export default Game;
//# sourceMappingURL=Game.js.map