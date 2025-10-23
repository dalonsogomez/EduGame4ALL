import api from './api';
import { Badge, GameSession } from '@/types';

// Description: Get user badges
// Endpoint: GET /api/progress/badges
// Request: {}
// Response: { badges: Badge[] }
export const getBadges = async () => {
  // Mocking the response
  return new Promise<{ badges: Badge[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        badges: [
          {
            _id: '1',
            name: 'Fast Learner',
            description: 'Complete 10 games in one day',
            icon: '⚡',
            category: 'milestone',
            isEarned: true,
            earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '2',
            name: 'Week Warrior',
            description: 'Maintain a 7-day streak',
            icon: '🔥',
            category: 'streak',
            isEarned: true,
            earnedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '3',
            name: 'Vocabulary Master',
            description: 'Score 100% on 5 vocabulary games',
            icon: '📚',
            category: 'mastery',
            isEarned: false,
            progress: 3,
            total: 5,
          },
          {
            _id: '4',
            name: 'Culture Expert',
            description: 'Complete all culture games',
            icon: '🌍',
            category: 'mastery',
            isEarned: false,
            progress: 4,
            total: 6,
          },
          {
            _id: '5',
            name: 'Team Player',
            description: 'Help 10 other learners',
            icon: '🤝',
            category: 'social',
            isEarned: false,
            progress: 2,
            total: 10,
          },
        ],
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/progress/badges');
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get game history
// Endpoint: GET /api/progress/history
// Request: { limit?: number }
// Response: { sessions: GameSession[] }
export const getGameHistory = async (limit?: number) => {
  // Mocking the response
  return new Promise<{ sessions: GameSession[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        sessions: [
          {
            _id: '1',
            gameId: '1',
            score: 8,
            timeSpent: 323,
            xpEarned: 75,
            completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            feedback: {
              strengths: ['Excellent vocabulary retention'],
              improvements: ['Focus on verb conjugations'],
              tips: ['Try using flashcards'],
              nextRecommendations: ['Conversation Simulator'],
              personalizedMessage: 'Great work!',
            },
          },
          {
            _id: '2',
            gameId: '4',
            score: 7,
            timeSpent: 245,
            xpEarned: 80,
            completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            feedback: {
              strengths: ['Good cultural awareness'],
              improvements: ['Learn more about local customs'],
              tips: ['Watch local TV shows'],
              nextRecommendations: ['City Explorer'],
              personalizedMessage: 'Keep it up!',
            },
          },
        ],
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/progress/history', { params: { limit } });
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get weekly report
// Endpoint: GET /api/progress/weekly-report
// Request: {}
// Response: { report: WeeklyReport }
export const getWeeklyReport = async () => {
  // Mocking the response
  return new Promise<{ report: WeeklyReport }>((resolve) => {
    setTimeout(() => {
      resolve({
        report: {
          gamesPlayed: 12,
          totalTime: 225,
          xpEarned: 450,
          strengths: ['Vocabulary retention', 'Pronunciation improving', 'Strong empathy in team scenarios'],
          improvements: ['Grammar rules need practice', 'Try more cultural games', 'Conflict resolution needs attention'],
          insights: [
            'You learn best in the morning',
            'You prefer visual learning',
            "You're ready to move from Beginner to Intermediate",
          ],
          weeklyActivity: [
            { day: 'Mon', xp: 75 },
            { day: 'Tue', xp: 120 },
            { day: 'Wed', xp: 0 },
            { day: 'Thu', xp: 90 },
            { day: 'Fri', xp: 85 },
            { day: 'Sat', xp: 80 },
            { day: 'Sun', xp: 0 },
          ],
        },
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/progress/weekly-report');
  // } catch (error: unknown) {
  //   const err = error as { response?: { data?: { message?: string } }; message: string };
  //   throw new Error(err?.response?.data?.message || err.message);
  // }
};

interface WeeklyReport {
  gamesPlayed: number;
  totalTime: number;
  xpEarned: number;
  strengths: string[];
  improvements: string[];
  insights: string[];
  weeklyActivity: Array<{ day: string; xp: number }>;
}