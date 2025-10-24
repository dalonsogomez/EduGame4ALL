# Games Management CRUD Implementation

## Overview

This document describes the implementation of full CRUD (Create, Read, Update, Delete) operations for games management in the EduGame4All platform, including filtering capabilities by category and difficulty.

## Features Implemented

1. **Create Game** - Admin-only endpoint to create new educational games with questions
2. **Read Games** - Retrieve games with optional filtering by category and difficulty
3. **Update Game** - Admin-only endpoint to update existing games
4. **Delete Game** - Admin-only soft delete that sets `isActive` to false
5. **Filter Games** - Support for filtering by category, difficulty, or both
6. **Admin Game Listing** - Admin-only endpoint to view all games including inactive ones

## Architecture

### Database Model

**Game Model** (`server/models/Game.ts`)
- Already existed with complete schema
- Includes support for:
  - Multiple categories: language, culture, soft-skills
  - Difficulty levels: 1-5
  - Questions with multiple-choice options
  - XP rewards and duration tracking
  - Active/inactive status for soft deletes

### Service Layer

**GameService** (`server/services/gameService.ts`)

New methods added:
- `createGame()` - Create new game with validation
- `updateGame()` - Update existing game with validation
- `deleteGame()` - Soft delete by setting isActive to false
- `getAllGames()` - Retrieve all games including inactive (admin only)

Existing methods (already implemented):
- `getGames()` - Get active games with optional filters
- `getGameById()` - Get specific game by ID

### API Endpoints

**Game Routes** (`server/routes/gameRoutes.ts`)

#### User Endpoints (All Roles)

1. **GET /api/games**
   - Get all active games
   - Query params: `category`, `difficulty`
   - Response: `{ games: Array<Game> }`

2. **GET /api/games/:id**
   - Get specific game by ID
   - Response: `{ game: Game }`

3. **POST /api/games/:id/session**
   - Submit game session (already existed)
   - Body: `{ score, maxScore, timeSpent, answers }`
   - Response: `{ session, xpEarned, feedback }`

4. **GET /api/games/sessions**
   - Get user's game sessions (already existed)
   - Query params: `gameId`, `startDate`, `endDate`, `limit`
   - Response: `{ sessions: Array<GameSession> }`

5. **GET /api/games/sessions/:sessionId**
   - Get specific game session (already existed)
   - Response: `{ session: GameSession }`

#### Admin Endpoints (Admin Only)

6. **POST /api/games**
   - Create new game
   - Body: `{ title, description, category, difficulty, duration, xpReward, thumbnailUrl?, questions }`
   - Response: `{ game: Game }`

7. **PUT /api/games/:id**
   - Update existing game
   - Body: Partial game data
   - Response: `{ game: Game }`

8. **DELETE /api/games/:id**
   - Soft delete game
   - Response: `{ message, game: Game }`

9. **GET /api/games/admin/all**
   - Get all games including inactive
   - Query params: `category`, `difficulty`, `isActive`
   - Response: `{ games: Array<Game> }`

### Frontend API Client

**Games API** (`client/src/api/games.ts`)

New functions added:
- `createGame()` - Create game (admin)
- `updateGame()` - Update game (admin)
- `deleteGame()` - Delete game (admin)
- `getAllGames()` - Get all games including inactive (admin)

Existing functions (already implemented):
- `getGames()` - Get active games with filters
- `getGameById()` - Get specific game
- `submitGameSession()` - Submit game session
- `getGameSession()` - Get specific session
- `getGameSessions()` - Get user sessions

## Validation

### Game Creation/Update Validation

1. **Difficulty**: Must be between 1 and 5
2. **Category**: Must be one of: language, culture, soft-skills
3. **Questions**:
   - At least one question required
   - Each question must have at least 2 options
   - Correct answer index must be within options bounds
4. **Required Fields**: title, description, category, difficulty, duration, xpReward, questions

### Authorization

- Create, Update, Delete operations require admin role
- Read operations available to all authenticated users
- Enforced through `requireUser([ROLES.ADMIN])` middleware

## Testing

### Test Script

**Location**: `server/scripts/test-games-crud.ts`

