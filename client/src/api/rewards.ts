import api from './api';
import { Reward, RedeemedReward } from '@/types';

// Description: Get all rewards
// Endpoint: GET /api/rewards
// Request: { category?: string }
// Response: { rewards: Reward[] }
export const getRewards = async (category?: string) => {
  // Mocking the response
  return new Promise<{ rewards: Reward[] }>((resolve) => {
    setTimeout(() => {
      const allRewards: Reward[] = [
        {
          _id: '1',
          title: '15% off at LocalMart',
          description: 'Use for groceries and household items',
          category: 'coupon',
          cost: 500,
          image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400',
          available: 23,
          expirationDays: 30,
        },
        {
          _id: '2',
          title: 'Free Weekly Transport Pass',
          description: 'Valid for all public transportation',
          category: 'coupon',
          cost: 800,
          image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
          available: 10,
          expirationDays: 7,
        },
        {
          _id: '3',
          title: 'Advanced Business Spanish Course',
          description: 'Unlock exclusive learning content',
          category: 'content',
          cost: 1000,
          image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
          available: 999,
        },
        {
          _id: '4',
          title: 'Donate to Refugee Support Fund',
          description: 'Your XP helps others access this platform',
          category: 'donation',
          cost: 100,
          image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400',
          available: 999,
        },
        {
          _id: '5',
          title: '20% off at CafeMart',
          description: 'Enjoy coffee and snacks',
          category: 'coupon',
          cost: 400,
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
          available: 15,
          expirationDays: 30,
        },
      ];

      let filteredRewards = allRewards;
      if (category) {
        filteredRewards = filteredRewards.filter((r) => r.category === category);
      }

      resolve({ rewards: filteredRewards });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/rewards', { params: { category } });
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Redeem a reward
// Endpoint: POST /api/rewards/:id/redeem
// Request: {}
// Response: { redeemedReward: RedeemedReward }
export const redeemReward = async (rewardId: string) => {
  // Mocking the response
  return new Promise<{ redeemedReward: RedeemedReward }>((resolve) => {
    setTimeout(() => {
      resolve({
        redeemedReward: {
          _id: '1',
          reward: {
            _id: rewardId,
            title: '15% off at LocalMart',
            description: 'Use for groceries and household items',
            category: 'coupon',
            cost: 500,
            image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400',
            available: 22,
            expirationDays: 30,
          },
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          redeemedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          isUsed: false,
        },
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post(`/api/rewards/${rewardId}/redeem`);
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get user's redeemed rewards
// Endpoint: GET /api/rewards/my-rewards
// Request: { status?: 'active' | 'used' | 'expired' }
// Response: { redeemedRewards: RedeemedReward[] }
export const getMyRewards = async (status?: string) => {
  // Mocking the response
  return new Promise<{ redeemedRewards: RedeemedReward[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        redeemedRewards: [
          {
            _id: '1',
            reward: {
              _id: '1',
              title: '15% off at LocalMart',
              description: 'Use for groceries and household items',
              category: 'coupon',
              cost: 500,
              image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400',
              available: 22,
              expirationDays: 30,
            },
            qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            redeemedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            expiresAt: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
            isUsed: false,
          },
        ],
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/rewards/my-rewards', { params: { status } });
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};