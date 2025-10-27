import { Router } from 'express';
import { requireUser } from './middlewares/auth';
import XpService, { SkillCategory } from '../services/xpService';

const router = Router();

// Description: Get user XP profile with detailed level info and skill categories
// Endpoint: GET /api/xp/profile
// Request: {}
// Response: { totalXP, level, skills: { language, culture, softSkills }, streak }
router.get('/profile', requireUser(), async (req, res) => {
  try {
    console.log(`[XP Routes] Fetching XP profile for user ${req.user._id}`);

    const xpProfile = await XpService.getUserXPProfile(req.user._id);

    res.status(200).json(xpProfile);
  } catch (error) {
    console.error(`[XP Routes] Error fetching XP profile:`, error);
    res.status(500).json({ error: 'Failed to fetch XP profile' });
  }
});

// Description: Award XP to a user (admin only, for testing/manual awards)
// Endpoint: POST /api/xp/award
// Request: { userId: string, xpAmount: number, category?: 'language' | 'culture' | 'softSkills' }
// Response: { success: boolean, result: XPAwardResult }
router.post('/award', requireUser(['admin']), async (req, res) => {
  try {
    const { userId, xpAmount, category } = req.body;

    if (!userId || typeof xpAmount !== 'number' || xpAmount <= 0) {
      return res.status(400).json({
        error: 'Valid userId and positive xpAmount are required'
      });
    }

    if (category && !['language', 'culture', 'softSkills'].includes(category)) {
      return res.status(400).json({
        error: 'Invalid category. Must be: language, culture, or softSkills'
      });
    }

    console.log(`[XP Routes] Admin ${req.user.email} awarding ${xpAmount} XP to user ${userId}${category ? ` in ${category}` : ''}`);

    const result = await XpService.awardXP(
      userId,
      xpAmount,
      category as SkillCategory
    );

    res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    console.error(`[XP Routes] Error awarding XP:`, error);
    res.status(500).json({ error: 'Failed to award XP' });
  }
});

// Description: Get XP leaderboard (total or category-specific)
// Endpoint: GET /api/xp/leaderboard/:category?
// Request: { category?: 'language' | 'culture' | 'softSkills', limit?: number }
// Response: { category: string, leaderboard: Array<{ rank, userId, xp, level }> }
router.get('/leaderboard/:category?', requireUser(), async (req, res) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    if (category && !['language', 'culture', 'softSkills'].includes(category)) {
      return res.status(400).json({
        error: 'Invalid category. Must be: language, culture, or softSkills'
      });
    }

    console.log(`[XP Routes] Fetching leaderboard for ${category || 'total'} (limit: ${limit})`);

    const leaderboard = await XpService.getLeaderboard(
      category as SkillCategory,
      limit
    );

    res.status(200).json({
      category: category || 'total',
      leaderboard,
    });
  } catch (error) {
    console.error(`[XP Routes] Error fetching leaderboard:`, error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Description: Calculate level from XP (utility endpoint)
// Endpoint: GET /api/xp/calculate-level
// Request: { xp: number }
// Response: { xp, level, xpForCurrentLevel, xpForNextLevel, progressPercentage }
router.get('/calculate-level', requireUser(), async (req, res) => {
  try {
    const xp = parseInt(req.query.xp as string) || 0;

    if (xp < 0) {
      return res.status(400).json({ error: 'XP must be non-negative' });
    }

    const levelInfo = XpService.getLevelInfo(xp);

    res.status(200).json(levelInfo);
  } catch (error) {
    console.error(`[XP Routes] Error calculating level:`, error);
    res.status(500).json({ error: 'Failed to calculate level' });
  }
});

export default router;
