import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  type: 'job' | 'grant' | 'service' | 'news';
  title: string;
  description: string;
  // Job-specific fields
  company?: string;
  location?: string;
  salary?: string;
  jobType?: string;
  requirements?: string[];
  matchScore?: number;
  // Grant-specific fields
  amount?: string;
  deadline?: Date;
  eligibility?: string[];
  // Service-specific fields
  provider?: string;
  serviceType?: string;
  contact?: string;
  // News-specific fields
  source?: string;
  publishedDate?: Date;
  imageUrl?: string;
  // Common fields
  url?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ['job', 'grant', 'service', 'news'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    // Job fields
    company: String,
    location: String,
    salary: String,
    jobType: String,
    requirements: [String],
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    // Grant fields
    amount: String,
    deadline: Date,
    eligibility: [String],
    // Service fields
    provider: String,
    serviceType: String,
    contact: String,
    // News fields
    source: String,
    publishedDate: Date,
    imageUrl: String,
    // Common
    url: String,
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
ResourceSchema.index({ type: 1, isActive: 1, createdAt: -1 });

export const Resource = mongoose.model<IResource>('Resource', ResourceSchema);
