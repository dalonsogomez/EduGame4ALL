import { AIFeedback, Emotion, Difficulty, GameSession } from '../types';

/**
 * Simula un agente de IA educativo que analiza respuestas y proporciona feedback personalizado
 * En producción, esto se conectaría a Llama-3.1-8B via LangChain
 */

// Simula detección de emociones basada en el rendimiento
export function detectEmotion(correctAnswers: number, totalQuestions: number, timeSpent: number): Emotion {
  const accuracy = correctAnswers / totalQuestions;
  const avgTimePerQuestion = timeSpent / totalQuestions;

  // Frustración: bajo rendimiento y mucho tiempo
  if (accuracy < 0.4 && avgTimePerQuestion > 30) {
    return 'frustrated';
  }

  // Confusión: rendimiento medio-bajo y tiempo variable
  if (accuracy >= 0.4 && accuracy < 0.6) {
    return 'confused';
  }

  // Feliz: buen rendimiento y tiempo razonable
  if (accuracy >= 0.8) {
    return 'happy';
  }

  // Motivado: mejorando
  if (accuracy >= 0.6 && accuracy < 0.8) {
    return 'motivated';
  }

  return 'neutral';
}

// Simula análisis de patrones de errores
export function analyzeMistakePatterns(questions: any[], userAnswers: number[]): string[] {
  const patterns: string[] = [];
  
  // Analiza tipos de errores comunes
  const incorrectIndices = userAnswers
    .map((answer, idx) => ({ 
      answer, 
      idx, 
      correct: questions[idx]?.correctAnswer 
    }))
    .filter(item => item.correct !== undefined && item.answer !== item.correct);

  if (incorrectIndices.length > 0) {
    // Detecta si hay confusión en vocabulario básico
    const basicVocabErrors = incorrectIndices.filter(item => 
      questions[item.idx] && questions[item.idx].difficulty === 'beginner'
    );
    if (basicVocabErrors.length > 0) {
      patterns.push('basic_vocabulary');
    }

    // Detecta problemas con contexto cultural
    const culturalErrors = incorrectIndices.filter(item =>
      questions[item.idx] && questions[item.idx].type === 'culture'
    );
    if (culturalErrors.length > 1) {
      patterns.push('cultural_context');
    }

    // Detecta dificultades con soft skills avanzadas
    const softSkillsErrors = incorrectIndices.filter(item =>
      questions[item.idx] && 
      questions[item.idx].type === 'soft-skills' && 
      questions[item.idx].difficulty === 'advanced'
    );
    if (softSkillsErrors.length > 0) {
      patterns.push('advanced_soft_skills');
    }
  }

  return patterns;
}

// Simula adaptación de dificultad (similar a LangChain ReAct Agent)
export function suggestNextDifficulty(
  currentDifficulty: Difficulty,
  accuracy: number,
  sessions: GameSession[]
): Difficulty {
  // Analiza tendencia de últimas sesiones
  const recentSessions = sessions.slice(-3);
  const avgRecentAccuracy = recentSessions.length > 0
    ? recentSessions.reduce((sum, s) => sum + (s.correctAnswers / s.totalQuestions), 0) / recentSessions.length
    : accuracy;

  // Lógica de adaptación
  if (avgRecentAccuracy >= 0.85 && currentDifficulty === 'beginner') {
    return 'intermediate';
  }
  
  if (avgRecentAccuracy >= 0.85 && currentDifficulty === 'intermediate') {
    return 'advanced';
  }

  if (avgRecentAccuracy < 0.5 && currentDifficulty === 'advanced') {
    return 'intermediate';
  }

  if (avgRecentAccuracy < 0.5 && currentDifficulty === 'intermediate') {
    return 'beginner';
  }

  return currentDifficulty;
}

