import mongoose, { Schema, Document } from 'mongoose';

export interface IBadge extends Document {
  name: string;
  description: string;
  category: 'language' | 'culture' | 'soft-skills' | 'achievement';
  iconUrl?: string;
  xpRequired: number;
  level: number; // 1-5 (Bronze, Silver, Gold, Platinum, Diamond)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BadgeSchema: Schema = new Schema(
  {
    name: {
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
      enum: ['language', 'culture', 'soft-skills', 'achievement'],
      required: true,
    },
    iconUrl: {
      type: String,
      default: '',
    },
    xpRequired: {
      type: Number,
      required: true,
      min: 0,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
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

// Index for efficient querying
BadgeSchema.index({ category: 1, xpRequired: 1, isActive: 1 });

export const Badge = mongoose.model<IBadge>('Badge', BadgeSchema);
