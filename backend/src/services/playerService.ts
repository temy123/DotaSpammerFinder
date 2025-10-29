import prisma from '../utils/database';
import { openDotaService } from './openDotaService';
import { Player } from '@prisma/client';

export const playerService = {
  async searchPlayers(query: string): Promise<any[]> {
    try {
      // Search via OpenDota API
      const players = await openDotaService.searchPlayers(query);
      
      // Sort by last match time (most recent first)
      const sortedPlayers = players.sort((a: any, b: any) => {
        const aTime = new Date(a.last_match_time || 0).getTime();
        const bTime = new Date(b.last_match_time || 0).getTime();
        return bTime - aTime;
      });

      // Return top 4 results
      return sortedPlayers.slice(0, 4).map((player: any) => ({
        id: player.account_id?.toString(),
        personaName: player.personaname,
        avatarUrl: player.avatar,
        avatarFullUrl: player.avatarfull,
        profileUrl: `https://www.opendota.com/players/${player.account_id}`,
        lastMatchTime: player.last_match_time ? new Date(player.last_match_time) : null,
        similarity: player.similarity,
      }));
    } catch (error) {
      console.error('Error searching players:', error);
      return [];
    }
  },

  async getPlayerById(playerId: string): Promise<Player | null> {
    try {
      // Try to get from local database first
      let player = await prisma.player.findUnique({
        where: { id: playerId },
      });

      // If not found locally, fetch from OpenDota and cache
      if (!player) {
        const playerData = await openDotaService.getPlayer(playerId);
        
        if (playerData) {
          player = await this.upsertPlayer(playerData);
        }
      }

      return player;
    } catch (error) {
      console.error('Error getting player:', error);
      return null;
    }
  },

  async upsertPlayer(playerData: any): Promise<Player> {
    const player = await prisma.player.upsert({
      where: { id: playerData.account_id?.toString() },
      update: {
        personaName: playerData.personaname,
        avatarUrl: playerData.avatar,
        avatarFullUrl: playerData.avatarfull,
        profileUrl: playerData.profileurl,
        lastMatchTime: playerData.last_match_time 
          ? new Date(playerData.last_match_time * 1000)
          : null,
        rank: playerData.rank_tier,
        rankTier: playerData.rank_tier,
        leaderboardRank: playerData.leaderboard_rank,
        updatedAt: new Date(),
      },
      create: {
        id: playerData.account_id?.toString(),
        personaName: playerData.personaname,
        avatarUrl: playerData.avatar,
        avatarFullUrl: playerData.avatarfull,
        profileUrl: playerData.profileurl,
        lastMatchTime: playerData.last_match_time 
          ? new Date(playerData.last_match_time * 1000)
          : null,
        rank: playerData.rank_tier,
        rankTier: playerData.rank_tier,
        leaderboardRank: playerData.leaderboard_rank,
      },
    });

    return player;
  },
};