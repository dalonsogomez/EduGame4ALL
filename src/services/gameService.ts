import { supabase } from '../lib/supabase';
import type { GameSession, AIFeedback, GameType, Difficulty } from '../types';

export const gameService = {
  /**
   * Create a new game session
   */
  async createGameSession(session: {
    userId: string;
    gameType: GameType;
    difficulty: Difficulty;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
    xpEarned: number;
  }) {
    const { data, error } = await supabase
      .from('game_sessions')
      .insert({
        user_id: session.userId,
        game_type: session.gameType,
        difficulty: session.difficulty,
        score: session.score,
        total_questions: session.totalQuestions,
        correct_answers: session.correctAnswers,
        time_spent: session.timeSpent,
        xp_earned: session.xpEarned,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get user's game sessions
   */
  async getUserSessions(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  /**
   * Get sessions by game type
   */
  async getSessionsByType(userId: string, gameType: GameType) {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('game_type', gameType)
      .order('completed_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get user statistics
   */
  async getUserStats(userId: string) {
    const { data: sessions, error } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    const stats = {
      totalGames: sessions.length,
      totalXP: sessions.reduce((sum, s) => sum + s.xp_earned, 0),
      averageScore: sessions.length > 0
        ? sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length
        : 0,
      totalTimeSpent: sessions.reduce((sum, s) => sum + s.time_spent, 0),
      byGameType: {
        vocabulary: sessions.filter(s => s.game_type === 'vocabulary').length,
        culture: sessions.filter(s => s.game_type === 'culture').length,
        'soft-skills': sessions.filter(s => s.game_type === 'soft-skills').length,
      },
      byDifficulty: {
        beginner: sessions.filter(s => s.difficulty === 'beginner').length,
        intermediate: sessions.filter(s => s.difficulty === 'intermediate').length,
        advanced: sessions.filter(s => s.difficulty === 'advanced').length,
      },
    };

    return stats;
  },

  /**
   * Create AI feedback for a session
   */
  async createAIFeedback(feedback: {
    sessionId: string;
    userId: string;
    emotionDetected?: string;
    difficultySuggestion?: string;
    mistakePatterns?: string[];
    feedbackMessage: string;
    encouragement?: string;
    nextSteps?: string[];
    confidenceScore?: number;
  }) {
    const { data, error } = await supabase
      .from('ai_feedback')
      .insert({
        session_id: feedback.sessionId,
        user_id: feedback.userId,
        emotion_detected: feedback.emotionDetected,
        difficulty_suggestion: feedback.difficultySuggestion,
        mistake_patterns: feedback.mistakePatterns || [],
        feedback_message: feedback.feedbackMessage,
        encouragement: feedback.encouragement,
        next_steps: feedback.nextSteps || [],
        confidence_score: feedback.confidenceScore || 0.85,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get AI feedback for a session
   */
  async getSessionFeedback(sessionId: string) {
    const { data, error } = await supabase
      .from('ai_feedback')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
};
