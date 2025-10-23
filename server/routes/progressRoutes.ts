import express, { Request, Response } from 'express';
import { ProgressService } from '../services/progressService';
import { requireUser } from './middlewares/auth';
import { ALL_ROLES } from 'shared';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Description: Get user badges with progress
// Endpoint: GET /api/progress/badges
// Request: {}
// Response: { badges: Array<BadgeWithProgress> }
router.get('/badges', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const badges = await ProgressService.getUserBadges(req.user._id);

    res.status(200).json({ badges });
  } catch (error: any) {
    console.error(`Error fetching badges: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Get user game history
// Endpoint: GET /api/progress/history
// Request: { limit?: number }
// Response: { history: Array<GameSession> }
router.get('/history', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const history = await ProgressService.getGameHistory(req.user._id, limit);

    res.status(200).json({ history });
  } catch (error: any) {
    console.error(`Error fetching game history: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Get weekly report
// Endpoint: GET /api/progress/weekly-report
// Request: {}
// Response: { report: WeeklyReport }
router.get('/weekly-report', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const report = await ProgressService.getWeeklyReport(req.user._id);

    res.status(200).json({ report });
  } catch (error: any) {
    console.error(`Error fetching weekly report: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
