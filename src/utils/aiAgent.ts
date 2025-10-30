import { 
  KnowledgeProfile, 
  AgentAction, 
  AgentInsight, 
  GameSession, 
  StudyPlan,
  DailyTask,
  GameType, 
  Difficulty,
  User 
} from '../types';
import { getRecommendedPracticeAreas, predictPerformance } from './knowledgeTracker';

/**
 * Sistema de Agente IA Avanzado
 * Va más allá de un simple chat: analiza, planifica, ejecuta acciones y se adapta
 */

// Analiza el progreso del usuario y genera acciones proactivas
export function analyzeAndGenerateActions(
  user: User,
  knowledgeProfile: KnowledgeProfile,
  recentSessions: GameSession[]
): AgentAction[] {
  const actions: AgentAction[] = [];

  // 1. Analizar racha y motivación
  const streakAction = analyzeStreak(user);
  if (streakAction) actions.push(streakAction);

  // 2. Analizar áreas débiles
  const weaknessActions = analyzeWeaknesses(knowledgeProfile);
  actions.push(...weaknessActions);

  // 3. Analizar patrones de práctica
  const practiceActions = analyzePracticePatterns(recentSessions, knowledgeProfile);
  actions.push(...practiceActions);

  // 4. Detectar estancamiento
  const stagnationAction = detectStagnation(knowledgeProfile, recentSessions);
  if (stagnationAction) actions.push(stagnationAction);

  // 5. Oportunidades de avance
  const advancementActions = identifyAdvancementOpportunities(knowledgeProfile);
  actions.push(...advancementActions);

  // 6. Revisar conocimiento antiguo
  const reviewActions = scheduleReviews(knowledgeProfile);
  actions.push(...reviewActions);

  // Ordenar por prioridad
  return actions.sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  }).slice(0, 5); // Top 5 acciones
}

// Analiza la racha del usuario
function analyzeStreak(user: User): AgentAction | null {
  if (user.streak === 0) {
    return {
      id: `action-${Date.now()}-streak-start`,
      type: 'encourage_user',
      priority: 'medium',
      title: 'Comienza tu racha de aprendizaje',
      description: 'Inicia una racha practicando hoy. ¡Los usuarios con rachas mejoran 3x más rápido!',
      reasoning: 'Usuario sin racha activa. Las rachas aumentan compromiso y resultados.',
      metadata: { targetStreak: 3 },
      createdAt: new Date().toISOString(),
      completed: false
    };
  } else if (user.streak >= 7 && user.streak < 14) {
    return {
      id: `action-${Date.now()}-streak-milestone`,
      type: 'celebrate_achievement',
      priority: 'low',
      title: '¡Una semana de dedicación!',
      description: `¡Increíble! Llevas ${user.streak} días consecutivos. Estás en el top 20% de usuarios.`,
      reasoning: 'Reconocer hitos de racha refuerza comportamiento positivo.',
      metadata: { streak: user.streak, milestone: 'week' },
      createdAt: new Date().toISOString(),
      completed: false
    };
  } else if (user.streak >= 30) {
    return {
      id: `action-${Date.now()}-streak-master`,
      type: 'celebrate_achievement',
      priority: 'medium',
      title: '🏆 ¡Maestro de la Constancia!',
      description: `${user.streak} días seguidos. Eres un ejemplo de dedicación. Has desbloqueado un cupón especial.`,
      reasoning: 'Usuario ha demostrado compromiso excepcional.',
      metadata: { streak: user.streak, milestone: 'month', reward: 'special_coupon' },
      createdAt: new Date().toISOString(),
      completed: false
    };
  }
  
  return null;
}

