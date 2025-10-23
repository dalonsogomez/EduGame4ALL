# Database Seed Script Implementation

## Overview
This document describes the complete implementation of the database seed script for the EduGame4All platform, including all database models, services, API routes, and seed data.

## What Was Implemented

### 1. Database Models (8 new models)

#### Game Model (`server/models/Game.ts`)
- Stores educational games with questions, categories, difficulty levels, and XP rewards
- Categories: language, culture, soft-skills
- Difficulty: 1-5 stars
- Includes questions array with multiple choice options

#### Badge Model (`server/models/Badge.ts`)
- Achievement badges users can earn
- Categories: language, culture, soft-skills, achievement
- XP requirements and level system (1-5)

#### Reward Model (`server/models/Reward.ts`)
- Redeemable rewards in the XP store
- Categories: gift-cards, courses, discounts, events
- Tracks available quantity and XP cost

#### UserProgress Model (`server/models/UserProgress.ts`)
- Tracks user's overall progress and skill levels
- Maintains streak, weekly goals, and skill-specific XP
- Skills: language, culture, softSkills

#### GameSession Model (`server/models/GameSession.ts`)
- Records completed game sessions
- Stores score, answers, time spent, and XP earned

#### UserBadge Model (`server/models/UserBadge.ts`)
- Links users to earned badges
- Tracks progress toward earning each badge (0-100%)

#### UserReward Model (`server/models/UserReward.ts`)
- Records redeemed rewards
- Status: active, used, expired
- Generates unique QR codes for redemption

#### Resource Model (`server/models/Resource.ts`)
- Community resources (jobs, grants, services, news)
- Type-specific fields for each resource category

### 2. Service Layer (5 new services)

#### GameService (`server/services/gameService.ts`)
- `getGames()` - Fetch games with optional filters (category, difficulty)
- `getGameById()` - Get single game details
- `submitGameSession()` - Submit completed game session and update progress
- `updateUserProgress()` - Internal method to update user XP and skills

#### ProgressService (`server/services/progressService.ts`)
- `getUserProgress()` - Get user's overall progress
- `getUserBadges()` - Get all badges with user's progress
- `checkAndAwardBadges()` - Check and award earned badges
- `getGameHistory()` - Get user's game session history
- `getWeeklyReport()` - Generate weekly performance report with insights

#### RewardService (`server/services/rewardService.ts`)
- `getRewards()` - Get available rewards
- `redeemReward()` - Redeem reward with XP
- `getUserRewards()` - Get user's redeemed rewards
- `markRewardAsUsed()` - Mark reward as used
- `expireOldRewards()` - Expire old rewards (can be run as cron job)

#### ResourceService (`server/services/resourceService.ts`)
- `getJobs()` - Get job listings with filters
- `getGrants()` - Get available grants
- `getServices()` - Get community services
- `getNews()` - Get news articles

#### DashboardService (`server/services/dashboardService.ts`)
- `getDashboardData()` - Get comprehensive dashboard data
- Includes user stats, recent activity, leaderboard, daily challenge, recommended games

### 3. API Routes (5 new route files)

#### Game Routes (`server/routes/gameRoutes.ts`)
- `GET /api/games` - Get all games with optional filters
- `GET /api/games/:id` - Get game by ID
- `POST /api/games/:id/session` - Submit game session

#### Progress Routes (`server/routes/progressRoutes.ts`)
- `GET /api/progress/badges` - Get user badges with progress
- `GET /api/progress/history` - Get game history
- `GET /api/progress/weekly-report` - Get weekly performance report

#### Reward Routes (`server/routes/rewardRoutes.ts`)
- `GET /api/rewards` - Get available rewards
- `POST /api/rewards/:id/redeem` - Redeem a reward
- `GET /api/rewards/my-rewards` - Get user's redeemed rewards

#### Resource Routes (`server/routes/resourceRoutes.ts`)
- `GET /api/resources/jobs` - Get job listings
- `GET /api/resources/grants` - Get grants
- `GET /api/resources/services` - Get community services
- `GET /api/resources/news` - Get news articles

#### Dashboard Routes (`server/routes/dashboardRoutes.ts`)
- `GET /api/dashboard` - Get comprehensive dashboard data

### 4. Seed Script (`server/scripts/seed.ts`)

The seed script populates the database with:

#### Admin User
- Email: `admin@edugame4all.com`
- Password: `Admin@123`
- Role: admin

#### Games (8 total)
- **Language Games (3):**
  - English Basics (Difficulty 1, 50 XP)
  - Conversational English (Difficulty 2, 75 XP)
  - Business English (Difficulty 3, 100 XP)

- **Culture Games (2):**
  - American Culture 101 (Difficulty 1, 60 XP)
  - Workplace Culture (Difficulty 2, 80 XP)

- **Soft Skills Games (3):**
  - Communication Skills (Difficulty 2, 75 XP)
  - Time Management (Difficulty 2, 70 XP)
  - Problem Solving (Difficulty 3, 90 XP)

#### Badges (14 total)
- Language badges (3 levels)
- Culture badges (3 levels)
- Soft skills badges (3 levels)
- Achievement badges (5 badges for milestones)

