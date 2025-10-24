import express, { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService';
import { requireUser } from './middlewares/auth';
import { ALL_ROLES } from 'shared';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Description: Get dashboard data for user including skills, daily challenge, recent activity, and leaderboard
// Endpoint: GET /api/dashboard
// Request: {}
// Response: { skills: SkillLevel[], dailyChallenge: DailyChallenge, recentActivity: ActivityItem[], leaderboard: LeaderboardEntry[] }
router.get('/', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      console.log('[DashboardRoutes] User not authenticated');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user._id.toString();
    console.log('[DashboardRoutes] Fetching dashboard data for user:', userId);

    const dashboardData = await DashboardService.getDashboardData(userId);

    console.log('[DashboardRoutes] Dashboard data fetched successfully');
    res.status(200).json(dashboardData);
  } catch (error: any) {
    console.error(`[DashboardRoutes] Error fetching dashboard data: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
