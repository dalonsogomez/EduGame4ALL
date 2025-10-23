import mongoose, { Schema, Document } from 'mongoose';

export interface IReward extends Document {
  title: string;
  description: string;
  category: 'gift-cards' | 'courses' | 'discounts' | 'events';
  xpCost: number;
  availableQuantity: number;
  totalQuantity: number;
  imageUrl?: string;
  isActive: boolean;
  expiryDate?: Date;
  terms?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RewardSchema: Schema = new Schema(
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
      enum: ['gift-cards', 'courses', 'discounts', 'events'],
      required: true,
    },
    xpCost: {
      type: Number,
      required: true,
      min: 0,
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiryDate: {
      type: Date,
    },
    terms: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
RewardSchema.index({ category: 1, xpCost: 1, isActive: 1, availableQuantity: 1 });

export const Reward = mongoose.model<IReward>('Reward', RewardSchema);
