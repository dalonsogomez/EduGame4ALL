import { IUserProgress } from '../models/UserProgress';
import mongoose from 'mongoose';
export declare class StreakService {
    /**
     * Check and update user streak based on last activity date
     * This method should be called on login and game play
     */
    static updateStreak(userId: mongoose.Types.ObjectId): Promise<IUserProgress>;
    /**
     * Get user's current streak information
     */
    static getStreakInfo(userId: mongoose.Types.ObjectId): Promise<{
        currentStreak: number;
        lastActivityDate: Date;
        isActiveToday: boolean;
        daysUntilReset: number;
    }>;
    /**
     * Manually reset streak (for admin or testing purposes)
     */
    static resetStreak(userId: mongoose.Types.ObjectId): Promise<IUserProgress | null>;
    /**
     * Get streak statistics across all users
     */
    static getStreakStatistics(): Promise<{
        totalUsers: number;
        usersWithActiveStreaks: number;
        averageStreak: number;
        longestStreak: number;
        topStreaks: Array<{
            userId: string;
            streak: number;
            username?: string;
        }>;
    }>;
    /**
     * Check all users and reset streaks that have expired (maintenance task)
     * This can be run as a daily cron job
     */
    static checkAndResetExpiredStreaks(): Promise<{
        totalChecked: number;
        streaksReset: number;
        affectedUsers: string[];
    }>;
}
//# sourceMappingURL=streakService.d.ts.map