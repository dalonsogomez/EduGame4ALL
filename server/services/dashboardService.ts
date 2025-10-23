import { UserProgress } from '../models/UserProgress';
import { GameSession } from '../models/GameSession';
import { Game } from '../models/Game';
import mongoose from 'mongoose';

export class DashboardService {
  // Get dashboard data for user
  static async getDashboardData(userId: string): Promise<any> {
    console.log('[DashboardService] Fetching dashboard data for user:', userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const [userProgress, recentActivity, leaderboard, dailyChallenge, recommendedGames] =
      await Promise.all([
        this.getUserStats(userId),
        this.getRecentActivity(userId),
        this.getLeaderboard(userId),
        this.getDailyChallenge(userId),
        this.getRecommendedGames(userId),
      ]);

    const dashboardData = {
      userProgress,
      recentActivity,
      leaderboard,
      dailyChallenge,
      recommendedGames,
    };

    console.log('[DashboardService] Dashboard data fetched successfully');
    return dashboardData;
  }

  // Get user stats
  private static async getUserStats(userId: string): Promise<any> {
    let progress = await UserProgress.findOne({ userId });

    if (!progress) {
      // Create default progress
      progress = await UserProgress.create({
        userId,
        totalXP: 0,
        level: 1,
        streak: 0,
        lastActivityDate: new Date(),
        weeklyGoal: 5,
        weeklyProgress: 0,
        skills: {
          language: { xp: 0, level: 1 },
          culture: { xp: 0, level: 1 },
          softSkills: { xp: 0, level: 1 },
        },
      });
    }

    // Count weekly games
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyGames = await GameSession.countDocuments({
      userId,
      completedAt: { $gte: oneWeekAgo },
    });

    return {
      totalXP: progress.totalXP,
      level: progress.level,
      streak: progress.streak,
      weeklyGames,
      weeklyGoal: progress.weeklyGoal,
      skills: progress.skills,
    };
  }

  // Get recent activity
  private static async getRecentActivity(userId: string, limit = 5): Promise<any[]> {
    const sessions = await GameSession.find({ userId })
      .populate('gameId')
      .sort({ completedAt: -1 })
      .limit(limit);

    return sessions.map((session) => {
      const game = session.gameId as any;
      return {
        type: 'game_completed',
        message: `Completed ${game.title}`,
        timestamp: session.completedAt,
        xpEarned: session.xpEarned,
      };
    });
  }

  // Get leaderboard
  private static async getLeaderboard(userId: string, limit = 10): Promise<any[]> {
    const topUsers = await UserProgress.find()
      .sort({ totalXP: -1 })
      .limit(limit)
      .populate('userId', 'email');

    const leaderboard = topUsers.map((progress, index) => {
      const user = progress.userId as any;
      return {
        rank: index + 1,
        userId: progress.userId,
        name: user.email.split('@')[0], // Use email prefix as name
        xp: progress.totalXP,
        level: progress.level,
        isCurrentUser: progress.userId.toString() === userId,
      };
    });

    return leaderboard;
  }

  // Get daily challenge
  private static async getDailyChallenge(userId: string): Promise<any> {
    // Get a random game for daily challenge
    const games = await Game.find({ isActive: true });
    if (games.length === 0) {
      return null;
    }

    // Use date as seed for consistent daily challenge
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const dailyGameIndex = seed % games.length;
    const dailyGame = games[dailyGameIndex];

    // Check if user has completed it today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const completedToday = await GameSession.findOne({
      userId,
      gameId: dailyGame._id,
      completedAt: { $gte: todayStart },
    });

    return {
      game: {
        id: dailyGame._id,
        title: dailyGame.title,
        description: dailyGame.description,
        category: dailyGame.category,
        difficulty: dailyGame.difficulty,
        xpReward: dailyGame.xpReward,
      },
      completed: !!completedToday,
      progress: completedToday ? 100 : 0,
    };
  }

  // Get recommended games
  private static async getRecommendedGames(userId: string, limit = 6): Promise<any[]> {
    const userProgress = await UserProgress.findOne({ userId });

    if (!userProgress) {
      // Return random games for new users
      const games = await Game.find({ isActive: true }).limit(limit);
      return games.map((game) => ({
        id: game._id,
        title: game.title,
        description: game.description,
        category: game.category,
        difficulty: game.difficulty,
        duration: game.duration,
        xpReward: game.xpReward,
        thumbnailUrl: game.thumbnailUrl,
      }));
    }

    // Find category with lowest XP and recommend games from that category
    const skills = userProgress.skills;
    let lowestCategory = 'language';
    let lowestXP = skills.language.xp;

    if (skills.culture.xp < lowestXP) {
      lowestCategory = 'culture';
      lowestXP = skills.culture.xp;
    }

    if (skills.softSkills.xp < lowestXP) {
      lowestCategory = 'soft-skills';
    }

    // Get games from the category user needs to improve
    const recommendedGames = await Game.find({
      isActive: true,
      category: lowestCategory,
    })
      .sort({ difficulty: 1 })
      .limit(limit);

    return recommendedGames.map((game) => ({
      id: game._id,
      title: game.title,
      description: game.description,
      category: game.category,
      difficulty: game.difficulty,
      duration: game.duration,
      xpReward: game.xpReward,
      thumbnailUrl: game.thumbnailUrl,
    }));
  }
}
