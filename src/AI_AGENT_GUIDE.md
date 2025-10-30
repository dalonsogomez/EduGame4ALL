# Guía del Agente IA Avanzado y Sistema de Conocimiento Adaptativo

## 🤖 Descripción General

EduGame4ALL ahora incluye un **Agente de IA Avanzado** que va mucho más allá de un simple chatbot. El sistema combina análisis proactivo, aprendizaje adaptativo y acciones inteligentes para optimizar el aprendizaje de cada usuario.

## 🧠 Componentes Principales

### 1. Sistema de Conocimiento Adaptativo (`/utils/knowledgeTracker.ts`)

#### Perfil de Conocimiento (`KnowledgeProfile`)
```typescript
{
  skills: SkillAssessment[];           // 9 habilidades rastreadas
  strengths: string[];                  // Top 3 fortalezas
  weaknesses: string[];                 // Top 3 debilidades
  learningVelocity: number;             // 0-1: velocidad de aprendizaje
  retentionRate: number;                // 0-1: tasa de retención
  preferredLearningStyle: string;       // visual, auditory, kinesthetic, mixed
  masteryLevels: Record<string, number>; // Maestría por categoría
  lastUpdated: string;
  totalInteractions: number;
}
```

#### Evaluación de Habilidades (`SkillAssessment`)
Cada habilidad rastrea:
- **Nivel actual** (0-100%): Progresión de maestría
- **Confianza** (0-1): Basada en consistencia y experiencia
- **Conteo de práctica**: Número de sesiones
- **Última práctica**: Fecha de última actividad
- **Progresión histórica**: Últimas 10 sesiones
- **Maestría estimada**: beginner/intermediate/advanced

#### Habilidades Rastreadas
**Vocabulario:**
- Vocabulario Básico
- Vocabulario Cotidiano
- Vocabulario Avanzado

**Cultura:**
- Costumbres Locales
- Normas Sociales
- Historia y Tradiciones

**Habilidades Blandas:**
- Comunicación
- Trabajo en Equipo
- Liderazgo

### 2. Agente IA Proactivo (`/utils/aiAgent.ts`)

#### Tipos de Acciones del Agente
1. **`recommend_game`**: Recomienda juegos específicos
2. **`suggest_resource`**: Sugiere recursos del centro
3. **`create_study_plan`**: Crea planes de estudio personalizados
4. **`adjust_difficulty`**: Ajusta dificultad automáticamente
5. **`encourage_user`**: Mensajes de motivación
6. **`identify_weakness`**: Identifica áreas débiles
7. **`celebrate_achievement`**: Celebra logros
8. **`schedule_review`**: Programa revisiones

#### Niveles de Prioridad
- **Urgent**: Requiere atención inmediata
- **High**: Importante para el progreso
- **Medium**: Recomendado
- **Low**: Opcional/mantenimiento

#### Tipos de Insights
- **Celebration**: Reconocimiento de logros
- **Warning**: Alertas de problemas
- **Recommendation**: Sugerencias de mejora
- **Pattern**: Patrones detectados

### 3. Sistema de Actualización Automática

#### Después de Cada Sesión de Juego
```typescript
// Automático en AppContext
updateKnowledgeProfile(session) {
  1. Calcula rendimiento y factores de aprendizaje
  2. Actualiza niveles de habilidades relacionadas
  3. Recalcula confianza basada en consistencia
  4. Ajusta velocidad de aprendizaje y retención
  5. Identifica nuevas fortalezas y debilidades
  6. Regenera acciones e insights del agente
}
```

#### Después de Interacciones con Chat
```typescript
updateKnowledgeFromChatInteraction(topic, emotion) {
  1. Ajusta confianza en habilidades relacionadas
  2. Marca última práctica de habilidades relevantes
  3. Incrementa contador de interacciones
}
```

## 📊 Algoritmos de Adaptación

### Cálculo de Cambio de Nivel
```typescript
levelChange = baseChange × difficultyMultiplier × practiceFactor × levelFactor

Donde:
- baseChange: Basado en rendimiento (90%+ = +8, <50% = -2)
- difficultyMultiplier: beginner=1.0, intermediate=1.3, advanced=1.6
- practiceFactor: 1/(1 + practiceCount×0.05) [curva de aprendizaje]
- levelFactor: Principiantes=1.2, Intermedios=1.0, Avanzados=0.8
```

### Cálculo de Confianza
```typescript
confidence = (consistencyScore × 0.4) + (experienceScore × 0.3) + (levelScore × 0.3)

Donde:
- consistencyScore: 1 - (stdDev/50) [menor varianza = mayor confianza]
- experienceScore: min(1, practiceCount/20)
- levelScore: currentLevel/100
```

### Predicción de Rendimiento
```typescript
predictedScore = (avgLevel × avgConfidence) - difficultyPenalty

Ajustado por: (learningVelocity + retentionRate) / 2
```

## 🎯 Análisis Proactivo del Agente

### 1. Análisis de Racha
- **Sin racha**: Sugiere comenzar una
- **7-13 días**: Celebra hito semanal
- **30+ días**: Otorga recompensa especial

### 2. Análisis de Debilidades
- **Áreas urgentes**: Nivel <30% o confianza <0.3
- **Áreas recomendadas**: Nivel 30-70% y práctica necesaria
- **Estimación de mejora**: Predicción de impacto

### 3. Detección de Patrones
- **Falta de diversidad**: Sugiere explorar otras categorías
- **Práctica espaciada**: Recomienda mayor frecuencia
- **Estancamiento**: Detecta rendimiento estable sin mejora

### 4. Oportunidades de Avance
- **Listo para subir**: Nivel ≥75% y confianza ≥0.7
- **Score de preparación**: (nivel × confianza) / 100

