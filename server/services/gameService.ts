import { Game, IGame } from '../models/Game';
import { GameSession, IGameSession } from '../models/GameSession';
import { UserProgress } from '../models/UserProgress';
import User from '../models/User';
import { generateGameFeedback } from './llmService';
import { ChallengeService } from './challengeService';
import XpService, { SkillCategory } from './xpService';
import { StreakService } from './streakService';
import mongoose from 'mongoose';
import { GameQueryFilters, GameSessionQueryFilters, GameFeedback } from '../types';

export class GameService {
  // Get all active games with optional filters
  static async getGames(filters?: { category?: string; difficulty?: number }): Promise<IGame[]> {
    console.log('[GameService] Fetching games with filters:', filters);

    const query: GameQueryFilters = { isActive: true };

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.difficulty) {
      query.difficulty = filters.difficulty;
    }

    const games = await Game.find(query).sort({ createdAt: -1 });
    console.log(`[GameService] Found ${games.length} games`);

    return games;
  }

  // Get game by ID
  static async getGameById(gameId: string): Promise<IGame | null> {
    console.log('[GameService] Fetching game by ID:', gameId);

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      throw new Error('Invalid game ID');
    }

    const game = await Game.findOne({ _id: gameId, isActive: true });

    if (!game) {
      console.log('[GameService] Game not found');
      return null;
    }

    console.log('[GameService] Game found:', game.title);
    return game;
  }

  // Submit game session and update user progress
  static async submitGameSession(
    userId: string,
    gameId: string,
    sessionData: {
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
  ): Promise<{ session: IGameSession; xpEarned: number; feedback: GameFeedback }> {
    console.log('[GameService] Submitting game session for user:', userId, 'game:', gameId);

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(gameId)) {
      throw new Error('Invalid user ID or game ID');
    }

    const game = await this.getGameById(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    // Get user details for personalized feedback
    const user = await User.findById(userId);
    const userProgress = await UserProgress.findOne({ userId });

    // Calculate XP earned (proportional to score)
    const scorePercentage = sessionData.score / sessionData.maxScore;
    const xpEarned = Math.round(game.xpReward * scorePercentage);

    console.log('[GameService] Generating AI-powered feedback');

    // Generate AI-powered personalized feedback
    let feedback: GameFeedback;
    try {
      // Map answers with actual question text and options
      const detailedAnswers = sessionData.answers.map(answer => {
        const question = game.questions[answer.questionIndex];
        return {
          question: question.question,
          selectedAnswer: question.options[answer.selectedAnswer],
          correctAnswer: question.options[question.correctAnswer],
          isCorrect: answer.isCorrect,
        };
      });

      feedback = await generateGameFeedback({
        gameTitle: game.title,
        gameCategory: game.category,
        gameDifficulty: game.difficulty,
        score: sessionData.score,
        maxScore: sessionData.maxScore,
        timeSpent: sessionData.timeSpent,
        answers: detailedAnswers,
        userLevel: userProgress?.level || 1,
        userTargetLanguage: user?.targetLanguage,
      });

      console.log('[GameService] AI feedback generated successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[GameService] Failed to generate AI feedback:', errorMessage);
      // Use fallback feedback
      feedback = {
        strengths: ['Completed the game'],
        improvements: ['Keep practicing to improve'],
        tips: ['Review the material regularly'],
        nextRecommendations: ['Try similar games'],
        personalizedMessage: `Great job completing ${game.title}! You earned ${xpEarned} XP.`,
      };
    }

    // Create game session with feedback
    const session = await GameSession.create({
      userId,
      gameId,
      score: sessionData.score,
      maxScore: sessionData.maxScore,
      xpEarned,
      timeSpent: sessionData.timeSpent,
      completedAt: new Date(),
      answers: sessionData.answers,
      feedback,
    });

    console.log('[GameService] Game session created with ID:', session._id, 'XP earned:', xpEarned);

    // Update user progress using XpService
    const categoryMap: Record<string, SkillCategory> = {
      'language': 'language',
      'culture': 'culture',
      'soft-skills': 'softSkills'
    };
    const skillCategory = categoryMap[game.category] as SkillCategory;

    if (skillCategory) {
      await XpService.awardXP(new mongoose.Types.ObjectId(userId), xpEarned, skillCategory);
      console.log('[GameService] XP awarded via XpService');
    } else {
      await XpService.awardXP(new mongoose.Types.ObjectId(userId), xpEarned);
      console.log('[GameService] XP awarded (no category)');
    }

    // Update challenge progress
    try {
      await ChallengeService.updateChallengeProgress(
        new mongoose.Types.ObjectId(userId),
        {
          gameId: new mongoose.Types.ObjectId(gameId),
          category: game.category,
          score: scorePercentage * 100,
          xpEarned,
        }
      );
      console.log('[GameService] Challenge progress updated');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[GameService] Error updating challenge progress:', errorMessage);
      // Don't fail the whole request if challenge update fails
    }

    // Update streak on game play
    try {
      await StreakService.updateStreak(new mongoose.Types.ObjectId(userId));
      console.log('[GameService] Streak updated after game completion');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[GameService] Error updating streak:', errorMessage);
      // Don't fail the whole request if streak update fails
    }

    return { session, xpEarned, feedback };
  }

  // Get user's progress on a specific game
  static async getUserGameProgress(userId: string, gameId: string): Promise<number> {
    const sessions = await GameSession.find({ userId, gameId }).sort({ createdAt: -1 }).limit(1);

    if (sessions.length === 0) {
      return 0;
    }

    return Math.round((sessions[0].score / sessions[0].maxScore) * 100);
  }

  // Get a specific game session by ID
  static async getGameSession(sessionId: string, userId: string): Promise<IGameSession | null> {
    console.log('[GameService] Fetching game session:', sessionId, 'for user:', userId);

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      throw new Error('Invalid session ID');
    }

    const session = await GameSession.findOne({ _id: sessionId, userId })
      .populate('gameId', 'title category difficulty xpReward');

    if (!session) {
      console.log('[GameService] Game session not found');
      return null;
    }

    console.log('[GameService] Game session found');
    return session;
  }

  // Get user's game sessions with optional filters
  static async getGameSessions(
    userId: string,
    filters?: {
      gameId?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ): Promise<IGameSession[]> {
    console.log('[GameService] Fetching game sessions for user:', userId, 'with filters:', filters);

    const query: GameSessionQueryFilters = { userId };

    if (filters?.gameId && mongoose.Types.ObjectId.isValid(filters.gameId)) {
      query.gameId = filters.gameId;
    }

    if (filters?.startDate || filters?.endDate) {
      query.completedAt = {};
      if (filters.startDate) {
        query.completedAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.completedAt.$lte = filters.endDate;
      }
    }

    const limit = filters?.limit || 50;

    const sessions = await GameSession.find(query)
      .populate('gameId', 'title category difficulty xpReward thumbnailUrl')
      .sort({ completedAt: -1 })
      .limit(limit);

    console.log(`[GameService] Found ${sessions.length} game sessions`);
    return sessions;
  }

  // Create a new game (admin only)
  static async createGame(gameData: {
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
  }): Promise<IGame> {
    console.log('[GameService] Creating new game:', gameData.title);

    // Validate difficulty
    if (gameData.difficulty < 1 || gameData.difficulty > 5) {
      throw new Error('Difficulty must be between 1 and 5');
    }

    // Validate questions
    if (!gameData.questions || gameData.questions.length === 0) {
      throw new Error('At least one question is required');
    }

    // Validate each question
    for (const question of gameData.questions) {
      if (question.options.length < 2) {
        throw new Error('Each question must have at least 2 options');
      }
      if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
        throw new Error('Correct answer index is out of bounds');
      }
    }

    const game = await Game.create({
      ...gameData,
      isActive: true,
    });

    console.log('[GameService] Game created successfully with ID:', game._id);
    return game;
  }

  // Update an existing game (admin only)
  static async updateGame(
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
  ): Promise<IGame | null> {
    console.log('[GameService] Updating game:', gameId);

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      throw new Error('Invalid game ID');
    }

    // Validate difficulty if provided
    if (updateData.difficulty !== undefined && (updateData.difficulty < 1 || updateData.difficulty > 5)) {
      throw new Error('Difficulty must be between 1 and 5');
    }

    // Validate questions if provided
    if (updateData.questions) {
      if (updateData.questions.length === 0) {
        throw new Error('At least one question is required');
      }

      for (const question of updateData.questions) {
        if (question.options.length < 2) {
          throw new Error('Each question must have at least 2 options');
        }
        if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
          throw new Error('Correct answer index is out of bounds');
        }
      }
    }

    const game = await Game.findByIdAndUpdate(gameId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!game) {
      console.log('[GameService] Game not found for update');
      return null;
    }

    console.log('[GameService] Game updated successfully:', game.title);
    return game;
  }

  // Delete a game (soft delete by setting isActive to false)
  static async deleteGame(gameId: string): Promise<IGame | null> {
    console.log('[GameService] Deleting game:', gameId);

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      throw new Error('Invalid game ID');
    }

    // Soft delete by setting isActive to false
    const game = await Game.findByIdAndUpdate(
      gameId,
      { isActive: false },
      { new: true }
    );

    if (!game) {
      console.log('[GameService] Game not found for deletion');
      return null;
    }

    console.log('[GameService] Game deleted successfully:', game.title);
    return game;
  }

  // Get all games including inactive ones (admin only)
  static async getAllGames(filters?: {
    category?: string;
    difficulty?: number;
    isActive?: boolean;
  }): Promise<IGame[]> {
    console.log('[GameService] Fetching all games (including inactive) with filters:', filters);

    const query: GameQueryFilters = {};

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.difficulty) {
      query.difficulty = filters.difficulty;
    }

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const games = await Game.find(query).sort({ createdAt: -1 });
    console.log(`[GameService] Found ${games.length} games`);

    return games;
  }
}
