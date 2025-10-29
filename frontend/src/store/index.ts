import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  Hero,
  HeroStat,
  SearchPlayer,
  MetaStats,
  DatabaseInfo,
} from '../types';

interface AppState {
  // Heroes state
  heroes: Hero[];
  currentHero: Hero | null;
  heroStats: HeroStat[];
  heroRankings: HeroStat[];
  
  // Players state
  searchResults: SearchPlayer[];
  searchQuery: string;
  
  // Filters state
  selectedTier: number;
  selectedPatch: string;
  selectedRole: number;
  
  // Meta state
  metaStats: MetaStats | null;
  databaseInfo: DatabaseInfo | null;
  availablePatches: string[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setHeroes: (heroes: Hero[]) => void;
  setCurrentHero: (hero: Hero | null) => void;
  setHeroStats: (stats: HeroStat[]) => void;
  setHeroRankings: (rankings: HeroStat[]) => void;
  setSearchResults: (results: SearchPlayer[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTier: (tier: number) => void;
  setSelectedPatch: (patch: string) => void;
  setSelectedRole: (role: number) => void;
  setMetaStats: (stats: MetaStats | null) => void;
  setDatabaseInfo: (info: DatabaseInfo | null) => void;
  setAvailablePatches: (patches: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial state
      heroes: [],
      currentHero: null,
      heroStats: [],
      heroRankings: [],
      searchResults: [],
      searchQuery: '',
      selectedTier: 8, // Immortal by default
      selectedPatch: '',
      selectedRole: 0, // All roles
      metaStats: null,
      databaseInfo: null,
      availablePatches: [],
      isLoading: false,
      error: null,
      
      // Actions
      setHeroes: (heroes) => set({ heroes }),
      setCurrentHero: (hero) => set({ currentHero: hero }),
      setHeroStats: (stats) => set({ heroStats: stats }),
      setHeroRankings: (rankings) => set({ heroRankings: rankings }),
      setSearchResults: (results) => set({ searchResults: results }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedTier: (tier) => set({ selectedTier: tier }),
      setSelectedPatch: (patch) => set({ selectedPatch: patch }),
      setSelectedRole: (role) => set({ selectedRole: role }),
      setMetaStats: (stats) => set({ metaStats: stats }),
      setDatabaseInfo: (info) => set({ databaseInfo: info }),
      setAvailablePatches: (patches) => set({ availablePatches: patches }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'dota-spammer-finder-store',
    }
  )
);

// Selector hooks for better performance
export const useHeroes = () => useAppStore((state) => state.heroes);
export const useCurrentHero = () => useAppStore((state) => state.currentHero);
export const useHeroStats = () => useAppStore((state) => state.heroStats);
export const useHeroRankings = () => useAppStore((state) => state.heroRankings);
export const useSearchResults = () => useAppStore((state) => state.searchResults);
export const useSearchQuery = () => useAppStore((state) => state.searchQuery);
export const useSelectedTier = () => useAppStore((state) => state.selectedTier);
export const useSelectedPatch = () => useAppStore((state) => state.selectedPatch);
export const useSelectedRole = () => useAppStore((state) => state.selectedRole);
export const useMetaStats = () => useAppStore((state) => state.metaStats);
export const useDatabaseInfo = () => useAppStore((state) => state.databaseInfo);
export const useAvailablePatches = () => useAppStore((state) => state.availablePatches);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);