# 🧪 EduGame4ALL - Testing Guide

## Overview
Comprehensive testing guide for all features and functionalities.

## 📋 Prerequisites

```bash
# Ensure database is running
# MongoDB local or Atlas connection

# Install dependencies
npm install

# Seed database with test data
npm run seed
```

## 🎯 Available Test Scripts

All test scripts are located in `server/scripts/` and can be run directly:

### 1. XP & Leveling System

```bash
npm run test:xp
```

**Tests:**
- Multi-category XP tracking (language, culture, soft-skills)
- Level progression calculations
- Badge awards based on XP/level
- Global and category leaderboards
- XP profile retrieval

**Expected Results:**
- User levels up after earning XP
- Category-specific skills increase
- Badges automatically awarded at milestones
- Leaderboard rankings update

---

### 2. Streak Tracking System

```bash
npm run test:streak
```

**Tests:**
- Streak initialization on registration
- Daily login streak updates
- Game play activity tracking
- Streak expiration after missed days
- Bonus XP for maintaining streaks

**Expected Results:**
- Streak increments on daily activity
- Resets to 1 after missed day
- Longest streak tracked
- Last activity date updated

---

### 3. Games CRUD Operations

```bash
npm run test:games
```

**Tests:**
- Create new games (admin)
- List all games with filters
- Get game by ID
- Update game details
- Soft delete games
- Game session creation
- AI-powered feedback generation

**Expected Results:**
- Games created with questions
- Filters work (category, difficulty)
- Only active games shown to users
- Sessions track answers and XP

---

### 4. Progress & Badges

```bash
npm run test:progress
```

**Tests:**
- Badge progress tracking (0-100%)
- Game history retrieval
- Weekly performance reports
- AI-generated insights
- Category-based statistics

**Expected Results:**
- Badges show completion percentage
- History lists recent game sessions
- Weekly report includes XP, games played, accuracy
- AI provides personalized recommendations

---

### 5. Daily Challenges

```bash
npm run test:challenges
```

**Tests:**
- Daily challenge generation
- Challenge types (play_games, earn_xp, etc.)
- Progress tracking
- Challenge completion
- Bonus XP and badge rewards

**Expected Results:**
- New challenge available daily
- Progress updates as user plays
- Completion awards bonus XP
- Challenge history tracked

---

### 6. Resources Hub

```bash
npm run test:resources
```

**Tests:**
- Jobs listing with match scores
- Grants/funding opportunities
- Community services nearby
- Immigration news
- Filtering by category/type
- Match score calculation based on user skills

**Expected Results:**
- Resources filtered by type
- Jobs show relevance match (0-100%)
- Grants show eligibility
- Services include contact info

---

### 7. Rewards System

```bash
npm run test:rewards
```

**Tests:**
- List available rewards by category
- XP-based redemption
- QR code generation
- Reward status tracking (active/used)
- Reward history

**Expected Results:**
- Rewards cost XP to redeem
- QR codes generated for verification
- Insufficient XP prevents redemption
- User's redeemed rewards tracked

---

### 8. Dashboard Analytics

```bash
npm run test:dashboard
```

**Tests:**
- User stats (games played, XP, level)
- Skill breakdown by category
- Recent activity timeline
- Daily challenge status
- Leaderboard position

**Expected Results:**
- Comprehensive user overview
- Skills show level progression
- Activity shows recent games
- Challenge shows today's task

---

### 9. User Profile

```bash
npm run test:profile
```

**Tests:**
- Profile retrieval
- Profile updates (name, location, languages)
- Avatar/photo upload
- User type (child/adult/educator)
- Language preferences

**Expected Results:**
- Profile data persists
- Updates reflect immediately
- Personal info properly stored

---

## 🔄 End-to-End Testing Flow

### Complete User Journey

```bash
# 1. Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123",
    "name": "Test User"
  }'

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
# Save the token from response

# 3. Get games
curl http://localhost:3000/api/games \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Play a game
curl -X POST http://localhost:3000/api/games/GAME_ID/session \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "score": 8,
    "maxScore": 10,
    "timeSpent": 120,
    "answers": [
      {"questionIndex": 0, "selectedAnswer": 2, "isCorrect": true, "pointsEarned": 10}
    ]
  }'

# 5. Check progress
curl http://localhost:3000/api/progress/badges \
  -H "Authorization: Bearer YOUR_TOKEN"

# 6. View dashboard
curl http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎮 Frontend Testing (Manual)

### 1. User Registration & Login

1. Navigate to http://localhost:5173
2. Click "Register"
3. Fill form with valid data
4. Submit and verify redirect to login
5. Login with credentials
6. Verify redirect to dashboard

### 2. Games Catalog

1. Navigate to "Games" page
2. Verify games load with thumbnails
3. Test category filter (Language, Culture, Soft Skills)
4. Test difficulty filter (1-5)
5. Click on a game card
6. Verify game details page loads

### 3. Game Play

1. Start a game
2. Answer questions
3. Submit answers
4. Verify feedback display:
   - XP earned
   - Score
   - AI-generated tips
   - Next recommendations
5. Check XP increase in header

### 4. Progress Page

1. Navigate to "Progress" page
2. Verify badge grid displays
3. Check badge progress bars
4. View game history list
5. Check weekly report:
   - Games played
   - XP earned
   - AI insights
   - Activity chart

### 5. Rewards

1. Navigate to "Rewards" page
2. Browse available rewards
3. Filter by category
4. Attempt to redeem:
   - With sufficient XP
   - With insufficient XP
5. View "My Rewards" section
6. Check QR code displays

### 6. Resources

1. Navigate to "Resources" page
2. Switch between tabs:
   - Jobs
   - Grants
   - Services
   - News
3. Verify match scores (Jobs)
4. Test "Learn More" links
5. Check contact information (Services)

### 7. Dashboard

1. View dashboard overview
2. Check daily challenge card
3. View skill progress rings
4. See recent activity
5. Check leaderboard position

---

## 🤖 AI Features Testing

### 1. Game Feedback (requires AI service or uses fallback)

```bash
# Start AI service (optional)
cd ai-services
python api/main.py

