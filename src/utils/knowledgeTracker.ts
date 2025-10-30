import { KnowledgeProfile, SkillAssessment, GameSession, GameType, Difficulty } from '../types';

/**
 * Sistema de seguimiento de conocimiento adaptativo
 * Rastrea y actualiza el perfil de habilidades del usuario basado en su rendimiento
 */

// Inicializa un perfil de conocimiento para un nuevo usuario
export function initializeKnowledgeProfile(): KnowledgeProfile {
  const skills: SkillAssessment[] = [
    // Vocabulario
    { skillId: 'vocab-basic', skillName: 'Vocabulario Básico', category: 'vocabulary', currentLevel: 20, confidence: 0.3, practiceCount: 0, lastPracticed: new Date().toISOString(), progression: [20], estimatedMastery: 'beginner' },
    { skillId: 'vocab-daily', skillName: 'Vocabulario Cotidiano', category: 'vocabulary', currentLevel: 15, confidence: 0.2, practiceCount: 0, lastPracticed: new Date().toISOString(), progression: [15], estimatedMastery: 'beginner' },
    { skillId: 'vocab-advanced', skillName: 'Vocabulario Avanzado', category: 'vocabulary', currentLevel: 5, confidence: 0.1, practiceCount: 0, lastPracticed: new Date().toISOString(), progression: [5], estimatedMastery: 'beginner' },
    
    // Cultura
    { skillId: 'culture-customs', skillName: 'Costumbres Locales', category: 'culture', currentLevel: 10, confidence: 0.2, practiceCount: 0, lastPracticed: new Date().toISOString(), progression: [10], estimatedMastery: 'beginner' },
    { skillId: 'culture-social', skillName: 'Normas Sociales', category: 'culture', currentLevel: 8, confidence: 0.15, practiceCount: 0, lastPracticed: new Date().toISOString(), progression: [8], estimatedMastery: 'beginner' },
    { skillId: 'culture-history', skillName: 'Historia y Tradiciones', category: 'culture', currentLevel: 5, confidence: 0.1, practiceCount: 0, lastPracticed: new Date().toISOString(), progression: [5], estimatedMastery: 'beginner' },
    
    // Habilidades blandas
    { skillId: 'soft-communication', skillName: 'Comunicación', category: 'soft-skills', currentLevel: 25, confidence: 0.4, practiceCount: 0, lastPracticed: new Date().toISOString(), progression: [25], estimatedMastery: 'beginner' },
    { skillId: 'soft-teamwork', skillName: 'Trabajo en Equipo', category: 'soft-skills', currentLevel: 20, confidence: 0.3, practiceCount: 0, lastPracticed: new Date().toISOString(), progression: [20], estimatedMastery: 'beginner' },
    { skillId: 'soft-leadership', skillName: 'Liderazgo', category: 'soft-skills', currentLevel: 10, confidence: 0.2, practiceCount: 0, lastPracticed: new Date().toISOString(), progression: [10], estimatedMastery: 'beginner' },
  ];

  return {
    skills,
    strengths: [],
    weaknesses: ['vocab-advanced', 'culture-history'],
    learningVelocity: 0.5,
    retentionRate: 0.7,
    preferredLearningStyle: 'mixed',
    masteryLevels: {},
    lastUpdated: new Date().toISOString(),
    totalInteractions: 0
  };
}

// Actualiza el perfil de conocimiento después de una sesión de juego
export function updateKnowledgeFromSession(
  profile: KnowledgeProfile,
  session: GameSession
): KnowledgeProfile {
  const performance = (session.correctAnswers / session.totalQuestions) * 100;
  const timePerQuestion = session.timeSpent / session.totalQuestions;
  
  // Factores que afectan el aprendizaje
  const speedFactor = calculateSpeedFactor(timePerQuestion);
  const accuracyFactor = performance / 100;
  const learningImpact = (accuracyFactor * 0.7) + (speedFactor * 0.3);

  // Actualizar habilidades relacionadas con esta sesión
  const updatedSkills = profile.skills.map(skill => {
    if (skill.category === session.gameType) {
      // Calcular nuevo nivel basado en rendimiento
      const levelChange = calculateLevelChange(
        skill.currentLevel,
        performance,
        session.difficulty,
        skill.practiceCount
      );

      const newLevel = Math.min(100, Math.max(0, skill.currentLevel + levelChange));
      const newProgression = [...skill.progression, newLevel];
      const newConfidence = calculateConfidence(newProgression, skill.practiceCount + 1);

      return {
        ...skill,
        currentLevel: newLevel,
        confidence: newConfidence,
        practiceCount: skill.practiceCount + 1,
        lastPracticed: new Date().toISOString(),
        progression: newProgression.slice(-10), // Mantener últimas 10 sesiones
        estimatedMastery: estimateMasteryLevel(newLevel)
      };
    }
    return skill;
  });

  // Calcular velocidad de aprendizaje
  const newLearningVelocity = calculateLearningVelocity(profile, learningImpact);

  // Calcular tasa de retención
  const newRetentionRate = calculateRetentionRate(profile, updatedSkills);

  // Identificar fortalezas y debilidades
  const { strengths, weaknesses } = identifyStrengthsAndWeaknesses(updatedSkills);

  // Actualizar niveles de maestría por tema
  const masteryLevels = { ...profile.masteryLevels };
  masteryLevels[session.gameType] = calculateCategoryMastery(
    updatedSkills.filter(s => s.category === session.gameType)
  );

  return {
    ...profile,
    skills: updatedSkills,
    strengths,
    weaknesses,
    learningVelocity: newLearningVelocity,
    retentionRate: newRetentionRate,
    masteryLevels,
    lastUpdated: new Date().toISOString(),
    totalInteractions: profile.totalInteractions + 1
  };
}

