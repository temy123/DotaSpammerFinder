import { Request, Response } from 'express';
import { statsService } from '../services/statsService';
import { AppError } from '../middleware/errorHandler';

export const statsController = {
  async getMetaStats(req: Request, res: Response): Promise<void> {
    const { tier, patch } = req.query;
    
    const metaStats = await statsService.getMetaStats({
      tier: tier ? parseInt(tier as string) : undefined,
      patch: patch as string,
    });

    res.json({
      status: 'success',
      data: metaStats,
    });
  },

  async getHeroRankings(req: Request, res: Response): Promise<void> {
    const { tier } = req.params;
    const { patch, limit } = req.query;
    
    const tierNum = parseInt(tier);
    if (isNaN(tierNum) || tierNum < 1 || tierNum > 8) {
      throw new AppError('Invalid tier. Must be between 1-8', 400);
    }

    const rankings = await statsService.getHeroRankings(tierNum, {
      patch: patch as string,
      limit: limit ? parseInt(limit as string) : undefined,
    });

    res.json({
      status: 'success',
      data: rankings,
      tier: tierNum,
    });
  },

  async getPatches(req: Request, res: Response): Promise<void> {
    const patches = await statsService.getAvailablePatches();

    res.json({
      status: 'success',
      data: patches,
    });
  },

  async getDatabaseInfo(req: Request, res: Response): Promise<void> {
    const dbInfo = await statsService.getDatabaseInfo();

    res.json({
      status: 'success',
      data: dbInfo,
    });
  },
};