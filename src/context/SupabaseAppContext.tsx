import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { 
  User, 
  GameSession, 
  Achievement, 
  Reward, 
  Resource, 
  AIFeedback,
  GameType,
  Difficulty
} from '../types';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import { gameService } from '../services/gameService';
import { achievementService } from '../services/achievementService';
import { rewardService } from '../services/rewardService';
import { resourceService } from '../services/resourceService';
import { toast } from 'sonner';

interface AppContextType {
  // Auth
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, userType: 'student' | 'teacher' | 'organization') => Promise<void>;
  signOut: () => Promise<void>;
  
  // Navigation
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // Game Sessions
  gameSessions: GameSession[];
  addGameSession: (session: Omit<GameSession, 'id' | 'completedAt'>) => Promise<void>;
  refreshSessions: () => Promise<void>;
  
  // Achievements
  achievements: Achievement[];
  userAchievements: any[];
  unlockAchievement: (achievementId: string) => Promise<void>;
  refreshAchievements: () => Promise<void>;
  
  // Rewards
  rewards: Reward[];
  userRewards: any[];
  redeemReward: (rewardId: string) => Promise<void>;
  refreshRewards: () => Promise<void>;
  
  // Resources
  resources: Resource[];
  refreshResources: () => Promise<void>;
  
  // Profile
  updateUserXP: (xp: number) => Promise<void>;
  updateStreak: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function SupabaseAppProvider({ children }: { children: ReactNode }) {
  const { user: authUser, loading: authLoading } = useAuth();
  const { profile, userProfile, refreshProfile: refreshProfileData } = useProfile();
  
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userRewards, setUserRewards] = useState<any[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  // Convert Supabase profile to User type
  const user: User | null = profile ? {
    id: profile.id,
    email: profile.email,
    name: profile.full_name || profile.email,
    userType: profile.user_type,
    xp: profile.xp,
    level: profile.level,
    streak: profile.streak_days,
    avatarUrl: profile.avatar_url,
    profile: userProfile || undefined,
    knowledgeProfile: undefined, // TODO: implement knowledge tracker
    gameSessions: gameSessions,
    achievements: userAchievements.map(ua => ua.achievement),
    redeemedRewards: userRewards.map(ur => ur.reward),
  } : null;

  // Load initial data when user is authenticated
  useEffect(() => {
    if (authUser) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [authUser]);

  async function loadUserData() {
    if (!authUser) return;

    try {
      setLoading(true);
      await Promise.all([
        refreshSessions(),
        refreshAchievements(),
        refreshRewards(),
        refreshResources(),
      ]);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Error al cargar datos del usuario');
    } finally {
      setLoading(false);
    }
  }

  // Auth methods
  async function signIn(email: string, password: string) {
    try {
      await authService.signIn({ email, password });
      toast.success('¡Bienvenido de nuevo!');
      setCurrentPage('dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
      throw error;
    }
  }

  async function signUp(email: string, password: string, fullName: string, userType: 'student' | 'teacher' | 'organization') {
    try {
      await authService.signUp({ email, password, fullName, userType });
      toast.success('¡Cuenta creada exitosamente!');
      setCurrentPage('onboarding');
    } catch (error: any) {
      toast.error(error.message || 'Error al crear cuenta');
      throw error;
    }
  }

  async function signOut() {
    try {
      await authService.signOut();
      setCurrentPage('landing');
      toast.success('Sesión cerrada');
    } catch (error: any) {
      toast.error(error.message || 'Error al cerrar sesión');
      throw error;
    }
  }

  // Game sessions
  async function addGameSession(session: Omit<GameSession, 'id' | 'completedAt'>) {
    if (!authUser) return;

    try {
      // Create session in database
      const dbSession = await gameService.createGameSession({
        userId: authUser.id,
        gameType: session.gameType,
        difficulty: session.difficulty,
        score: session.score,
        totalQuestions: session.totalQuestions,
        correctAnswers: session.correctAnswers,
        timeSpent: session.timeSpent,
        xpEarned: session.xpEarned,
      });

      // Add AI feedback if available
      if (session.aiFeedback) {
        await gameService.createAIFeedback({
          sessionId: dbSession.id,
          userId: authUser.id,
          emotionDetected: session.aiFeedback.emotionDetected,
          difficultySuggestion: session.aiFeedback.suggestedDifficulty,
          mistakePatterns: session.aiFeedback.mistakePatterns,
          feedbackMessage: session.aiFeedback.message,
          encouragement: session.aiFeedback.encouragement,
          nextSteps: session.aiFeedback.nextSteps,
          confidenceScore: session.aiFeedback.confidence,
        });
      }

      // Update XP
      await updateUserXP(session.xpEarned);

      // Update streak
      await updateStreak();

      // Refresh sessions
      await refreshSessions();

      // Check for achievement unlocks
      const stats = await gameService.getUserStats(authUser.id);
      await achievementService.checkAndUnlockAchievements(authUser.id, {
        totalGames: stats.totalGames,
        vocabGames: stats.byGameType.vocabulary,
        cultureGames: stats.byGameType.culture,
        softSkillsGames: stats.byGameType['soft-skills'],
      });

      await refreshAchievements();

      toast.success('¡Sesión guardada!');
    } catch (error: any) {
      console.error('Error adding game session:', error);
      toast.error('Error al guardar sesión');
      throw error;
    }
  }

  async function refreshSessions() {
    if (!authUser) return;

    try {
      const sessions = await gameService.getUserSessions(authUser.id);
      setGameSessions(sessions.map(s => ({
        id: s.id,
        gameType: s.game_type as GameType,
        difficulty: s.difficulty as Difficulty,
        score: s.score,
        totalQuestions: s.total_questions,
        correctAnswers: s.correct_answers,
        timeSpent: s.time_spent,
        xpEarned: s.xp_earned,
        completedAt: new Date(s.completed_at),
        questions: [], // Not stored in DB
      })));
    } catch (error) {
      console.error('Error refreshing sessions:', error);
    }
  }

  // Achievements
  async function refreshAchievements() {
    try {
      const [allAchievements, userAchs] = await Promise.all([
        achievementService.getAllAchievements(),
        authUser ? achievementService.getUserAchievements(authUser.id) : Promise.resolve([]),
      ]);

      setAchievements(allAchievements.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        icon: a.icon,
        unlocked: userAchs.some(ua => ua.achievement_id === a.id),
        unlockedAt: userAchs.find(ua => ua.achievement_id === a.id)?.unlocked_at,
        xpReward: a.xp_reward,
      })));

      setUserAchievements(userAchs);
    } catch (error) {
      console.error('Error refreshing achievements:', error);
    }
  }

  async function unlockAchievement(achievementId: string) {
    if (!authUser) return;

    try {
      const unlocked = await achievementService.unlockAchievement(authUser.id, achievementId);
      if (unlocked) {
        await refreshAchievements();
        toast.success(`¡Logro desbloqueado: ${unlocked.achievement.title}!`);
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  }

  // Rewards
  async function refreshRewards() {
    try {
      const [allRewards, userRwds] = await Promise.all([
        rewardService.getAllRewards(),
        authUser ? rewardService.getUserRewards(authUser.id) : Promise.resolve([]),
      ]);

      setRewards(allRewards.map(r => ({
        id: r.id,
        title: r.title,
        description: r.description,
        category: r.category,
        xpCost: r.xp_cost,
        imageUrl: r.image_url,
        redeemed: userRwds.some(ur => ur.reward_id === r.id),
      })));

      setUserRewards(userRwds);
    } catch (error) {
      console.error('Error refreshing rewards:', error);
    }
  }

  async function redeemReward(rewardId: string) {
    if (!authUser || !profile) return;

    try {
      const reward = rewards.find(r => r.id === rewardId);
      if (!reward) throw new Error('Reward not found');

      await rewardService.redeemReward(authUser.id, rewardId, profile.xp);
      
      // Deduct XP
      await profileService.updateXP(authUser.id, -reward.xpCost);
      
      await refreshRewards();
      await refreshProfileData();
      
      toast.success(`¡Recompensa canjeada: ${reward.title}!`);
    } catch (error: any) {
      console.error('Error redeeming reward:', error);
      toast.error(error.message || 'Error al canjear recompensa');
      throw error;
    }
  }

  // Resources
  async function refreshResources() {
    try {
      const allResources = await resourceService.getAllResources();
      setResources(allResources.map(r => ({
        id: r.id,
        title: r.title,
        description: r.description,
        category: r.category,
        url: r.url,
        icon: r.icon || 'ExternalLink',
      })));
    } catch (error) {
      console.error('Error refreshing resources:', error);
    }
  }

  // Profile updates
  async function updateUserXP(xp: number) {
    if (!authUser) return;

    try {
      await profileService.updateXP(authUser.id, xp);
      await refreshProfileData();
    } catch (error) {
      console.error('Error updating XP:', error);
      throw error;
    }
  }

  async function updateStreak() {
    if (!authUser) return;

    try {
      await profileService.updateStreak(authUser.id);
      await refreshProfileData();
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }

  const value: AppContextType = {
    user,
    loading: authLoading || loading,
    signIn,
    signUp,
    signOut,
    currentPage,
    setCurrentPage,
    gameSessions,
    addGameSession,
    refreshSessions,
    achievements,
    userAchievements,
    unlockAchievement,
    refreshAchievements,
    rewards,
    userRewards,
    redeemReward,
    refreshRewards,
    resources,
    refreshResources,
    updateUserXP,
    updateStreak,
    refreshProfile: refreshProfileData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within a SupabaseAppProvider');
  }
  return context;
}
