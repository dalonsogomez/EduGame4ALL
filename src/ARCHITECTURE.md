# Arquitectura Técnica - EduGame4ALL

## 📐 Visión General

EduGame4ALL es una aplicación web educativa gamificada construida con React, TypeScript y Tailwind CSS, diseñada con una arquitectura modular y escalable para facilitar el aprendizaje personalizado mediante IA.

## 🏗️ Arquitectura de Capas

```
┌─────────────────────────────────────────────────────────┐
│                 PRESENTATION LAYER                       │
│  (React Components + Pages + UI Components)             │
├─────────────────────────────────────────────────────────┤
│                 APPLICATION LAYER                        │
│  (Context API + Hooks + Business Logic)                 │
├─────────────────────────────────────────────────────────┤
│                   SERVICE LAYER                          │
│  (AI Simulation + Data Management + Utils)              │
├─────────────────────────────────────────────────────────┤
│                    DATA LAYER                            │
│  (Mock Data + Types + State Management)                 │
└─────────────────────────────────────────────────────────┘
```

## 📁 Estructura de Directorios

### `/components` - Componentes Reutilizables

#### Componentes de UI Base (`/components/ui`)
- **shadcn/ui components**: Biblioteca de componentes pre-diseñados
- Consistencia visual en toda la aplicación
- Accesibilidad integrada (WCAG 2.1)
- Personalización con Tailwind CSS

#### Componentes Personalizados
- **GameCard**: Tarjeta de juego con información y acciones
- **StatsCard**: Visualización de estadísticas con iconos y tendencias
- **VoiceRecorder**: Simulador de grabación de voz con análisis IA
- **Confetti**: Animación de celebración para logros
- **LeaderboardCard**: Tabla de clasificación con rankings
- **TutorialTooltip**: Sistema de onboarding guiado
- **GamingWorldLogo**: Logo SVG vectorial del proyecto

### `/pages` - Páginas Principales

#### Flujo de Autenticación
- **LandingPage**: Hero, features, testimonios
- **RegisterPage**: Registro con tipos de usuario
- **LoginPage**: Login con demo mode
- **OnboardingPage**: Cuestionario de 4 pasos

#### Flujo Principal de Aplicación
- **DashboardPage**: Vista principal con stats y accesos rápidos
- **GamesPage**: Catálogo de juegos con filtros
- **GamePlayPage**: Experiencia de juego interactiva
- **ProgressPage**: Análisis detallado y estadísticas
- **RewardsPage**: Tienda de recompensas canjeables
- **ResourcesPage**: Centro de recursos externos
- **AIChatPage**: Chat con tutor de IA

### `/context` - Gestión de Estado Global

#### AppContext
```typescript
interface AppContextType {
  user: User | null;
  currentPage: string;
  gameSessions: GameSession[];
  achievements: Achievement[];
  rewards: Reward[];
  resources: Resource[];
  // Métodos
  setUser, setCurrentPage, addGameSession,
  updateUserXP, unlockAchievement, redeemReward, updateStreak
}
```

**Responsabilidades**:
- Estado global de la aplicación
- Gestión de usuario y autenticación
- Historial de sesiones de juego
- Sistema de logros y recompensas
- Actualización de racha diaria

### `/types` - Definiciones TypeScript

#### Tipos Principales
```typescript
- User: Perfil completo del usuario
- UserProfile: Configuración de aprendizaje
- GameSession: Sesión de juego completada
- Question: Pregunta de juego con opciones
- Achievement: Logro desbloqueable
- Reward: Recompensa canjeable
- AIFeedback: Análisis y feedback de IA
- Resource: Recurso externo (empleo, ayuda, etc.)
```

### `/utils` - Utilidades y Servicios

#### aiSimulation.ts - Motor de IA Simulado

##### 1. Detección de Emociones
```typescript
detectEmotion(correctAnswers, totalQuestions, timeSpent): Emotion
```
- Analiza rendimiento y tiempo
- Clasifica: happy, frustrated, confused, motivated, neutral
- Base para adaptación de contenido

##### 2. Análisis de Patrones de Error
```typescript
analyzeMistakePatterns(questions, userAnswers): string[]
```
- Identifica errores recurrentes
- Categoriza: basic_vocabulary, cultural_context, advanced_soft_skills
- Informa recomendaciones personalizadas

