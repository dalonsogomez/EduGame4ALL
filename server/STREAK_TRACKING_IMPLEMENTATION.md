# Streak Tracking System Implementation

## Overview
The Streak Tracking System monitors daily user logins and game plays, automatically maintaining and resetting streaks based on user activity. This implementation provides a complete backend service with API endpoints, service layer, and comprehensive testing.

## Features
- ✅ Automatic streak updates on login
- ✅ Automatic streak updates on game completion
- ✅ Intelligent streak management (increment, maintain, or reset)
- ✅ Same-day activity protection (no duplicate increments)
- ✅ Automatic streak expiration after missed days
- ✅ Streak statistics and leaderboards
- ✅ Admin maintenance tasks for expired streaks
- ✅ RESTful API endpoints
- ✅ Full TypeScript support
- ✅ Comprehensive test coverage

## Architecture

### 1. Database Model
The streak data is stored in the existing `UserProgress` model:

```typescript
// server/models/UserProgress.ts
{
  userId: ObjectId,
  streak: number,              // Current consecutive days streak
  lastActivityDate: Date,      // Last time user was active
  // ... other fields
}
```

### 2. Service Layer

**File**: `server/services/streakService.ts`

#### Core Methods:

##### `updateStreak(userId: ObjectId): Promise<IUserProgress>`
Updates user streak based on last activity date:
- **Same day**: No change
- **Consecutive day**: Increment by 1
- **Missed days**: Reset to 1

##### `getStreakInfo(userId: ObjectId): Promise<StreakInfo>`
Returns current streak information:
```typescript
{
  currentStreak: number,
  lastActivityDate: Date,
  isActiveToday: boolean,
  daysUntilReset: number
}
```

##### `resetStreak(userId: ObjectId): Promise<IUserProgress | null>`
Manually resets a user's streak to 0.

##### `getStreakStatistics(): Promise<StreakStatistics>`
Returns platform-wide streak statistics:
```typescript
{
  totalUsers: number,
  usersWithActiveStreaks: number,
  averageStreak: number,
  longestStreak: number,
  topStreaks: Array<{
    userId: string,
    streak: number,
    username: string
  }>
}
```

##### `checkAndResetExpiredStreaks(): Promise<ResetResult>`
Maintenance task to reset all expired streaks (can be run as cron job).

### 3. API Routes

**File**: `server/routes/streakRoutes.ts`

#### Endpoints:

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/streak` | User | Get current user's streak info |
| POST | `/api/streak/update` | User | Manually trigger streak update |
| POST | `/api/streak/reset` | User | Reset own streak to 0 |
| GET | `/api/streak/statistics` | Admin | Get platform-wide stats |
| POST | `/api/streak/reset-expired` | Admin | Reset all expired streaks |

#### Example Requests:

**Get Streak Info:**
```bash
GET /api/streak
Authorization: Bearer <token>

Response:
{
  "currentStreak": 7,
  "lastActivityDate": "2024-01-15T10:30:00.000Z",
  "isActiveToday": true,
  "daysUntilReset": 1
}
```

**Manual Update:**
```bash
POST /api/streak/update
Authorization: Bearer <token>

Response:
{
  "streak": 7,
  "lastActivityDate": "2024-01-15T10:30:00.000Z",
  "message": "Streak updated successfully"
}
```

**Get Statistics (Admin):**
```bash
GET /api/streak/statistics
Authorization: Bearer <admin-token>

Response:
{
  "totalUsers": 150,
  "usersWithActiveStreaks": 87,
  "averageStreak": 4,
  "longestStreak": 45,
  "topStreaks": [
    { "userId": "...", "streak": 45, "username": "JohnDoe" },
    { "userId": "...", "streak": 32, "username": "JaneSmith" }
  ]
}
```

### 4. Integration Points

#### Login Integration
**File**: `server/routes/authRoutes.ts`

Streaks are automatically updated when users log in:
```typescript
// After successful authentication
await StreakService.updateStreak(userId);
```

#### Game Play Integration
**File**: `server/services/gameService.ts`

Streaks are automatically updated after game completion:
```typescript
// After game session is saved and XP is awarded
await StreakService.updateStreak(userId);
```

### 5. Frontend API Client

**File**: `client/src/api/streak.ts`

TypeScript API client functions:
- `getStreakInfo()`: Get current streak
- `updateStreak()`: Manually update streak
- `resetMyStreak()`: Reset own streak
- `getStreakStatistics()`: Get stats (admin)
- `resetExpiredStreaks()`: Reset expired (admin)

#### Usage Example:
```typescript
import { getStreakInfo } from '@/api/streak';

