import { supabase } from '../lib/supabase';
import type { User, UserProfile } from '../types';

export const profileService = {
  /**
   * Get user profile by ID
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get user learning profile
   */
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  },

  /**
   * Create or update user learning profile
   */
  async upsertUserProfile(userId: string, profile: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        ...profile,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update user XP and level
   */
  async updateXP(userId: string, xpToAdd: number) {
    // Get current profile
    const profile = await this.getProfile(userId);
    const newXP = profile.xp + xpToAdd;
    const newLevel = Math.floor(newXP / 100) + 1; // Simple level calculation

    const { data, error } = await supabase
      .from('profiles')
      .update({
        xp: newXP,
        level: newLevel,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update user streak
   */
  async updateStreak(userId: string) {
    const profile = await this.getProfile(userId);
    const today = new Date().toISOString().split('T')[0];
    const lastActive = profile.last_active_date;

    let newStreak = profile.streak_days;

    if (!lastActive) {
      // First time playing
      newStreak = 1;
    } else {
      const lastDate = new Date(lastActive);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day, no change
        return profile;
      } else if (diffDays === 1) {
        // Consecutive day
        newStreak += 1;
      } else {
        // Streak broken
        newStreak = 1;
      }
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        streak_days: newStreak,
        last_active_date: today,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update profile information
   */
  async updateProfile(userId: string, updates: Partial<{
    full_name: string;
    avatar_url: string;
  }>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
