import express, { Request, Response } from 'express';
import { ResourceService } from '../services/resourceService';
import { requireUser } from './middlewares/auth';
import { ALL_ROLES } from 'shared';

const router = express.Router();

// Description: Get jobs with optional filters and personalized match scoring
// Endpoint: GET /api/resources/jobs
// Request: { location?: string, jobType?: string }
// Response: { jobs: Array<Job> }
router.get('/jobs', requireUser(ALL_ROLES), async (req: Request, res: Response) => {
  try {
    const { location, jobType } = req.query;

    const filters: any = {};
    if (location) filters.location = location as string;
    if (jobType) filters.jobType = jobType as string;

    // Pass userId for personalized match scoring
    const userId = (req as any).user._id.toString();
    const jobs = await ResourceService.getJobs(filters, userId);

    res.status(200).json({ jobs });
  } catch (error: any) {
    console.error(`[ResourceRoutes] Error fetching jobs: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Get grants with optional filters
// Endpoint: GET /api/resources/grants
// Request: { minAmount?: number, maxAmount?: number }
// Response: { grants: Array<Grant> }
router.get('/grants', requireUser(ALL_ROLES), async (req: Request, res: Response) => {
  try {
    const { minAmount, maxAmount } = req.query;

    const filters: any = {};
    if (minAmount) filters.minAmount = parseInt(minAmount as string);
    if (maxAmount) filters.maxAmount = parseInt(maxAmount as string);

    const grants = await ResourceService.getGrants(filters);

    res.status(200).json({ grants });
  } catch (error: any) {
    console.error(`[ResourceRoutes] Error fetching grants: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Get community services with optional filters
// Endpoint: GET /api/resources/services
// Request: { serviceType?: string }
// Response: { services: Array<Service> }
router.get('/services', requireUser(ALL_ROLES), async (req: Request, res: Response) => {
  try {
    const { serviceType } = req.query;

    const filters: any = {};
    if (serviceType) filters.serviceType = serviceType as string;

    const services = await ResourceService.getServices(filters);

    res.status(200).json({ services });
  } catch (error: any) {
    console.error(`[ResourceRoutes] Error fetching services: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Get news articles with optional filters
// Endpoint: GET /api/resources/news
// Request: { category?: string, limit?: number }
// Response: { news: Array<News> }
router.get('/news', requireUser(ALL_ROLES), async (req: Request, res: Response) => {
  try {
    const { category, limit } = req.query;

    const filters: any = {};
    if (category) filters.category = category as string;
    if (limit) filters.limit = parseInt(limit as string);

    const news = await ResourceService.getNews(filters);

    res.status(200).json({ news });
  } catch (error: any) {
    console.error(`[ResourceRoutes] Error fetching news: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
