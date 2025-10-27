import mongoose from 'mongoose';
import { IChallenge } from '../models/Challenge';
import { IUserChallenge } from '../models/UserChallenge';
export declare class ChallengeService {
    /**
     * Generate a daily challenge for a specific date
     * This creates a challenge that all users can participate in
     */
    static generateDailyChallenge(date?: Date): Promise<IChallenge>;
    /**
     * Get or create today's challenge for a user
     */
    static getUserDailyChallenge(userId: mongoose.Types.ObjectId): Promise<{
        challenge: IChallenge;
        userChallenge: IUserChallenge;
    }>;
    /**
     * Update challenge progress after a game session
     * This is called from gameService after a game is completed
     */
    static updateChallengeProgress(userId: mongoose.Types.ObjectId, gameSession: {
        gameId: mongoose.Types.ObjectId;
        category: string;
        score: number;
        xpEarned: number;
    }): Promise<void>;
    /**
     * Mark a challenge as completed and award rewards
     */
    static completeChallenge(userId: mongoose.Types.ObjectId, challengeId: mongoose.Types.ObjectId): Promise<IUserChallenge>;
    /**
     * Award a bonus badge if user doesn't already have it
     */
    static checkAndAwardBonusBadge(userId: mongoose.Types.ObjectId, badgeId: mongoose.Types.ObjectId, userChallenge: IUserChallenge): Promise<void>;
    /**
     * Get challenge history for a user
     */
    static getChallengeHistory(userId: mongoose.Types.ObjectId, limit?: number): Promise<Array<{
        challenge: IChallenge;
        userChallenge: IUserChallenge;
    }>>;
    /**
     * Expire old challenges that are still in progress
     * This should be run daily via a cron job
     */
    static expireOldChallenges(): Promise<number>;
    /**
     * Get statistics about challenges
     */
    static getChallengeStats(userId: mongoose.Types.ObjectId): Promise<{
        totalCompleted: number;
        totalXPEarned: number;
        bonusBadgesEarned: number;
        currentStreak: number;
    }>;
}
//# sourceMappingURL=challengeService.d.ts.map