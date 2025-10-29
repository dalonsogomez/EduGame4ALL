# 🎮 EduGame4ALL

> **Empowering Immigrant & Refugee Communities Through Gamified Learning**

Una plataforma educativa completa diseñada para Hack4Edu 2025, que ayuda a comunidades de inmigrantes y refugiados a aprender idiomas, habilidades blandas e integración cultural a través de juegos interactivos potenciados por IA.

[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-brightgreen.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success.svg)]()

---

## 🌟 Características Principales

### 🎯 Experiencia de Juego

- **15+ Juegos Educativos** en Idiomas, Cultura y Habilidades Blandas
- **Feedback Potenciado por IA** con recomendaciones personalizadas
- **Seguimiento en Tiempo Real** con análisis visuales
- **Sistema Multi-Categoría de XP** para progresión basada en habilidades
- **Insignias de Logros** con seguimiento de progreso (14 badges)

### 📊 Progreso y Análisis

- **Dashboard Personal** con estadísticas completas
- **Reportes Semanales** con insights generados por IA
- **Seguimiento de Rachas** para fomentar compromiso diario
- **Tablas de Clasificación** para competencia amistosa
- **Historial de Juegos** con análisis detallado de sesiones

### 🏆 Características de Compromiso

- **Desafíos Diarios** con recompensas bonus
- **Recompensas Basadas en XP** (tarjetas regalo, cursos, descuentos)
- **Sistema de Códigos QR** para canje
- **Personalización de Perfil** con soporte de avatar
- **Soporte Multiidioma** para idiomas nativos y objetivo

### 🌐 Recursos Comunitarios

- **Bolsa de Trabajo** con scoring de coincidencia potenciado por IA
- **Oportunidades de Becas y Financiamiento** para inmigrantes
- **Buscador de Servicios Comunitarios** con datos de ubicación
- **Noticias de Inmigración** con calificaciones de dificultad

### 🤖 Integración de IA (Opcional)

- **Agente LLM** (Llama-3.1 / GPT-4) para tutoría personalizada
- **Reconocimiento de Voz** (Whisper Large V3) para pronunciación
- **Detección de Emociones** para experiencias de aprendizaje adaptativas
- **Fallback Inteligente** cuando los servicios de IA no están disponibles

---

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js** 18 o superior
- **MongoDB** 6 o superior (local o Atlas)
- **npm** 9 o superior

### Instalación Completa

#### 1. Clonar el Repositorio

```bash
git clone https://github.com/dalonsogomez/EduGame4ALL.git
cd EduGame4ALL
```

#### 2. Instalar Dependencias

```bash
# Desde la raíz del proyecto (instala shared, client y server)
npm install
```

#### 3. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp server/.env.example server/.env

# Editar con tu configuración
nano server/.env
```

**Variables mínimas requeridas**:

```env
# Base de Datos (OBLIGATORIO)
DATABASE_URL=mongodb://localhost:27017/edugame4all

# Seguridad (OBLIGATORIO)
JWT_SECRET=tu-clave-jwt-super-secreta-cambiar-en-produccion
SESSION_SECRET=tu-session-secret-cambiar-en-produccion

# CORS (OBLIGATORIO)
CORS_ORIGIN=http://localhost:5173

# Servicios de IA (OPCIONAL - tiene fallback inteligente)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
AI_SERVICE_URL=http://localhost:8001
```

#### 4. ⚠️ **CRÍTICO** - Ejecutar Migración de Datos

Si ya tienes datos en tu base de datos, **DEBES ejecutar este paso**:

```bash
cd server
npm run migrate:longest-streak
```

**Salida esperada**:
```
✅ Migration completed successfully!
📈 Statistics:
   - Total records: X
   - Updated: Y
