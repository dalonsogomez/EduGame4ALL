import express, { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService';
import { requireUser } from './middlewares/auth';
import { ALL_ROLES } from 'shared';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Description: Get dashboard data for user
// Endpoint: GET /api/dashboard
// Request: {}
// Response: { userProgress, recentActivity, leaderboard, dailyChallenge, recommendedGames }
router.get('/', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const dashboardData = await DashboardService.getDashboardData(req.user._id);

    res.status(200).json(dashboardData);
  } catch (error: any) {
    console.error(`Error fetching dashboard data: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
