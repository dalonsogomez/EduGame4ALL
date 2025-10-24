import { UserProgress } from '../models/UserProgress';
import { UserBadge } from '../models/UserBadge';
import { Badge } from '../models/Badge';
import { GameSession } from '../models/GameSession';
import mongoose from 'mongoose';
export class ProgressService {
    // Get user progress
    static async getUserProgress(userId) {
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
    static async getUserBadges(userId) {
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
            }
            else {
                // Calculate progress based on XP
                progress = Math.min(100, Math.round((userProgress.totalXP / badge.xpRequired) * 100));
            }
            return {
                id: badge._id,
                name: badge.name,
                description: badge.description,
                category: badge.category,
                iconUrl: badge.iconUrl,
                xpRequired: badge.xpRequired,
                level: badge.level,
                progress,
                isEarned,
                earnedAt,
            };
        });
        console.log(`[ProgressService] Returning ${badgesWithProgress.length} badges`);
        return badgesWithProgress;
    }
    // Check and award badges to user
    static async checkAndAwardBadges(userId) {
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
            }
            else if (!existingUserBadge.earnedAt && progress >= 100) {
                // Award the badge
                existingUserBadge.progress = 100;
                existingUserBadge.earnedAt = new Date();
                await existingUserBadge.save();
                console.log('[ProgressService] Badge earned:', badge.name);
            }
            else if (existingUserBadge.progress !== progress) {
                // Update progress
                existingUserBadge.progress = progress;
                await existingUserBadge.save();
            }
        }
    }
    // Get user game history
    static async getGameHistory(userId, limit = 20) {
        console.log('[ProgressService] Fetching game history for user:', userId);
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
        }
        const sessions = await GameSession.find({ userId })
            .populate('gameId')
            .sort({ completedAt: -1 })
            .limit(limit);
        const history = sessions.map((session) => {
            const game = session.gameId;
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
    // Get weekly report
    static async getWeeklyReport(userId) {
        console.log('[ProgressService] Generating weekly report for user:', userId);
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
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
        const avgAccuracy = sessions.length > 0
            ? sessions.reduce((sum, s) => sum + (s.score / s.maxScore) * 100, 0) / sessions.length
            : 0;
        // Category breakdown
        const categoryStats = {
            language: { games: 0, xp: 0 },
            culture: { games: 0, xp: 0 },
            'soft-skills': { games: 0, xp: 0 },
        };
        sessions.forEach((session) => {
            const game = session.gameId;
            if (categoryStats[game.category]) {
                categoryStats[game.category].games += 1;
                categoryStats[game.category].xp += session.xpEarned;
            }
        });
        const report = {
            period: {
                start: oneWeekAgo,
                end: new Date(),
            },
            summary: {
                totalGames,
                totalXP,
                totalTime: Math.round(totalTime / 60), // Convert to minutes
                avgAccuracy: Math.round(avgAccuracy),
            },
            categoryBreakdown: categoryStats,
            insight: this.generateInsight(totalGames, avgAccuracy, categoryStats),
        };
        console.log('[ProgressService] Weekly report generated');
        return report;
    }
    // Generate AI-like insight
    static generateInsight(totalGames, avgAccuracy, categoryStats) {
        if (totalGames === 0) {
            return "You haven't played any games this week. Start your learning journey today!";
        }
        if (avgAccuracy >= 80) {
            return `Excellent performance this week! You've completed ${totalGames} games with ${Math.round(avgAccuracy)}% accuracy. Keep up the great work!`;
        }
        else if (avgAccuracy >= 60) {
            return `Good effort this week with ${totalGames} games completed. Try focusing on areas where you can improve to boost your accuracy.`;
        }
        else {
            return `You've played ${totalGames} games this week. Consider reviewing the material and taking your time with each question to improve your scores.`;
        }
    }
}
//# sourceMappingURL=progressService.js.map