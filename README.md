# 🎮 EduGame4ALL

> **Empowering Immigrant & Refugee Communities Through Gamified Learning**

A comprehensive educational gaming platform designed for Hack4Edu 2025, helping immigrant and refugee communities learn languages, soft skills, and cultural integration through engaging, AI-powered games.

[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-brightgreen.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)

---

## 🌟 Features

### 🎯 Core Gaming Experience
- **15+ Educational Games** across Language, Culture, and Soft Skills
- **AI-Powered Feedback** with personalized learning recommendations
- **Real-time Progress Tracking** with visual analytics
- **Multi-Category XP System** for skill-based progression
- **Achievement Badges** with progress tracking (14 badges)

### 📊 Progress & Analytics
- **Personal Dashboard** with comprehensive statistics
- **Weekly Performance Reports** with AI-generated insights
- **Streak Tracking** to encourage daily engagement
- **Leaderboards** for friendly competition
- **Game History** with detailed session analysis

### 🏆 Engagement Features
- **Daily Challenges** with bonus rewards
- **XP-Based Rewards** (gift cards, courses, discounts)
- **QR Code Redemption** system
- **Profile Customization** with avatar support
- **Multi-language Support** for native and target languages

### 🌐 Community Resources
- **Job Board** with AI-powered match scoring
- **Grant & Funding** opportunities for immigrants
- **Community Services** finder with location data
- **Immigration News** with difficulty ratings

### 🤖 AI Integration (Optional)
- **LLM Agent** (Llama-3.1 / GPT-4) for personalized tutoring
- **Speech Recognition** (Whisper Large V3) for pronunciation
- **Emotion Detection** for adaptive learning experiences
- **Intelligent Fallback** when AI services unavailable

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+ (local or Atlas)
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/dalonsogomez/EduGame4ALL.git
cd EduGame4ALL

# Install dependencies
npm install

# Configure environment
cp server/.env.example server/.env
# Edit server/.env with your DATABASE_URL

# Seed database with sample data
npm run seed

# Start development servers
npm run dev
```

**Access the app:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Test Credentials
- **Admin**: `admin@edugame4all.com` / `Admin@123`
- **Users**: `user1@test.com`, `user2@test.com` / `Test@123`

---

## 📚 Documentation

- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Complete production deployment instructions
- **[Testing Guide](TESTING_GUIDE.md)** - Comprehensive testing procedures
- **[AI Implementation](AI_IMPLEMENTATION.md)** - AI services setup and integration
- **[XP System](XP_IMPLEMENTATION_SUMMARY.md)** - Leveling and progression mechanics
- **[Resources Hub](RESOURCES_IMPLEMENTATION_SUMMARY.md)** - Community resources feature
- **[Rewards System](REWARDS_IMPLEMENTATION_SUMMARY.md)** - Redemption mechanics
- **[Progress Tracking](PROGRESS_TRACKING_IMPLEMENTATION.md)** - Badges and analytics

---

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18 + TypeScript
- Vite for fast builds
- TailwindCSS + shadcn/ui components
- React Router for navigation
- Axios for API calls

**Backend:**
- Node.js + Express + TypeScript
- MongoDB with Mongoose ODM
- JWT authentication
- RESTful API design
- Comprehensive error handling

**AI Services (Optional):**
- Python FastAPI
- LangChain for LLM orchestration
- Whisper for speech recognition
- Transformers for emotion detection

### Project Structure

```
EduGame4ALL/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── api/           # API client functions
│   │   ├── contexts/      # React contexts
│   │   └── types/         # TypeScript types
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── types/            # TypeScript interfaces
│   ├── utils/            # Utilities
│   ├── scripts/          # Testing & seed scripts
│   └── package.json
├── shared/               # Shared types & constants
│   └── types/
├── ai-services/          # Python AI services (optional)
│   ├── api/
│   ├── services/
│   └── requirements-ai.txt
└── package.json          # Root workspace config
```

---

## 🎮 Features in Detail

### Games System
Play educational games across three categories:
- **Language Games**: Vocabulary, grammar, pronunciation
- **Cultural Games**: Traditions, customs, local knowledge
- **Soft Skills**: Communication, teamwork, job skills

Each game provides:
- Multiple-choice questions
- Timed challenges
- Instant feedback
- XP rewards based on performance
- AI-generated personalized tips

### XP & Leveling
- **Multi-Category Progression**: Language, Culture, Soft Skills
- **Global Level**: Overall player progress
- **Category Levels**: Specialized skill tracking
- **Automatic Badge Awards**: Unlock achievements at milestones
- **Leaderboards**: Compete globally and per category

### Badges & Achievements
14 badges across 4 categories:
- **Language Badges**: First Words, Conversationalist, Fluent Speaker, etc.
- **Culture Badges**: Cultural Explorer, Tradition Keeper, etc.
- **Soft Skills**: Team Player, Leader, Professional, etc.
- **Achievements**: First Steps, Streak Master, Perfectionist, etc.

### Daily Challenges
Auto-generated daily challenges:
- Play X games
- Earn X XP
- Complete category games
- Achieve perfect scores
- Focus on specific skills

Rewards: Bonus XP + special badges

### Rewards Store
Redeem XP for:
- **Gift Cards**: Amazon, Target, Walmart
- **Courses**: Language courses, professional certifications
- **Discounts**: Services, products for immigrants
- **Events**: Cultural events, workshops

All rewards include QR codes for verification.

### Resources Hub
Curated resources for immigrants:
- **Jobs**: With AI-powered match scoring based on skills
- **Grants**: Funding opportunities with eligibility info
- **Services**: ESL classes, legal aid, healthcare
- **News**: Immigration updates with difficulty ratings

---

## 🧪 Testing

### Run Test Suites

```bash
# XP System
npm run test:xp

