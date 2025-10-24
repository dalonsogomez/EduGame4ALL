import api from './api';
import { SkillLevel, DailyChallenge, ActivityItem, LeaderboardEntry } from '@/types';

// Description: Get dashboard data including user skills, daily challenges, recent activity, and leaderboard rankings
// Endpoint: GET /api/dashboard
// Request: {}
// Response: { skills: SkillLevel[], dailyChallenge: DailyChallenge, recentActivity: ActivityItem[], leaderboard: LeaderboardEntry[] }
export const getDashboardData = async (): Promise<{
  skills: SkillLevel[];
  dailyChallenge: DailyChallenge;
  recentActivity: ActivityItem[];
  leaderboard: LeaderboardEntry[];
}> => {
  try {
    const response = await api.get('/api/dashboard');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};