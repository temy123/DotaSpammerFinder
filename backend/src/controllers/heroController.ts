import { Request, Response } from 'express';
import { heroService } from '../services/heroService';
import { AppError } from '../middleware/errorHandler';

export const heroController = {
  async getAllHeroes(req: Request, res: Response): Promise<void> {
    const { tier, patch, role } = req.query;
    
    const heroes = await heroService.getAllHeroes({
      tier: tier ? parseInt(tier as string) : undefined,
      patch: patch as string,
      role: role ? parseInt(role as string) : undefined,
    });

    res.json({
      status: 'success',
      data: heroes,
      total: heroes.length,
    });
  },

  async getHeroById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const heroId = parseInt(id);

    if (isNaN(heroId)) {
      throw new AppError('Invalid hero ID', 400);
    }

    const hero = await heroService.getHeroById(heroId);
    
    if (!hero) {
      throw new AppError('Hero not found', 404);
    }

    res.json({
      status: 'success',
      data: hero,
    });
  },

  async getHeroStats(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { tier, patch } = req.query;
    const heroId = parseInt(id);

    if (isNaN(heroId)) {
      throw new AppError('Invalid hero ID', 400);
    }

    const stats = await heroService.getHeroStats(heroId, {
      tier: tier ? parseInt(tier as string) : undefined,
      patch: patch as string,
    });

    res.json({
      status: 'success',
      data: stats,
    });
  },

  async getHeroMatchups(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { tier, patch, limit } = req.query;
    const heroId = parseInt(id);

    if (isNaN(heroId)) {
      throw new AppError('Invalid hero ID', 400);
    }

    const matchups = await heroService.getHeroMatchups(heroId, {
      tier: tier ? parseInt(tier as string) : undefined,
      patch: patch as string,
      limit: limit ? parseInt(limit as string) : 10,
    });

    res.json({
      status: 'success',
      data: matchups,
    });
  },

  async getHeroRoles(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const heroId = parseInt(id);

    if (isNaN(heroId)) {
      throw new AppError('Invalid hero ID', 400);
    }

    const roles = await heroService.getHeroRoles(heroId);

    res.json({
      status: 'success',
      data: roles,
    });
  },

  async getPatches(req: Request, res: Response): Promise<void> {
    const patches = await heroService.getPatches();

    res.json({
      status: 'success',
      data: patches,
    });
  },

  async getHeroRankings(req: Request, res: Response): Promise<void> {
    const { tier } = req.params;
    const { patch, limit } = req.query;
    const tierNumber = parseInt(tier);

    if (isNaN(tierNumber) || tierNumber < 1 || tierNumber > 8) {
      throw new AppError('Invalid tier (must be 1-8)', 400);
    }

    const rankings = await heroService.getHeroTierRankings(
      tierNumber,
      patch as string
    );

    const limitNumber = limit ? parseInt(limit as string) : rankings.length;
    const limitedRankings = rankings.slice(0, limitNumber);

    res.json({
      status: 'success',
      data: limitedRankings,
      total: limitedRankings.length,
    });
  },
};