# EduGame4ALL 🎮🌍

Plataforma educativa gamificada con IA personalizada para ayudar a personas en situación de vulnerabilidad (refugiados, niños, jóvenes con barreras de comunicación) a aprender idiomas, cultura local y habilidades blandas mediante juegos interactivos.

## ✨ Nuevas Características (v2.0)

### 🤖 Chat con Tutor de IA

- Asistente conversacional disponible 24/7
- Respuestas personalizadas según contexto del usuario
- Detección automática de intención y emoción
- Recomendaciones inteligentes de actividades
- Sugerencias rápidas contextuales

### 🎤 Grabador de Voz Simulado

- Interfaz de grabación de audio
- Simulación de transcripción con Whisper
- Análisis de emoción en voz
- Feedback sobre pronunciación

### 🎊 Celebraciones Visuales

- Confetti animado para logros perfectos
- Animaciones de transición suaves
- Feedback visual inmediato

### 📊 Sistema de Clasificación

- Leaderboard global con rankings
- Posición del usuario actualizada
- Competencia saludable entre estudiantes

### 🎓 Tutorial Interactivo

- Onboarding guiado paso a paso
- 4 pasos tutoriales explicativos
- Puede saltarse o repetirse
- Progreso visual

### 📈 Estadísticas Mejoradas

- Cards de stats con tendencias
- Indicadores visuales de progreso
- Comparativas semanales

## 🎯 Características Principales

### Sistema de Autenticación

- Registro con selección de tipo de usuario (niño, adulto, tutor)
- Login con múltiples idiomas soportados
- Perfiles personalizados según necesidades

### Cuestionario de Evaluación Inicial

- Evaluación de nivel de idioma actual
- Conocimientos culturales
- Habilidades de comunicación
- Personalización del perfil de aprendizaje

### Módulos de Aprendizaje Gamificados

#### 📚 Módulo de Idiomas

- Vocabulario contextual (supermercado, médico, trabajo)
- Simulaciones de conversaciones cotidianas
- Ejercicios de pronunciación
- Retos de comprensión

#### 🌍 Módulo Cultural

- Quiz interactivos sobre costumbres locales
- Simuladores de situaciones sociales
- Historia y geografía del país de acogida
- Normas sociales y cívicas

#### 🤝 Módulo de Habilidades Blandas

- Trabajo en equipo virtual
- Simulaciones de resolución de conflictos
- Ejercicios de comunicación asertiva
- Retos de liderazgo y colaboración

### Sistema de IA Personalizada

El sistema utiliza **simulaciones de modelos de IA** para proporcionar:

- **Análisis de Rendimiento**: Tracking de tiempo de respuesta, errores comunes, patrones de aprendizaje
- **Adaptación Dinámica**: Ajuste automático de dificultad basado en progreso
- **Feedback Inteligente**: Explicaciones personalizadas y sugerencias de mejora
- **Detección Emocional**: Identifica frustración, confusión o motivación y adapta la experiencia
- **Predicción de Necesidades**: Identificación proactiva de áreas que requieren refuerzo

#### Modelos de IA Recomendados (Para Implementación Futura)

1. **LLM Principal**: Meta-Llama-3.1-8B-Instruct
   - Multilingüe (100+ idiomas)
   - Feedback personalizado
   - Adaptación de dificultad

2. **Reconocimiento de Voz**: OpenAI Whisper Large V3
   - Transcripción multilingüe
   - Evaluación de pronunciación

3. **Detección de Emociones**:
   - Audio: wav2vec2-lg-xlsr
   - Texto: DistilBERT Emotion

4. **Generación de Contenido**: T5-base-finetuned-question-generation

### Sistema de Recompensas

- **Puntos y Niveles**: Sistema de experiencia (XP) con niveles desbloqueables
- **Logros y Medallas**: Reconocimientos visuales por hitos específicos
- **Cupones Reales**: Descuentos en supermercados, transporte, educación
- **Streaks Diarios**: Racha de días consecutivos de práctica
- **Leaderboards**: Tabla de clasificación comunitaria

### Centro de Recursos

- **Oportunidades de Empleo**: Ofertas laborales filtradas
- **Información sobre Subvenciones**: Ayudas disponibles
- **Recursos Comunitarios**: Directorio de centros de ayuda
- **Noticias Locales**: Contenido adaptado y simplificado

## 🏗️ Arquitectura del Proyecto

```
/
├── components/
│   ├── GameCard.tsx          # Tarjeta de juego
│   ├── GamingWorldLogo.tsx   # Logo del proyecto
│   └── ui/                   # Componentes UI (shadcn)
├── context/
│   └── AppContext.tsx        # Estado global de la aplicación
├── data/
│   └── mockData.ts          # Datos de prueba (juegos, logros, recompensas)
├── pages/
│   ├── LandingPage.tsx       # Página de inicio
│   ├── RegisterPage.tsx      # Registro de usuario
│   ├── LoginPage.tsx         # Inicio de sesión
│   ├── OnboardingPage.tsx    # Configuración inicial
│   ├── DashboardPage.tsx     # Panel principal
│   ├── GamesPage.tsx         # Centro de juegos
│   ├── GamePlayPage.tsx      # Juego interactivo
│   ├── ProgressPage.tsx      # Estadísticas y progreso
│   ├── RewardsPage.tsx       # Tienda de recompensas
│   └── ResourcesPage.tsx     # Centro de recursos
├── types/
│   └── index.ts             # Definiciones TypeScript
├── utils/
│   └── aiSimulation.ts      # Simulación de IA
└── App.tsx                  # Componente principal con enrutado
```

