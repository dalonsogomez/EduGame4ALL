import api from './api';
import { Reward, RedeemedReward } from '@/types';

// Description: Get all available rewards from the catalog
// Endpoint: GET /api/rewards
// Request: { category?: string }
// Response: { rewards: Array<Reward> }
export const getRewards = async (category?: string) => {
  try {
    console.log('[getRewards] Fetching rewards, category:', category);
    const response = await api.get('/api/rewards', { params: category ? { category } : {} });

    // Map backend response to frontend types
    const rewards = response.data.rewards.map((reward: any) => ({
      _id: reward._id,
      title: reward.title,
      description: reward.description,
      category: reward.category,
      cost: reward.xpCost,
      image: reward.imageUrl || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400',
      available: reward.availableQuantity,
      expirationDays: reward.expiryDate
        ? Math.ceil((new Date(reward.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : undefined,
    }));

    console.log(`[getRewards] Fetched ${rewards.length} rewards`);
    return { rewards };
  } catch (error: any) {
    console.error('[getRewards] Error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Redeem a reward with XP balance check and QR code generation
// Endpoint: POST /api/rewards/:id/redeem
// Request: {}
// Response: { userReward: UserReward, qrCode: string }
export const redeemReward = async (rewardId: string) => {
  try {
    console.log('[redeemReward] Redeeming reward:', rewardId);
    const response = await api.post(`/api/rewards/${rewardId}/redeem`);

    const { userReward, qrCode } = response.data;
    const reward = userReward.rewardId;

    // Map backend response to frontend types
    const redeemedReward: RedeemedReward = {
      _id: userReward._id,
      reward: {
        _id: reward._id,
        title: reward.title,
        description: reward.description,
        category: reward.category,
        cost: reward.xpCost,
        image: reward.imageUrl || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400',
        available: reward.availableQuantity,
        expirationDays: reward.expiryDate
          ? Math.ceil((new Date(reward.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          : undefined,
      },
      qrCode: qrCode,
      redeemedAt: userReward.redeemedAt,
      expiresAt: userReward.expiryDate,
      isUsed: userReward.status === 'used',
    };

    console.log('[redeemReward] Reward redeemed successfully');
    return { redeemedReward };
  } catch (error: any) {
    console.error('[redeemReward] Error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get user's redeemed rewards with status filtering
// Endpoint: GET /api/rewards/my-rewards
// Request: { status?: 'active' | 'used' | 'expired' }
// Response: { rewards: Array<UserReward> }
export const getMyRewards = async (status?: string) => {
  try {
    console.log('[getMyRewards] Fetching user rewards, status:', status);
    const response = await api.get('/api/rewards/my-rewards', { params: status ? { status } : {} });

    // Map backend response to frontend types
    const redeemedRewards: RedeemedReward[] = response.data.rewards.map((userReward: any) => ({
      _id: userReward.id,
      reward: {
        _id: userReward.reward.id,
        title: userReward.reward.title,
        description: userReward.reward.description,
        category: userReward.reward.category,
        cost: 0, // Not returned in backend response, not needed for redeemed rewards
        image: userReward.reward.imageUrl || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400',
        available: 0, // Not returned in backend response, not needed for redeemed rewards
      },
      qrCode: userReward.qrCode,
      redeemedAt: userReward.redeemedAt,
      expiresAt: userReward.expiryDate,
      isUsed: userReward.status === 'used',
    }));

    console.log(`[getMyRewards] Fetched ${redeemedRewards.length} redeemed rewards`);
    return { redeemedRewards };
  } catch (error: any) {
    console.error('[getMyRewards] Error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};