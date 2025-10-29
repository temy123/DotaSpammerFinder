import { Router } from 'express';
import { playerController } from '../controllers/playerController';
import { catchAsync } from '../middleware/errorHandler';

const router = Router();

// GET /api/players/search - Search players
router.get('/search', catchAsync(playerController.searchPlayers));

// GET /api/players/:id - Get player by ID
router.get('/:id', catchAsync(playerController.getPlayerById));

export default router;