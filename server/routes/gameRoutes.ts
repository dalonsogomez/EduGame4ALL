import express, { Request, Response } from 'express';
import { GameService } from '../services/gameService';
import { requireUser } from './middlewares/auth';
import { ALL_ROLES } from 'shared';

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

// Description: Submit game session
// Endpoint: POST /api/games/:id/session
// Request: { score: number, maxScore: number, timeSpent: number, answers: Array<Answer> }
// Response: { session: GameSession, xpEarned: number }
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

export default router;
