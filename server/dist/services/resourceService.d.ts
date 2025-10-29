import { IResource } from '../models/Resource';
export declare class ResourceService {
    private static calculateMatchScore;
    static getJobs(filters?: {
        location?: string;
        jobType?: string;
    }, userId?: string): Promise<any[]>;
    static getGrants(filters?: {
        minAmount?: number;
        maxAmount?: number;
    }): Promise<any[]>;
    static getServices(filters?: {
        serviceType?: string;
    }): Promise<any[]>;
    static getNews(filters?: {
        category?: string;
        limit?: number;
    }): Promise<any[]>;
    static createResource(data: Partial<IResource>): Promise<IResource>;
    static updateResource(resourceId: string, data: Partial<IResource>): Promise<IResource | null>;
    static deleteResource(resourceId: string): Promise<boolean>;
}
//# sourceMappingURL=resourceService.d.ts.map