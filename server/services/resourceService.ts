import { Resource, IResource } from '../models/Resource';

export class ResourceService {
  // Get jobs
  static async getJobs(filters?: { location?: string; jobType?: string }): Promise<any[]> {
    console.log('[ResourceService] Fetching jobs with filters:', filters);

    const query: any = { type: 'job', isActive: true };

    if (filters?.location) {
      query.location = new RegExp(filters.location, 'i');
    }

    if (filters?.jobType) {
      query.jobType = filters.jobType;
    }

    const jobs = await Resource.find(query).sort({ matchScore: -1, createdAt: -1 });

    console.log(`[ResourceService] Found ${jobs.length} jobs`);
    return jobs;
  }

  // Get grants
  static async getGrants(filters?: { minAmount?: number; maxAmount?: number }): Promise<any[]> {
    console.log('[ResourceService] Fetching grants with filters:', filters);

    const query: any = { type: 'grant', isActive: true };

    const grants = await Resource.find(query).sort({ deadline: 1, createdAt: -1 });

    console.log(`[ResourceService] Found ${grants.length} grants`);
    return grants;
  }

  // Get services
  static async getServices(filters?: { serviceType?: string }): Promise<any[]> {
    console.log('[ResourceService] Fetching services with filters:', filters);

    const query: any = { type: 'service', isActive: true };

    if (filters?.serviceType) {
      query.serviceType = filters.serviceType;
    }

    const services = await Resource.find(query).sort({ createdAt: -1 });

    console.log(`[ResourceService] Found ${services.length} services`);
    return services;
  }

  // Get news
  static async getNews(limit = 20): Promise<any[]> {
    console.log('[ResourceService] Fetching news, limit:', limit);

    const query: any = { type: 'news', isActive: true };

    const news = await Resource.find(query).sort({ publishedDate: -1, createdAt: -1 }).limit(limit);

    console.log(`[ResourceService] Found ${news.length} news articles`);
    return news;
  }

  // Create resource (admin only)
  static async createResource(data: Partial<IResource>): Promise<IResource> {
    console.log('[ResourceService] Creating resource:', data.type, data.title);

    const resource = await Resource.create(data);

    console.log('[ResourceService] Resource created successfully');
    return resource;
  }

  // Update resource (admin only)
  static async updateResource(resourceId: string, data: Partial<IResource>): Promise<IResource | null> {
    console.log('[ResourceService] Updating resource:', resourceId);

    const resource = await Resource.findByIdAndUpdate(resourceId, data, { new: true });

    if (resource) {
      console.log('[ResourceService] Resource updated successfully');
    } else {
      console.log('[ResourceService] Resource not found');
    }

    return resource;
  }

  // Delete resource (admin only)
  static async deleteResource(resourceId: string): Promise<boolean> {
    console.log('[ResourceService] Deleting resource:', resourceId);

    const result = await Resource.findByIdAndUpdate(resourceId, { isActive: false });

    if (result) {
      console.log('[ResourceService] Resource deleted successfully');
      return true;
    }

    console.log('[ResourceService] Resource not found');
    return false;
  }
}