## 🚀 Cómo Usar

### Para Usuarios

1. **Regístrate** seleccionando tu tipo de usuario (niño, adulto, tutor)
2. **Completa el cuestionario inicial** para personalizar tu experiencia
3. **Explora el dashboard** y conoce tus estadísticas
4. **Juega** en los diferentes módulos (idiomas, cultura, habilidades blandas)
5. **Gana XP y logros** con cada sesión completada
6. **Canjea recompensas** en la tienda
7. **Explora recursos** para oportunidades de empleo y ayudas

### Demo Rápida

- **Email**: cualquier@email.com
- **Contraseña**: cualquiera
- El sistema creará un usuario demo con progreso existente

## 🎮 Tipos de Juegos

### Principiante

- Vocabulario básico
- Costumbres locales simples
- Comunicación básica

### Intermedio

- Conversaciones cotidianas
- Etiqueta social
- Trabajo en equipo

### Avanzado

- Entrevistas de trabajo
- Festividades y celebraciones
- Liderazgo y gestión

## 📊 Sistema de Puntuación

- **Principiante**: 10 XP base x pregunta
- **Intermedio**: 20 XP base x pregunta
- **Avanzado**: 35 XP base x pregunta

**Bonificaciones**:

- Velocidad: +20% si respondes rápido
- Precisión: +50% con puntuación perfecta
- Racha: +10% por mantener racha diaria

## 🏆 Logros Disponibles

- 🎯 **Primer Paso**: Primer inicio de sesión
- 🎮 **Jugador Novato**: Primer juego completado
- 🔥 **Entusiasta**: 10 juegos completados
- ⭐ **Perfeccionista**: Puntuación perfecta
- 📅 **Dedicación**: Racha de 7 días
- 📚 **Maestro del Idioma**: 20 ejercicios de vocabulario

## 🎁 Recompensas

- Descuentos en supermercados locales
- Transporte público gratuito
- Clases de idiomas gratis
- Material escolar
- Entradas a museos

## 🌐 Soporte Multilingüe

La aplicación soporta:

- 🇪🇸 Español
- 🇬🇧 English
- 🇸🇦 العربية (Árabe)
- 🇨🇳 中文 (Chino)

## 🧠 Características de IA (Simuladas)

El sistema actual **simula** las capacidades de IA que en producción se integrarían con modelos reales:

### Detección de Emociones

Analiza el rendimiento para detectar:

- 😊 Felicidad (buen rendimiento)
- 😤 Frustración (bajo rendimiento + mucho tiempo)
- 🤔 Confusión (rendimiento medio)
- 🚀 Motivación (mejorando constantemente)

### Adaptación Dinámica

- Incrementa dificultad si precisión > 85%
- Reduce dificultad si precisión < 50%
- Analiza tendencia de últimas 3 sesiones

### Feedback Personalizado

- Mensajes adaptados a la emoción detectada
- Sugerencias específicas según patrones de error
- Recomendaciones de próximos pasos

### Análisis de Patrones

Identifica errores en:

- Vocabulario básico
- Contexto cultural
- Habilidades avanzadas

## 🔮 Roadmap de Implementación IA Completa

Para implementar la versión completa con modelos de IA reales:

### Fase 1: Backend con FastAPI (Python)

```bash
pip install transformers torch whisper-openai langchain fastapi
```

### Fase 2: Integración de Modelos

- LLM: Meta-Llama-3.1-8B-Instruct
- Speech: OpenAI Whisper Large V3
- Emotion: wav2vec2 + DistilBERT
- Questions: T5-finetuned

### Fase 3: Despliegue

- Docker containers para cada servicio
- API REST endpoints
- Cache de modelos con HuggingFace

## 🛠️ Stack Tecnológico

- **Frontend**: React + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Icons**: Lucide React
- **Toast Notifications**: Sonner
- **IA Simulation**: Custom TypeScript functions

## 📱 Responsive Design

La aplicación es completamente responsive y funciona en:

- 💻 Desktop
- 📱 Tablet
- 📱 Móvil

## 🎨 Diseño

- Gradientes modernos (azul, púrpura, rosa)
- Componentes interactivos con hover effects
- Animaciones suaves
- Accesibilidad integrada (WCAG 2.1)

## 🌟 Impacto Social

EduGame4ALL está diseñado para:

- ✅ Facilitar integración de poblaciones vulnerables
- ✅ Democratizar acceso a educación personalizada
- ✅ Crear puentes culturales y sociales
- ✅ Proporcionar herramientas prácticas para la vida diaria

## 📄 Licencia

Este proyecto es parte del hackathon Hack4Edu 2025.

## 👥 Contribuciones

Desarrollado como MVP para demostrar el potencial de combinar:

- Gamificación educativa
- IA personalizada
- Impacto social real

---

**EduGame4ALL** - Educación gamificada con IA para todos 🎮🌍❤️