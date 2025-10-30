import { supabase } from '../lib/supabase';
import type { Achievement } from '../types';

export const achievementService = {
  /**
   * Get all available achievements
   */
  async getAllAchievements() {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('xp_reward', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Get user's unlocked achievements
   */
  async getUserAchievements(userId: string) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Check if user has unlocked an achievement
   */
  async hasAchievement(userId: string, achievementCode: string) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementCode)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  /**
   * Unlock an achievement for a user
   */
  async unlockAchievement(userId: string, achievementId: string) {
    // Check if already unlocked
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();

    if (existing) {
      return null; // Already unlocked
    }

    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
      })
      .select(`
        *,
        achievement:achievements(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Check and unlock achievements based on user progress
   */
  async checkAndUnlockAchievements(userId: string, stats: {
    totalGames?: number;
    streakDays?: number;
    totalXP?: number;
    vocabGames?: number;
    cultureGames?: number;
    softSkillsGames?: number;
    perfectGames?: number;
    fastGames?: number;
  }) {
    const achievements = await this.getAllAchievements();
    const unlockedAchievements = [];

    for (const achievement of achievements) {
      const alreadyUnlocked = await this.hasAchievement(userId, achievement.id);
      if (alreadyUnlocked) continue;

      let shouldUnlock = false;

      switch (achievement.requirement_type) {
        case 'games_completed':
          shouldUnlock = (stats.totalGames || 0) >= achievement.requirement_value;
          break;
        case 'streak_days':
          shouldUnlock = (stats.streakDays || 0) >= achievement.requirement_value;
          break;
        case 'total_xp':
          shouldUnlock = (stats.totalXP || 0) >= achievement.requirement_value;
          break;
        case 'vocab_games':
          shouldUnlock = (stats.vocabGames || 0) >= achievement.requirement_value;
          break;
        case 'culture_games':
          shouldUnlock = (stats.cultureGames || 0) >= achievement.requirement_value;
          break;
        case 'soft_skills_games':
          shouldUnlock = (stats.softSkillsGames || 0) >= achievement.requirement_value;
          break;
        case 'perfect_games':
          shouldUnlock = (stats.perfectGames || 0) >= achievement.requirement_value;
          break;
        case 'fast_games':
          shouldUnlock = (stats.fastGames || 0) >= achievement.requirement_value;
          break;
      }

      if (shouldUnlock) {
        const unlocked = await this.unlockAchievement(userId, achievement.id);
        if (unlocked) {
          unlockedAchievements.push(unlocked);
        }
      }
    }

    return unlockedAchievements;
  },
};
