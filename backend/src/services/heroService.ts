import prisma from '../utils/database';
import { Hero, HeroStat, HeroRole, HeroMatchup } from '@prisma/client';

interface HeroFilters {
  tier?: number;
  patch?: string;
  role?: number;
}

interface HeroStatsFilters {
  tier?: number;
  patch?: string;
}

interface HeroMatchupsFilters {
  tier?: number;
  patch?: string;
  limit?: number;
}

export const heroService = {
  async getAllHeroes(filters: HeroFilters = {}): Promise<Hero[]> {
    const where: any = {};
    
    if (filters.role) {
      where.roles = {
        some: {
          roleType: filters.role,
        },
      };
    }

    const heroes = await prisma.hero.findMany({
      where,
      include: {
        stats: filters.tier || filters.patch ? {
          where: {
            ...(filters.tier && { tier: filters.tier }),
            ...(filters.patch && { patchVersion: filters.patch }),
          },
        } : false,
        roles: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return heroes;
  },

  async getHeroById(heroId: number): Promise<Hero | null> {
    const hero = await prisma.hero.findUnique({
      where: { id: heroId },
      include: {
        stats: {
          orderBy: {
            tier: 'desc',
          },
        },
        roles: {
          orderBy: {
            priority: 'asc',
          },
        },
      },
    });

    return hero;
  },

  async getHeroStats(heroId: number, filters: HeroStatsFilters = {}): Promise<HeroStat[]> {
    const where: any = { heroId };
    
    if (filters.tier) {
      where.tier = filters.tier;
    }
    
    if (filters.patch) {
      where.patchVersion = filters.patch;
    }

    const stats = await prisma.heroStat.findMany({
      where,
      orderBy: {
        tier: 'desc',
      },
    });

    return stats;
  },

  async getHeroMatchups(heroId: number, filters: HeroMatchupsFilters = {}): Promise<HeroMatchup[]> {
    const where: any = { heroId };
    
    if (filters.tier) {
      where.tier = filters.tier;
    }
    
    if (filters.patch) {
      where.patchVersion = filters.patch;
    }

    const matchups = await prisma.heroMatchup.findMany({
      where,
      include: {
        against: true,
      },
      orderBy: [
        { gamesPlayed: 'desc' },
        { wins: 'desc' },
      ],
      take: filters.limit || 10,
    });

    return matchups;
  },

  async getHeroRoles(heroId: number): Promise<HeroRole[]> {
    const roles = await prisma.heroRole.findMany({
      where: { heroId },
      orderBy: {
        priority: 'asc',
      },
    });

    return roles;
  },

  async getHeroTierRankings(tier: number, patch?: string): Promise<any[]> {
    const where: any = { tier };
    
    if (patch) {
      where.patchVersion = patch;
    }

    const stats = await prisma.heroStat.findMany({
      where,
      include: {
        hero: true,
      },
      orderBy: [
        { tierRating: 'desc' },
        { picks: 'desc' },
      ],
    });

    return stats.map(stat => ({
      ...stat,
      winRate: stat.picks > 0 ? (stat.wins / stat.picks) * 100 : 0,
    }));
  },

  async getPatches(): Promise<string[]> {
    const patches = await prisma.heroStat.findMany({
      select: { patchVersion: true },
      distinct: ['patchVersion'],
      orderBy: { patchVersion: 'desc' },
    });
    
    return patches.map(p => p.patchVersion);
  },
};