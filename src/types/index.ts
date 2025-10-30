export type UserType = 'child' | 'adult' | 'tutor';

export type Language = 'es' | 'en' | 'ar' | 'zh';

export type GameType = 'vocabulary' | 'culture' | 'soft-skills';

export type Emotion = 'happy' | 'frustrated' | 'confused' | 'motivated' | 'neutral';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type AgentActionType = 
  | 'recommend_game' 
  | 'suggest_resource' 
  | 'create_study_plan' 
  | 'adjust_difficulty'
  | 'encourage_user'
  | 'identify_weakness'
  | 'celebrate_achievement'
  | 'schedule_review';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  language: Language;
  profileCompleted: boolean;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  achievements: string[];
  profile?: UserProfile;
  knowledgeProfile?: KnowledgeProfile;
}

export interface UserProfile {
  currentLanguageLevel: Difficulty;
  culturalKnowledge: Difficulty;
  communicationSkills: Difficulty;
  personalSituation: string;
  learningGoals: string[];
  preferredTopics: string[];
}

// Sistema de conocimiento adaptativo
export interface KnowledgeProfile {
  skills: SkillAssessment[];
  strengths: string[];
  weaknesses: string[];
  learningVelocity: number; // Velocidad de aprendizaje (0-1)
  retentionRate: number; // Tasa de retención (0-1)
  preferredLearningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  masteryLevels: Record<string, number>; // Por tema, 0-100
  lastUpdated: string;
  totalInteractions: number;
}

export interface SkillAssessment {
  skillId: string;
  skillName: string;
  category: GameType;
  currentLevel: number; // 0-100
  confidence: number; // 0-1
  practiceCount: number;
  lastPracticed: string;
  progression: number[]; // Histórico de niveles
  estimatedMastery: Difficulty;
}

// Sistema de agente IA
export interface AgentAction {
  id: string;
  type: AgentActionType;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  reasoning: string; // Por qué el agente recomienda esto
  metadata: Record<string, any>; // Datos específicos de la acción
  createdAt: string;
  completed: boolean;
  effectiveness?: number; // Si el usuario siguió la acción, qué tan efectiva fue (0-1)
}

export interface AgentInsight {
  id: string;
  type: 'pattern' | 'recommendation' | 'warning' | 'celebration';
  message: string;
  data: Record<string, any>;
  confidence: number;
  createdAt: string;
  dismissed: boolean;
}

export interface StudyPlan {
  id: string;
  userId: string;
  goals: string[];
  duration: number; // días
  dailyTasks: DailyTask[];
  adaptiveAdjustments: string[]; // Historial de ajustes automáticos
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
}

export interface DailyTask {
  id: string;
  day: number;
  gameType: GameType;
  difficulty: Difficulty;
  topic: string;
  estimatedDuration: number; // minutos
  completed: boolean;
  performance?: number; // 0-100
}

export interface GameSession {
  id: string;
  userId: string;
  gameType: GameType;
  difficulty: Difficulty;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  mistakesPattern: string[];
  emotionDetected: Emotion;
  xpEarned: number;
  completedAt: string;
  skillsImpacted: string[]; // Qué habilidades se practicaron
  performanceScore: number; // 0-100
}

export interface Question {
  id: string;
  type: GameType;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  context?: string;
  skillsTested?: string[]; // Qué habilidades evalúa esta pregunta
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpRequired: number;
  unlocked: boolean;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  partner: string;
  imageUrl: string;
  available: boolean;
}

export interface AIFeedback {
  message: string;
  emotion: Emotion;
  suggestedDifficulty: Difficulty;
  encouragement: string;
  nextSteps: string[];
  confidence: number;
  agentActions?: AgentAction[]; // Acciones que el agente sugiere
  insights?: AgentInsight[]; // Insights del agente
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'job' | 'grant' | 'community' | 'news';
  url: string;
  date: string;
  relevant: boolean;
}
