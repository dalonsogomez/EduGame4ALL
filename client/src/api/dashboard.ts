import api from './api';
import { SkillLevel, DailyChallenge, ActivityItem, LeaderboardEntry } from '@/types';

// Description: Get dashboard data
// Endpoint: GET /api/dashboard
// Request: {}
// Response: { skills: SkillLevel[], dailyChallenge: DailyChallenge, recentActivity: ActivityItem[], leaderboard: LeaderboardEntry[] }
export const getDashboardData = async () => {
  // Mocking the response
  return new Promise<{
    skills: SkillLevel[];
    dailyChallenge: DailyChallenge;
    recentActivity: ActivityItem[];
    leaderboard: LeaderboardEntry[];
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        skills: [
          {
            category: 'language',
            level: 5,
            xp: 450,
            xpToNextLevel: 1000,
            percentage: 45,
          },
          {
            category: 'culture',
            level: 4,
            xp: 620,
            xpToNextLevel: 1000,
            percentage: 62,
          },
          {
            category: 'softSkills',
            level: 3,
            xp: 380,
            xpToNextLevel: 1000,
            percentage: 38,
          },
        ],
        dailyChallenge: {
          _id: '1',
          title: 'Complete 3 vocabulary games',
          description: 'Practice your language skills today',
          progress: 1,
          total: 3,
          xpReward: 50,
          bonusBadge: 'Daily Champion',
        },
        recentActivity: [
          {
            _id: '1',
            type: 'badge',
            message: "You earned the 'Fast Learner' badge!",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            icon: '🏆',
          },
          {
            _id: '2',
            type: 'game',
            message: "You completed 'Market Vocabulary' game",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            icon: '🎮',
          },
          {
            _id: '3',
            type: 'level',
            message: 'You reached Level 5!',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            icon: '⭐',
          },
        ],
        leaderboard: [
          { rank: 1, userId: '2', username: 'Maria S.', xp: 2450, country: 'ES' },
          { rank: 2, userId: '3', username: 'Ahmed K.', xp: 2100, country: 'SY' },
          { rank: 3, userId: '4', username: 'Sofia L.', xp: 1890, country: 'VE' },
          { rank: 4, userId: '5', username: 'Omar M.', xp: 1650, country: 'MA' },
          { rank: 5, userId: '1', username: 'You', xp: 1250, country: 'SY', isCurrentUser: true },
        ],
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/dashboard');
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};