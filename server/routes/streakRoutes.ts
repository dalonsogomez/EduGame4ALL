import express, { Request, Response } from 'express';
import { StreakService } from '../services/streakService';
import { requireUser } from './middlewares/auth';
import { ALL_ROLES } from 'shared';
import mongoose from 'mongoose';

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    roles: string[];
  };
}

// Description: Get current user's streak information
// Endpoint: GET /api/streak
// Request: {}
// Response: { currentStreak: number, lastActivityDate: string, isActiveToday: boolean, daysUntilReset: number }
router.get('/', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    const streakInfo = await StreakService.getStreakInfo(userId);

    console.log(`[StreakRoutes] Streak info retrieved for user ${userId}`);

    res.status(200).json(streakInfo);
  } catch (error) {
    console.error('[StreakRoutes] Error fetching streak info:', error);
    res.status(500).json({ error: 'Failed to fetch streak information' });
  }
});

// Description: Manually update/check user streak
// Endpoint: POST /api/streak/update
// Request: {}
// Response: { streak: number, lastActivityDate: string, message: string }
router.post('/update', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    const userProgress = await StreakService.updateStreak(userId);

    console.log(`[StreakRoutes] Streak updated for user ${userId}: ${userProgress.streak}`);

    res.status(200).json({
      streak: userProgress.streak,
      lastActivityDate: userProgress.lastActivityDate,
      message: 'Streak updated successfully',
    });
  } catch (error) {
    console.error('[StreakRoutes] Error updating streak:', error);
    res.status(500).json({ error: 'Failed to update streak' });
  }
});

// Description: Get streak statistics (admin only)
// Endpoint: GET /api/streak/statistics
// Request: {}
// Response: { totalUsers: number, usersWithActiveStreaks: number, averageStreak: number, longestStreak: number, topStreaks: Array }
router.get('/statistics', requireUser(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const statistics = await StreakService.getStreakStatistics();

    console.log('[StreakRoutes] Streak statistics retrieved by admin');

    res.status(200).json(statistics);
  } catch (error) {
    console.error('[StreakRoutes] Error fetching streak statistics:', error);
    res.status(500).json({ error: 'Failed to fetch streak statistics' });
  }
});

// Description: Reset expired streaks (admin only - maintenance task)
// Endpoint: POST /api/streak/reset-expired
// Request: {}
// Response: { totalChecked: number, streaksReset: number, affectedUsers: string[], message: string }
router.post('/reset-expired', requireUser(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const result = await StreakService.checkAndResetExpiredStreaks();

    console.log(`[StreakRoutes] Expired streaks reset by admin: ${result.streaksReset} users affected`);

    res.status(200).json({
      ...result,
      message: 'Expired streaks have been reset',
    });
  } catch (error) {
    console.error('[StreakRoutes] Error resetting expired streaks:', error);
    res.status(500).json({ error: 'Failed to reset expired streaks' });
  }
});

// Description: Manually reset user's own streak
// Endpoint: POST /api/streak/reset
// Request: {}
// Response: { streak: number, message: string }
router.post('/reset', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    const userProgress = await StreakService.resetStreak(userId);

    if (!userProgress) {
      return res.status(404).json({ error: 'User progress not found' });
    }

    console.log(`[StreakRoutes] Streak manually reset for user ${userId}`);

    res.status(200).json({
      streak: userProgress.streak,
      message: 'Streak has been reset to 0',
    });
  } catch (error) {
    console.error('[StreakRoutes] Error resetting streak:', error);
    res.status(500).json({ error: 'Failed to reset streak' });
  }
});

export default router;
