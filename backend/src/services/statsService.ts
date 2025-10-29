import prisma from '../utils/database';

interface MetaStatsFilters {
  tier?: number;
  patch?: string;
}

interface HeroRankingsFilters {
  patch?: string;
  limit?: number;
}

export const statsService = {
  async getMetaStats(filters: MetaStatsFilters = {}): Promise<any> {
    const where: any = {};
    
    if (filters.tier) {
      where.tier = filters.tier;
    }
    
    if (filters.patch) {
      where.patchVersion = filters.patch;
    }

    // Get total games per tier
    const totalStats = await prisma.heroStat.groupBy({
      by: ['tier'],
      where,
      _sum: {
        picks: true,
        wins: true,
      },
    });

    // Get hero count per tier
    const heroCount = await prisma.heroStat.groupBy({
      by: ['tier'],
      where,
      _count: {
        heroId: true,
      },
    });

    // Get most picked/banned heroes
    const topPicked = await prisma.heroStat.findMany({
      where,
      include: {
        hero: true,
      },
      orderBy: {
        picks: 'desc',
      },
      take: 10,
    });

    const topWinRate = await prisma.heroStat.findMany({
      where: {
        ...where,
        picks: {
          gte: 100, // Minimum 100 picks for statistical significance
        },
      },
      include: {
        hero: true,
      },
      orderBy: {
        wins: 'desc',
      },
      take: 10,
    });

    return {
      totalStats,
      heroCount,
      topPicked: topPicked.map(stat => ({
        ...stat.hero,
        ...stat,
        winRate: stat.picks > 0 ? (stat.wins / stat.picks) * 100 : 0,
      })),
      topWinRate: topWinRate.map(stat => ({
        ...stat.hero,
        ...stat,
        winRate: stat.picks > 0 ? (stat.wins / stat.picks) * 100 : 0,
      })),
    };
  },

  async getHeroRankings(tier: number, filters: HeroRankingsFilters = {}): Promise<any[]> {
    const where: any = { tier };
    
    if (filters.patch) {
      where.patchVersion = filters.patch;
    }

    const rankings = await prisma.heroStat.findMany({
      where,
      include: {
        hero: {
          include: {
            roles: true,
          },
        },
      },
      orderBy: [
        { tierRating: 'asc' },
        { wins: 'desc' },
      ],
      take: filters.limit,
    });

    return rankings.map((stat, index) => ({
      rank: index + 1,
      ...stat.hero,
      ...stat,
      winRate: stat.picks > 0 ? (stat.wins / stat.picks) * 100 : 0,
      pickRate: 0, // This would need total games to calculate
    }));
  },

  async getAvailablePatches(): Promise<string[]> {
    const patches = await prisma.heroStat.findMany({
      select: {
        patchVersion: true,
      },
      distinct: ['patchVersion'],
      orderBy: {
        patchVersion: 'desc',
      },
    });

    return patches.map(p => p.patchVersion);
  },

  async getDatabaseInfo(): Promise<any> {
    const heroCount = await prisma.hero.count();
    const statsCount = await prisma.heroStat.count();
    const lastUpdate = await prisma.systemInfo.findUnique({
      where: { key: 'last_update' },
    });

    const patches = await this.getAvailablePatches();
    const currentPatch = patches[0];

    return {
      heroCount,
      statsCount,
      patches,
      currentPatch,
      lastUpdate: lastUpdate?.updatedAt || null,
      version: '2.0.0',
    };
  },
};