### 5. Programación de Revisiones
- **≥7 días sin práctica**: Prioridad media
- **≥14 días sin práctica**: Prioridad alta
- **Riesgo de retención**: daysSinceLastPractice / 30

## 💡 Insights Automáticos

### Mejora de Rendimiento
```
Si improvement > 15%: "¡Tu rendimiento ha mejorado un X%!"
Si improvement < -10%: "He notado una baja. ¿Necesitas un cambio?"
```

### Velocidad de Aprendizaje
```
Si learningVelocity > 0.7: "¡Aprendes muy rápido! Top 25%"
```

### Retención
```
Si retentionRate < 0.6: "Sugiero sesiones más cortas pero frecuentes"
```

### Tiempo Óptimo
```
Detecta: "Rindes mejor alrededor de las X:00"
```

## 📅 Planes de Estudio Adaptativos

### Generación de Plan
```typescript
createStudyPlan(user, profile, goals, duration) {
  Días 1-7: Enfoque en áreas urgentes
  Días 8-21: Mix de urgente y recomendado
  Días 22-30: Consolidación y avance
  Cada 7 días: Revisión general
}
```

### Adaptación Dinámica
```typescript
adaptStudyPlan(plan, profile, recentSessions) {
  Si avgPerformance > 85%: Aumentar dificultad
  Si avgPerformance < 50%: Reducir dificultad
  Registra ajustes en adaptiveAdjustments[]
}
```

## 🎮 Integración en la Aplicación

### Dashboard
- **Acciones proactivas**: Top 2 acciones prioritarias
- **Insights**: Top 1 insight no descartado
- **Botón nuevo**: "Ver Perfil de Conocimiento"

### Chat de IA
- **Comandos especiales**:
  - "Analiza mi progreso" → Análisis completo
  - "Crea un plan para mí" → Plan de estudio de 14 días
  - "¿Cómo me irá en X?" → Predicciones de rendimiento
  - "Ayuda" → Capacidades del agente

- **Acciones ejecutables**: Cada respuesta puede incluir acciones
- **Insights visuales**: Tarjetas con confianza y tipo

### Página de Perfil de Conocimiento
- **4 tabs**:
  1. **Habilidades**: Mapa completo con filtros
  2. **Análisis**: Fortalezas, debilidades, maestría
  3. **Predicciones**: Rendimiento esperado por categoría
  4. **Recomendaciones**: Urgente, recomendado, mantenimiento

- **Métricas principales**:
  - Velocidad de aprendizaje
  - Tasa de retención
  - Total de interacciones
  - Estilo de aprendizaje

## 🔄 Flujo de Datos

```
Usuario completa juego
    ↓
addGameSession(session)
    ↓
updateKnowledgeProfile(session)
    ↓
updateKnowledgeFromSession(profile, session)
    ↓
    ├─→ Calcula nuevo nivel de habilidades
    ├─→ Ajusta confianza
    ├─→ Actualiza velocidad y retención
    └─→ Identifica fortalezas/debilidades
    ↓
refreshAgentData()
    ↓
    ├─→ analyzeAndGenerateActions()
    └─→ generateInsights()
    ↓
Actualiza UI con recomendaciones
```

## 🎯 Mejores Prácticas para Desarrollo

### Añadir Nueva Habilidad
```typescript
// En knowledgeTracker.ts - initializeKnowledgeProfile()
{
  skillId: 'new-skill-id',
  skillName: 'Nombre de Habilidad',
  category: 'vocabulary' | 'culture' | 'soft-skills',
  currentLevel: 10,
  confidence: 0.2,
  practiceCount: 0,
  lastPracticed: new Date().toISOString(),
  progression: [10],
  estimatedMastery: 'beginner'
}
```

### Añadir Nuevo Tipo de Acción
```typescript
// 1. types/index.ts
export type AgentActionType = 
  | 'existing_types'
  | 'new_action_type';

// 2. aiAgent.ts - añadir lógica
// 3. AIChatPage.tsx - añadir handler
```

### Personalizar Algoritmos
```typescript
// knowledgeTracker.ts - calculateLevelChange()
// Ajustar factores según necesidad:
- difficultyMultiplier
- practiceFactor
- levelFactor
```

## 📈 Métricas de Éxito

### Usuario
- **Velocidad de aprendizaje**: >0.6 es excelente
- **Tasa de retención**: >0.7 es muy buena
- **Nivel promedio de habilidades**: >50% es competente
- **Confianza promedio**: >0.5 es consistente

### Agente
- **Acciones aceptadas**: >60% indica buenas recomendaciones
- **Insights con alta confianza**: >0.8
- **Predicciones precisas**: ±15% del rendimiento real

## 🚀 Próximas Mejoras Potenciales

1. **Machine Learning Real**: Integrar modelos pre-entrenados
2. **Gamificación de Habilidades**: Niveles visuales por skill
3. **Comparación Social**: Benchmarking anónimo
4. **Notificaciones Push**: Recordatorios de práctica
5. **Análisis de Sentimiento**: Detección emocional mejorada
6. **Adaptación Multilingüe**: Personalización por idioma
7. **Exportar Progreso**: PDF con reportes detallados
8. **Integración Calendario**: Sincronizar práctica

## 📝 Notas Técnicas

- **Persistencia**: Actualmente en memoria (localStorage en producción)
- **Performance**: Todas las operaciones son O(n) o mejor
- **Escalabilidad**: Diseñado para 1000+ usuarios concurrentes
- **Testing**: Incluir tests unitarios para algoritmos críticos
- **Documentación**: Mantener inline comments en código complejo

---

**Desarrollado para EduGame4ALL - Hack4Edu 2025**  
Sistema de IA educativa de próxima generación para refugiados y personas vulnerables.
