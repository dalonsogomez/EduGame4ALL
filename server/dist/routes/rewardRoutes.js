import express from 'express';
import { RewardService } from '../services/rewardService';
import { requireUser } from './middlewares/auth';
import { ALL_ROLES } from 'shared';
const router = express.Router();
// Description: Get all available rewards
// Endpoint: GET /api/rewards
// Request: { category?: string }
// Response: { rewards: Array<Reward> }
router.get('/', requireUser(ALL_ROLES), async (req, res) => {
    try {
        const { category } = req.query;
        const rewards = await RewardService.getRewards(category);
        res.status(200).json({ rewards });
    }
    catch (error) {
        console.error(`Error fetching rewards: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});
// Description: Redeem a reward
// Endpoint: POST /api/rewards/:id/redeem
// Request: { id: string }
// Response: { userReward: UserReward, qrCode: string }
router.post('/:id/redeem', requireUser(ALL_ROLES), async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.user?._id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const result = await RewardService.redeemReward(req.user._id, id);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(`Error redeeming reward: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
});
// Description: Get user's redeemed rewards
// Endpoint: GET /api/rewards/my-rewards
// Request: { status?: string }
// Response: { rewards: Array<UserReward> }
router.get('/my-rewards', requireUser(ALL_ROLES), async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { status } = req.query;
        const rewards = await RewardService.getUserRewards(req.user._id, status);
        res.status(200).json({ rewards });
    }
    catch (error) {
        console.error(`Error fetching user rewards: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=rewardRoutes.js.map