```

#### 5. Poblar Base de Datos (Primera Vez)

```bash
cd server
npm run seed
```

Esto creará:
- 3 usuarios de prueba
- 8 juegos educativos
- 14 badges
- 10 recompensas
- 16 recursos comunitarios

#### 6. Iniciar Servidores de Desarrollo

```bash
# Desde la raíz del proyecto
npm run dev
```

**Accede a la aplicación:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

### Credenciales de Prueba

- **Admin**: `admin@edugame4all.com` / `Admin@123`
- **Usuario 1**: `user1@test.com` / `Test@123`
- **Usuario 2**: `user2@test.com` / `Test@123`

---

## 📚 Documentación

- **[Guía de Despliegue](DEPLOYMENT_GUIDE.md)** - Instrucciones completas para producción
- **[Guía de Testing](TESTING_GUIDE.md)** - Procedimientos de testing completos
- **[Implementación de IA](AI_IMPLEMENTATION.md)** - Setup e integración de servicios de IA
- **[Sistema XP](XP_IMPLEMENTATION_SUMMARY.md)** - Mecánicas de nivelación y progresión
- **[Hub de Recursos](RESOURCES_IMPLEMENTATION_SUMMARY.md)** - Característica de recursos comunitarios
- **[Sistema de Recompensas](REWARDS_IMPLEMENTATION_SUMMARY.md)** - Mecánicas de canje
- **[Seguimiento de Progreso](PROGRESS_TRACKING_IMPLEMENTATION.md)** - Badges y análisis

---

## 🏗️ Arquitectura

### Stack Tecnológico

**Frontend:**
- React 18 + TypeScript
- Vite para builds rápidos
- TailwindCSS + componentes shadcn/ui
- React Router para navegación
- Axios para llamadas API

**Backend:**
- Node.js + Express + TypeScript
- MongoDB con Mongoose ODM
- Autenticación JWT
- Diseño de API RESTful
- Manejo completo de errores

**Servicios de IA (Opcional):**
- Python FastAPI
- LangChain para orquestación de LLM
- Whisper para reconocimiento de voz
- Transformers para detección de emociones

### Estructura del Proyecto

```
EduGame4ALL/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes UI reutilizables
│   │   ├── pages/         # Componentes de página
│   │   ├── api/           # Funciones cliente API
│   │   ├── contexts/      # Contextos React
│   │   └── types/         # Tipos TypeScript
│   └── package.json
├── server/                # Backend Node.js
│   ├── models/           # Modelos Mongoose
│   ├── routes/           # Rutas API
│   ├── services/         # Lógica de negocio
│   ├── types/            # Interfaces TypeScript
│   ├── utils/            # Utilidades
│   ├── scripts/          # Scripts de testing y seed
│   └── package.json
├── shared/               # Tipos y constantes compartidos
│   └── types/
├── ai-services/          # Servicios Python AI (opcional)
│   ├── api/
│   ├── services/
│   └── requirements-ai.txt
└── package.json          # Configuración workspace raíz
```

---

## 🎮 Características en Detalle

### Sistema de Juegos

Juega juegos educativos en tres categorías:
- **Juegos de Idiomas**: Vocabulario, gramática, pronunciación
- **Juegos Culturales**: Tradiciones, costumbres, conocimiento local
- **Habilidades Blandas**: Comunicación, trabajo en equipo, habilidades laborales

Cada juego proporciona:
- Preguntas de opción múltiple
- Desafíos cronometrados
- Feedback instantáneo
- Recompensas XP basadas en rendimiento
- Tips personalizados generados por IA

### XP y Nivelación

- **Progresión Multi-Categoría**: Idiomas, Cultura, Habilidades Blandas
- **Nivel Global**: Progreso general del jugador
- **Niveles por Categoría**: Seguimiento de habilidades especializadas
- **Otorgamiento Automático de Badges**: Desbloquea logros en hitos
- **Tablas de Clasificación**: Compite globalmente y por categoría

### Badges y Logros

14 badges en 4 categorías:
- **Badges de Idiomas**: Primeras Palabras, Conversador, Hablante Fluido, etc.
- **Badges Culturales**: Explorador Cultural, Guardián de Tradiciones, etc.
- **Habilidades Blandas**: Jugador de Equipo, Líder, Profesional, etc.
- **Logros**: Primeros Pasos, Maestro de Rachas, Perfeccionista, etc.

### Desafíos Diarios

Desafíos diarios auto-generados:
- Jugar X juegos
- Ganar X XP
- Completar juegos de categoría
- Lograr puntuaciones perfectas
- Enfocarse en habilidades específicas

Recompensas: XP bonus + badges especiales

### Tienda de Recompensas

Canjea XP por:
- **Tarjetas Regalo**: Amazon, Target, Walmart
- **Cursos**: Cursos de idiomas, certificaciones profesionales
- **Descuentos**: Servicios, productos para inmigrantes
- **Eventos**: Eventos culturales, talleres

Todas las recompensas incluyen códigos QR para verificación.

### Hub de Recursos

Recursos curados para inmigrantes:
- **Empleos**: Con scoring de coincidencia potenciado por IA basado en habilidades
- **Becas**: Oportunidades de financiamiento con info de elegibilidad
- **Servicios**: Clases de ESL, ayuda legal, atención médica
- **Noticias**: Actualizaciones de inmigración con calificaciones de dificultad

---

## 🧪 Testing

### Ejecutar Suites de Tests

```bash
# Sistema XP
npm run test:xp

# Seguimiento de Rachas
npm run test:streak

# CRUD de Juegos
npm run test:games

# Progreso y Badges
npm run test:progress

# Desafíos Diarios
npm run test:challenges

# Recursos
npm run test:resources

# Recompensas
npm run test:rewards

# Dashboard
npm run test:dashboard
```

Ver [TESTING_GUIDE.md](TESTING_GUIDE.md) para procedimientos detallados de testing.

---

## 🔧 Desarrollo

### Scripts Disponibles

```bash
# Instalar todas las dependencias
npm install

# Iniciar desarrollo (todos los servicios)
npm run dev

# Build para producción
npm run build

# Lint del código
npm run lint

# Poblar base de datos
npm run seed