// Analiza debilidades y sugiere acciones
function analyzeWeaknesses(profile: KnowledgeProfile): AgentAction[] {
  const actions: AgentAction[] = [];
  const { urgent, recommended } = getRecommendedPracticeAreas(profile);

  // Áreas urgentes
  urgent.slice(0, 2).forEach(skill => {
    actions.push({
      id: `action-${Date.now()}-weakness-${skill.skillId}`,
      type: 'recommend_game',
      priority: 'high',
      title: `Reforzar: ${skill.skillName}`,
      description: `Tu nivel en ${skill.skillName} necesita atención (${Math.round(skill.currentLevel)}%). Te recomiendo practicar ahora.`,
      reasoning: `Habilidad crítica con nivel bajo (${skill.currentLevel}%) y confianza baja (${skill.confidence.toFixed(2)}).`,
      metadata: {
        skillId: skill.skillId,
        gameType: skill.category,
        difficulty: skill.estimatedMastery,
        estimatedImprovement: 15
      },
      createdAt: new Date().toISOString(),
      completed: false
    });
  });

  // Áreas recomendadas
  if (recommended.length > 0 && urgent.length === 0) {
    const skill = recommended[0];
    actions.push({
      id: `action-${Date.now()}-improve-${skill.skillId}`,
      type: 'recommend_game',
      priority: 'medium',
      title: `Mejorar: ${skill.skillName}`,
      description: `Estás progresando bien en ${skill.skillName}. ¡Sigamos avanzando!`,
      reasoning: `Habilidad en desarrollo con potencial de mejora. Nivel actual: ${skill.currentLevel}%.`,
      metadata: {
        skillId: skill.skillId,
        gameType: skill.category,
        difficulty: skill.estimatedMastery,
        estimatedImprovement: 10
      },
      createdAt: new Date().toISOString(),
      completed: false
    });
  }

  return actions;
}

// Analiza patrones de práctica
function analyzePracticePatterns(
  sessions: GameSession[],
  profile: KnowledgeProfile
): AgentAction[] {
  const actions: AgentAction[] = [];

  if (sessions.length === 0) {
    return [{
      id: `action-${Date.now()}-first-game`,
      type: 'recommend_game',
      priority: 'high',
      title: 'Comienza tu viaje de aprendizaje',
      description: 'Aún no has completado ningún juego. ¡Empecemos con algo sencillo!',
      reasoning: 'Usuario nuevo sin historial de sesiones.',
      metadata: {
        gameType: 'vocabulary',
        difficulty: 'beginner',
        suggested: true
      },
      createdAt: new Date().toISOString(),
      completed: false
    }];
  }

  // Detectar falta de diversidad
  const gameTypes = new Set(sessions.map(s => s.gameType));
  if (gameTypes.size === 1 && sessions.length >= 5) {
    const unusedTypes = (['vocabulary', 'culture', 'soft-skills'] as GameType[])
      .filter(t => !gameTypes.has(t));
    
    if (unusedTypes.length > 0) {
      actions.push({
        id: `action-${Date.now()}-diversity`,
        type: 'recommend_game',
        priority: 'medium',
        title: 'Diversifica tu aprendizaje',
        description: `Has practicado mucho ${sessions[0].gameType}. ¿Qué tal explorar ${unusedTypes[0]}?`,
        reasoning: 'Usuario se enfoca en una sola categoría. Diversificar mejora aprendizaje integral.',
        metadata: {
          gameType: unusedTypes[0],
          difficulty: 'beginner',
          reason: 'diversification'
        },
        createdAt: new Date().toISOString(),
        completed: false
      });
    }
  }

  // Detectar sesiones muy espaciadas
  const recentSessions = sessions.slice(-5);
  if (recentSessions.length >= 2) {
    const dates = recentSessions.map(s => new Date(s.completedAt).getTime());
    const avgGap = (dates[dates.length - 1] - dates[0]) / (dates.length - 1);
    const dayGap = avgGap / (1000 * 60 * 60 * 24);

    if (dayGap > 3) {
      actions.push({
        id: `action-${Date.now()}-frequency`,
        type: 'encourage_user',
        priority: 'medium',
        title: 'Practica más seguido',
        description: 'He notado que practicas cada varios días. La práctica diaria acelera tu progreso.',
        reasoning: `Intervalo promedio entre sesiones: ${dayGap.toFixed(1)} días. Recomendado: 1 día.`,
        metadata: {
          currentFrequency: dayGap,
          recommendedFrequency: 1,
          potentialImprovement: '2x'
        },
        createdAt: new Date().toISOString(),
        completed: false
      });
    }
  }

  return actions;
}

