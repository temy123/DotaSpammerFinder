import { Router } from 'express';
import { heroController } from '../controllers/heroController';
import { catchAsync } from '../middleware/errorHandler';

const router = Router();

// GET /api/heroes - Get all heroes
router.get('/', catchAsync(heroController.getAllHeroes));

// GET /api/heroes/patches - Get all available patches
router.get('/patches', catchAsync(heroController.getPatches));

// GET /api/heroes/rankings/:tier - Get hero rankings by tier
router.get('/rankings/:tier', catchAsync(heroController.getHeroRankings));

// GET /api/heroes/:id - Get hero by ID
router.get('/:id', catchAsync(heroController.getHeroById));

// GET /api/heroes/:id/stats - Get hero stats by tier
router.get('/:id/stats', catchAsync(heroController.getHeroStats));

// GET /api/heroes/:id/matchups - Get hero matchups
router.get('/:id/matchups', catchAsync(heroController.getHeroMatchups));

// GET /api/heroes/:id/roles - Get hero roles
router.get('/:id/roles', catchAsync(heroController.getHeroRoles));

export default router;