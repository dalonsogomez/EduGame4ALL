import { UserProgress } from '../models/UserProgress';
import { Badge } from '../models/Badge';
import { UserBadge } from '../models/UserBadge';
/**
 * XP Service - Handles all XP calculations, level-ups, and skill category tracking
 */
export class XpService {
    /**
     * Calculate the level based on total XP
     * Formula: level = floor(log(XP / BASE_XP) / log(MULTIPLIER)) + 1
     */
    static calculateLevel(xp) {
        if (xp < this.BASE_XP)
            return 1;
        const level = Math.floor(Math.log(xp / this.BASE_XP) / Math.log(this.XP_MULTIPLIER)) + 1;
        return Math.max(1, level);
    }
    /**
     * Calculate XP required to reach a specific level
     * Formula: XP = BASE_XP * MULTIPLIER^(level - 1)
     */
    static xpForLevel(level) {
        if (level <= 1)
            return 0;
        return Math.floor(this.BASE_XP * Math.pow(this.XP_MULTIPLIER, level - 1));
    }
    /**
     * Get detailed level information for given XP
     */
    static getLevelInfo(xp) {
        const currentLevel = this.calculateLevel(xp);
        const xpForCurrentLevel = this.xpForLevel(currentLevel);
        const xpForNextLevel = this.xpForLevel(currentLevel + 1);
        const xpProgressInLevel = xp - xpForCurrentLevel;
        const xpNeededInLevel = xpForNextLevel - xpForCurrentLevel;
        const progressPercentage = (xpProgressInLevel / xpNeededInLevel) * 100;
        return {
            currentLevel,
            currentXP: xp,
            xpForCurrentLevel,
            xpForNextLevel,
            xpProgressInLevel,
            progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
        };
    }
    /**
     * Get category-specific level information
     */
    static getCategoryLevelInfo(category, categoryXP) {
        const levelInfo = this.getLevelInfo(categoryXP);
        return {
            category,
            ...levelInfo,
        };
    }
    /**
     * Award XP to a user (both total and category-specific)
     * Handles level-ups and badge awards automatically
     */
    static async awardXP(userId, xpAmount, category) {
        console.log(`[XpService] Awarding ${xpAmount} XP to user ${userId}${category ? ` in category ${category}` : ''}`);
        // Get or create user progress
        let userProgress = await UserProgress.findOne({ userId });
        if (!userProgress) {
            console.log(`[XpService] Creating new progress record for user ${userId}`);
            userProgress = new UserProgress({
                userId,
                totalXP: 0,
                level: 1,
                currentStreak: 0,
                longestStreak: 0,
                skills: {
                    language: { level: 1, xp: 0 },
                    culture: { level: 1, xp: 0 },
                    softSkills: { level: 1, xp: 0 },
                },
            });
        }
        // Store old values
        const oldTotalXP = userProgress.totalXP;
        const oldLevel = userProgress.level;
        const oldCategoryXP = category ? userProgress.skills[category].xp : undefined;
        const oldCategoryLevel = category ? userProgress.skills[category].level : undefined;
        // Award total XP
        userProgress.totalXP += xpAmount;
        const newLevel = this.calculateLevel(userProgress.totalXP);
        const leveledUp = newLevel > oldLevel;
        userProgress.level = newLevel;
        // Award category-specific XP
        let categoryLeveledUp = false;
        let newCategoryLevel = oldCategoryLevel;
        if (category) {
            userProgress.skills[category].xp += xpAmount;
            newCategoryLevel = this.calculateLevel(userProgress.skills[category].xp);
            categoryLeveledUp = newCategoryLevel > oldCategoryLevel;
            userProgress.skills[category].level = newCategoryLevel;
        }
        await userProgress.save();
        console.log(`[XpService] XP awarded successfully. Total XP: ${oldTotalXP} -> ${userProgress.totalXP}, Level: ${oldLevel} -> ${newLevel}`);
        if (category) {
            console.log(`[XpService] Category ${category}: XP ${oldCategoryXP} -> ${userProgress.skills[category].xp}, Level: ${oldCategoryLevel} -> ${newCategoryLevel}`);
        }
        // Check for level-based badges
        const badgesEarned = await this.checkAndAwardLevelBadges(userId, newLevel, category, newCategoryLevel);
        return {
            xpAwarded: xpAmount,
            totalXP: userProgress.totalXP,
            categoryXP: category ? userProgress.skills[category].xp : undefined,
            oldLevel,
            newLevel,
            leveledUp,
            oldCategoryLevel,
            newCategoryLevel,
            categoryLeveledUp,
            badgesEarned,
        };
    }
    /**
     * Check and award badges based on level milestones
     */
    static async checkAndAwardLevelBadges(userId, totalLevel, category, categoryLevel) {
        const badgesEarned = [];
        // Check achievement badges for total level milestones
        const achievementBadges = await Badge.find({
            category: 'achievement',
            xpRequired: { $lte: totalLevel * this.BASE_XP },
        });
        for (const badge of achievementBadges) {
            const existingBadge = await UserBadge.findOne({
                userId,
                badgeId: badge._id,
            });
            if (!existingBadge) {
                await UserBadge.create({
                    userId,
                    badgeId: badge._id,
                    progress: 100,
                    earnedAt: new Date(),
                });
                badgesEarned.push({
                    badgeId: badge._id,
                    title: badge.name,
                });
                console.log(`[XpService] Badge earned: ${badge.name} for reaching level ${totalLevel}`);
            }
        }
        // Check category-specific badges
        if (category && categoryLevel) {
            const categoryBadges = await Badge.find({
                category,
                level: { $lte: categoryLevel },
            });
            for (const badge of categoryBadges) {
                const existingBadge = await UserBadge.findOne({
                    userId,
                    badgeId: badge._id,
                });
                if (!existingBadge) {
                    await UserBadge.create({
                        userId,
                        badgeId: badge._id,
                        progress: 100,
                        earnedAt: new Date(),
                    });
                    badgesEarned.push({
                        badgeId: badge._id,
                        title: badge.name,
                    });
                    console.log(`[XpService] Badge earned: ${badge.name} for ${category} level ${categoryLevel}`);
                }
            }
        }
        return badgesEarned;
    }
    /**
     * Get complete XP profile for a user
     */
    static async getUserXPProfile(userId) {
        const userProgress = await UserProgress.findOne({ userId });
        if (!userProgress) {
            // Return default profile
            return {
                totalXP: 0,
                level: this.getLevelInfo(0),
                skills: {
                    language: this.getCategoryLevelInfo('language', 0),
                    culture: this.getCategoryLevelInfo('culture', 0),
                    softSkills: this.getCategoryLevelInfo('softSkills', 0),
                },
                streak: {
                    current: 0,
                    longest: 0,
                },
            };
        }
        return {
            totalXP: userProgress.totalXP,
            level: this.getLevelInfo(userProgress.totalXP),
            skills: {
                language: this.getCategoryLevelInfo('language', userProgress.skills.language.xp),
                culture: this.getCategoryLevelInfo('culture', userProgress.skills.culture.xp),
                softSkills: this.getCategoryLevelInfo('softSkills', userProgress.skills.softSkills.xp),
            },
            streak: {
                current: userProgress.streak,
                longest: userProgress.streak, // Using current streak as longest for now
            },
            lastActive: userProgress.lastActivityDate,
        };
    }
    /**
     * Get leaderboard for total XP or specific category
     */
    static async getLeaderboard(category, limit = 10) {
        let sortField;
        if (category) {
            sortField = { [`skills.${category}.xp`]: -1 };
        }
        else {
            sortField = { totalXP: -1 };
        }
        const leaderboard = await UserProgress.find({ userId: { $ne: null } })
            .sort(sortField)
            .limit(limit)
            .populate('userId', 'name email')
            .lean();
        // Filter out any entries where population failed
        return leaderboard
            .filter((entry) => entry.userId != null)
            .map((entry, index) => {
            const xp = category ? entry.skills[category].xp : entry.totalXP;
            const level = this.calculateLevel(xp);
            return {
                rank: index + 1,
                userId: entry.userId,
                xp,
                level,
                category: category || 'total',
            };
        });
    }
}
// Base XP required for level 2, grows exponentially
XpService.BASE_XP = 100;
XpService.XP_MULTIPLIER = 1.5;
export default XpService;
//# sourceMappingURL=xpService.js.map