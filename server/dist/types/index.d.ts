import { Types } from 'mongoose';
import { IGame } from '../models/Game';
import { IGameSession } from '../models/GameSession';
import { IUser } from '../models/User';
import { IReward } from '../models/Reward';
import { IUserReward } from '../models/UserReward';
export interface GameQueryFilters {
    isActive?: boolean;
    category?: string;
    difficulty?: number | {
        $gte?: number;
        $lte?: number;
    };
    _id?: Types.ObjectId | {
        $in: Types.ObjectId[];
    };
}
export interface GameSessionQueryFilters {
    userId?: Types.ObjectId | string;
    gameId?: Types.ObjectId | string;
    completedAt?: {
        $gte?: Date;
        $lte?: Date;
    };
    _id?: Types.ObjectId | string;
}
export interface ResourceQueryFilters {
    type?: string;
    category?: string;
    isActive?: boolean;
    difficulty?: {
        $gte?: number;
        $lte?: number;
    };
    minAmount?: number;
    maxAmount?: number;
}
export interface RewardQueryFilters {
    category?: string;
    isActive?: boolean;
    requiredPoints?: {
        $lte?: number;
    };
}
export interface UserRewardQueryFilters {
    userId: Types.ObjectId | string;
    status?: 'redeemed' | 'used' | 'expired';
}
export interface PopulatedGameSession extends Omit<IGameSession, 'gameId' | 'userId'> {
    gameId: IGame;
    userId: IUser;
}
export interface PopulatedUserReward extends Omit<IUserReward, 'rewardId' | 'userId'> {
    rewardId: IReward;
    userId: IUser;
}
export interface GameSessionResponse {
    id: string;
    game: {
        id: string;
        title: string;
        category: string;
    };
    score: number;
    maxScore: number;
    xpEarned: number;
    completedAt: string;
    accuracy: number;
    feedback?: {
        strengths: string[];
        improvements: string[];
        tips: string[];
        nextRecommendations: string[];
        personalizedMessage: string;
    };
}
export interface BadgeResponse {
    _id: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    xpRequired: number;
    level: number;
    progress: number;
    total: number;
    isEarned: boolean;
    earnedAt: string | null;
}
export interface WeeklyActivityDay {
    day: string;
    date: string;
    games: number;
    xp: number;
}
export interface CategoryPerformance {
    category: string;
    games: number;
    avgScore: number;
    totalXP: number;
}
export interface WeeklyReportResponse {
    gamesPlayed: number;
    totalTime: number;
    xpEarned: number;
    avgAccuracy: number;
    weeklyActivity: WeeklyActivityDay[];
    categoryBreakdown: Record<string, {
        games: number;
        xp: number;
        avgScore?: number;
        totalXP?: number;
    }>;
    period?: {
        start: Date;
        end: Date;
    };
    strengths: string[];
    improvements: string[];
    insights: string[];
    aiSummary: string;
}
export interface DailyChallengeResponse {
    id: string;
    title: string;
    description: string;
    game: {
        id: string;
        title: string;
        category: string;
        difficulty: number;
    };
    xpReward: number;
    deadline: string;
    progress: {
        completed: boolean;
        score?: number;
        completedAt?: string;
    };
}
export interface LeaderboardEntry {
    rank: number;
    userId: string;
    username: string;
    displayName: string;
    avatar?: string;
    totalXP: number;
    level: number;
    gamesPlayed: number;
    isCurrentUser: boolean;
}
export interface UserSkill {
    category: string;
    level: number;
    xp: number;
    nextLevelXP: number;
    progress: number;
}
export interface DashboardDataResponse {
    user: {
        username: string;
        displayName: string;
        level: number;
        currentXP: number;
        totalXP: number;
        nextLevelXP: number;
        streak: number;
        avatar?: string;
    };
    stats: {
        gamesPlayed: number;
        totalPlayTime: number;
        averageScore: number;
        badgesEarned: number;
    };
    skills: UserSkill[];
    recentActivity: GameSessionResponse[];
    dailyChallenge: DailyChallengeResponse;
    leaderboard: LeaderboardEntry[];
}
export interface RewardResponse {
    _id: string;
    title: string;
    description: string;
    category: string;
    pointsCost: number;
    imageUrl?: string;
    isActive: boolean;
    stock?: number;
    expiresAt?: string;
}
export interface RedeemedRewardResponse {
    _id: string;
    reward: {
        _id: string;
        title: string;
        description: string;
        category: string;
        imageUrl?: string;
    };
    redeemedAt: string;
    status: 'redeemed' | 'used' | 'expired';
    qrCode?: string;
    usedAt?: string;
    expiresAt?: string;
}
export interface RedeemRewardResponse {
    userReward: RedeemedRewardResponse;
    qrCode: string;
}
export interface ResourceResponse {
    _id: string;
    title: string;
    description: string;
    type: string;
    url?: string;
    thumbnailUrl?: string;
    category?: string;
    difficulty?: number;
    isActive: boolean;
}
export interface GrantResponse {
    _id: string;
    title: string;
    description: string;
    organization: string;
    amount: number;
    currency: string;
    deadline?: string;
    url?: string;
    eligibility: string[];
    category: string;
}
export interface GameFeedback {
    strengths: string[];
    improvements: string[];
    tips: string[];
    nextRecommendations: string[];
    personalizedMessage: string;
}
export interface GameSessionData {
    gameType: string;
    difficulty: string;
    correctAnswers: number;
    totalQuestions: number;
    timeSpent: number;
    mistakesPattern?: string[];
}
export interface AIFeedbackRequest {
    user_id: string;
    game_session: GameSessionData;
    language: string;
    age_group?: string;
    current_level?: string;
}
export interface WeeklyInsightsData {
    gamesPlayed: number;
    totalTime: number;
    xpEarned: number;
    avgAccuracy: number;
    activeDays: number;
    categoryBreakdown: CategoryPerformance[];
    weeklyActivity: WeeklyActivityDay[];
}
export declare class ServiceError extends Error {
    statusCode: number;
    code?: string;
    constructor(message: string, statusCode?: number, code?: string);
}
export declare class NotFoundError extends ServiceError {
    constructor(message?: string);
}
export declare class ValidationError extends ServiceError {
    constructor(message?: string);
}
export declare class AuthenticationError extends ServiceError {
    constructor(message?: string);
}
export declare class AuthorizationError extends ServiceError {
    constructor(message?: string);
}
//# sourceMappingURL=index.d.ts.map