// Actualiza el perfil basado en interacciones con el chat de IA
export function updateKnowledgeFromChat(
  profile: KnowledgeProfile,
  topic: string,
  emotionDetected: string
): KnowledgeProfile {
  // El chat puede indicar áreas de interés o preocupación
  const updatedSkills = profile.skills.map(skill => {
    if (skill.skillName.toLowerCase().includes(topic.toLowerCase())) {
      // Pequeño ajuste de confianza basado en interacción
      const confidenceAdjust = emotionDetected === 'joy' ? 0.05 : 
                              emotionDetected === 'sadness' ? -0.05 : 0;
      
      return {
        ...skill,
        confidence: Math.min(1, Math.max(0, skill.confidence + confidenceAdjust)),
        lastPracticed: new Date().toISOString()
      };
    }
    return skill;
  });

  return {
    ...profile,
    skills: updatedSkills,
    lastUpdated: new Date().toISOString(),
    totalInteractions: profile.totalInteractions + 1
  };
}

// Calcula cambio de nivel basado en rendimiento y contexto
function calculateLevelChange(
  currentLevel: number,
  performance: number,
  difficulty: Difficulty,
  practiceCount: number
): number {
  const difficultyMultiplier = {
    beginner: 1.0,
    intermediate: 1.3,
    advanced: 1.6
  };

  // Factor de práctica: más práctica = cambios más pequeños (curva de aprendizaje)
  const practiceFactor = 1 / (1 + practiceCount * 0.05);

  // Factor de dificultad actual
  const levelFactor = currentLevel < 30 ? 1.2 : currentLevel < 70 ? 1.0 : 0.8;

  let baseChange = 0;
  
  if (performance >= 90) {
    baseChange = 8;
  } else if (performance >= 80) {
    baseChange = 6;
  } else if (performance >= 70) {
    baseChange = 4;
  } else if (performance >= 60) {
    baseChange = 2;
  } else if (performance >= 50) {
    baseChange = 1;
  } else {
    baseChange = -2;
  }

  return baseChange * difficultyMultiplier[difficulty] * practiceFactor * levelFactor;
}

// Calcula la confianza basada en la consistencia del progreso
function calculateConfidence(progression: number[], practiceCount: number): number {
  if (progression.length < 2) return 0.3;

  // Calcular varianza en el progreso
  const recent = progression.slice(-5);
  const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
  const variance = recent.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / recent.length;
  const stdDev = Math.sqrt(variance);

  // Menor varianza = mayor confianza
  const consistencyScore = 1 - Math.min(1, stdDev / 50);

  // Más práctica = mayor confianza
  const experienceScore = Math.min(1, practiceCount / 20);

  // Nivel actual también afecta confianza
  const levelScore = mean / 100;

  return (consistencyScore * 0.4 + experienceScore * 0.3 + levelScore * 0.3);
}

// Estima el nivel de maestría basado en el nivel actual
function estimateMasteryLevel(level: number): Difficulty {
  if (level < 40) return 'beginner';
  if (level < 75) return 'intermediate';
  return 'advanced';
}

// Calcula factor de velocidad basado en tiempo por pregunta
function calculateSpeedFactor(timePerQuestion: number): number {
  // Rango óptimo: 10-20 segundos
  if (timePerQuestion < 10) return 0.8; // Demasiado rápido, posiblemente adivinando
  if (timePerQuestion <= 20) return 1.0; // Velocidad óptima
  if (timePerQuestion <= 30) return 0.9;
  if (timePerQuestion <= 45) return 0.7;
  return 0.5; // Muy lento
}

