import mongoose, { Document, Schema } from 'mongoose';

export interface IUserChallenge extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  status: 'in_progress' | 'completed' | 'expired';
  progress: {
    current: number; // current count (games played, XP earned, etc.)
    target: number; // target count
    percentage: number; // 0-100
  };
  completedAt?: Date;
  xpEarned: number;
  bonusBadgeAwarded: boolean;
  bonusBadgeId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserChallengeSchema = new Schema<IUserChallenge>(
  {
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
  },
  {
    timestamps: true,
  }
);

// Compound index for finding user's active challenges
UserChallengeSchema.index({ userId: 1, status: 1, createdAt: -1 });
// Unique constraint: one user challenge per user per challenge
UserChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

export const UserChallenge = mongoose.model<IUserChallenge>('UserChallenge', UserChallengeSchema);
