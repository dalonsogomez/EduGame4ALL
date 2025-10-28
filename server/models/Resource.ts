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
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
  languages?: string[];
  isFree?: boolean;
  coordinates?: { lat: number; lng: number };
  // News-specific fields
  source?: string;
  publishedDate?: Date;
  imageUrl?: string;
  category?: string;
  difficulty?: string;
  summary?: string;
  content?: string;
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
    address: String,
    phone: String,
    email: String,
    hours: String,
    languages: [String],
    isFree: Boolean,
    coordinates: {
      lat: Number,
      lng: Number,
    },
    // News fields
    source: String,
    publishedDate: Date,
    imageUrl: String,
    category: String,
    difficulty: String,
    summary: String,
    content: String,
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
export default Resource;
