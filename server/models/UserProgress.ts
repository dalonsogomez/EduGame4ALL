import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  totalXP: number;
  level: number;
  streak: number;
  lastActivityDate: Date;
  weeklyGoal: number;
  weeklyProgress: number;
  skills: {
    language: {
      xp: number;
      level: number;
    };
    culture: {
      xp: number;
      level: number;
    };
    softSkills: {
      xp: number;
      level: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserProgressSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
UserProgressSchema.index({ userId: 1 });
UserProgressSchema.index({ totalXP: -1 }); // For leaderboard

export const UserProgress = mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
