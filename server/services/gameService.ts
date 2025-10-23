import { Game, IGame } from '../models/Game';
import { GameSession, IGameSession } from '../models/GameSession';
import { UserProgress } from '../models/UserProgress';
import mongoose from 'mongoose';

export class GameService {
  // Get all active games with optional filters
  static async getGames(filters?: { category?: string; difficulty?: number }): Promise<IGame[]> {
    console.log('[GameService] Fetching games with filters:', filters);

    const query: any = { isActive: true };

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
  ): Promise<{ session: IGameSession; xpEarned: number }> {
    console.log('[GameService] Submitting game session for user:', userId, 'game:', gameId);

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(gameId)) {
      throw new Error('Invalid user ID or game ID');
    }

    const game = await this.getGameById(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    // Calculate XP earned (proportional to score)
    const scorePercentage = sessionData.score / sessionData.maxScore;
    const xpEarned = Math.round(game.xpReward * scorePercentage);

    // Create game session
    const session = await GameSession.create({
      userId,
      gameId,
      score: sessionData.score,
      maxScore: sessionData.maxScore,
      xpEarned,
      timeSpent: sessionData.timeSpent,
      completedAt: new Date(),
      answers: sessionData.answers,
    });

    console.log('[GameService] Game session created, XP earned:', xpEarned);

    // Update user progress
    await this.updateUserProgress(userId, game.category, xpEarned);

    return { session, xpEarned };
  }

  // Update user progress after game completion
  private static async updateUserProgress(
    userId: string,
    category: string,
    xpEarned: number
  ): Promise<void> {
    console.log('[GameService] Updating user progress for user:', userId);

    const progress = await UserProgress.findOne({ userId });

    if (!progress) {
      // Create new progress record
      await UserProgress.create({
        userId,
        totalXP: xpEarned,
        level: 1,
        streak: 1,
        lastActivityDate: new Date(),
        weeklyProgress: 1,
        skills: {
          language: { xp: category === 'language' ? xpEarned : 0, level: 1 },
          culture: { xp: category === 'culture' ? xpEarned : 0, level: 1 },
          softSkills: { xp: category === 'soft-skills' ? xpEarned : 0, level: 1 },
        },
      });
      console.log('[GameService] Created new progress record');
      return;
    }

    // Update existing progress
    progress.totalXP += xpEarned;
    progress.level = Math.floor(progress.totalXP / 100) + 1; // Level up every 100 XP

    // Update skill-specific XP
    if (category === 'language') {
      progress.skills.language.xp += xpEarned;
      progress.skills.language.level = Math.floor(progress.skills.language.xp / 100) + 1;
    } else if (category === 'culture') {
      progress.skills.culture.xp += xpEarned;
      progress.skills.culture.level = Math.floor(progress.skills.culture.xp / 100) + 1;
    } else if (category === 'soft-skills') {
      progress.skills.softSkills.xp += xpEarned;
      progress.skills.softSkills.level = Math.floor(progress.skills.softSkills.xp / 100) + 1;
    }

    // Update streak
    const lastActivity = new Date(progress.lastActivityDate);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      progress.streak += 1;
    } else if (daysDiff > 1) {
      progress.streak = 1;
    }

    progress.lastActivityDate = today;
    progress.weeklyProgress += 1;

    await progress.save();
    console.log('[GameService] User progress updated, new total XP:', progress.totalXP);
  }

  // Get user's progress on a specific game
  static async getUserGameProgress(userId: string, gameId: string): Promise<number> {
    const sessions = await GameSession.find({ userId, gameId }).sort({ createdAt: -1 }).limit(1);

    if (sessions.length === 0) {
      return 0;
    }

    return Math.round((sessions[0].score / sessions[0].maxScore) * 100);
  }
}
