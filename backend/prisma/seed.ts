import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface OfficialHero {
  id: number;
  name: string;
  name_loc: string;
  name_english_loc: string;
  primary_attr: number;
  complexity: number;
}

interface OpenDotaHero {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: string;
  attack_type: string;
  roles: string[];
  img: string;
  icon: string;
}

interface HeroRanking {
  hero_id: number;
  rank: number;
  tier: number;
  patch_version: string;
  picks: number;
  wins: number;
  tier_rating: number;
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Load official heroes from JSON file
  console.log('\n📥 Loading official heroes data...');
  const officialHeroesPath = path.join(__dirname, '../../official_heroes.json');
  const officialHeroesData = JSON.parse(fs.readFileSync(officialHeroesPath, 'utf-8'));
  const officialHeroes: OfficialHero[] = officialHeroesData.result.data.heroes;

  // 2. Fetch heroes from OpenDota API
  console.log('📡 Fetching heroes from OpenDota API...');
  const { data: openDotaHeroes } = await axios.get<OpenDotaHero[]>(
    'https://api.opendota.com/api/heroes'
  );

  // 3. Merge and import heroes
  console.log('💾 Importing heroes to database...');
  for (const official of officialHeroes) {
    const openDota = openDotaHeroes.find(h => h.id === official.id);
    
    if (!openDota) {
      console.warn(`⚠️  OpenDota data not found for hero ID ${official.id}`);
      continue;
    }

    try {
      await prisma.hero.upsert({
        where: { id: official.id },
        update: {
          name: openDota.name,
          localizedNameKor: official.name_loc,
          localizedNameEng: official.name_english_loc,
          primaryAttr: getPrimaryAttrString(official.primary_attr),
          primaryAttrKor: getPrimaryAttrKorean(official.primary_attr),
          attackType: openDota.attack_type,
          attackTypeKor: openDota.attack_type === 'Melee' ? '근접' : '원거리',
          imgUrl: openDota.img,
          iconUrl: openDota.icon,
        },
        create: {
          id: official.id,
          name: openDota.name,
          localizedNameKor: official.name_loc,
          localizedNameEng: official.name_english_loc,
          primaryAttr: getPrimaryAttrString(official.primary_attr),
          primaryAttrKor: getPrimaryAttrKorean(official.primary_attr),
          attackType: openDota.attack_type,
          attackTypeKor: openDota.attack_type === 'Melee' ? '근접' : '원거리',
          imgUrl: openDota.img,
          iconUrl: openDota.icon,
        },
      });

      // Import hero roles
      const roleMapping = getRolePriorities(openDota.roles);
      for (const [roleType, priority] of roleMapping) {
        await prisma.heroRole.upsert({
          where: {
            heroId_roleType: {
              heroId: official.id,
              roleType: roleType,
            },
          },
          update: { priority },
          create: {
            heroId: official.id,
            roleType: roleType,
            priority: priority,
          },
        });
      }

      console.log(`✅ Imported: ${official.name_loc} (${official.name_english_loc})`);
    } catch (error) {
      console.error(`❌ Failed to import hero ID ${official.id}:`, error);
    }
  }

  // 4. Fetch and import hero rankings from OpenDota
  console.log('\n📊 Fetching hero rankings from OpenDota...');
  const currentPatch = '7.37'; // Update this with current patch
  
  try {
    const { data: heroStats } = await axios.get('https://api.opendota.com/api/heroStats');
    
    console.log(`Fetched stats for ${heroStats.length} heroes from OpenDota`);

    for (let tier = 1; tier <= 8; tier++) {
      console.log(`\n🎯 Processing tier ${tier}...`);
      let successCount = 0;
      
      for (const stat of heroStats) {
        if (!stat.id) continue;

        // OpenDota heroStats returns data with structure like:
        // { id, name, localized_name, [1_pick, 1_win, 2_pick, 2_win, ...] }
        const tierPick = stat[`${tier}_pick`];
        const tierWin = stat[`${tier}_win`];
        
        if (tierPick === undefined || tierWin === undefined) {
          continue;
        }

        try {
          const picks = tierPick || 0;
          const wins = tierWin || 0;
          
          await prisma.heroStat.create({
            data: {
              heroId: stat.id,
              tier: tier,
              patchVersion: currentPatch,
              picks: picks,
              wins: wins,
              tierRating: calculateTierRating(picks, wins),
            },
          });
          successCount++;
        } catch (error) {
          // Skip if already exists
          if (!(error as any).code?.includes('UNIQUE')) {
            console.error(`  ⚠️  Failed for hero ${stat.id}:`, (error as Error).message);
          }
        }
      }

      console.log(`  ✅ Created ${successCount} stat records for tier ${tier}`);
    }

    console.log('\n✅ All hero rankings imported successfully');
  } catch (error) {
    console.error('❌ Failed to fetch hero rankings:', error);
    throw error;
  }

  console.log('\n✨ Database seeding completed!');
}

function getPrimaryAttrString(attr: number): string {
  switch (attr) {
    case 0: return 'str'; // Strength
    case 1: return 'agi'; // Agility
    case 2: return 'int'; // Intelligence
    case 3: return 'all'; // Universal
    default: return 'all';
  }
}

function getPrimaryAttrKorean(attr: number): string {
  switch (attr) {
    case 0: return '힘'; // Strength
    case 1: return '민첩'; // Agility
    case 2: return '지능'; // Intelligence
    case 3: return '만능'; // Universal
    default: return '만능';
  }
}

function getRolePriorities(roles: string[]): [number, number][] {
  const roleMap: { [key: string]: number } = {
    'Carry': 1,
    'Mid': 2,
    'Offlane': 3,
    'Support': 4,
    'Hard Support': 5,
    'Disabler': 4,
    'Initiator': 3,
    'Nuker': 2,
    'Escape': 1,
    'Pusher': 1,
    'Durable': 3,
  };

  const result: [number, number][] = [];
  roles.forEach((role, index) => {
    const roleType = roleMap[role] || 4;
    const priority = index + 1;
    if (priority <= 3) {
      result.push([roleType, priority]);
    }
  });

  return result;
}

function calculateTierRating(picks: number, wins: number): number {
  if (picks === 0) return 5;
  
  const winRate = (wins / picks) * 100;
  
  // Higher winrate = higher tier rating
  if (winRate >= 55) return 8;
  if (winRate >= 53) return 7;
  if (winRate >= 51) return 6;
  if (winRate >= 49) return 5;
  if (winRate >= 47) return 4;
  if (winRate >= 45) return 3;
  if (winRate >= 43) return 2;
  return 1;
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