##### 3. Sugerencia de Dificultad Adaptativa
```typescript
suggestNextDifficulty(current, accuracy, history): Difficulty
```
- Analiza últimas 3 sesiones
- Incrementa si accuracy > 85%
- Reduce si accuracy < 50%
- Mantiene flujo óptimo de aprendizaje

##### 4. Generación de Feedback Personalizado
```typescript
generateAIFeedback(session, emotion, difficulty, patterns): AIFeedback
```
- Mensaje adaptado a emoción detectada
- Palabras de aliento personalizadas
- 3 pasos sugeridos para mejora
- Confidence score del análisis

##### 5. Cálculo de XP
```typescript
calculateXP(correct, total, difficulty, time): number
```
- Base XP por dificultad (10/20/35)
- Bonificación por precisión (hasta +50%)
- Bonificación por velocidad (hasta +20%)

##### 6. Análisis de Emoción en Texto
```typescript
analyzeTextEmotion(text): { emotion, score }
```
- Detección por keywords
- 6 emociones: joy, sadness, anger, fear, surprise, neutral
- Score de confianza normalizado

### `/data` - Datos de Prueba

#### mockData.ts
- **mockAchievements**: 6 logros predefinidos
- **mockRewards**: 5 recompensas reales
- **mockResources**: 5 recursos por categoría
- **vocabularyQuestions**: 5 preguntas por nivel
- **cultureQuestions**: 5 preguntas por nivel
- **softSkillsQuestions**: 5 preguntas por nivel

Total: **45 preguntas** distribuidas en 3 módulos × 3 niveles × 5 preguntas

## 🔄 Flujo de Datos

### 1. Inicio de Sesión
```
LandingPage → LoginPage → AppContext.setUser() → DashboardPage
                              ↓
                    localStorage (opcional)
```

### 2. Completar Juego
```
GamePlayPage → Respuestas del usuario
     ↓
AI Simulation → Análisis (emoción, patrones, dificultad)
     ↓
GameSession → AppContext.addGameSession()
     ↓
updateUserXP() → Verificar logros → UI Feedback
```

### 3. Sistema de Recompensas
```
Ganar XP → Acumular puntos → RewardsPage
                 ↓
           Canjear recompensa → AppContext.redeemReward()
                 ↓
           Actualizar XP → Notificación Toast
```

## 🎨 Sistema de Diseño

### Paleta de Colores
```css
/* Primarios */
--blue-500: #3b82f6    /* Idiomas */
--purple-500: #8b5cf6  /* Cultura */
--pink-500: #ec4899    /* Habilidades */

/* Feedback */
--green-500: #10b981   /* Éxito */
--yellow-500: #f59e0b  /* Advertencia */
--red-500: #ef4444     /* Error */
--orange-500: #f97316  /* Racha */
```

### Gradientes
```css
/* Fondo principal */
bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50

/* Cards destacadas */
bg-gradient-to-r from-blue-600 to-purple-600
```

### Tipografía
- Sistema utiliza `globals.css` con definiciones base
- No se sobreescribe con clases Tailwind
- Jerarquía: h1 > h2 > h3 > h4 > p

## 🔌 Integración con IA Real (Roadmap)

### Backend Propuesto (FastAPI + Python)

#### Endpoints de IA
```
POST /api/ai/chat
- Input: { user_id, message, context, language }
- Output: { response, confidence, suggested_actions }
- Modelo: Meta-Llama-3.1-8B-Instruct

POST /api/ai/transcribe
- Input: audio_file, language
- Output: { transcription, detected_language, confidence }
- Modelo: OpenAI Whisper Large V3

POST /api/ai/emotion/audio
- Input: audio_file
- Output: { emotion, confidence, recommendations }
- Modelo: wav2vec2-lg-xlsr

POST /api/ai/emotion/text
- Input: text, context
- Output: { emotion, confidence, sentiment_score }
- Modelo: DistilBERT Emotion

POST /api/ai/generate-question
- Input: topic, difficulty, user_profile
- Output: { question, options, correct_answer }
- Modelo: T5-finetuned-question-generation
```

