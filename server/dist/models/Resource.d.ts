import mongoose, { Document } from 'mongoose';
export interface IResource extends Document {
    type: 'job' | 'grant' | 'service' | 'news';
    title: string;
    description: string;
    company?: string;
    location?: string;
    salary?: string;
    jobType?: string;
    requirements?: string[];
    matchScore?: number;
    amount?: string;
    deadline?: Date;
    eligibility?: string[];
    provider?: string;
    serviceType?: string;
    contact?: string;
    source?: string;
    publishedDate?: Date;
    imageUrl?: string;
    url?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Resource: mongoose.Model<IResource, {}, {}, {}, mongoose.Document<unknown, {}, IResource, {}, {}> & IResource & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Resource.d.ts.map