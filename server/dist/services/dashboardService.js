import { UserProgress } from '../models/UserProgress';
import { GameSession } from '../models/GameSession';
import { UserBadge } from '../models/UserBadge';
import { ChallengeService } from './challengeService';
import mongoose from 'mongoose';
export class DashboardService {
    // Get dashboard data for user
    static async getDashboardData(userId) {
        console.log('[DashboardService] Fetching dashboard data for user:', userId);
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
        }
        const [skills, recentActivity, leaderboard, dailyChallenge] = await Promise.all([
            this.getUserSkills(userId),
            this.getRecentActivity(userId),
            this.getLeaderboard(userId),
            this.getDailyChallenge(userId),
        ]);
        const dashboardData = {
            skills,
            recentActivity,
            leaderboard,
            dailyChallenge,
        };
        console.log('[DashboardService] Dashboard data fetched successfully');
        return dashboardData;
    }
    // Get user skills in the format expected by frontend
    static async getUserSkills(userId) {
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
        // XP required for next level follows a progressive formula
        const calculateXPToNextLevel = (level) => {
            return Math.floor(100 * Math.pow(1.5, level - 1));
        };
        const skills = progress.skills;
        return [
            {
                category: 'language',
                level: skills.language.level,
                xp: skills.language.xp,
                xpToNextLevel: calculateXPToNextLevel(skills.language.level),
                percentage: Math.floor((skills.language.xp / calculateXPToNextLevel(skills.language.level)) * 100),
            },
            {
                category: 'culture',
                level: skills.culture.level,
                xp: skills.culture.xp,
                xpToNextLevel: calculateXPToNextLevel(skills.culture.level),
                percentage: Math.floor((skills.culture.xp / calculateXPToNextLevel(skills.culture.level)) * 100),
            },
            {
                category: 'softSkills',
                level: skills.softSkills.level,
                xp: skills.softSkills.xp,
                xpToNextLevel: calculateXPToNextLevel(skills.softSkills.level),
                percentage: Math.floor((skills.softSkills.xp / calculateXPToNextLevel(skills.softSkills.level)) * 100),
            },
        ];
    }
    // Get recent activity with proper formatting
    static async getRecentActivity(userId, limit = 10) {
        const activities = [];
        // Get recent game sessions
        const sessions = await GameSession.find({ userId })
            .populate('gameId')
            .sort({ completedAt: -1 })
            .limit(5);
        sessions.forEach((session) => {
            const game = session.gameId;
            if (game) {
                activities.push({
                    _id: session._id.toString(),
                    type: 'game',
                    message: `Completed "${game.title}" - earned ${session.xpEarned} XP`,
                    timestamp: session.completedAt.toISOString(),
                    icon: '🎮',
                });
            }
        });
        // Get recently earned badges
        const recentBadges = await UserBadge.find({ userId, earnedAt: { $exists: true } })
            .populate('badgeId')
            .sort({ earnedAt: -1 })
            .limit(3);
        recentBadges.forEach((userBadge) => {
            const badge = userBadge.badgeId;
            if (badge && userBadge.earnedAt) {
                activities.push({
                    _id: userBadge._id.toString(),
                    type: 'badge',
                    message: `Earned the "${badge.name}" badge!`,
                    timestamp: userBadge.earnedAt.toISOString(),
                    icon: '🏆',
                });
            }
        });
        // Check for level ups
        const progress = await UserProgress.findOne({ userId });
        if (progress && progress.level > 1) {
            // Add a level milestone activity (using level as pseudo-timestamp)
            activities.push({
                _id: `level-${progress.level}`,
                type: 'level',
                message: `Reached Level ${progress.level}!`,
                timestamp: progress.lastActivityDate.toISOString(),
                icon: '⭐',
            });
        }
        // Sort by timestamp and limit
        return activities
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
    }
    // Get leaderboard with proper formatting
    static async getLeaderboard(userId, limit = 10) {
        const topUsers = await UserProgress.find()
            .sort({ totalXP: -1 })
            .limit(limit * 2) // Get more to account for null users
            .populate('userId', 'email name');
        // Filter out entries where user doesn't exist
        const validUsers = topUsers.filter((progress) => progress.userId !== null);
        const leaderboard = validUsers.slice(0, limit).map((progress, index) => {
            const user = progress.userId;
            // Generate a consistent country code based on user ID (for demo purposes)
            const countries = ['US', 'ES', 'FR', 'DE', 'IT', 'SY', 'MA', 'VE', 'CO', 'MX'];
            const userIdStr = user._id ? user._id.toString() : user.toString();
            const countryIndex = userIdStr.charCodeAt(0) % countries.length;
            return {
                rank: index + 1,
                userId: userIdStr,
                username: user.name || user.email.split('@')[0], // Use name or email prefix
                xp: progress.totalXP,
                country: countries[countryIndex],
                isCurrentUser: userIdStr === userId,
            };
        });
        return leaderboard;
    }
    // Get daily challenge with proper formatting using ChallengeService
    static async getDailyChallenge(userId) {
        try {
            const userObjectId = new mongoose.Types.ObjectId(userId);
            const { challenge, userChallenge } = await ChallengeService.getUserDailyChallenge(userObjectId);
            return {
                _id: challenge._id.toString(),
                title: challenge.title,
                description: challenge.description,
                progress: userChallenge.progress.current,
                total: userChallenge.progress.target,
                xpReward: challenge.rewards.xp,
                bonusBadge: challenge.rewards.bonusBadgeId
                    ? (challenge.rewards.bonusBadgeId.name || 'Bonus Badge')
                    : undefined,
                status: userChallenge.status,
                percentage: userChallenge.progress.percentage,
                completedAt: userChallenge.completedAt,
            };
        }
        catch (error) {
            console.error('[DashboardService] Error fetching daily challenge:', error);
            // Return a default challenge structure if there's an error
            return {
                _id: 'default',
                title: 'Complete 3 games today',
                description: 'Play educational games to improve your skills',
                progress: 0,
                total: 3,
                xpReward: 100,
                status: 'in_progress',
                percentage: 0,
            };
        }
    }
}
//# sourceMappingURL=dashboardService.js.map