import { Challenge } from '../models/Challenge';
import { UserChallenge } from '../models/UserChallenge';
import { UserBadge } from '../models/UserBadge';
import { Badge } from '../models/Badge';
import XpService from './xpService';
export class ChallengeService {
    /**
     * Generate a daily challenge for a specific date
     * This creates a challenge that all users can participate in
     */
    static async generateDailyChallenge(date = new Date()) {
        console.log(`[ChallengeService] Generating daily challenge for ${date.toDateString()}`);
        // Set to start of day
        const challengeDate = new Date(date);
        challengeDate.setHours(0, 0, 0, 0);
        // Check if challenge already exists for this date
        const existingChallenge = await Challenge.findOne({
            date: challengeDate,
            isActive: true,
        });
        if (existingChallenge) {
            console.log(`[ChallengeService] Challenge already exists for ${challengeDate.toDateString()}`);
            return existingChallenge;
        }
        // Generate random challenge
        const challengeTypes = [
            {
                type: 'play_games',
                title: 'Game Master',
                description: 'Complete 3 games today',
                requirements: { targetCount: 3 },
                rewards: { xp: 100 },
            },
            {
                type: 'earn_xp',
                title: 'XP Hunter',
                description: 'Earn 200 XP today',
                requirements: { targetXP: 200 },
                rewards: { xp: 150 },
            },
            {
                type: 'complete_category',
                title: 'Language Learner',
                description: 'Complete 2 language games',
                category: 'language',
                requirements: { targetCount: 2 },
                rewards: { xp: 120 },
            },
            {
                type: 'complete_category',
                title: 'Culture Explorer',
                description: 'Complete 2 culture games',
                category: 'culture',
                requirements: { targetCount: 2 },
                rewards: { xp: 120 },
            },
            {
                type: 'complete_category',
                title: 'Skills Builder',
                description: 'Complete 2 soft skills games',
                category: 'soft-skills',
                requirements: { targetCount: 2 },
                rewards: { xp: 120 },
            },
            {
                type: 'perfect_score',
                title: 'Perfectionist',
                description: 'Complete a game with 100% score',
                requirements: { targetCount: 1, minScore: 100 },
                rewards: { xp: 200 },
            },
        ];
        // Select random challenge
        const template = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
        // Check if there's a bonus badge for this category
        let bonusBadgeId;
        if (template.category) {
            const bonusBadge = await Badge.findOne({
                category: template.category,
                level: 1,
            });
            bonusBadgeId = bonusBadge?._id;
        }
        const challenge = await Challenge.create({
            title: template.title,
            description: template.description,
            type: template.type,
            category: template.category,
            date: challengeDate,
            requirements: template.requirements,
            rewards: {
                xp: template.rewards.xp,
                bonusBadgeId,
            },
            isActive: true,
        });
        console.log(`[ChallengeService] Created challenge: ${challenge.title} (ID: ${challenge._id})`);
        return challenge;
    }
    /**
     * Get or create today's challenge for a user
     */
    static async getUserDailyChallenge(userId) {
        console.log(`[ChallengeService] Getting daily challenge for user ${userId}`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Get or create today's challenge
        let challenge = await Challenge.findOne({
            date: today,
            isActive: true,
        }).populate('rewards.bonusBadgeId');
        if (!challenge) {
            const newChallenge = await this.generateDailyChallenge(today);
            challenge = await Challenge.findById(newChallenge._id).populate('rewards.bonusBadgeId');
        }
        // Get or create user's challenge tracking
        let userChallenge = await UserChallenge.findOne({
            userId,
            challengeId: challenge._id,
        }).populate('bonusBadgeId');
        if (!userChallenge) {
            // Determine target based on challenge type
            let target = 0;
            if (challenge.requirements.targetCount) {
                target = challenge.requirements.targetCount;
            }
            else if (challenge.requirements.targetXP) {
                target = challenge.requirements.targetXP;
            }
            userChallenge = await UserChallenge.create({
                userId,
                challengeId: challenge._id,
                status: 'in_progress',
                progress: {
                    current: 0,
                    target,
                    percentage: 0,
                },
                xpEarned: 0,
                bonusBadgeAwarded: false,
            });
            console.log(`[ChallengeService] Created user challenge tracking for user ${userId}`);
        }
        return { challenge, userChallenge };
    }
    /**
     * Update challenge progress after a game session
     * This is called from gameService after a game is completed
     */
    static async updateChallengeProgress(userId, gameSession) {
        console.log(`[ChallengeService] Updating challenge progress for user ${userId}`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Get today's challenge
        const challenge = await Challenge.findOne({
            date: today,
            isActive: true,
        });
        if (!challenge) {
            console.log('[ChallengeService] No active challenge for today');
            return;
        }
        // Get user's challenge
        const userChallenge = await UserChallenge.findOne({
            userId,
            challengeId: challenge._id,
            status: 'in_progress',
        });
        if (!userChallenge) {
            console.log('[ChallengeService] No user challenge found');
            return;
        }
        let progressIncrement = 0;
        let shouldUpdate = false;
        // Determine progress based on challenge type
        switch (challenge.type) {
            case 'play_games':
                progressIncrement = 1;
                shouldUpdate = true;
                break;
            case 'earn_xp':
                progressIncrement = gameSession.xpEarned;
                shouldUpdate = true;
                break;
            case 'complete_category':
                if (challenge.category === gameSession.category) {
                    progressIncrement = 1;
                    shouldUpdate = true;
                }
                break;
            case 'perfect_score':
                if (gameSession.score >= 100) {
                    progressIncrement = 1;
                    shouldUpdate = true;
                }
                break;
            case 'skill_focus':
                if (challenge.category === gameSession.category) {
                    progressIncrement = gameSession.xpEarned;
                    shouldUpdate = true;
                }
                break;
        }
        if (shouldUpdate && progressIncrement > 0) {
            userChallenge.progress.current += progressIncrement;
            // Calculate percentage
            if (userChallenge.progress.target > 0) {
                userChallenge.progress.percentage = Math.min(100, Math.floor((userChallenge.progress.current / userChallenge.progress.target) * 100));
            }
            // Check if completed
            if (userChallenge.progress.current >= userChallenge.progress.target) {
                await this.completeChallenge(userId, challenge._id);
            }
            else {
                await userChallenge.save();
                console.log(`[ChallengeService] Updated challenge progress: ${userChallenge.progress.current}/${userChallenge.progress.target}`);
            }
        }
    }
    /**
     * Mark a challenge as completed and award rewards
     */
    static async completeChallenge(userId, challengeId) {
        console.log(`[ChallengeService] Completing challenge ${challengeId} for user ${userId}`);
        const userChallenge = await UserChallenge.findOne({
            userId,
            challengeId,
            status: 'in_progress',
        });
        if (!userChallenge) {
            throw new Error('User challenge not found or already completed');
        }
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            throw new Error('Challenge not found');
        }
        // Mark as completed
        userChallenge.status = 'completed';
        userChallenge.completedAt = new Date();
        userChallenge.progress.percentage = 100;
        userChallenge.xpEarned = challenge.rewards.xp;
        // Award XP using XpService
        const xpResult = await XpService.awardXP(userId, challenge.rewards.xp);
        if (xpResult.leveledUp) {
            console.log(`[ChallengeService] User leveled up from ${xpResult.oldLevel} to ${xpResult.newLevel}`);
        }
        console.log(`[ChallengeService] Awarded ${challenge.rewards.xp} XP via XpService`);
        // Award bonus badge if applicable
        if (challenge.rewards.bonusBadgeId) {
            await this.checkAndAwardBonusBadge(userId, challenge.rewards.bonusBadgeId, userChallenge);
        }
        await userChallenge.save();
        console.log(`[ChallengeService] Challenge completed! Total XP earned: ${userChallenge.xpEarned}`);
        return userChallenge;
    }
    /**
     * Award a bonus badge if user doesn't already have it
     */
    static async checkAndAwardBonusBadge(userId, badgeId, userChallenge) {
        console.log(`[ChallengeService] Checking bonus badge ${badgeId} for user ${userId}`);
        // Check if user already has this badge
        const existingBadge = await UserBadge.findOne({
            userId,
            badgeId,
        });
        if (existingBadge) {
            console.log('[ChallengeService] User already has this badge');
            return;
        }
        // Award the badge
        await UserBadge.create({
            userId,
            badgeId,
            progress: 100,
            earnedAt: new Date(),
        });
        userChallenge.bonusBadgeAwarded = true;
        userChallenge.bonusBadgeId = badgeId;
        console.log(`[ChallengeService] Awarded bonus badge ${badgeId}`);
    }
    /**
     * Get challenge history for a user
     */
    static async getChallengeHistory(userId, limit = 10) {
        console.log(`[ChallengeService] Fetching challenge history for user ${userId}`);
        const userChallenges = await UserChallenge.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('challengeId')
            .populate('bonusBadgeId');
        const history = userChallenges
            .filter((uc) => uc.challengeId)
            .map((uc) => ({
            challenge: uc.challengeId,
            userChallenge: uc,
        }));
        return history;
    }
    /**
     * Expire old challenges that are still in progress
     * This should be run daily via a cron job
     */
    static async expireOldChallenges() {
        console.log('[ChallengeService] Expiring old challenges');
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(23, 59, 59, 999);
        const result = await UserChallenge.updateMany({
            status: 'in_progress',
            createdAt: { $lt: yesterday },
        }, {
            $set: { status: 'expired' },
        });
        console.log(`[ChallengeService] Expired ${result.modifiedCount} challenges`);
        return result.modifiedCount;
    }
    /**
     * Get statistics about challenges
     */
    static async getChallengeStats(userId) {
        const userChallenges = await UserChallenge.find({
            userId,
            status: 'completed',
        }).sort({ completedAt: -1 });
        const totalCompleted = userChallenges.length;
        const totalXPEarned = userChallenges.reduce((sum, uc) => sum + uc.xpEarned, 0);
        const bonusBadgesEarned = userChallenges.filter((uc) => uc.bonusBadgeAwarded).length;
        // Calculate current streak (consecutive days)
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 0; i < userChallenges.length; i++) {
            const challengeDate = new Date(userChallenges[i].completedAt);
            challengeDate.setHours(0, 0, 0, 0);
            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);
            expectedDate.setHours(0, 0, 0, 0);
            if (challengeDate.getTime() === expectedDate.getTime()) {
                currentStreak++;
            }
            else {
                break;
            }
        }
        return {
            totalCompleted,
            totalXPEarned,
            bonusBadgesEarned,
            currentStreak,
        };
    }
}
//# sourceMappingURL=challengeService.js.map