# Play game and check feedback
# Should receive personalized tips based on performance
```

### 2. Weekly Insights

```bash
# View weekly report
curl http://localhost:3000/api/progress/weekly-report \
  -H "Authorization: Bearer YOUR_TOKEN"

# Verify AI-generated insights:
# - Strengths identified
# - Improvement suggestions
# - Behavioral patterns
# - Encouraging summary
```

### 3. Voice Recording (if AI services running)

1. Navigate to game with voice input
2. Click microphone button
3. Record speech
4. Verify transcription appears
5. Check emotion detection feedback

---

## 📊 Database Testing

### Manual Database Inspection

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/edugame4all

# Check collections
show collections

# View users
db.users.find().pretty()

# View games
db.games.find().pretty()

# View game sessions
db.gamesessions.find().sort({createdAt: -1}).limit(5).pretty()

# Check user progress
db.userprogresses.find().pretty()

# View badges
db.badges.find().pretty()

# Check user badges (progress)
db.userbadges.find().pretty()
```

---

## 🔍 Common Issues & Solutions

### Issue: Games not loading
**Solution:**
```bash
# Reseed database
npm run seed
```

### Issue: No AI feedback
**Solution:**
- AI services are optional
- System uses intelligent fallback
- Check `AI_SERVICE_URL` in `.env`

### Issue: Badges not appearing
**Solution:**
```bash
# Check database
db.badges.countDocuments()
# Should be 14 badges

# Reseed if needed
npm run seed
```

### Issue: XP not updating
**Solution:**
- Verify game session created
- Check `db.gamesessions.find()`
- Ensure XP service is working
- Review server logs

### Issue: Streak not incrementing
**Solution:**
- Check last activity date
- Verify timezone settings
- Ensure login endpoint called
- Check `db.userprogresses.find()`

---

## 📈 Performance Testing

### Load Testing with Artillery

```bash
# Install Artillery
npm install -g artillery

# Create artillery.yml
# Run load test
artillery run artillery.yml
```

Example `artillery.yml`:
```yaml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - flow:
      - post:
          url: '/api/auth/login'
          json:
            email: 'user1@test.com'
            password: 'Test@123'
      - get:
          url: '/api/games'
      - get:
          url: '/api/dashboard'
```

---

## ✅ Testing Checklist

### Core Features
- [ ] User registration works
- [ ] Login/logout functional
- [ ] JWT tokens valid
- [ ] Games load correctly
- [ ] Game sessions save
- [ ] XP awards properly
- [ ] Levels increase
- [ ] Badges unlock
- [ ] Streak tracks daily
- [ ] Challenges generate
- [ ] Rewards redeemable
- [ ] Resources load
- [ ] Dashboard displays
- [ ] Profile updates

### UI/UX
- [ ] Mobile responsive
- [ ] Loading states shown
- [ ] Error messages clear
- [ ] Navigation intuitive
- [ ] Forms validate
- [ ] Success feedback shown

### Security
- [ ] Passwords hashed
- [ ] JWT required for protected routes
- [ ] CORS configured
- [ ] Input sanitized
- [ ] SQL injection prevented
- [ ] XSS prevented

### Performance
- [ ] Pages load < 2s
- [ ] API responses < 500ms
- [ ] Database queries optimized
- [ ] Images optimized
- [ ] No memory leaks

---

## 🎓 Test Data

### Default Admin
- **Email:** admin@edugame4all.com
- **Password:** Admin@123

### Test Users
- **Email:** user1@test.com, user2@test.com
- **Password:** Test@123

### Sample Data
- **15 Games** across 3 categories
- **14 Badges** in 4 categories
- **12 Rewards** available
- **50+ Resources** (jobs, grants, services, news)

---

## 📞 Support

If tests fail:
1. Check server logs
2. Verify MongoDB connection
3. Ensure seed data loaded
4. Review `.env` configuration
5. Check Node.js version (18+)

---

**Happy Testing!** 🎉

Generated for EduGame4ALL - Hack4Edu 2025
