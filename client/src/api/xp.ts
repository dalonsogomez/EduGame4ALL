import api from './api';

export interface LevelInfo {
  currentLevel: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpProgressInLevel: number;
  progressPercentage: number;
}

export interface CategoryLevelInfo extends LevelInfo {
  category: 'language' | 'culture' | 'softSkills';
}

export interface XPProfile {
  totalXP: number;
  level: LevelInfo;
  skills: {
    language: CategoryLevelInfo;
    culture: CategoryLevelInfo;
    softSkills: CategoryLevelInfo;
  };
  streak: {
    current: number;
    longest: number;
  };
  lastActive?: Date;
}

export interface LeaderboardEntry {
  rank: number;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  xp: number;
  level: number;
  category: string;
}

// Description: Get user XP profile with detailed level info and skill categories
// Endpoint: GET /api/xp/profile
// Request: {}
// Response: XPProfile
export const getUserXPProfile = async (): Promise<XPProfile> => {
  try {
    const response = await api.get('/api/xp/profile');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get XP leaderboard (total or category-specific)
// Endpoint: GET /api/xp/leaderboard/:category?
// Request: { category?: 'language' | 'culture' | 'softSkills', limit?: number }
// Response: { category: string, leaderboard: LeaderboardEntry[] }
export const getXPLeaderboard = async (
  category?: 'language' | 'culture' | 'softSkills',
  limit: number = 10
): Promise<{ category: string; leaderboard: LeaderboardEntry[] }> => {
  try {
    const endpoint = category
      ? `/api/xp/leaderboard/${category}?limit=${limit}`
      : `/api/xp/leaderboard?limit=${limit}`;
    const response = await api.get(endpoint);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Calculate level from XP (utility function)
// Endpoint: GET /api/xp/calculate-level
// Request: { xp: number }
// Response: LevelInfo
export const calculateLevelFromXP = async (xp: number): Promise<LevelInfo> => {
  try {
    const response = await api.get(`/api/xp/calculate-level?xp=${xp}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};
