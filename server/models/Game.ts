import mongoose, { Schema, Document } from 'mongoose';

export interface IGame extends Document {
  title: string;
  description: string;
  category: 'language' | 'culture' | 'soft-skills';
  difficulty: number; // 1-5
  duration: number; // in minutes
  xpReward: number;
  thumbnailUrl?: string;
  isActive: boolean;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
    points: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema: Schema = new Schema(
  {
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
            validator: (v: string[]) => v.length >= 2,
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
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
GameSchema.index({ category: 1, difficulty: 1, isActive: 1 });

export const Game = mongoose.model<IGame>('Game', GameSchema);
export default Game;
