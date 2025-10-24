import api from './api';
import { Badge, GameSession } from '@/types';

// Description: Get user badges
// Endpoint: GET /api/progress/badges
// Request: {}
// Response: { badges: Badge[] }
export const getBadges = async () => {
  try {
    const response = await api.get('/api/progress/badges');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get game history
// Endpoint: GET /api/progress/history
// Request: { limit?: number }
// Response: { history: Array<GameSession> }
export const getGameHistory = async (limit?: number) => {
  try {
    const response = await api.get('/api/progress/history', { params: { limit } });
    return { sessions: response.data.history }; // Map 'history' to 'sessions' for frontend compatibility
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get weekly report with AI-generated insights
// Endpoint: GET /api/progress/weekly-report
// Request: {}
// Response: { report: WeeklyReport }
export const getWeeklyReport = async () => {
  try {
    const response = await api.get('/api/progress/weekly-report');
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message: string };
    throw new Error(err?.response?.data?.error || err.message);
  }
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