// Detecta estancamiento en el progreso
function detectStagnation(
  profile: KnowledgeProfile,
  recentSessions: GameSession[]
): AgentAction | null {
  const recentPerformances = recentSessions.slice(-5).map(s => 
    (s.correctAnswers / s.totalQuestions) * 100
  );

  if (recentPerformances.length >= 3) {
    const avgPerformance = recentPerformances.reduce((a, b) => a + b, 0) / recentPerformances.length;
    const variance = recentPerformances.reduce((sum, p) => 
      sum + Math.pow(p - avgPerformance, 2), 0
    ) / recentPerformances.length;

    // Si el rendimiento es consistentemente medio-bajo con poca variación
    if (avgPerformance < 65 && variance < 50) {
      return {
        id: `action-${Date.now()}-stagnation`,
        type: 'adjust_difficulty',
        priority: 'high',
        title: 'Ajustar estrategia de aprendizaje',
        description: 'Parece que has llegado a una meseta. Vamos a cambiar el enfoque.',
        reasoning: `Rendimiento estancado en ${avgPerformance.toFixed(0)}% con baja variación. Necesita cambio de estrategia.`,
        metadata: {
          avgPerformance,
          suggestion: 'lower_difficulty',
          alternativeApproach: 'different_game_type'
        },
        createdAt: new Date().toISOString(),
        completed: false
      };
    }
  }

  return null;
}

// Identifica oportunidades de avance
function identifyAdvancementOpportunities(profile: KnowledgeProfile): AgentAction[] {
  const actions: AgentAction[] = [];

  // Buscar habilidades listas para subir de nivel
  profile.skills.forEach(skill => {
    if (skill.currentLevel >= 75 && skill.confidence >= 0.7) {
      const nextDifficulty: Difficulty = 
        skill.estimatedMastery === 'beginner' ? 'intermediate' :
        skill.estimatedMastery === 'intermediate' ? 'advanced' : 'advanced';

      if (skill.estimatedMastery !== 'advanced') {
        actions.push({
          id: `action-${Date.now()}-advance-${skill.skillId}`,
          type: 'recommend_game',
          priority: 'medium',
          title: `¡Listo para el siguiente nivel!`,
          description: `Dominas ${skill.skillName}. Es hora de un desafío mayor.`,
          reasoning: `Habilidad con alto nivel (${skill.currentLevel}%) y confianza (${skill.confidence.toFixed(2)}). Listo para avanzar.`,
          metadata: {
            skillId: skill.skillId,
            gameType: skill.category,
            currentDifficulty: skill.estimatedMastery,
            suggestedDifficulty: nextDifficulty,
            readinessScore: (skill.currentLevel * skill.confidence) / 100
          },
          createdAt: new Date().toISOString(),
          completed: false
        });
      }
    }
  });

  return actions;
}

