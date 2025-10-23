export type UserType = 'child' | 'adult' | 'educator';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  userType: UserType;
  age?: number;
  location: string;
  nativeLanguage: string;
  targetLanguage: string;
  profilePhoto?: string;
  level: number;
  xp: number;
  streak: number;
  createdAt: string;
}

export interface SkillLevel {
  category: 'language' | 'culture' | 'softSkills';
  level: number;
  xp: number;
  xpToNextLevel: number;
  percentage: number;
}

export interface Game {
  _id: string;
  title: string;
  description: string;
  category: 'language' | 'culture' | 'softSkills';
  difficulty: 1 | 2 | 3 | 4 | 5;
  duration: number;
  xpReward: number;
  thumbnail: string;
  isLocked: boolean;
  progress?: number;
}

export interface Badge {
  _id: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'streak' | 'mastery' | 'social' | 'special';
  isEarned: boolean;
  earnedAt?: string;
  progress?: number;
  total?: number;
}

export interface Reward {
  _id: string;
  title: string;
  description: string;
  category: 'coupon' | 'digital' | 'content' | 'donation';
  cost: number;
  image: string;
  available: number;
  expirationDays?: number;
}

export interface RedeemedReward {
  _id: string;
  reward: Reward;
  qrCode: string;
  redeemedAt: string;
  expiresAt: string;
  isUsed: boolean;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'internship' | 'volunteer';
  matchScore: number;
  requirements: string[];
  salary?: string;
  postedAt: string;
  logo?: string;
}

export interface Grant {
  _id: string;
  name: string;
  organization: string;
  amount: string;
  eligibility: string[];
  deadline: string;
  description: string;
}

export interface Service {
  _id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  languages: string[];
  isFree: boolean;
  coordinates?: { lat: number; lng: number };
}

export interface NewsArticle {
  _id: string;
  title: string;
  summary: string;
  category: 'community' | 'events' | 'important' | 'culture';
  source: string;
  difficulty: 'easy' | 'medium' | 'hard';
  publishedAt: string;
  content?: string;
}

export interface DailyChallenge {
  _id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  xpReward: number;
  bonusBadge?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  xp: number;
  country: string;
  isCurrentUser?: boolean;
}

export interface ActivityItem {
  _id: string;
  type: 'badge' | 'game' | 'level';
  message: string;
  timestamp: string;
  icon: string;
}

export interface GameSession {
  _id: string;
  gameId: string;
  score: number;
  timeSpent: number;
  xpEarned: number;
  completedAt: string;
  feedback: AIFeedback;
}

export interface AIFeedback {
  strengths: string[];
  improvements: string[];
  tips: string[];
  nextRecommendations: string[];
  personalizedMessage: string;
}