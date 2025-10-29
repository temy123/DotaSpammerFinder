export interface Hero {
  id: number;
  name: string;
  localizedNameEng: string;
  localizedNameKor: string;
  primaryAttr: string;
  primaryAttrKor: string;
  attackType: string;
  attackTypeKor: string;
  imgUrl?: string;
  iconUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeroStat {
  id: number;
  heroId: number;
  tier: number;
  picks: number;
  wins: number;
  tierRating: number;
  patchVersion: string;
  createdAt: string;
  hero?: Hero;
  winRate?: number;
  pickRate?: number;
}

export interface HeroRole {
  id: number;
  heroId: number;
  roleType: number;
  priority: number;
  createdAt: string;
}

export interface HeroMatchup {
  id: number;
  heroId: number;
  againstId: number;
  gamesPlayed: number;
  wins: number;
  tier: number;
  patchVersion: string;
  createdAt: string;
  against?: Hero;
  winRate?: number;
}

export interface Player {
  id: string;
  personaName?: string;
  avatarUrl?: string;
  avatarFullUrl?: string;
  profileUrl?: string;
  lastMatchTime?: string;
  rank?: number;
  rankTier?: number;
  leaderboardRank?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchPlayer {
  id: string;
  personaName: string;
  avatarUrl?: string;
  avatarFullUrl?: string;
  profileUrl: string;
  lastMatchTime?: string;
  similarity?: number;
}

export interface MetaStats {
  totalStats: Array<{
    tier: number;
    _sum: {
      picks: number;
      wins: number;
    };
  }>;
  heroCount: Array<{
    tier: number;
    _count: {
      heroId: number;
    };
  }>;
  topPicked: HeroStat[];
  topWinRate: HeroStat[];
}

export interface DatabaseInfo {
  heroCount: number;
  statsCount: number;
  patches: string[];
  currentPatch: string;
  lastUpdate?: string;
  version: string;
}

// API Response types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
  total?: number;
  tier?: number;
}

// Filter types
export interface HeroFilters {
  tier?: number;
  patch?: string;
  role?: number;
}

export interface HeroStatsFilters {
  tier?: number;
  patch?: string;
}

export interface HeroMatchupsFilters {
  tier?: number;
  patch?: string;
  limit?: number;
}

export interface HeroRankingsFilters {
  patch?: string;
  limit?: number;
}

// Constants
export const ROLE_TYPES = {
  1: { name: '캐리', nameEng: 'Carry', icon: 'icon_carry.jpg' },
  2: { name: '미드', nameEng: 'Mid', icon: 'icon_nuker.jpg' },
  3: { name: '오프레이너', nameEng: 'Offlaner', icon: 'icon_durable.jpg' },
  4: { name: '서포터', nameEng: 'Support', icon: 'icon_support.jpg' },
  5: { name: '하드 서포터', nameEng: 'Hard Support', icon: 'icon_jungler.jpg' },
} as const;

export const TIER_NAMES = {
  1: '선구자',
  2: '수호자',
  3: '성전사',
  4: '집정관',
  5: '전설',
  6: '거장',
  7: '신',
  8: '불멸자',
} as const;

export const TIER_RATINGS = {
  0: { name: 'OP', color: 'tier-0' },
  1: { name: '1티어', color: 'tier-1' },
  2: { name: '2티어', color: 'tier-2' },
  3: { name: '3티어', color: 'tier-3' },
  4: { name: '4티어', color: 'tier-4' },
  5: { name: '5티어', color: 'tier-5' },
} as const;