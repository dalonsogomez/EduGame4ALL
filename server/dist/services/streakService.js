import { UserProgress } from '../models/UserProgress';
export class StreakService {
    /**
     * Check and update user streak based on last activity date
     * This method should be called on login and game play
     */
    static async updateStreak(userId) {
        console.log('[StreakService] Updating streak for user:', userId);
        let userProgress = await UserProgress.findOne({ userId });
        if (!userProgress) {
            console.log('[StreakService] Creating new user progress');
            // Create default progress if it doesn't exist
            userProgress = await UserProgress.create({
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
            console.log('[StreakService] User progress created with initial streak: 0');
            return userProgress;
        }
        const now = new Date();
        const lastActivity = new Date(userProgress.lastActivityDate);
        // Reset time to start of day for both dates for accurate comparison
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastActivityStart = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
        // Calculate difference in days
        const daysDifference = Math.floor((todayStart.getTime() - lastActivityStart.getTime()) / (1000 * 60 * 60 * 24));
        console.log('[StreakService] Days difference from last activity:', daysDifference);
        if (daysDifference === 0) {
            // Same day, no streak update needed
            console.log('[StreakService] Same day activity, streak unchanged:', userProgress.streak);
            return userProgress;
        }
        else if (daysDifference === 1) {
            // Consecutive day, increment streak
            userProgress.streak += 1;
            userProgress.lastActivityDate = now;
            await userProgress.save();
            console.log('[StreakService] Streak incremented to:', userProgress.streak);
            return userProgress;
        }
        else {
            // Missed one or more days, reset streak
            const previousStreak = userProgress.streak;
            userProgress.streak = 1; // Start fresh with today
            userProgress.lastActivityDate = now;
            await userProgress.save();
            console.log('[StreakService] Streak reset from', previousStreak, 'to 1 (missed', daysDifference, 'days)');
            return userProgress;
        }
    }
    /**
     * Get user's current streak information
     */
    static async getStreakInfo(userId) {
        console.log('[StreakService] Getting streak info for user:', userId);
        const userProgress = await UserProgress.findOne({ userId });
        if (!userProgress) {
            console.log('[StreakService] No user progress found');
            return {
                currentStreak: 0,
                lastActivityDate: new Date(),
                isActiveToday: false,
                daysUntilReset: 0,
            };
        }
        const now = new Date();
        const lastActivity = new Date(userProgress.lastActivityDate);
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastActivityStart = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
        const daysDifference = Math.floor((todayStart.getTime() - lastActivityStart.getTime()) / (1000 * 60 * 60 * 24));
        const isActiveToday = daysDifference === 0;
        const daysUntilReset = isActiveToday ? 1 : 0; // 1 day until reset if active today, 0 if already needs reset
        return {
            currentStreak: userProgress.streak,
            lastActivityDate: userProgress.lastActivityDate,
            isActiveToday,
            daysUntilReset,
        };
    }
    /**
     * Manually reset streak (for admin or testing purposes)
     */
    static async resetStreak(userId) {
        console.log('[StreakService] Manually resetting streak for user:', userId);
        const userProgress = await UserProgress.findOne({ userId });
        if (!userProgress) {
            console.log('[StreakService] User progress not found');
            return null;
        }
        userProgress.streak = 0;
        await userProgress.save();
        console.log('[StreakService] Streak reset to 0');
        return userProgress;
    }
    /**
     * Get streak statistics across all users
     */
    static async getStreakStatistics() {
        console.log('[StreakService] Calculating streak statistics');
        const allProgress = await UserProgress.find().populate('userId', 'name email');
        const totalUsers = allProgress.length;
        const usersWithActiveStreaks = allProgress.filter(p => p.streak > 0).length;
        const totalStreak = allProgress.reduce((sum, p) => sum + p.streak, 0);
        const averageStreak = totalUsers > 0 ? Math.round(totalStreak / totalUsers) : 0;
        const longestStreak = allProgress.length > 0
            ? Math.max(...allProgress.map(p => p.streak))
            : 0;
        const topStreaks = allProgress
            .sort((a, b) => b.streak - a.streak)
            .slice(0, 10)
            .map(p => {
            const user = p.userId;
            return {
                userId: user?._id?.toString() || 'unknown',
                streak: p.streak,
                username: user?.name || user?.email?.split('@')[0] || 'Anonymous',
            };
        });
        console.log('[StreakService] Statistics:', {
            totalUsers,
            usersWithActiveStreaks,
            averageStreak,
            longestStreak,
        });
        return {
            totalUsers,
            usersWithActiveStreaks,
            averageStreak,
            longestStreak,
            topStreaks,
        };
    }
    /**
     * Check all users and reset streaks that have expired (maintenance task)
     * This can be run as a daily cron job
     */
    static async checkAndResetExpiredStreaks() {
        console.log('[StreakService] Checking for expired streaks');
        const allProgress = await UserProgress.find();
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let streaksReset = 0;
        const affectedUsers = [];
        for (const progress of allProgress) {
            const lastActivity = new Date(progress.lastActivityDate);
            const lastActivityStart = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
            const daysDifference = Math.floor((todayStart.getTime() - lastActivityStart.getTime()) / (1000 * 60 * 60 * 24));
            // If more than 1 day has passed and streak > 0, reset it
            if (daysDifference > 1 && progress.streak > 0) {
                console.log(`[StreakService] Resetting expired streak for user ${progress.userId}: ${progress.streak} -> 0`);
                progress.streak = 0;
                await progress.save();
                streaksReset++;
                affectedUsers.push(progress.userId.toString());
            }
        }
        console.log(`[StreakService] Reset ${streaksReset} expired streaks out of ${allProgress.length} users`);
        return {
            totalChecked: allProgress.length,
            streaksReset,
            affectedUsers,
        };
    }
}
//# sourceMappingURL=streakService.js.map