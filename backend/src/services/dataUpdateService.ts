import prisma from '../utils/database';
import { openDotaService, dota2ApiService } from './openDotaService';
import { logger } from '../utils/logger';

interface HeroData {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: string;
  attack_type: string;
  roles: string[];
  img: string;
  icon: string;
}

interface HeroStats {
  id: number;
  pro_pick: number;
  pro_win: number;
  // Add tier-specific stats
  [key: string]: any;
}

export const dataUpdateService = {
  async updateAllData(): Promise<any> {
    logger.info('Starting data update process...');
    
    try {
      // 1. Fetch hero data from both APIs
      const [officialHeroes, openDotaHeroes] = await Promise.all([
        dota2ApiService.getOfficialHeroes(),
        openDotaService.getHeroStats(),
      ]);

      logger.info(`Fetched ${officialHeroes.length} official heroes and ${openDotaHeroes.length} OpenDota heroes`);

      // 2. Merge hero data
      const mergedHeroes = this.mergeHeroData(officialHeroes, openDotaHeroes);
      
      // 3. Update heroes in database
      await this.updateHeroes(mergedHeroes);

      // 4. Update hero stats for each tier
      await this.updateHeroStats(mergedHeroes);

      // 5. Update hero roles
      await this.updateHeroRoles(mergedHeroes);

      // 6. Update system info
      await this.updateSystemInfo();

      logger.info('Data update completed successfully');
      
      return {
        heroesUpdated: mergedHeroes.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Data update failed:', error);
      throw error;
    }
  },

  mergeHeroData(officialHeroes: any[], openDotaHeroes: any[]): any[] {
    const merged = [];
    
    for (const officialHero of officialHeroes) {
      const openDotaHero = openDotaHeroes.find(h => h.name === officialHero.name);
      
      if (openDotaHero) {
        merged.push({
          id: officialHero.id,
          name: officialHero.name,
          localizedNameEng: officialHero.name_english_loc || officialHero.name,
          localizedNameKor: officialHero.name_loc || officialHero.name,
          primaryAttr: this.mapPrimaryAttr(openDotaHero.primary_attr),
          primaryAttrKor: this.mapPrimaryAttrKor(openDotaHero.primary_attr),
          attackType: openDotaHero.attack_type,
          attackTypeKor: this.mapAttackTypeKor(openDotaHero.attack_type),
          imgUrl: openDotaHero.img,
          iconUrl: openDotaHero.icon,
          // OpenDota stats
          stats: openDotaHero,
        });
      }
    }
    
    return merged;
  },

  async updateHeroes(heroes: any[]): Promise<void> {
    logger.info(`Updating ${heroes.length} heroes...`);
    
    for (const hero of heroes) {
      await prisma.hero.upsert({
        where: { id: hero.id },
        update: {
          name: hero.name,
          localizedNameEng: hero.localizedNameEng,
          localizedNameKor: hero.localizedNameKor,
          primaryAttr: hero.primaryAttr,
          primaryAttrKor: hero.primaryAttrKor,
          attackType: hero.attackType,
          attackTypeKor: hero.attackTypeKor,
          imgUrl: hero.imgUrl,
          iconUrl: hero.iconUrl,
          updatedAt: new Date(),
        },
        create: {
          id: hero.id,
          name: hero.name,
          localizedNameEng: hero.localizedNameEng,
          localizedNameKor: hero.localizedNameKor,
          primaryAttr: hero.primaryAttr,
          primaryAttrKor: hero.primaryAttrKor,
          attackType: hero.attackType,
          attackTypeKor: hero.attackTypeKor,
          imgUrl: hero.imgUrl,
          iconUrl: hero.iconUrl,
        },
      });
    }
  },

  async updateHeroStats(heroes: any[]): Promise<void> {
    logger.info('Updating hero statistics...');
    
    const currentPatch = '7.36'; // This should be dynamic
    
    for (const hero of heroes) {
      // Generate tier-based stats (this is a simplified version)
      for (let tier = 1; tier <= 8; tier++) {
        const picks = hero.stats[`${tier}_pick`] || 0;
        const wins = hero.stats[`${tier}_win`] || 0;
        const tierRating = this.calculateTierRating(picks, wins, tier);
        
        await prisma.heroStat.upsert({
          where: {
            heroId_tier_patchVersion: {
              heroId: hero.id,
              tier: tier,
              patchVersion: currentPatch,
            },
          },
          update: {
            picks,
            wins,
            tierRating,
          },
          create: {
            heroId: hero.id,
            tier: tier,
            picks,
            wins,
            tierRating,
            patchVersion: currentPatch,
          },
        });
      }
    }
  },

  async updateHeroRoles(heroes: any[]): Promise<void> {
    logger.info('Updating hero roles...');
    
    for (const hero of heroes) {
      // Get lane roles from OpenDota
      try {
        const laneRoles = await openDotaService.getScenarioLaneRoles(hero.id);
        
        // Clear existing roles
        await prisma.heroRole.deleteMany({
          where: { heroId: hero.id },
        });
        
        // Add new roles (top 3)
        const sortedRoles = laneRoles
          .sort((a: any, b: any) => b.games - a.games)
          .slice(0, 3);
          
        for (let i = 0; i < sortedRoles.length; i++) {
          const role = sortedRoles[i];
          await prisma.heroRole.create({
            data: {
              heroId: hero.id,
              roleType: role.lane_role,
              priority: i + 1,
            },
          });
        }
        
        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        logger.error(`Failed to update roles for hero ${hero.id}:`, error);
      }
    }
  },

  async updateSystemInfo(): Promise<void> {
    await prisma.systemInfo.upsert({
      where: { key: 'last_update' },
      update: {
        value: new Date().toISOString(),
        description: 'Last data update timestamp',
      },
      create: {
        key: 'last_update',
        value: new Date().toISOString(),
        description: 'Last data update timestamp',
      },
    });
  },

  calculateTierRating(picks: number, wins: number, tier: number): number {
    if (picks === 0) return 5; // Default to tier 5
    
    const winRate = (wins / picks) * 100;
    const pickRate = picks; // This would need total games for proper calculation
    
    // Simplified tier calculation based on win rate and pick rate
    if (winRate >= 52 && pickRate >= 20) return 0; // OP tier
    if (winRate >= 49 && pickRate >= 15) return 1; // Tier 1
    if (winRate >= 46 && pickRate >= 10) return 2; // Tier 2
    if (winRate >= 43 && pickRate >= 5) return 3;  // Tier 3
    if (winRate >= 40) return 4; // Tier 4
    return 5; // Tier 5
  },

  mapPrimaryAttr(attr: string): string {
    switch (attr) {
      case 'str': return 'Strength';
      case 'agi': return 'Agility';
      case 'int': return 'Intelligence';
      default: return attr;
    }
  },

  mapPrimaryAttrKor(attr: string): string {
    switch (attr) {
      case 'str': return '힘';
      case 'agi': return '민첩';
      case 'int': return '지능';
      default: return attr;
    }
  },

  mapAttackTypeKor(attackType: string): string {
    switch (attackType) {
      case 'Melee': return '근접';
      case 'Ranged': return '원거리';
      default: return attackType;
    }
  },
};