import mongoose, { Document, Schema } from 'mongoose';

export interface IChallenge extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: 'play_games' | 'earn_xp' | 'complete_category' | 'perfect_score' | 'streak' | 'skill_focus';
  category?: 'language' | 'culture' | 'soft-skills';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  date: Date; // The date this challenge is active
  requirements: {
    targetCount?: number; // e.g., play 3 games
    targetXP?: number; // e.g., earn 150 XP
    minScore?: number; // e.g., score at least 80%
    specificGameId?: mongoose.Types.ObjectId; // specific game to complete
  };
  rewards: {
    xp: number;
    bonusBadgeId?: mongoose.Types.ObjectId; // Optional bonus badge
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>(
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
  },
  {
    timestamps: true,
  }
);

// Index for finding today's challenge
ChallengeSchema.index({ date: 1, isActive: 1 });

export const Challenge = mongoose.model<IChallenge>('Challenge', ChallengeSchema);
export default Challenge;
