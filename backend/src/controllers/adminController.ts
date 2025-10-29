import { Request, Response } from 'express';
import { dataUpdateService } from '../services/dataUpdateService';
import { AppError } from '../middleware/errorHandler';

export const adminController = {
  async updateData(req: Request, res: Response): Promise<void> {
    try {
      const result = await dataUpdateService.updateAllData();
      
      res.json({
        status: 'success',
        message: 'Data update completed successfully',
        data: result,
      });
    } catch (error) {
      throw new AppError('Failed to update data', 500);
    }
  },

  async getDatabaseVersions(req: Request, res: Response): Promise<void> {
    // This would be implemented to list available database files
    // For now, return a placeholder
    res.json({
      status: 'success',
      data: {
        current: '25-01-29',
        available: ['25-01-29', '25-01-28', '25-01-27'],
      },
    });
  },
};