**Run Command**: `npm run test:games-crud`

**Tests Included**:
1. Admin login authentication
2. Create new game with questions
3. Fetch all games (admin endpoint)
4. Filter games by category
5. Filter games by difficulty
6. Filter games by category AND difficulty
7. Get specific game by ID
8. Update game (title, difficulty, xpReward)
9. Delete game (soft delete)
10. Verify deleted game not in regular listing
11. Verify deleted game appears in admin listing
12. Verify non-admin users cannot create games

### Running Tests

```bash
# Make sure server is running first
cd server
npm run dev

# In another terminal
npm run test:games-crud
```

## Example Usage

### Admin: Create a New Game

```javascript
import { createGame } from '@/api/games';

const newGame = await createGame({
  title: 'Spanish Greetings',
  description: 'Learn common Spanish greetings',
  category: 'language',
  difficulty: 1,
  duration: 10,
  xpReward: 100,
  thumbnailUrl: 'https://example.com/spanish-greetings.jpg',
  questions: [
    {
      question: 'How do you say "Hello" in Spanish?',
      options: ['Hola', 'Adiós', 'Gracias', 'Por favor'],
      correctAnswer: 0,
      explanation: 'Hola means hello in Spanish',
      points: 10
    }
  ]
});
```

### User: Get Filtered Games

```javascript
import { getGames } from '@/api/games';

// Get all language games
const languageGames = await getGames({ category: 'language' });

// Get all difficulty 3 games
const hardGames = await getGames({ difficulty: 3 });

// Get language games with difficulty 2
const filteredGames = await getGames({
  category: 'language',
  difficulty: 2
});
```

### Admin: Update a Game

```javascript
import { updateGame } from '@/api/games';

const updated = await updateGame(gameId, {
  difficulty: 3,
  xpReward: 200,
  isActive: true
});
```

### Admin: Delete a Game

```javascript
import { deleteGame } from '@/api/games';

const result = await deleteGame(gameId);
// Game is soft deleted (isActive = false)
// Still accessible via admin endpoints
```

### Admin: View All Games

```javascript
import { getAllGames } from '@/api/games';

// Get all games including inactive
const allGames = await getAllGames();

// Get only inactive games
const inactiveGames = await getAllGames({ isActive: false });
```

## Security Considerations

1. **Role-Based Access Control**: Admin operations protected by middleware
2. **Input Validation**: All inputs validated before database operations
3. **Soft Deletes**: Games are never permanently deleted, only marked inactive
4. **MongoDB ObjectId Validation**: All IDs validated before queries
5. **Error Handling**: Comprehensive error handling with meaningful messages

## Logging

The implementation includes strategic logging at key points:

- `[GameService]` prefix for service-level operations
- `[GameRoutes]` prefix for route-level operations
- Logs include:
  - Game creation with ID
  - Game updates with ID
  - Game deletions with ID
  - Filter operations
  - Error messages with context

## Database Indexes

The Game model includes indexes for optimal query performance:

```javascript
GameSchema.index({ category: 1, difficulty: 1, isActive: 1 });
```

This supports efficient filtering by category, difficulty, and active status.

## Future Enhancements

Potential improvements:
1. Bulk game operations (create/update/delete multiple)
2. Game templates for quick creation
3. Version history tracking
4. Game analytics and popularity metrics
5. User-generated content moderation workflow
6. Multi-language support for game content
7. Rich media support (images, audio, video in questions)
8. Advanced question types (fill-in-blank, matching, etc.)

## Related Documentation

- [SEED_IMPLEMENTATION.md](./SEED_IMPLEMENTATION.md) - Database seeding including games
- [GAME_SESSION_IMPLEMENTATION.md](./GAME_SESSION_IMPLEMENTATION.md) - Game session tracking
- [DASHBOARD_IMPLEMENTATION.md](./DASHBOARD_IMPLEMENTATION.md) - Dashboard integration

## Support

For issues or questions about games management:
1. Check test script output for specific error messages
2. Review logs with `[GameService]` and `[GameRoutes]` prefixes
3. Verify admin role is properly assigned to user
4. Ensure database connection is active
5. Confirm required fields are provided in requests