// Calcula la velocidad de aprendizaje basada en progreso reciente
function calculateLearningVelocity(profile: KnowledgeProfile, recentImpact: number): number {
  const currentVelocity = profile.learningVelocity;
  // Media móvil exponencial
  return currentVelocity * 0.7 + recentImpact * 0.3;
}

// Calcula tasa de retención comparando sesiones antiguas vs recientes
function calculateRetentionRate(profile: KnowledgeProfile, updatedSkills: SkillAssessment[]): number {
  let retentionSum = 0;
  let skillsWithHistory = 0;

  updatedSkills.forEach(skill => {
    if (skill.progression.length >= 3) {
      const oldest = skill.progression[0];
      const newest = skill.progression[skill.progression.length - 1];
      
      if (oldest > 0) {
        const retention = newest / oldest;
        retentionSum += Math.min(1.5, retention); // Cap at 1.5 para crecimiento
        skillsWithHistory++;
      }
    }
  });

  if (skillsWithHistory === 0) return profile.retentionRate;

  const newRetention = retentionSum / skillsWithHistory;
  // Media móvil
  return profile.retentionRate * 0.6 + (newRetention * 0.4);
}

// Identifica fortalezas y debilidades
function identifyStrengthsAndWeaknesses(skills: SkillAssessment[]): {
  strengths: string[];
  weaknesses: string[];
} {
  const sorted = [...skills].sort((a, b) => b.currentLevel - a.currentLevel);
  
  const strengths = sorted
    .filter(s => s.currentLevel >= 70 && s.confidence >= 0.6)
    .slice(0, 3)
    .map(s => s.skillId);

  const weaknesses = sorted
    .filter(s => s.currentLevel < 40 || s.confidence < 0.4)
    .reverse()
    .slice(0, 3)
    .map(s => s.skillId);

  return { strengths, weaknesses };
}

// Calcula maestría promedio de una categoría
function calculateCategoryMastery(skills: SkillAssessment[]): number {
  if (skills.length === 0) return 0;
  
  const totalMastery = skills.reduce((sum, skill) => {
    // Ponderar por confianza
    return sum + (skill.currentLevel * skill.confidence);
  }, 0);

  const totalConfidence = skills.reduce((sum, skill) => sum + skill.confidence, 0);
  
  return totalConfidence > 0 ? totalMastery / totalConfidence : 0;
}

// Obtiene recomendaciones de práctica basadas en el perfil
export function getRecommendedPracticeAreas(profile: KnowledgeProfile): {
  urgent: SkillAssessment[];
  recommended: SkillAssessment[];
  maintenance: SkillAssessment[];
} {
  const now = new Date();
  
  const urgent = profile.skills.filter(skill => {
    const daysSinceLastPractice = Math.floor(
      (now.getTime() - new Date(skill.lastPracticed).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return (
      skill.currentLevel < 30 || 
      (skill.confidence < 0.3 && daysSinceLastPractice > 3) ||
      profile.weaknesses.includes(skill.skillId)
    );
  });

  const recommended = profile.skills.filter(skill => {
    const daysSinceLastPractice = Math.floor(
      (now.getTime() - new Date(skill.lastPracticed).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return (
      skill.currentLevel >= 30 &&
      skill.currentLevel < 70 &&
      daysSinceLastPractice > 1 &&
      !urgent.includes(skill)
    );
  });

  const maintenance = profile.skills.filter(skill => {
    return (
      skill.currentLevel >= 70 &&
      !urgent.includes(skill) &&
      !recommended.includes(skill) &&
      profile.strengths.includes(skill.skillId)
    );
  });

  return { urgent, recommended, maintenance };
}

// Predice el rendimiento esperado en una sesión futura
export function predictPerformance(
  profile: KnowledgeProfile,
  gameType: GameType,
  difficulty: Difficulty
): number {
  const relevantSkills = profile.skills.filter(s => s.category === gameType);
  
  if (relevantSkills.length === 0) return 50;

  const avgLevel = relevantSkills.reduce((sum, s) => sum + s.currentLevel, 0) / relevantSkills.length;
  const avgConfidence = relevantSkills.reduce((sum, s) => sum + s.confidence, 0) / relevantSkills.length;

  const difficultyPenalty = {
    beginner: 0,
    intermediate: 15,
    advanced: 30
  };

  const predictedScore = avgLevel * avgConfidence - difficultyPenalty[difficulty];
  
  // Ajustar por velocidad de aprendizaje y retención
  const adjustment = (profile.learningVelocity + profile.retentionRate) / 2;
  
  return Math.max(20, Math.min(100, predictedScore * (0.8 + adjustment * 0.4)));
}
