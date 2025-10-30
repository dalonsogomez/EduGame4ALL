import { supabase } from '../lib/supabase';
import type { Reward } from '../types';

export const rewardService = {
  /**
   * Get all available rewards
   */
  async getAllRewards() {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('is_active', true)
      .order('xp_cost', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Get rewards by category
   */
  async getRewardsByCategory(category: string) {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('xp_cost', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Get user's redeemed rewards
   */
  async getUserRewards(userId: string) {
    const { data, error } = await supabase
      .from('user_rewards')
      .select(`
        *,
        reward:rewards(*)
      `)
      .eq('user_id', userId)
      .order('redeemed_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Redeem a reward
   */
  async redeemReward(userId: string, rewardId: string, userXP: number) {
    // Get reward details
    const { data: reward, error: rewardError } = await supabase
      .from('rewards')
      .select('*')
      .eq('id', rewardId)
      .single();

    if (rewardError) throw rewardError;

    // Check if user has enough XP
    if (userXP < reward.xp_cost) {
      throw new Error('Insufficient XP');
    }

    // Check stock
    if (reward.stock === 0) {
      throw new Error('Reward out of stock');
    }

    // Start transaction-like operations
    // 1. Create user_reward entry
    const { data: userReward, error: userRewardError } = await supabase
      .from('user_rewards')
      .insert({
        user_id: userId,
        reward_id: rewardId,
      })
      .select()
      .single();

    if (userRewardError) throw userRewardError;

    // 2. Update reward stock if not unlimited
    if (reward.stock > 0) {
      const { error: stockError } = await supabase
        .from('rewards')
        .update({ stock: reward.stock - 1 })
        .eq('id', rewardId);

      if (stockError) throw stockError;
    }

    // 3. Deduct XP from user (handled in profileService)
    // This should be called by the caller after successful redemption

    return userReward;
  },

  /**
   * Update reward status
   */
  async updateRewardStatus(userRewardId: string, status: 'pending' | 'completed' | 'expired') {
    const { data, error } = await supabase
      .from('user_rewards')
      .update({ status })
      .eq('id', userRewardId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
