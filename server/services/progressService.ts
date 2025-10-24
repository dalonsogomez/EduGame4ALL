import { UserProgress, IUserProgress } from '../models/UserProgress';
import { UserBadge, IUserBadge } from '../models/UserBadge';
import { Badge, IBadge } from '../models/Badge';
import { GameSession, IGameSession } from '../models/GameSession';
import { generateWeeklyInsights } from './llmService';
import mongoose from 'mongoose';

export class ProgressService {
  // Get user progress
  static async getUserProgress(userId: string): Promise<IUserProgress | null> {
    console.log('[ProgressService] Fetching user progress for:', userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const progress = await UserProgress.findOne({ userId });

    if (!progress) {
      console.log('[ProgressService] No progress found, creating default');
      // Create default progress
      return await UserProgress.create({
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

    console.log('[ProgressService] User progress found, level:', progress.level);
    return progress;
  }

  // Get user badges with progress
  static async getUserBadges(userId: string): Promise<any[]> {
    console.log('[ProgressService] Fetching badges for user:', userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const userProgress = await this.getUserProgress(userId);
    if (!userProgress) {
      return [];
    }

    // Get all active badges
    const allBadges = await Badge.find({ isActive: true }).sort({ category: 1, level: 1 });

    // Get user's badge records
    const userBadges = await UserBadge.find({ userId }).populate('badgeId');

    const badgeMap = new Map();
    userBadges.forEach((ub) => {
      badgeMap.set(ub.badgeId._id.toString(), ub);
    });

    // Calculate progress for each badge
    const badgesWithProgress = allBadges.map((badge) => {
      const userBadge = badgeMap.get(badge._id.toString());

      let progress = 0;
      let isEarned = false;
      let earnedAt = null;

      if (userBadge) {
        progress = userBadge.progress;
        isEarned = !!userBadge.earnedAt;
        earnedAt = userBadge.earnedAt;
      } else {
        // Calculate progress based on XP
        progress = Math.min(100, Math.round((userProgress.totalXP / badge.xpRequired) * 100));
      }

      return {
        _id: badge._id,
        name: badge.name,
        description: badge.description,
        category: badge.category,
        icon: badge.iconUrl || '🏆', // Map iconUrl to icon with default emoji
        xpRequired: badge.xpRequired,
        level: badge.level,
        progress,
        total: 100, // Progress out of 100
        isEarned,
        earnedAt,
      };
    });

    console.log(`[ProgressService] Returning ${badgesWithProgress.length} badges`);
    return badgesWithProgress;
  }

  // Check and award badges to user
  static async checkAndAwardBadges(userId: string): Promise<void> {
    console.log('[ProgressService] Checking badges for user:', userId);

    const userProgress = await this.getUserProgress(userId);
    if (!userProgress) {
      return;
    }

    const badges = await Badge.find({ isActive: true });

    for (const badge of badges) {
      const existingUserBadge = await UserBadge.findOne({ userId, badgeId: badge._id });

      const progress = Math.min(100, Math.round((userProgress.totalXP / badge.xpRequired) * 100));

      if (!existingUserBadge) {
        // Create new user badge record
        const earnedAt = progress >= 100 ? new Date() : undefined;
        await UserBadge.create({
          userId,
          badgeId: badge._id,
          progress,
          earnedAt,
        });

        if (earnedAt) {
          console.log('[ProgressService] Badge earned:', badge.name);
        }
      } else if (!existingUserBadge.earnedAt && progress >= 100) {
        // Award the badge
        existingUserBadge.progress = 100;
        existingUserBadge.earnedAt = new Date();
        await existingUserBadge.save();
        console.log('[ProgressService] Badge earned:', badge.name);
      } else if (existingUserBadge.progress !== progress) {
        // Update progress
        existingUserBadge.progress = progress;
        await existingUserBadge.save();
      }
    }
  }

  // Get user game history
  static async getGameHistory(userId: string, limit = 20): Promise<any[]> {
    console.log('[ProgressService] Fetching game history for user:', userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const sessions = await GameSession.find({ userId })
      .populate('gameId')
      .sort({ completedAt: -1 })
      .limit(limit);

    const history = sessions.map((session) => {
      const game = session.gameId as any;
      return {
        id: session._id,
        game: {
          id: game._id,
          title: game.title,
          category: game.category,
        },
        score: session.score,
        maxScore: session.maxScore,
        xpEarned: session.xpEarned,
        completedAt: session.completedAt,
        accuracy: Math.round((session.score / session.maxScore) * 100),
      };
    });

    console.log(`[ProgressService] Returning ${history.length} game sessions`);
    return history;
  }

  // Get weekly report with AI-generated insights
  static async getWeeklyReport(userId: string): Promise<any> {
    console.log('[ProgressService] Generating weekly report for user:', userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const userProgress = await this.getUserProgress(userId);
    if (!userProgress) {
      throw new Error('User progress not found');
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const sessions = await GameSession.find({
      userId,
      completedAt: { $gte: oneWeekAgo },
    }).populate('gameId');

    const totalGames = sessions.length;
    const totalXP = sessions.reduce((sum, s) => sum + s.xpEarned, 0);
    const totalTime = sessions.reduce((sum, s) => sum + s.timeSpent, 0);
    const avgAccuracy =
      sessions.length > 0
        ? sessions.reduce((sum, s) => sum + (s.score / s.maxScore) * 100, 0) / sessions.length
        : 0;

    // Category breakdown
    const categoryStats: any = {
      language: { games: 0, xp: 0 },
      culture: { games: 0, xp: 0 },
      'soft-skills': { games: 0, xp: 0 },
    };

    sessions.forEach((session) => {
      const game = session.gameId as any;
      if (categoryStats[game.category]) {
        categoryStats[game.category].games += 1;
        categoryStats[game.category].xp += session.xpEarned;
      }
    });

    // Build daily activity array for the past 7 days
    const dailyActivity = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const daySessions = sessions.filter((s) => {
        const sessionDate = new Date(s.completedAt);
        return sessionDate >= date && sessionDate < nextDay;
      });

      dailyActivity.push({
        day: dayNames[date.getDay()],
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        games: daySessions.length,
        xp: daySessions.reduce((sum, s) => sum + s.xpEarned, 0),
      });
    }

    console.log('[ProgressService] Generating AI insights for weekly report');

    // Generate AI insights
    let aiInsights;
    try {
      aiInsights = await generateWeeklyInsights({
        totalGames,
        totalXP,
        totalTime: Math.round(totalTime / 60), // Convert to minutes
        avgAccuracy: Math.round(avgAccuracy),
        categoryStats,
        userLevel: userProgress.level,
        dailyActivity: dailyActivity.map(d => ({
          date: d.date,
          games: d.games,
          xp: d.xp,
        })),
      });
    } catch (error) {
      console.error('[ProgressService] Error generating AI insights:', error);
      // Fallback will be handled by llmService
      aiInsights = {
        strengths: ['Completed weekly games'],
        improvements: ['Keep practicing regularly'],
        insights: ['Continue your learning journey'],
        aiGeneratedSummary: 'Keep up the great work on your learning journey!',
      };
    }

    const report = {
      // Frontend-compatible format
      gamesPlayed: totalGames,
      totalTime: Math.round(totalTime / 60), // Convert to minutes
      xpEarned: totalXP,
      avgAccuracy: Math.round(avgAccuracy),

      // Additional details
      period: {
        start: oneWeekAgo,
        end: new Date(),
      },
      categoryBreakdown: categoryStats,
      weeklyActivity: dailyActivity,

      // AI-generated insights
      strengths: aiInsights.strengths,
      improvements: aiInsights.improvements,
      insights: aiInsights.insights,
      aiSummary: aiInsights.aiGeneratedSummary,
    };

    console.log('[ProgressService] Weekly report generated with AI insights');
    return report;
  }
}
