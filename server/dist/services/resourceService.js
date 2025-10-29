import { Resource } from '../models/Resource';
import { UserProgress } from '../models/UserProgress';
export class ResourceService {
    // Calculate match score for a job based on user's skills and progress
    static async calculateMatchScore(userId, job) {
        try {
            const userProgress = await UserProgress.findOne({ userId });
            if (!userProgress) {
                return 50; // Default score if no progress data
            }
            let score = 50; // Base score
            // Add points based on language skills (up to +20)
            const languageLevel = userProgress.skills.language.level;
            score += Math.min(languageLevel * 4, 20);
            // Add points based on soft skills (up to +15)
            const softSkillsLevel = userProgress.skills.softSkills.level;
            score += Math.min(softSkillsLevel * 3, 15);
            // Add points based on culture knowledge (up to +15)
            const cultureLevel = userProgress.skills.culture.level;
            score += Math.min(cultureLevel * 3, 15);
            // Ensure score is between 0 and 100
            return Math.min(Math.max(score, 0), 100);
        }
        catch (error) {
            console.error('[ResourceService] Error calculating match score:', error);
            return 50; // Default score on error
        }
    }
    // Get jobs with match scoring
    static async getJobs(filters, userId) {
        console.log('[ResourceService] Fetching jobs with filters:', filters);
        const query = { type: 'job', isActive: true };
        if (filters?.location) {
            query.location = new RegExp(filters.location, 'i');
        }
        if (filters?.jobType) {
            query.jobType = filters.jobType;
        }
        let jobs = await Resource.find(query).sort({ matchScore: -1, createdAt: -1 }).lean();
        // Calculate match scores for authenticated users
        if (userId) {
            console.log('[ResourceService] Calculating personalized match scores for user:', userId);
            for (const job of jobs) {
                job.matchScore = await this.calculateMatchScore(userId, job);
            }
            // Re-sort by calculated match score
            jobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        }
        console.log(`[ResourceService] Found ${jobs.length} jobs`);
        return jobs;
    }
    // Get grants
    static async getGrants(filters) {
        console.log('[ResourceService] Fetching grants with filters:', filters);
        const query = { type: 'grant', isActive: true };
        const grants = await Resource.find(query).sort({ deadline: 1, createdAt: -1 });
        console.log(`[ResourceService] Found ${grants.length} grants`);
        return grants;
    }
    // Get services
    static async getServices(filters) {
        console.log('[ResourceService] Fetching services with filters:', filters);
        const query = { type: 'service', isActive: true };
        if (filters?.serviceType) {
            query.serviceType = filters.serviceType;
        }
        const services = await Resource.find(query).sort({ createdAt: -1 });
        console.log(`[ResourceService] Found ${services.length} services`);
        return services;
    }
    // Get news with optional category filter
    static async getNews(filters) {
        console.log('[ResourceService] Fetching news with filters:', filters);
        const query = { type: 'news', isActive: true };
        // Add category filter if provided
        if (filters?.category) {
            query.category = filters.category;
        }
        const limit = filters?.limit || 20;
        const news = await Resource.find(query).sort({ publishedDate: -1, createdAt: -1 }).limit(limit);
        console.log(`[ResourceService] Found ${news.length} news articles`);
        return news;
    }
    // Create resource (admin only)
    static async createResource(data) {
        console.log('[ResourceService] Creating resource:', data.type, data.title);
        const resource = await Resource.create(data);
        console.log('[ResourceService] Resource created successfully');
        return resource;
    }
    // Update resource (admin only)
    static async updateResource(resourceId, data) {
        console.log('[ResourceService] Updating resource:', resourceId);
        const resource = await Resource.findByIdAndUpdate(resourceId, data, { new: true });
        if (resource) {
            console.log('[ResourceService] Resource updated successfully');
        }
        else {
            console.log('[ResourceService] Resource not found');
        }
        return resource;
    }
    // Delete resource (admin only)
    static async deleteResource(resourceId) {
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
//# sourceMappingURL=resourceService.js.map