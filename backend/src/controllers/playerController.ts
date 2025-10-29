import { Request, Response } from 'express';
import { playerService } from '../services/playerService';
import { AppError } from '../middleware/errorHandler';

export const playerController = {
  async searchPlayers(req: Request, res: Response): Promise<void> {
    const { q: query } = req.query;
    
    if (!query || typeof query !== 'string') {
      throw new AppError('Search query is required', 400);
    }

    if (query.length < 2) {
      throw new AppError('Search query must be at least 2 characters long', 400);
    }

    const players = await playerService.searchPlayers(query);

    res.json({
      status: 'success',
      data: players,
      total: players.length,
    });
  },

  async getPlayerById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    const player = await playerService.getPlayerById(id);
    
    if (!player) {
      throw new AppError('Player not found', 404);
    }

    res.json({
      status: 'success',
      data: player,
    });
  },
};