import mongoose, { Schema } from 'mongoose';
const ResourceSchema = new Schema({
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
}, {
    timestamps: true,
});
// Index for efficient querying
ResourceSchema.index({ type: 1, isActive: 1, createdAt: -1 });
export const Resource = mongoose.model('Resource', ResourceSchema);
//# sourceMappingURL=Resource.js.map