### Stack de IA Completo
```
Frontend (React) ←→ API Gateway ←→ AI Services
                                      ↓
                        ┌─────────────┴────────────┐
                        ↓                          ↓
                   LLM Service              Speech Service
                 (Llama 3.1-8B)           (Whisper Large V3)
                        ↓                          ↓
                  Emotion Service         Question Generator
                  (DistilBERT)                 (T5-base)
```

## 📊 Métricas y Análisis

### KPIs Tracked
1. **Engagement**
   - Racha diaria (días consecutivos)
   - Tiempo promedio por sesión
   - Juegos completados por semana

2. **Aprendizaje**
   - Tasa de precisión por módulo
   - Progresión de dificultad
   - Patrones de error identificados

3. **Emocional**
   - Distribución de emociones
   - Frecuencia de frustración
   - Correlación emoción-rendimiento

4. **Retención**
   - Usuarios activos diarios/semanales
   - Tasa de abandono por dificultad
   - Recompensas canjeadas

## 🔒 Seguridad y Privacidad

### Actual (MVP)
- Sin autenticación real (demo mode)
- Datos en memoria (no persistentes)
- Sin información sensible

### Producción (Recomendado)
- JWT para autenticación
- Encriptación de datos (bcrypt)
- Cumplimiento GDPR
- Control parental para menores
- Anonimización de datos analíticos

## 🚀 Optimizaciones de Rendimiento

### Renderizado
- React.memo en componentes pesados
- Lazy loading de páginas
- Debouncing en inputs de búsqueda

### Estado
- Context API dividido por dominio
- Optimistic updates para UX
- Cache de datos frecuentes

### Assets
- SVGs inline para iconos
- Imágenes optimizadas con fallbacks
- Componentes UI cargados bajo demanda

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Estrategia Mobile-First
- Grid adaptativo (1→2→3 columnas)
- Stack vertical en mobile
- Touch-friendly (botones ≥44px)

## 🧪 Testing (Propuesto)

### Unit Tests
- Utilidades de IA (aiSimulation.ts)
- Cálculos de XP y logros
- Funciones de validación

### Integration Tests
- Flujo completo de juego
- Sistema de recompensas
- Actualización de perfil

### E2E Tests
- Onboarding completo
- Completar 3 juegos diferentes
- Canjear recompensa

## 📈 Escalabilidad

### Horizontal
- Stateless frontend (deploy en CDN)
- API backend separada
- Cache distribuido (Redis)

### Vertical
- Modelos IA cuantizados (8-bit)
- Batch processing de análisis
- Worker pools para inferencia

## 🌍 Internacionalización (i18n)

### Implementación Futura
```typescript
// Usando react-i18next
const { t } = useTranslation();
<h1>{t('dashboard.welcome', { name: user.name })}</h1>
```

### Idiomas Soportados
- Español (es) - Base
- English (en)
- العربية (ar)
- 中文 (zh)
- Français (fr)
- Português (pt)

## 🔧 Herramientas de Desarrollo

### Stack Actual
- **Vite**: Build tool rápido
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling utility-first
- **shadcn/ui**: Componentes accesibles
- **Lucide React**: Iconos SVG

### Propuesto para Producción
- **Vitest**: Unit testing
- **Playwright**: E2E testing
- **Storybook**: Component documentation
- **Sentry**: Error tracking
- **Vercel/Netlify**: Deployment
- **Supabase**: Backend as a Service

## 📚 Dependencias Clave

```json
{
  "react": "^18.x",
  "typescript": "^5.x",
  "tailwindcss": "^4.x",
  "lucide-react": "^0.x",
  "sonner": "^2.x",
  "react-hook-form": "^7.55.0"
}
```

## 🎯 Próximos Pasos

### Fase 1: MVP Actual ✅
- Sistema completo de juegos
- IA simulada
- UI/UX completa

### Fase 2: Backend Real
- Integración Supabase
- Persistencia de datos
- Autenticación JWT

### Fase 3: IA Real
- Despliegue modelos HuggingFace
- FastAPI backend
- Whisper para voz

### Fase 4: Producción
- Tests automatizados
- CI/CD pipeline
- Monitoreo y analytics

---

**EduGame4ALL** - Arquitectura diseñada para escalar desde MVP a producción enterprise
