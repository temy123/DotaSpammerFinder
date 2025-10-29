import { Router } from 'express';
import { statsController } from '../controllers/statsController';
import { catchAsync } from '../middleware/errorHandler';

const router = Router();

// GET /api/stats/meta - Get current meta statistics
router.get('/meta', catchAsync(statsController.getMetaStats));

// GET /api/stats/rankings/:tier - Get hero rankings by tier
router.get('/rankings/:tier', catchAsync(statsController.getHeroRankings));

// GET /api/stats/patches - Get available patch versions
router.get('/patches', catchAsync(statsController.getPatches));

// GET /api/stats/database/info - Get database information
router.get('/database/info', catchAsync(statsController.getDatabaseInfo));

export default router;