#### Rewards (10 total)
- Gift cards: $10 Amazon, $25 Target, $50 Visa
- Courses: Online course access, workshops
- Discounts: Restaurant, gym, transportation
- Events: Networking, career fair

#### Community Resources (16 total)
- Jobs (4): Customer service, warehouse, restaurant, software developer
- Grants (3): New Americans, ESL, Small business
- Services (5): Legal, ESL classes, job placement, healthcare, housing
- News (4): Recent community news and updates

## How to Use

### Running the Seed Script

```bash
cd server
npm run seed
```

This will:
1. Connect to MongoDB
2. Clear existing games, badges, rewards, and resources
3. Create admin user (if not exists)
4. Populate all seed data
5. Display summary of created records

### Running the Server

```bash
cd server
npm run dev
```

The server will start on port 3000 with all routes registered.

### Available Endpoints

All endpoints require authentication (JWT token in Authorization header).

**Dashboard:**
- GET `/api/dashboard` - Get all dashboard data

**Games:**
- GET `/api/games?category=language&difficulty=2` - List games
- GET `/api/games/:id` - Get game details
- POST `/api/games/:id/session` - Submit game session

**Progress:**
- GET `/api/progress/badges` - Get user badges
- GET `/api/progress/history` - Get game history
- GET `/api/progress/weekly-report` - Get weekly report

**Rewards:**
- GET `/api/rewards?category=gift-cards` - List rewards
- POST `/api/rewards/:id/redeem` - Redeem reward
- GET `/api/rewards/my-rewards?status=active` - Get user rewards

**Resources:**
- GET `/api/resources/jobs` - List jobs
- GET `/api/resources/grants` - List grants
- GET `/api/resources/services` - List services
- GET `/api/resources/news` - List news

## Database Schema Summary

```
Users (existing)
├── UserProgress (1:1)
├── GameSessions (1:many)
├── UserBadges (many:many with Badges)
└── UserRewards (many:many with Rewards)

Games
└── GameSessions (1:many)

Badges
└── UserBadges (1:many)

Rewards
└── UserRewards (1:many)

Resources (standalone)
```

## Key Features

### XP System
- Users earn XP by playing games
- XP is proportional to score achieved
- XP contributes to overall level and skill-specific levels
- Level calculation: Level = Math.floor(totalXP / 100) + 1

### Badge System
- Badges have XP requirements
- Progress is calculated automatically based on user's XP
- Badges are awarded when progress reaches 100%

### Reward System
- Users can redeem rewards using earned XP
- Each redemption generates unique QR code
- Rewards have expiry dates
- Available quantity is tracked

### Streak System
- Tracks consecutive days of activity
- Resets if user misses a day
- Updated automatically on game completion

### Leaderboard
- Ranks users by total XP
- Displays top 10 users
- Highlights current user's position

## Logging

All services include meaningful console logs:
- Service name in brackets: `[GameService]`, `[ProgressService]`, etc.
- Action being performed
- Results or errors

Example:
```
[GameService] Fetching games with filters: { category: 'language' }
[GameService] Found 3 games
```

## Error Handling

All routes include proper error handling:
- Input validation (IDs, required fields)
- Try-catch blocks
- Appropriate HTTP status codes
- Error messages in response

## Testing the Implementation

1. **Seed the database:**
   ```bash
   cd server && npm run seed
   ```

2. **Start the server:**
   ```bash
   cd server && npm run dev
   ```

3. **Register a test user:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test@123"}'
   ```

4. **Login and get token:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test@123"}'
   ```

5. **Test endpoints with token:**
   ```bash
   curl http://localhost:3000/api/games \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

## Future Enhancements

Potential improvements for the seed script:
1. Add more diverse game content
2. Include difficulty progression recommendations
3. Add seasonal rewards and limited-time events
4. Create user personas with sample progress data
5. Add multi-language support for games
6. Include achievement milestones
7. Add community challenges

## Files Modified/Created

### Created (23 files):
- `server/models/Game.ts`
- `server/models/Badge.ts`
- `server/models/Reward.ts`
- `server/models/UserProgress.ts`
- `server/models/GameSession.ts`
- `server/models/UserBadge.ts`
- `server/models/UserReward.ts`
- `server/models/Resource.ts`
- `server/services/gameService.ts`
- `server/services/progressService.ts`
- `server/services/rewardService.ts`
- `server/services/resourceService.ts`
- `server/services/dashboardService.ts`
- `server/routes/gameRoutes.ts`
- `server/routes/progressRoutes.ts`
- `server/routes/rewardRoutes.ts`
- `server/routes/resourceRoutes.ts`
- `server/routes/dashboardRoutes.ts`
- `server/scripts/seed.ts`

### Modified (2 files):
- `server/server.ts` - Added route registrations
- `server/package.json` - Added seed script

## Notes

- All endpoints require authentication using JWT tokens
- The seed script is idempotent for the admin user
- Games, badges, rewards, and resources are cleared and recreated on each seed
- User data (UserProgress, GameSessions, UserBadges, UserRewards) is preserved
- All MongoDB indexes are properly configured for query optimization
- The implementation follows RESTful API conventions
- All code includes proper TypeScript typing
- Services include business logic, routes handle HTTP concerns