// Programa revisiones de conocimiento
function scheduleReviews(profile: KnowledgeProfile): AgentAction[] {
  const actions: AgentAction[] = [];
  const now = new Date();

  profile.skills.forEach(skill => {
    const daysSinceLastPractice = Math.floor(
      (now.getTime() - new Date(skill.lastPracticed).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Revisar habilidades no practicadas recientemente
    if (daysSinceLastPractice >= 7 && skill.currentLevel >= 50) {
      actions.push({
        id: `action-${Date.now()}-review-${skill.skillId}`,
        type: 'schedule_review',
        priority: daysSinceLastPractice >= 14 ? 'high' : 'medium',
        title: `Revisar: ${skill.skillName}`,
        description: `No has practicado ${skill.skillName} en ${daysSinceLastPractice} días. Una revisión rápida mantiene tu nivel.`,
        reasoning: `El conocimiento se degrada sin práctica. Última práctica hace ${daysSinceLastPractice} días.`,
        metadata: {
          skillId: skill.skillId,
          gameType: skill.category,
          difficulty: skill.estimatedMastery,
          daysSinceLastPractice,
          retentionRisk: daysSinceLastPractice / 30 // 0-1 scale
        },
        createdAt: new Date().toISOString(),
        completed: false
      });
    }
  });

  return actions;
}

// Genera insights basados en análisis profundo
export function generateInsights(
  user: User,
  profile: KnowledgeProfile,
  sessions: GameSession[]
): AgentInsight[] {
  const insights: AgentInsight[] = [];

  // Insight de progreso general
  if (sessions.length >= 10) {
    const recentSessions = sessions.slice(-10);
    const oldSessions = sessions.slice(0, Math.min(10, sessions.length - 10));
    
    if (oldSessions.length > 0) {
      const recentAvg = recentSessions.reduce((sum, s) => 
        sum + (s.correctAnswers / s.totalQuestions), 0
      ) / recentSessions.length;
      
      const oldAvg = oldSessions.reduce((sum, s) => 
        sum + (s.correctAnswers / s.totalQuestions), 0
      ) / oldSessions.length;

      const improvement = ((recentAvg - oldAvg) / oldAvg) * 100;

      if (improvement > 15) {
        insights.push({
          id: `insight-${Date.now()}-improvement`,
          type: 'celebration',
          message: `¡Tu rendimiento ha mejorado un ${improvement.toFixed(0)}%! Tu dedicación está dando frutos. 🌟`,
          data: { improvement, recentAvg, oldAvg },
          confidence: 0.9,
          createdAt: new Date().toISOString(),
          dismissed: false
        });
      } else if (improvement < -10) {
        insights.push({
          id: `insight-${Date.now()}-decline`,
          type: 'warning',
          message: `He notado que tu rendimiento ha bajado. ¿Necesitas un descanso o cambiar de estrategia?`,
          data: { decline: Math.abs(improvement), recentAvg, oldAvg },
          confidence: 0.85,
          createdAt: new Date().toISOString(),
          dismissed: false
        });
      }
    }
  }

  // Insight de velocidad de aprendizaje
  if (profile.learningVelocity > 0.7) {
    insights.push({
      id: `insight-${Date.now()}-fast-learner`,
      type: 'celebration',
      message: `¡Aprendes muy rápido! Estás en el top 25% de usuarios. Considera aumentar la dificultad.`,
      data: { learningVelocity: profile.learningVelocity },
      confidence: 0.8,
      createdAt: new Date().toISOString(),
      dismissed: false
    });
  }

  // Insight de retención
  if (profile.retentionRate < 0.6 && profile.totalInteractions > 15) {
    insights.push({
      id: `insight-${Date.now()}-retention`,
      type: 'recommendation',
      message: `Tu retención puede mejorar. Te sugiero sesiones más cortas pero más frecuentes.`,
      data: { retentionRate: profile.retentionRate },
      confidence: 0.75,
      createdAt: new Date().toISOString(),
      dismissed: false
    });
  }

  // Patrón de tiempo óptimo
  if (sessions.length >= 5) {
    const sessionsByHour: Record<number, number[]> = {};
    sessions.forEach(s => {
      const hour = new Date(s.completedAt).getHours();
      if (!sessionsByHour[hour]) sessionsByHour[hour] = [];
      sessionsByHour[hour].push((s.correctAnswers / s.totalQuestions) * 100);
    });

    let bestHour = -1;
    let bestPerformance = 0;
    
    Object.entries(sessionsByHour).forEach(([hour, performances]) => {
      if (performances.length >= 2) {
        const avg = performances.reduce((a, b) => a + b, 0) / performances.length;
        if (avg > bestPerformance) {
          bestPerformance = avg;
          bestHour = parseInt(hour);
        }
      }
    });

    if (bestHour !== -1) {
      insights.push({
        id: `insight-${Date.now()}-optimal-time`,
        type: 'pattern',
        message: `Rindes mejor alrededor de las ${bestHour}:00. ¿Intentas practicar a esa hora más seguido?`,
        data: { optimalHour: bestHour, performance: bestPerformance },
        confidence: 0.7,
        createdAt: new Date().toISOString(),
        dismissed: false
      });
    }
  }

  return insights;
}

// Crea un plan de estudio personalizado
export function createStudyPlan(
  user: User,
  profile: KnowledgeProfile,
  goals: string[],
  duration: number = 30
): StudyPlan {
  const dailyTasks: DailyTask[] = [];
  const { urgent, recommended, maintenance } = getRecommendedPracticeAreas(profile);

  // Distribuir tareas a lo largo de los días
  for (let day = 1; day <= duration; day++) {
    // Días 1-7: Enfoque en áreas urgentes
    if (day <= 7 && urgent.length > 0) {
      const skill = urgent[Math.floor(Math.random() * urgent.length)];
      dailyTasks.push({
        id: `task-${day}-1`,
        day,
        gameType: skill.category,
        difficulty: skill.estimatedMastery,
        topic: skill.skillName,
        estimatedDuration: 15,
        completed: false
      });
    }
    
    // Días 8-21: Mix de urgente y recomendado
    if (day > 7 && day <= 21) {
      const skills = [...urgent, ...recommended];
      if (skills.length > 0) {
        const skill = skills[Math.floor(Math.random() * skills.length)];
        dailyTasks.push({
          id: `task-${day}-1`,
          day,
          gameType: skill.category,
          difficulty: skill.estimatedMastery,
          topic: skill.skillName,
          estimatedDuration: 20,
          completed: false
        });
      }
    }

    // Días 22-30: Consolidación y mantenimiento
    if (day > 21) {
      const skills = [...recommended, ...maintenance];
      if (skills.length > 0) {
        const skill = skills[Math.floor(Math.random() * skills.length)];
        const nextDifficulty: Difficulty = 
          skill.estimatedMastery === 'beginner' ? 'intermediate' :
          skill.estimatedMastery === 'intermediate' ? 'advanced' : 'advanced';

        dailyTasks.push({
          id: `task-${day}-1`,
          day,
          gameType: skill.category,
          difficulty: skill.currentLevel >= 70 ? nextDifficulty : skill.estimatedMastery,
          topic: skill.skillName,
          estimatedDuration: 25,
          completed: false
        });
      }
    }

    // Cada 7 días: Revisión general
    if (day % 7 === 0) {
      const categories: GameType[] = ['vocabulary', 'culture', 'soft-skills'];
      const category = categories[Math.floor(day / 7) % 3];
      
      dailyTasks.push({
        id: `task-${day}-review`,
        day,
        gameType: category,
        difficulty: 'intermediate',
        topic: 'Revisión General',
        estimatedDuration: 30,
        completed: false
      });
    }
  }

  return {
    id: `plan-${user.id}-${Date.now()}`,
    userId: user.id,
    goals,
    duration,
    dailyTasks,
    adaptiveAdjustments: [`Plan creado el ${new Date().toLocaleDateString('es-ES')}`],
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// Ajusta el plan de estudio basado en progreso
export function adaptStudyPlan(
  plan: StudyPlan,
  profile: KnowledgeProfile,
  recentSessions: GameSession[]
): StudyPlan {
  const completedTasks = plan.dailyTasks.filter(t => t.completed);
  const avgPerformance = completedTasks
    .filter(t => t.performance !== undefined)
    .reduce((sum, t) => sum + (t.performance || 0), 0) / completedTasks.length;

  const adjustments: string[] = [...plan.adaptiveAdjustments];

  // Si el rendimiento es muy alto, aumentar dificultad
  if (avgPerformance > 85 && completedTasks.length >= 5) {
    plan.dailyTasks = plan.dailyTasks.map(task => {
      if (!task.completed && task.difficulty === 'beginner') {
        adjustments.push(`Día ${task.day}: Dificultad aumentada de beginner a intermediate`);
        return { ...task, difficulty: 'intermediate' as Difficulty };
      }
      if (!task.completed && task.difficulty === 'intermediate') {
        adjustments.push(`Día ${task.day}: Dificultad aumentada de intermediate a advanced`);
        return { ...task, difficulty: 'advanced' as Difficulty };
      }
      return task;
    });
  }

  // Si el rendimiento es bajo, reducir dificultad
  if (avgPerformance < 50 && completedTasks.length >= 5) {
    plan.dailyTasks = plan.dailyTasks.map(task => {
      if (!task.completed && task.difficulty === 'advanced') {
        adjustments.push(`Día ${task.day}: Dificultad reducida de advanced a intermediate`);
        return { ...task, difficulty: 'intermediate' as Difficulty };
      }
      if (!task.completed && task.difficulty === 'intermediate') {
        adjustments.push(`Día ${task.day}: Dificultad reducida de intermediate a beginner`);
        return { ...task, difficulty: 'beginner' as Difficulty };
      }
      return task;
    });
  }

  const progress = (completedTasks.length / plan.dailyTasks.length) * 100;

  return {
    ...plan,
    adaptiveAdjustments: adjustments,
    progress,
    updatedAt: new Date().toISOString()
  };
}

// Función para que el agente responda en el chat con acciones
export function getAgentChatResponse(
  userMessage: string,
  user: User,
  profile: KnowledgeProfile,
  sessions: GameSession[]
): {
  message: string;
  actions: AgentAction[];
  insights: AgentInsight[];
} {
  const lowercaseMessage = userMessage.toLowerCase();
  
  // El agente puede realizar análisis profundos basados en la consulta
  if (lowercaseMessage.includes('plan') || lowercaseMessage.includes('estudiar')) {
    const studyPlan = createStudyPlan(user, profile, ['Mejorar habilidades generales'], 14);
    const nextTask = studyPlan.dailyTasks[0];
    
    return {
      message: `He creado un plan de estudio personalizado de 14 días para ti. Basándome en tu perfil, te sugiero empezar con ${nextTask.topic} (${nextTask.difficulty}). El plan se adaptará automáticamente según tu progreso.\n\n📅 **Plan destacado:**\n- Duración: 14 días\n- Tareas diarias: 1-2 ejercicios (15-25 min)\n- Revisiones semanales incluidas\n\n¿Quieres ver el plan completo?`,
      actions: [{
        id: `action-${Date.now()}-view-plan`,
        type: 'create_study_plan',
        priority: 'high',
        title: 'Ver Plan de Estudio Completo',
        description: 'Accede a tu plan personalizado de 14 días',
        reasoning: 'Usuario solicitó plan de estudio',
        metadata: { studyPlan },
        createdAt: new Date().toISOString(),
        completed: false
      }],
      insights: []
    };
  }

  // Análisis de progreso
  if (lowercaseMessage.includes('progreso') || lowercaseMessage.includes('análisis')) {
    const insights = generateInsights(user, profile, sessions);
    const actions = analyzeAndGenerateActions(user, profile, sessions);

    const strongestSkill = profile.skills.reduce((prev, curr) => 
      prev.currentLevel > curr.currentLevel ? prev : curr
    );
    
    const weakestSkill = profile.skills.reduce((prev, curr) => 
      prev.currentLevel < curr.currentLevel ? prev : curr
    );

    return {
      message: `He analizado tu progreso en profundidad. Aquí está mi evaluación:\n\n📊 **Análisis Completo:**\n\n**Fortaleza principal:** ${strongestSkill.skillName} (${Math.round(strongestSkill.currentLevel)}%)\n**Área de mejora:** ${weakestSkill.skillName} (${Math.round(weakestSkill.currentLevel)}%)\n\n**Velocidad de aprendizaje:** ${(profile.learningVelocity * 100).toFixed(0)}%\n**Tasa de retención:** ${(profile.retentionRate * 100).toFixed(0)}%\n**Total de interacciones:** ${profile.totalInteractions}\n\nTengo ${actions.length} recomendaciones específicas para ti basadas en este análisis. ¿Quieres verlas?`,
      actions: actions.slice(0, 3),
      insights
    };
  }

  // Predicción de rendimiento
  if (lowercaseMessage.includes('predic') || lowercaseMessage.includes('esperar')) {
    const predictions = (['vocabulary', 'culture', 'soft-skills'] as GameType[]).map(gameType => {
      const pred = predictPerformance(profile, gameType, 'intermediate');
      return { gameType, prediction: pred };
    });

    const best = predictions.reduce((prev, curr) => 
      prev.prediction > curr.prediction ? prev : curr
    );

    return {
      message: `Basándome en tu perfil de conocimiento, he calculado tus rendimientos esperados:\n\n🎯 **Predicciones (nivel intermedio):**\n\n- Vocabulario: ${predictions[0].prediction.toFixed(0)}%\n- Cultura: ${predictions[1].prediction.toFixed(0)}%\n- Habilidades Blandas: ${predictions[2].prediction.toFixed(0)}%\n\nTu mejor área predicha es **${best.gameType}**. Te recomendaría empezar por ahí para ganar confianza.`,
      actions: [{
        id: `action-${Date.now()}-best-pred`,
        type: 'recommend_game',
        priority: 'medium',
        title: `Jugar ${best.gameType}`,
        description: 'Área con mejor rendimiento predicho',
        reasoning: `Predicción de ${best.prediction.toFixed(0)}% de éxito`,
        metadata: {
          gameType: best.gameType,
          difficulty: 'intermediate',
          predictedScore: best.prediction
        },
        createdAt: new Date().toISOString(),
        completed: false
      }],
      insights: []
    };
  }

  // Ayuda general
  return {
    message: `Como tu agente de IA, puedo ayudarte de muchas formas:\n\n🤖 **Capacidades del Agente:**\n\n1. **Análisis profundo** - "Analiza mi progreso"\n2. **Planes de estudio** - "Crea un plan para mí"\n3. **Predicciones** - "¿Cómo me irá en vocabulario?"\n4. **Recomendaciones proactivas** - Siempre activas\n5. **Adaptación dinámica** - Ajusto contenido automáticamente\n6. **Detección de patrones** - Identifico áreas de mejora\n\n¿Qué te gustaría que hiciera por ti?`,
    actions: analyzeAndGenerateActions(user, profile, sessions).slice(0, 2),
    insights: generateInsights(user, profile, sessions).slice(0, 2)
  };
}
