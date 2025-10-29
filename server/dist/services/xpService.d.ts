import { Types } from 'mongoose';
export type SkillCategory = 'language' | 'culture' | 'softSkills';
interface LevelInfo {
    currentLevel: number;
    currentXP: number;
    xpForCurrentLevel: number;
    xpForNextLevel: number;
    xpProgressInLevel: number;
    progressPercentage: number;
}
interface CategoryLevelInfo extends LevelInfo {
    category: SkillCategory;
}
interface XPAwardResult {
    xpAwarded: number;
    totalXP: number;
    categoryXP?: number;
    oldLevel: number;
    newLevel: number;
    leveledUp: boolean;
    oldCategoryLevel?: number;
    newCategoryLevel?: number;
    categoryLeveledUp?: boolean;
    badgesEarned?: Array<{
        badgeId: Types.ObjectId;
        title: string;
    }>;
}
/**
 * XP Service - Handles all XP calculations, level-ups, and skill category tracking
 */
export declare class XpService {
    private static readonly BASE_XP;
    private static readonly XP_MULTIPLIER;
    /**
     * Calculate the level based on total XP
     * Formula: level = floor(log(XP / BASE_XP) / log(MULTIPLIER)) + 1
     */
    static calculateLevel(xp: number): number;
    /**
     * Calculate XP required to reach a specific level
     * Formula: XP = BASE_XP * MULTIPLIER^(level - 1)
     */
    static xpForLevel(level: number): number;
    /**
     * Get detailed level information for given XP
     */
    static getLevelInfo(xp: number): LevelInfo;
    /**
     * Get category-specific level information
     */
    static getCategoryLevelInfo(category: SkillCategory, categoryXP: number): CategoryLevelInfo;
    /**
     * Award XP to a user (both total and category-specific)
     * Handles level-ups and badge awards automatically
     */
    static awardXP(userId: Types.ObjectId, xpAmount: number, category?: SkillCategory): Promise<XPAwardResult>;
    /**
     * Check and award badges based on level milestones
     */
    private static checkAndAwardLevelBadges;
    /**
     * Get complete XP profile for a user
     */
    static getUserXPProfile(userId: Types.ObjectId): Promise<{
        totalXP: number;
        level: LevelInfo;
        skills: {
            language: CategoryLevelInfo;
            culture: CategoryLevelInfo;
            softSkills: CategoryLevelInfo;
        };
        streak: {
            current: number;
            longest: number;
        };
        lastActive?: undefined;
    } | {
        totalXP: number;
        level: LevelInfo;
        skills: {
            language: CategoryLevelInfo;
            culture: CategoryLevelInfo;
            softSkills: CategoryLevelInfo;
        };
        streak: {
            current: number;
            longest: number;
        };
        lastActive: Date;
    }>;
    /**
     * Get leaderboard for total XP or specific category
     */
    static getLeaderboard(category?: SkillCategory, limit?: number): Promise<{
        rank: number;
        userId: Types.ObjectId;
        xp: number;
        level: number;
        category: string;
    }[]>;
}
export default XpService;
//# sourceMappingURL=xpService.d.ts.map