# Streak Tracking
npm run test:streak

# Games CRUD
npm run test:games

# Progress & Badges
npm run test:progress

# Daily Challenges
npm run test:challenges

# Resources
npm run test:resources

# Rewards
npm run test:rewards

# Dashboard
npm run test:dashboard
```

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed testing procedures.

---

## 🔧 Development

### Available Scripts

```bash
# Install all dependencies
npm install

# Start development (all services)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Seed database
npm run seed

# Clean database
npm run cleanup-db
```

### API Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

**Games:**
- `GET /api/games` - List games
- `GET /api/games/:id` - Get game details
- `POST /api/games/:id/session` - Submit game session
- `GET /api/games/sessions` - Get user's game sessions

**Progress:**
- `GET /api/progress/badges` - Get user badges
- `GET /api/progress/history` - Get game history
- `GET /api/progress/weekly-report` - Get weekly analytics

**XP & Leveling:**
- `GET /api/xp/profile` - Get XP profile
- `GET /api/xp/leaderboard` - Get leaderboard

**Challenges:**
- `GET /api/challenges/daily` - Get today's challenge
- `POST /api/challenges/:id/complete` - Complete challenge
- `GET /api/challenges/history` - Get challenge history

**Rewards:**
- `GET /api/rewards` - List rewards
- `POST /api/rewards/:id/redeem` - Redeem reward
- `GET /api/rewards/user` - Get user's rewards

**Resources:**
- `GET /api/resources/jobs` - List job opportunities
- `GET /api/resources/grants` - List grants
- `GET /api/resources/services` - List services
- `GET /api/resources/news` - List news

**Dashboard:**
- `GET /api/dashboard` - Get dashboard data

**Profile:**
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

---

## 🤝 Contributing

This project was created for Hack4Edu 2025. Contributions, issues, and feature requests are welcome!

### Development Guidelines
1. Follow TypeScript best practices
2. Write meaningful commit messages
3. Test your changes
4. Update documentation
5. Follow existing code style

---

## 📄 License

This project is part of Hack4Edu 2025 hackathon.

---

## 🙏 Acknowledgments

- **Hack4Edu 2025** for the opportunity
- **Anthropic** for Claude AI assistance
- **OpenAI** for LLM capabilities
- Open source community for amazing tools

---

## 📞 Support

For questions, issues, or support:
1. Check [TESTING_GUIDE.md](TESTING_GUIDE.md)
2. Review [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
3. Search existing issues
4. Create a new issue with details

---

## 🎯 Project Status

✅ **Complete** - All core features implemented and tested
- Full gaming system with 15+ games
- XP & leveling with multi-category progression
- Badges & achievements system
- Daily challenges with rewards
- Resources hub for community support
- AI integration (optional)
- Comprehensive testing suite
- Production-ready deployment

---

<div align="center">

**Made with ❤️ for Immigrant & Refugee Communities**

*Empowering through education, one game at a time.*

[🚀 Get Started](#-quick-start) | [📚 Documentation](#-documentation) | [🧪 Testing](#-testing)

</div>
