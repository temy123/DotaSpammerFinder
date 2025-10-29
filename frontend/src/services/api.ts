import axios, { AxiosInstance } from 'axios';
import {
  Hero,
  HeroStat,
  HeroRole,
  HeroMatchup,
  Player,
  SearchPlayer,
  MetaStats,
  DatabaseInfo,
  ApiResponse,
  HeroFilters,
  HeroStatsFilters,
  HeroMatchupsFilters,
  HeroRankingsFilters,
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Heroes API
  async getHeroes(filters?: HeroFilters): Promise<Hero[]> {
    const response = await this.api.get<ApiResponse<Hero[]>>('/heroes', {
      params: filters,
    });
    return response.data.data;
  }

  async getHeroById(id: number): Promise<Hero> {
    const response = await this.api.get<ApiResponse<Hero>>(`/heroes/${id}`);
    return response.data.data;
  }

  async getHeroStats(id: number, filters?: HeroStatsFilters): Promise<HeroStat[]> {
    const response = await this.api.get<ApiResponse<HeroStat[]>>(`/heroes/${id}/stats`, {
      params: filters,
    });
    return response.data.data;
  }

  async getHeroMatchups(id: number, filters?: HeroMatchupsFilters): Promise<HeroMatchup[]> {
    const response = await this.api.get<ApiResponse<HeroMatchup[]>>(`/heroes/${id}/matchups`, {
      params: filters,
    });
    return response.data.data;
  }

  async getHeroRoles(id: number): Promise<HeroRole[]> {
    const response = await this.api.get<ApiResponse<HeroRole[]>>(`/heroes/${id}/roles`);
    return response.data.data;
  }

  // Players API
  async searchPlayers(query: string): Promise<SearchPlayer[]> {
    const response = await this.api.get<ApiResponse<SearchPlayer[]>>('/players/search', {
      params: { q: query },
    });
    return response.data.data;
  }

  async getPlayerById(id: string): Promise<Player> {
    const response = await this.api.get<ApiResponse<Player>>(`/players/${id}`);
    return response.data.data;
  }

  // Stats API
  async getMetaStats(filters?: { tier?: number; patch?: string }): Promise<MetaStats> {
    const response = await this.api.get<ApiResponse<MetaStats>>('/stats/meta', {
      params: filters,
    });
    return response.data.data;
  }

  async getHeroRankings(tier: number, filters?: HeroRankingsFilters): Promise<HeroStat[]> {
    const response = await this.api.get<ApiResponse<HeroStat[]>>(`/stats/rankings/${tier}`, {
      params: filters,
    });
    return response.data.data;
  }

  async getPatches(): Promise<string[]> {
    const response = await this.api.get<ApiResponse<string[]>>('/stats/patches');
    return response.data.data;
  }

  async getDatabaseInfo(): Promise<DatabaseInfo> {
    const response = await this.api.get<ApiResponse<DatabaseInfo>>('/stats/database/info');
    return response.data.data;
  }

  // Admin API
  async updateData(): Promise<any> {
    const response = await this.api.post<ApiResponse<any>>('/admin/update-data');
    return response.data.data;
  }

  async getDatabaseVersions(): Promise<any> {
    const response = await this.api.get<ApiResponse<any>>('/admin/database/versions');
    return response.data.data;
  }
}

export const apiService = new ApiService();
export default apiService;