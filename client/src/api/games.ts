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

// Description: Create a new game (admin only)
// Endpoint: POST /api/games
// Request: { title: string, description: string, category: string, difficulty: number, duration: number, xpReward: number, thumbnailUrl?: string, questions: Array<Question> }
// Response: { game: Game }
export const createGame = async (gameData: {
  title: string;
  description: string;
  category: 'language' | 'culture' | 'soft-skills';
  difficulty: number;
  duration: number;
  xpReward: number;
  thumbnailUrl?: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
    points: number;
  }>;
}) => {
  try {
    const response = await api.post('/api/games', gameData);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update an existing game (admin only)
// Endpoint: PUT /api/games/:id
// Request: { title?: string, description?: string, category?: string, difficulty?: number, duration?: number, xpReward?: number, thumbnailUrl?: string, isActive?: boolean, questions?: Array<Question> }
// Response: { game: Game }
export const updateGame = async (
  gameId: string,
  updateData: Partial<{
    title: string;
    description: string;
    category: 'language' | 'culture' | 'soft-skills';
    difficulty: number;
    duration: number;
    xpReward: number;
    thumbnailUrl: string;
    isActive: boolean;
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
      points: number;
    }>;
  }>
) => {
  try {
    const response = await api.put(`/api/games/${gameId}`, updateData);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete a game (soft delete, admin only)
// Endpoint: DELETE /api/games/:id
// Request: {}
// Response: { message: string, game: Game }
export const deleteGame = async (gameId: string) => {
  try {
    const response = await api.delete(`/api/games/${gameId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get all games including inactive (admin only)
// Endpoint: GET /api/games/admin/all
// Request: { category?: string, difficulty?: number, isActive?: boolean }
// Response: { games: Array<Game> }
export const getAllGames = async (filters?: {
  category?: string;
  difficulty?: number;
  isActive?: boolean;
}) => {
  try {
    const response = await api.get('/api/games/admin/all', { params: filters });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};