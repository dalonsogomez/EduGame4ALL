import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  GameSession, 
  Achievement, 
  Reward, 
  Resource, 
  AIFeedback,
  KnowledgeProfile,
  AgentAction,
  AgentInsight,
  StudyPlan
} from '../types';
import { mockAchievements, mockRewards, mockResources } from '../data/mockData';
import { 
  initializeKnowledgeProfile, 
  updateKnowledgeFromSession,
  updateKnowledgeFromChat 
} from '../utils/knowledgeTracker';
import { analyzeAndGenerateActions, generateInsights } from '../utils/aiAgent';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  gameSessions: GameSession[];
  addGameSession: (session: GameSession) => void;
  achievements: Achievement[];
  rewards: Reward[];
  resources: Resource[];
  updateUserXP: (xp: number) => void;
  unlockAchievement: (achievementId: string) => void;
  redeemReward: (rewardId: string) => void;
  updateStreak: () => void;
  agentActions: AgentAction[];
  agentInsights: AgentInsight[];
  updateKnowledgeProfile: (session: GameSession) => void;
  updateKnowledgeFromChatInteraction: (topic: string, emotion: string) => void;
  refreshAgentData: () => void;
  dismissAction: (actionId: string) => void;
  dismissInsight: (insightId: string) => void;
  currentStudyPlan: StudyPlan | null;
  setCurrentStudyPlan: (plan: StudyPlan | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [rewards, setRewards] = useState<Reward[]>(mockRewards);
  const [resources] = useState<Resource[]>(mockResources);
  const [agentActions, setAgentActions] = useState<AgentAction[]>([]);
  const [agentInsights, setAgentInsights] = useState<AgentInsight[]>([]);
  const [currentStudyPlan, setCurrentStudyPlan] = useState<StudyPlan | null>(null);

  const addGameSession = (session: GameSession) => {
    setGameSessions(prev => {
      const newSessions = [...prev, session];
      
      // Verificar logros basados en número de juegos
      if (newSessions.length === 1) {
        setTimeout(() => unlockAchievement('first_game'), 100);
      } else if (newSessions.length === 10) {
        setTimeout(() => unlockAchievement('ten_games'), 100);
      }
      
      // Verificar logros basados en tipo de juego
      const vocabularyGames = newSessions.filter(s => s.gameType === 'vocabulary').length;
      if (vocabularyGames === 20) {
        setTimeout(() => unlockAchievement('language_master'), 100);
      }
      
      return newSessions;
    });
    
    // Actualizar perfil de conocimiento automáticamente
    if (user?.knowledgeProfile) {
      updateKnowledgeProfile(session);
    }
  };

  const updateUserXP = (xp: number) => {
    if (!user) return;
    
    setUser(prevUser => {
      if (!prevUser) return null;
      
      const newXP = prevUser.xp + xp;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      // Check for achievement unlocks después de actualizar
      setTimeout(() => checkAchievementUnlocks(newXP, newLevel), 0);
      
      return {
        ...prevUser,
        xp: newXP,
        level: newLevel
      };
    });
  };

  const checkAchievementUnlocks = (xp: number, level: number) => {
    setAchievements(prev => {
      const toUnlock: string[] = [];
      
      const updated = prev.map(achievement => {
        if (!achievement.unlocked && xp >= achievement.xpRequired) {
          toUnlock.push(achievement.id);
          return { ...achievement, unlocked: true };
        }
        return achievement;
      });
      
      // Actualizar logros del usuario si hay logros nuevos
      if (toUnlock.length > 0) {
        setUser(prevUser => {
          if (!prevUser) return null;
          
          const newAchievements = [...prevUser.achievements];
          toUnlock.forEach(id => {
            if (!newAchievements.includes(id)) {
              newAchievements.push(id);
            }
          });
          
          return {
            ...prevUser,
            achievements: newAchievements
          };
        });
      }
      
      return updated;
    });
  };

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => prev.map(achievement => 
      achievement.id === achievementId ? { ...achievement, unlocked: true } : achievement
    ));
    
    setUser(prevUser => {
      if (!prevUser || prevUser.achievements.includes(achievementId)) return prevUser;
      
      return {
        ...prevUser,
        achievements: [...prevUser.achievements, achievementId]
      };
    });
  };

  const redeemReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    setUser(prevUser => {
      if (!prevUser || prevUser.xp < reward.pointsCost) return prevUser;
      
      return {
        ...prevUser,
        xp: prevUser.xp - reward.pointsCost
      };
    });
  };

  const updateStreak = () => {
    setUser(prevUser => {
      if (!prevUser) return null;
      
      const today = new Date().toDateString();
      const lastActive = new Date(prevUser.lastActiveDate).toDateString();
      
      if (today !== lastActive) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        const newStreak = lastActive === yesterdayStr ? prevUser.streak + 1 : 1;
        
        // Verificar logro de racha de 7 días
        if (newStreak >= 7) {
          setTimeout(() => unlockAchievement('week_streak'), 100);
        }
        
        return {
          ...prevUser,
          streak: newStreak,
          lastActiveDate: new Date().toISOString()
        };
      }
      
      return prevUser;
    });
  };

  // Actualizar perfil de conocimiento después de una sesión
  const updateKnowledgeProfile = (session: GameSession) => {
    setUser(prevUser => {
      if (!prevUser || !prevUser.knowledgeProfile) return prevUser;
      
      const updatedProfile = updateKnowledgeFromSession(prevUser.knowledgeProfile, session);
      
      // Regenerar acciones e insights del agente después de actualizar
      setTimeout(() => refreshAgentData(), 0);
      
      return {
        ...prevUser,
        knowledgeProfile: updatedProfile
      };
    });
  };

  // Actualizar conocimiento desde interacciones con el chat
  const updateKnowledgeFromChatInteraction = (topic: string, emotion: string) => {
    setUser(prevUser => {
      if (!prevUser || !prevUser.knowledgeProfile) return prevUser;

      const updatedProfile = updateKnowledgeFromChat(prevUser.knowledgeProfile, topic, emotion);
      
      return {
        ...prevUser,
        knowledgeProfile: updatedProfile
      };
    });
  };

  // Refrescar datos del agente
  const refreshAgentData = () => {
    if (!user || !user.knowledgeProfile) return;

    const actions = analyzeAndGenerateActions(user, user.knowledgeProfile, gameSessions);
    const insights = generateInsights(user, user.knowledgeProfile, gameSessions);

    setAgentActions(actions);
    setAgentInsights(insights);
  };

  // Descartar una acción
  const dismissAction = (actionId: string) => {
    setAgentActions(prev => prev.filter(a => a.id !== actionId));
  };

  // Descartar un insight
  const dismissInsight = (insightId: string) => {
    setAgentInsights(prev => prev.map(i => 
      i.id === insightId ? { ...i, dismissed: true } : i
    ));
  };

  // Inicializar perfil de conocimiento cuando el usuario se registra
  useEffect(() => {
    if (user && !user.knowledgeProfile) {
      const knowledgeProfile = initializeKnowledgeProfile();
      setUser({
        ...user,
        knowledgeProfile
      });
      
      // Desbloquear logro de primer inicio de sesión
      setTimeout(() => unlockAchievement('first_login'), 500);
    }
  }, [user?.id]);

  // Refrescar datos del agente cuando cambien las sesiones o el perfil
  useEffect(() => {
    if (user?.knowledgeProfile && gameSessions.length > 0) {
      refreshAgentData();
    }
  }, [gameSessions.length, user?.knowledgeProfile?.lastUpdated]);

  useEffect(() => {
    if (user) {
      updateStreak();
    }
  }, [currentPage]);

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      currentPage,
      setCurrentPage,
      gameSessions,
      addGameSession,
      achievements,
      rewards,
      resources,
      updateUserXP,
      unlockAchievement,
      redeemReward,
      updateStreak,
      agentActions,
      agentInsights,
      updateKnowledgeProfile,
      updateKnowledgeFromChatInteraction,
      refreshAgentData,
      dismissAction,
      dismissInsight,
      currentStudyPlan,
      setCurrentStudyPlan
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
