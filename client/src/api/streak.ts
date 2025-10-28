import api from './api';

export interface StreakInfo {
  currentStreak: number;
  lastActivityDate: string;
  isActiveToday: boolean;
  daysUntilReset: number;
}

export interface StreakStatistics {
  totalUsers: number;
  usersWithActiveStreaks: number;
  averageStreak: number;
  longestStreak: number;
  topStreaks: Array<{
    userId: string;
    streak: number;
    username?: string;
  }>;
}

export interface StreakUpdateResponse {
  streak: number;
  lastActivityDate: string;
  message: string;
}

export interface ResetExpiredResponse {
  totalChecked: number;
  streaksReset: number;
  affectedUsers: string[];
  message: string;
}

// Description: Get current user's streak information
// Endpoint: GET /api/streak
// Request: {}
// Response: { currentStreak: number, lastActivityDate: string, isActiveToday: boolean, daysUntilReset: number }
export const getStreakInfo = async (): Promise<StreakInfo> => {
  try {
    const response = await api.get('/api/streak');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Manually update/check user streak
// Endpoint: POST /api/streak/update
// Request: {}
// Response: { streak: number, lastActivityDate: string, message: string }
export const updateStreak = async (): Promise<StreakUpdateResponse> => {
  try {
    const response = await api.post('/api/streak/update');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get streak statistics (admin only)
// Endpoint: GET /api/streak/statistics
// Request: {}
// Response: { totalUsers: number, usersWithActiveStreaks: number, averageStreak: number, longestStreak: number, topStreaks: Array }
export const getStreakStatistics = async (): Promise<StreakStatistics> => {
  try {
    const response = await api.get('/api/streak/statistics');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Reset expired streaks (admin only - maintenance task)
// Endpoint: POST /api/streak/reset-expired
// Request: {}
// Response: { totalChecked: number, streaksReset: number, affectedUsers: string[], message: string }
export const resetExpiredStreaks = async (): Promise<ResetExpiredResponse> => {
  try {
    const response = await api.post('/api/streak/reset-expired');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Manually reset user's own streak
// Endpoint: POST /api/streak/reset
// Request: {}
// Response: { streak: number, message: string }
export const resetMyStreak = async (): Promise<{ streak: number; message: string }> => {
  try {
    const response = await api.post('/api/streak/reset');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};
