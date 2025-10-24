import express, { Request, Response } from 'express';
import { GameService } from '../services/gameService';
import { requireUser } from './middlewares/auth';
import { ALL_ROLES, ROLES } from 'shared';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Description: Get all games with optional filters
// Endpoint: GET /api/games
// Request: { category?: string, difficulty?: number }
// Response: { games: Array<Game> }
router.get('/', requireUser(ALL_ROLES), async (req: Request, res: Response) => {
  try {
    const { category, difficulty } = req.query;

    const filters: any = {};
    if (category) filters.category = category as string;
    if (difficulty) filters.difficulty = parseInt(difficulty as string);

    const games = await GameService.getGames(filters);

    res.status(200).json({ games });
  } catch (error: any) {
    console.error(`Error fetching games: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Get user's game sessions with optional filters
// Endpoint: GET /api/games/sessions
// Request: { gameId?: string, startDate?: string, endDate?: string, limit?: number }
// Response: { sessions: Array<GameSession> }
router.get('/sessions', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { gameId, startDate, endDate, limit } = req.query;

    const filters: any = {};

    if (gameId) {
      filters.gameId = gameId as string;
    }

    if (startDate) {
      filters.startDate = new Date(startDate as string);
    }

    if (endDate) {
      filters.endDate = new Date(endDate as string);
    }

    if (limit) {
      filters.limit = parseInt(limit as string);
    }

    const sessions = await GameService.getGameSessions(req.user._id, filters);

    res.status(200).json({ sessions });
  } catch (error: any) {
    console.error(`Error fetching game sessions: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Get specific game session by ID
// Endpoint: GET /api/games/sessions/:sessionId
// Request: {}
// Response: { session: GameSession }
router.get('/sessions/:sessionId', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;

    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const session = await GameService.getGameSession(sessionId, req.user._id);

    if (!session) {
      return res.status(404).json({ error: 'Game session not found' });
    }

    res.status(200).json({ session });
  } catch (error: any) {
    console.error(`Error fetching game session: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Get game by ID
// Endpoint: GET /api/games/:id
// Request: { id: string }
// Response: { game: Game }
router.get('/:id', requireUser(ALL_ROLES), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const game = await GameService.getGameById(id);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.status(200).json({ game });
  } catch (error: any) {
    console.error(`Error fetching game: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Submit game session with AI-powered feedback
// Endpoint: POST /api/games/:id/session
// Request: { score: number, maxScore: number, timeSpent: number, answers: Array<Answer> }
// Response: { session: GameSession, xpEarned: number, feedback: AIFeedback }
router.post('/:id/session', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { score, maxScore, timeSpent, answers } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (
      typeof score !== 'number' ||
      typeof maxScore !== 'number' ||
      typeof timeSpent !== 'number' ||
      !Array.isArray(answers)
    ) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const result = await GameService.submitGameSession(req.user._id, id, {
      score,
      maxScore,
      timeSpent,
      answers,
    });

    res.status(200).json(result);
  } catch (error: any) {
    console.error(`Error submitting game session: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Create a new game (admin only)
// Endpoint: POST /api/games
// Request: { title: string, description: string, category: string, difficulty: number, duration: number, xpReward: number, thumbnailUrl?: string, questions: Array<Question> }
// Response: { game: Game }
router.post('/', requireUser([ROLES.ADMIN]), async (req: Request, res: Response) => {
  try {
    const { title, description, category, difficulty, duration, xpReward, thumbnailUrl, questions } = req.body;

    // Validate required fields
    if (!title || !description || !category || !difficulty || !duration || !xpReward || !questions) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate category
    if (!['language', 'culture', 'soft-skills'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category. Must be language, culture, or soft-skills' });
    }

    const game = await GameService.createGame({
      title,
      description,
      category,
      difficulty,
      duration,
      xpReward,
      thumbnailUrl,
      questions,
    });

    console.log(`[GameRoutes] Game created successfully: ${game._id}`);
    res.status(201).json({ game });
  } catch (error: any) {
    console.error(`Error creating game: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Update an existing game (admin only)
// Endpoint: PUT /api/games/:id
// Request: { title?: string, description?: string, category?: string, difficulty?: number, duration?: number, xpReward?: number, thumbnailUrl?: string, isActive?: boolean, questions?: Array<Question> }
// Response: { game: Game }
router.put('/:id', requireUser([ROLES.ADMIN]), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate category if provided
    if (updateData.category && !['language', 'culture', 'soft-skills'].includes(updateData.category)) {
      return res.status(400).json({ error: 'Invalid category. Must be language, culture, or soft-skills' });
    }

    const game = await GameService.updateGame(id, updateData);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    console.log(`[GameRoutes] Game updated successfully: ${game._id}`);
    res.status(200).json({ game });
  } catch (error: any) {
    console.error(`Error updating game: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Delete a game (soft delete, admin only)
// Endpoint: DELETE /api/games/:id
// Request: {}
// Response: { message: string, game: Game }
router.delete('/:id', requireUser([ROLES.ADMIN]), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const game = await GameService.deleteGame(id);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    console.log(`[GameRoutes] Game deleted successfully: ${game._id}`);
    res.status(200).json({ message: 'Game deleted successfully', game });
  } catch (error: any) {
    console.error(`Error deleting game: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Description: Get all games including inactive (admin only)
// Endpoint: GET /api/games/admin/all
// Request: { category?: string, difficulty?: number, isActive?: boolean }
// Response: { games: Array<Game> }
router.get('/admin/all', requireUser([ROLES.ADMIN]), async (req: Request, res: Response) => {
  try {
    const { category, difficulty, isActive } = req.query;

    const filters: any = {};
    if (category) filters.category = category as string;
    if (difficulty) filters.difficulty = parseInt(difficulty as string);
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    const games = await GameService.getAllGames(filters);

    res.status(200).json({ games });
  } catch (error: any) {
    console.error(`Error fetching all games: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
