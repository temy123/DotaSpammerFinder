import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  console.log('=== Checking Database Data ===\n');

  // Check heroes
  const heroCount = await prisma.hero.count();
  console.log(`Total Heroes: ${heroCount}`);

  if (heroCount > 0) {
    const sampleHero = await prisma.hero.findFirst();
    console.log('Sample Hero:', sampleHero);
  }

  // Check hero stats
  const statsCount = await prisma.heroStat.count();
  console.log(`\nTotal Hero Stats: ${statsCount}`);

  if (statsCount > 0) {
    const sampleStat = await prisma.heroStat.findFirst({
      include: { hero: true },
    });
    console.log('Sample Stat:', sampleStat);
  }

  // Check stats by tier
  console.log('\n=== Stats by Tier ===');
  for (let tier = 1; tier <= 8; tier++) {
    const tierStats = await prisma.heroStat.count({
      where: { tier },
    });
    console.log(`Tier ${tier}: ${tierStats} records`);
  }

  // Check patches
  const patches = await prisma.heroStat.findMany({
    select: { patchVersion: true },
    distinct: ['patchVersion'],
  });
  console.log('\n=== Available Patches ===');
  console.log(patches.map(p => p.patchVersion));

  // Check specific query that frontend uses
  console.log('\n=== Testing Frontend Query (Tier 8) ===');
  const tier8Stats = await prisma.heroStat.findMany({
    where: { tier: 8 },
    include: {
      hero: {
        include: {
          roles: true,
        },
      },
    },
    orderBy: [
      { tierRating: 'desc' },
      { wins: 'desc' },
    ],
    take: 10,
  });
  
  console.log(`Found ${tier8Stats.length} records for tier 8`);
  if (tier8Stats.length > 0) {
    console.log('Sample record:', {
      heroName: tier8Stats[0].hero?.localizedNameKor,
      picks: tier8Stats[0].picks,
      wins: tier8Stats[0].wins,
      tierRating: tier8Stats[0].tierRating,
    });
  }

  await prisma.$disconnect();
}

checkData().catch(console.error);
