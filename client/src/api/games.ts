import api from './api';
import { Game, GameSession } from '@/types';

// Description: Get all games
// Endpoint: GET /api/games
// Request: { category?: string, difficulty?: number }
// Response: { games: Game[] }
export const getGames = async (filters?: { category?: string; difficulty?: number }) => {
  try {
    const response = await api.get('/api/games', { params: filters });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get game by ID
// Endpoint: GET /api/games/:id
// Request: {}
// Response: { game: Game }
export const getGameById = async (id: string) => {
  try {
    const response = await api.get(`/api/games/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Submit game session with AI-powered feedback
// Endpoint: POST /api/games/:id/session
// Request: { score: number, maxScore: number, timeSpent: number, answers: Array<Answer> }
// Response: { session: GameSession, xpEarned: number, feedback: AIFeedback }
export const submitGameSession = async (
  gameId: string,
  data: {
    score: number;
    maxScore: number;
    timeSpent: number;
    answers: Array<{
      questionIndex: number;
      selectedAnswer: number;
      isCorrect: boolean;
      pointsEarned: number;
    }>;
  }
) => {
  try {
    const response = await api.post(`/api/games/${gameId}/session`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get specific game session by ID
// Endpoint: GET /api/games/sessions/:sessionId
// Request: {}
// Response: { session: GameSession }
export const getGameSession = async (sessionId: string) => {
  try {
    const response = await api.get(`/api/games/sessions/${sessionId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get user's game sessions with filters
// Endpoint: GET /api/games/sessions
// Request: { gameId?: string, startDate?: string, endDate?: string, limit?: number }
// Response: { sessions: Array<GameSession> }
export const getGameSessions = async (filters?: {
  gameId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}) => {
  try {
    const response = await api.get('/api/games/sessions', { params: filters });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};