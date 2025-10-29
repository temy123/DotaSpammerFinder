import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { catchAsync } from '../middleware/errorHandler';

const router = Router();

// POST /api/admin/update-data - Trigger data update
router.post('/update-data', catchAsync(adminController.updateData));

// GET /api/admin/database/versions - Get available database versions
router.get('/database/versions', catchAsync(adminController.getDatabaseVersions));

export default router;