import express from 'express';
import { requireUser } from './middlewares/auth';
import { ChallengeService } from '../services/challengeService';
import mongoose from 'mongoose';

const router = express.Router();

// Description: Get today's daily challenge for the authenticated user
// Endpoint: GET /api/challenges/daily
// Request: {}
// Response: { challenge: Challenge, userChallenge: UserChallenge, stats: ChallengeStats }
router.get('/daily', requireUser(), async (req, res) => {
  try {
    const userId = req.user._id;

    console.log(`[GET /api/challenges/daily] Fetching daily challenge for user ${userId}`);

    const { challenge, userChallenge } = await ChallengeService.getUserDailyChallenge(userId);
    const stats = await ChallengeService.getChallengeStats(userId);

    res.status(200).json({
      challenge,
      userChallenge,
      stats,
    });
  } catch (error) {
    console.error('[GET /api/challenges/daily] Error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Description: Mark a challenge as completed
// Endpoint: POST /api/challenges/:challengeId/complete
// Request: {}
// Response: { success: true, userChallenge: UserChallenge, xpEarned: number, bonusBadgeAwarded: boolean }
router.post('/:challengeId/complete', requireUser(), async (req, res) => {
  try {
    const userId = req.user._id;
    const challengeId = new mongoose.Types.ObjectId(req.params.challengeId);

    console.log(`[POST /api/challenges/${challengeId}/complete] Completing challenge for user ${userId}`);

    const userChallenge = await ChallengeService.completeChallenge(userId, challengeId);

    res.status(200).json({
      success: true,
      userChallenge,
      xpEarned: userChallenge.xpEarned,
      bonusBadgeAwarded: userChallenge.bonusBadgeAwarded,
    });
  } catch (error) {
    console.error(`[POST /api/challenges/:challengeId/complete] Error:`, error);
    res.status(400).json({ error: (error as Error).message });
  }
});

// Description: Get challenge history for the authenticated user
// Endpoint: GET /api/challenges/history
// Request: { limit?: number }
// Response: { history: Array<{ challenge: Challenge, userChallenge: UserChallenge }>, stats: ChallengeStats }
router.get('/history', requireUser(), async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    console.log(`[GET /api/challenges/history] Fetching challenge history for user ${userId}`);

    const history = await ChallengeService.getChallengeHistory(userId, limit);
    const stats = await ChallengeService.getChallengeStats(userId);

    res.status(200).json({
      history,
      stats,
    });
  } catch (error) {
    console.error('[GET /api/challenges/history] Error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Description: Get challenge statistics for the authenticated user
// Endpoint: GET /api/challenges/stats
// Request: {}
// Response: { stats: ChallengeStats }
router.get('/stats', requireUser(), async (req, res) => {
  try {
    const userId = req.user._id;

    console.log(`[GET /api/challenges/stats] Fetching challenge stats for user ${userId}`);

    const stats = await ChallengeService.getChallengeStats(userId);

    res.status(200).json({ stats });
  } catch (error) {
    console.error('[GET /api/challenges/stats] Error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
