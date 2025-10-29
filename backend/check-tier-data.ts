import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTierData() {
  console.log('=== Checking Data by Tier ===\n');

  for (let tier = 1; tier <= 8; tier++) {
    const stats = await prisma.heroStat.findMany({
      where: { 
        tier,
        picks: { gt: 0 } // Only show heroes with actual data
      },
      include: { hero: true },
      take: 3,
      orderBy: { picks: 'desc' }
    });
    
    console.log(`\nTier ${tier}:`);
    if (stats.length > 0) {
      stats.forEach(stat => {
        const winRate = stat.picks > 0 ? ((stat.wins / stat.picks) * 100).toFixed(1) : '0.0';
        console.log(`  ${stat.hero?.localizedNameKor}: ${stat.picks} picks, ${stat.wins} wins (${winRate}% WR)`);
      });
    } else {
      console.log(`  No data available`);
    }
  }

  await prisma.$disconnect();
}

checkTierData().catch(console.error);