// Genera feedback personalizado usando plantillas (simula Llama-3.1-8B)
export function generateAIFeedback(
  session: Partial<GameSession>,
  emotion: Emotion,
  suggestedDifficulty: Difficulty,
  mistakePatterns: string[]
): AIFeedback {
  const accuracy = session.correctAnswers! / session.totalQuestions!;
  
  let message = '';
  let encouragement = '';
  let nextSteps: string[] = [];

  // Mensajes adaptados a la emoción detectada
  switch (emotion) {
    case 'frustrated':
      message = 'Noto que este ejercicio fue desafiante. Recuerda que aprender requiere tiempo y todos avanzamos a nuestro ritmo. ¡No te rindas!';
      encouragement = '💪 Cada error es una oportunidad de aprendizaje. ¡Vamos a intentar algo más adecuado a tu nivel!';
      nextSteps = [
        'Revisar los conceptos básicos en modo práctica',
        'Intentar ejercicios más sencillos para ganar confianza',
        'Tomar un descanso breve y volver con energía renovada'
      ];
      break;

    case 'confused':
      message = `Has acertado ${session.correctAnswers} de ${session.totalQuestions} preguntas. Parece que algunos conceptos necesitan refuerzo.`;
      encouragement = '🤔 La confusión es parte del proceso de aprendizaje. Vamos a aclarar estos conceptos juntos.';
      nextSteps = [
        'Repasar las explicaciones de las respuestas incorrectas',
        'Practicar con ejemplos similares',
        'Consultar el material de apoyo en el centro de recursos'
      ];
      break;

    case 'happy':
      message = `¡Excelente trabajo! Has acertado ${session.correctAnswers} de ${session.totalQuestions} preguntas. Tu dominio del tema es impresionante.`;
      encouragement = '🌟 ¡Estás brillando! Tu esfuerzo está dando grandes resultados.';
      nextSteps = [
        'Probar ejercicios de nivel superior para seguir creciendo',
        'Ayudar a otros estudiantes compartiendo lo que has aprendido',
        'Explorar temas relacionados que puedan interesarte'
      ];
      break;

    case 'motivated':
      message = `¡Buen progreso! Has conseguido ${session.correctAnswers} respuestas correctas. Vas por el camino correcto.`;
      encouragement = '🚀 Tu dedicación está marcando la diferencia. ¡Sigue así!';
      nextSteps = [
        'Continuar practicando para consolidar estos conocimientos',
        'Identificar áreas específicas donde puedes mejorar',
        'Mantener tu racha diaria de aprendizaje'
      ];
      break;

    default:
      message = `Has completado el ejercicio con ${session.correctAnswers} de ${session.totalQuestions} respuestas correctas.`;
      encouragement = '✅ Cada sesión de práctica te acerca más a tus objetivos.';
      nextSteps = [
        'Revisar las respuestas para consolidar el aprendizaje',
        'Continuar con ejercicios similares',
        'Explorar otros módulos disponibles'
      ];
  }

  // Añadir recomendaciones específicas basadas en patrones de errores
  if (mistakePatterns.includes('basic_vocabulary')) {
    nextSteps.unshift('Reforzar vocabulario básico con ejercicios de práctica');
  }
  if (mistakePatterns.includes('cultural_context')) {
    nextSteps.push('Explorar recursos culturales en el centro de información');
  }
  if (mistakePatterns.includes('advanced_soft_skills')) {
    nextSteps.push('Practicar escenarios de soft skills con simulaciones interactivas');
  }

  return {
    message,
    emotion,
    suggestedDifficulty,
    encouragement,
    nextSteps: nextSteps.slice(0, 3), // Máximo 3 sugerencias
    confidence: Math.min(0.95, accuracy + 0.1) // Simula confidence score del modelo
  };
}

// Genera preguntas adaptativas (simula T5 Question Generation)
export function generateAdaptiveQuestion(
  topic: string,
  difficulty: Difficulty,
  userProfile: any
): string {
  // En producción, esto usaría T5-base-finetuned-question-generation
  const templates = {
    beginner: [
      `¿Cuál es la palabra correcta para "${topic}" en español?`,
      `En una situación de ${topic}, ¿qué dirías primero?`,
      `¿Cómo se dice "${topic}" correctamente?`
    ],
    intermediate: [
      `En el contexto de ${topic}, ¿cuál sería la respuesta más apropiada?`,
      `¿Cómo manejarías una situación relacionada con ${topic}?`,
      `¿Qué consideraciones culturales debes tener en cuenta con ${topic}?`
    ],
    advanced: [
      `Analiza la siguiente situación compleja de ${topic} y determina la mejor estrategia.`,
      `¿Cómo aplicarías principios de ${topic} en un entorno profesional?`,
      `Evalúa diferentes enfoques para resolver un problema de ${topic}.`
    ]
  };

  const options = templates[difficulty];
  return options[Math.floor(Math.random() * options.length)];
}

// Analiza texto para detectar emociones (simula DistilBERT Emotion)
export function analyzeTextEmotion(text: string): { emotion: string; score: number } {
  const lowerText = text.toLowerCase();
  
  // Palabras clave para cada emoción
  const emotionKeywords = {
    sadness: ['difícil', 'no entiendo', 'frustrado', 'imposible', 'no puedo', 'complicado'],
    joy: ['bien', 'genial', 'excelente', 'perfecto', 'me gusta', 'fácil'],
    anger: ['odio', 'molesto', 'enfadado', 'terrible', 'horrible'],
    fear: ['miedo', 'nervioso', 'preocupado', 'inseguro'],
    surprise: ['wow', 'increíble', 'sorprendente', 'no esperaba'],
    neutral: ['ok', 'bien', 'continuar']
  };

  // Busca coincidencias
  let maxScore = 0;
  let detectedEmotion = 'neutral';

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
    const score = matches / keywords.length;
    
    if (score > maxScore) {
      maxScore = score;
      detectedEmotion = emotion;
    }
  }

  return {
    emotion: detectedEmotion,
    score: Math.min(1, maxScore * 2 + 0.5) // Normaliza score
  };
}

// Calcula XP ganado basado en rendimiento y dificultad
export function calculateXP(
  correctAnswers: number,
  totalQuestions: number,
  difficulty: Difficulty,
  timeSpent: number
): number {
  const baseXP = {
    beginner: 10,
    intermediate: 20,
    advanced: 35
  };

  const accuracy = correctAnswers / totalQuestions;
  const difficultyMultiplier = baseXP[difficulty];
  
  // Bonificación por tiempo (más rápido = más XP, pero con límite razonable)
  const avgTimePerQuestion = timeSpent / totalQuestions;
  const speedBonus = avgTimePerQuestion < 15 ? 1.2 : avgTimePerQuestion < 25 ? 1.1 : 1.0;
  
  // Bonificación por precisión
  const accuracyBonus = accuracy >= 1.0 ? 1.5 : accuracy >= 0.8 ? 1.3 : accuracy >= 0.6 ? 1.1 : 1.0;

  const totalXP = Math.floor(
    difficultyMultiplier * totalQuestions * accuracyBonus * speedBonus
  );

  return totalXP;
}
