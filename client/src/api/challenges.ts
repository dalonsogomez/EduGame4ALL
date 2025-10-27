import api from './api';

// Description: Get today's daily challenge for the authenticated user
// Endpoint: GET /api/challenges/daily
// Request: {}
// Response: { challenge: Challenge, userChallenge: UserChallenge, stats: ChallengeStats }
export const getDailyChallenge = async () => {
  try {
    const response = await api.get('/api/challenges/daily');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Mark a challenge as completed
// Endpoint: POST /api/challenges/:challengeId/complete
// Request: {}
// Response: { success: true, userChallenge: UserChallenge, xpEarned: number, bonusBadgeAwarded: boolean }
export const completeChallenge = async (challengeId: string) => {
  try {
    const response = await api.post(`/api/challenges/${challengeId}/complete`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get challenge history for the authenticated user
// Endpoint: GET /api/challenges/history
// Request: { limit?: number }
// Response: { history: Array<{ challenge: Challenge, userChallenge: UserChallenge }>, stats: ChallengeStats }
export const getChallengeHistory = async (limit?: number) => {
  try {
    const params = limit ? { limit } : {};
    const response = await api.get('/api/challenges/history', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get challenge statistics for the authenticated user
// Endpoint: GET /api/challenges/stats
// Request: {}
// Response: { stats: ChallengeStats }
export const getChallengeStats = async () => {
  try {
    const response = await api.get('/api/challenges/stats');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};