# Limpiar base de datos
npm run cleanup-db

# Migración de datos (longestStreak)
cd server && npm run migrate:longest-streak
```

### Endpoints de API

**Autenticación:**
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refrescar token
- `POST /api/auth/logout` - Logout

**Juegos:**
- `GET /api/games` - Listar juegos
- `GET /api/games/:id` - Obtener detalles de juego
- `POST /api/games/:id/session` - Enviar sesión de juego
- `GET /api/games/sessions` - Obtener sesiones del usuario

**Progreso:**
- `GET /api/progress/badges` - Obtener badges del usuario
- `GET /api/progress/history` - Obtener historial de juegos
- `GET /api/progress/weekly-report` - Obtener análisis semanal

**XP y Nivelación:**
- `GET /api/xp/profile` - Obtener perfil XP
- `GET /api/xp/leaderboard` - Obtener tabla de clasificación

**Desafíos:**
- `GET /api/challenges/daily` - Obtener desafío de hoy
- `POST /api/challenges/:id/complete` - Completar desafío
- `GET /api/challenges/history` - Obtener historial de desafíos

**Recompensas:**
- `GET /api/rewards` - Listar recompensas
- `POST /api/rewards/:id/redeem` - Canjear recompensa
- `GET /api/rewards/user` - Obtener recompensas del usuario

**Recursos:**
- `GET /api/resources/jobs` - Listar oportunidades de empleo
- `GET /api/resources/grants` - Listar becas
- `GET /api/resources/services` - Listar servicios
- `GET /api/resources/news` - Listar noticias

**Dashboard:**
- `GET /api/dashboard` - Obtener datos del dashboard

**Perfil:**
- `GET /api/profile` - Obtener perfil de usuario
- `PUT /api/profile` - Actualizar perfil

---

## ✅ Correcciones Aplicadas (Versión Actual)

### 🔧 Bug Crítico Resuelto

**Problema**: El modelo `UserProgress` no incluía el campo `longestStreak`, causando errores en el sistema de rachas.

**Solución Aplicada** (Commit `730b484`):

1. ✅ Añadido campo `longestStreak` al modelo `UserProgress`
2. ✅ Actualizado `StreakService` para mantener `longestStreak`
3. ✅ Corregido `XpService` para usar campos correctos
4. ✅ Corregido `ProgressService` para pasar datos completos
5. ✅ Creado script de migración `migrate-longest-streak.ts`
6. ✅ Actualizado `DashboardService` para inicializar `longestStreak`

**Estado**: ✅ **Listo para Producción** (después de ejecutar migración)

Ver [CORRECCIONES_APLICADAS.md](CORRECCIONES_APLICADAS.md) para detalles completos.

---

## 🤝 Contribuciones

Este proyecto fue creado para Hack4Edu 2025. ¡Contribuciones, issues y solicitudes de características son bienvenidas!

### Guías de Desarrollo

1. Seguir mejores prácticas de TypeScript
2. Escribir mensajes de commit significativos
3. Testear tus cambios
4. Actualizar documentación
5. Seguir el estilo de código existente

---

## 📄 Licencia

Este proyecto es parte del hackathon Hack4Edu 2025.

---

## 🙏 Agradecimientos

- **Hack4Edu 2025** por la oportunidad
- **Anthropic** por asistencia de Claude AI
- **OpenAI** por capacidades LLM
- Comunidad open source por herramientas increíbles

---

## 📞 Soporte

Para preguntas, issues o soporte:

1. Revisa [TESTING_GUIDE.md](TESTING_GUIDE.md)
2. Consulta [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
3. Busca issues existentes
4. Crea un nuevo issue con detalles

---

## 🎯 Estado del Proyecto

✅ **Completo** - Todas las características principales implementadas y testeadas

- Sistema de juegos completo con 15+ juegos
- XP y nivelación con progresión multi-categoría
- Sistema de badges y logros
- Desafíos diarios con recompensas
- Hub de recursos para soporte comunitario
- Integración de IA (opcional)
- Suite de testing completa
- Listo para despliegue en producción

---

## 📈 Roadmap Futuro

### Corto Plazo
- [ ] Más juegos educativos (objetivo: 25+)
- [ ] App móvil (React Native)
- [ ] Modo offline
- [ ] Más idiomas de interfaz

### Medio Plazo
- [ ] Sistema de mentorías
- [ ] Grupos de estudio
- [ ] Eventos virtuales
- [ ] Integración con plataformas educativas

### Largo Plazo
- [ ] IA adaptativa avanzada
- [ ] Realidad aumentada para juegos culturales
- [ ] Certificaciones oficiales
- [ ] Expansión internacional

---

<div align="center">

**Hecho con ❤️ para Comunidades de Inmigrantes y Refugiados**

*Empoderando a través de la educación, un juego a la vez.*

[🚀 Comenzar](#-inicio-rápido) | [📚 Documentación](#-documentación) | [🧪 Testing](#-testing)

</div>