const streakInfo = await getStreakInfo();
console.log(`Current streak: ${streakInfo.currentStreak} days`);
```

### 6. Dashboard Integration

The dashboard already displays streak information through the `WelcomeBanner` component:
```typescript
// client/src/components/dashboard/WelcomeBanner.tsx
<Flame className="h-5 w-5 text-orange-300" />
<span className="font-semibold">{streak} day streak!</span>
```

The streak value is fetched from the user's progress data in the dashboard API.

## Streak Logic

### Day Calculation
Days are calculated using start-of-day timestamps (ignoring time):
```typescript
const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const lastActivityStart = new Date(
  lastActivity.getFullYear(),
  lastActivity.getMonth(),
  lastActivity.getDate()
);
const daysDifference = Math.floor(
  (todayStart.getTime() - lastActivityStart.getTime()) / (1000 * 60 * 60 * 24)
);
```

### Update Rules
- **Days Difference = 0**: Same day → No change
- **Days Difference = 1**: Consecutive day → Increment by 1
- **Days Difference > 1**: Missed days → Reset to 1

### Examples
1. User logs in Monday, plays game Monday → Streak: 1
2. User logs in Tuesday → Streak: 2
3. User plays game Tuesday → Streak: 2 (no change, same day)
4. User logs in Thursday (missed Wednesday) → Streak: 1 (reset)

## Testing

### Test Scripts

#### 1. End-to-End API Tests
**File**: `server/scripts/test-streak.ts`

Run: `npm run test:streak`

Tests:
- User registration
- Initial streak state
- Streak update on game play
- Streak update on login
- Manual streak update
- Dashboard integration
- Streak reset
- Admin endpoints

#### 2. Expiration Logic Tests
**File**: `server/scripts/test-streak-expiration.ts`

Run: `npm run test:streak-expiration`

Tests:
- Consecutive day increments
- Same-day duplicate prevention
- Streak reset after missed days
- Active/inactive user detection
- Maintenance task execution
- Statistics calculation

### Running Tests

```bash
# Run API integration tests
npm run test:streak

# Run expiration logic tests
npm run test:streak-expiration

# Start server for testing
npm run dev
```

## Maintenance

### Automated Streak Reset
For production, set up a daily cron job to reset expired streaks:

```bash
# Example cron entry (runs at 00:01 every day)
1 0 * * * curl -X POST http://localhost:3000/api/streak/reset-expired \
  -H "Authorization: Bearer <admin-token>"
```

Or create a scheduled task script:
```typescript
import cron from 'node-cron';
import { StreakService } from './services/streakService';

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily streak maintenance...');
  const result = await StreakService.checkAndResetExpiredStreaks();
  console.log(`Reset ${result.streaksReset} expired streaks`);
});
```

## Performance Considerations

1. **Indexes**: The `UserProgress` collection has indexes on `userId` for fast lookups
2. **Single Query**: Streak updates use a single findOne + save operation
3. **Non-Blocking**: Streak updates don't block login or game completion
4. **Error Handling**: Failures in streak updates don't affect core functionality

## Security

1. **Authentication Required**: All endpoints require valid JWT tokens
2. **User Isolation**: Users can only access their own streak data
3. **Admin Protection**: Statistics and maintenance endpoints are admin-only
4. **Input Validation**: MongoDB ObjectId validation on all user IDs

## Future Enhancements

Potential improvements:
- Streak freeze items (allow 1 missed day)
- Streak notifications/reminders
- Streak achievements and badges
- Streak recovery challenges
- Weekly/monthly streak competitions
- Streak analytics dashboard
- Push notifications for streak milestones

## API Response Examples

### Success Response
```json
{
  "currentStreak": 7,
  "lastActivityDate": "2024-01-15T10:30:00.000Z",
  "isActiveToday": true,
  "daysUntilReset": 1
}
```

### Error Response
```json
{
  "error": "Failed to fetch streak information"
}
```

## Troubleshooting

### Streak Not Updating
1. Check user has valid progress record
2. Verify `lastActivityDate` is being updated
3. Check server logs for errors
4. Ensure date calculations are correct for timezone

### Streak Reset Unexpectedly
1. Verify the days difference calculation
2. Check if maintenance task ran incorrectly
3. Review server timezone settings
4. Check for manual reset actions

### Dashboard Not Showing Streak
1. Ensure dashboard API returns progress data
2. Verify WelcomeBanner receives streak prop
3. Check frontend API client is working
4. Inspect browser console for errors

## Support

For issues or questions:
1. Check server logs for detailed error messages
2. Run test scripts to verify functionality
3. Review this documentation for proper usage
4. Check integration points in auth and game routes
