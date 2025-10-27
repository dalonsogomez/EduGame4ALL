import mongoose, { Schema, Document } from 'mongoose';

export interface IUserReward extends Document {
  userId: mongoose.Types.ObjectId;
  rewardId: mongoose.Types.ObjectId;
  status: 'active' | 'used' | 'expired';
  redeemedAt: Date;
  usedAt?: Date;
  qrCode: string;
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserRewardSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
UserRewardSchema.index({ userId: 1, status: 1, redeemedAt: -1 });
// Note: qrCode index is automatically created by unique: true constraint

export const UserReward = mongoose.model<IUserReward>('UserReward', UserRewardSchema);
