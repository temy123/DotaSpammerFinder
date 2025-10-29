import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';

interface OpenDotaConfig {
  baseURL: string;
  timeout: number;
  rateLimit: number;
}

class OpenDotaService {
  private api: AxiosInstance;
  private rateLimit: number;
  private lastRequestTime: number = 0;

  constructor(config: OpenDotaConfig) {
    this.api = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'User-Agent': 'DotaSpammerFinder/2.0 (https://github.com/temy123/DotaSpammerFinder)',
      },
    });

    this.rateLimit = config.rateLimit;
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for rate limiting
    this.api.interceptors.request.use(async (config) => {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      const minInterval = 1000 / this.rateLimit; // Convert rate limit to interval

      if (timeSinceLastRequest < minInterval) {
        const delay = minInterval - timeSinceLastRequest;
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      this.lastRequestTime = Date.now();
      logger.debug(`OpenDota API Request: ${config.method?.toUpperCase()} ${config.url}`);
      
      return config;
    });

    // Response interceptor for logging and error handling
    this.api.interceptors.response.use(
      (response) => {
        logger.debug(`OpenDota API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error(`OpenDota API Error:`, {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
        });
        throw error;
      }
    );
  }

  async searchPlayers(query: string): Promise<any[]> {
    try {
      const response = await this.api.get('/search', {
        params: { q: query },
      });
      return response.data || [];
    } catch (error) {
      logger.error('Error searching players:', error);
      return [];
    }
  }

  async getPlayer(accountId: string): Promise<any | null> {
    try {
      const response = await this.api.get(`/players/${accountId}`);
      return response.data;
    } catch (error) {
      logger.error(`Error getting player ${accountId}:`, error);
      return null;
    }
  }

  async getHeroStats(): Promise<any[]> {
    try {
      const response = await this.api.get('/heroStats');
      return response.data || [];
    } catch (error) {
      logger.error('Error getting hero stats:', error);
      return [];
    }
  }

  async getHeroMatchups(heroId: number): Promise<any[]> {
    try {
      const response = await this.api.get(`/heroes/${heroId}/matchups`);
      return response.data || [];
    } catch (error) {
      logger.error(`Error getting hero ${heroId} matchups:`, error);
      return [];
    }
  }

  async getScenarioLaneRoles(heroId?: number): Promise<any[]> {
    try {
      const params = heroId ? { hero_id: heroId } : {};
      const response = await this.api.get('/scenarios/laneRoles', { params });
      return response.data || [];
    } catch (error) {
      logger.error('Error getting lane roles:', error);
      return [];
    }
  }

  async getConstants(resource: string): Promise<any> {
    try {
      const response = await this.api.get(`/constants/${resource}`);
      return response.data || {};
    } catch (error) {
      logger.error(`Error getting constants for ${resource}:`, error);
      return {};
    }
  }
}

// Create singleton instance
const config: OpenDotaConfig = {
  baseURL: process.env.OPENDOTA_API_URL || 'https://api.opendota.com/api',
  timeout: 30000, // 30 seconds
  rateLimit: parseInt(process.env.OPENDOTA_RATE_LIMIT || '60'), // requests per minute
};

export const openDotaService = new OpenDotaService(config);

// Additional service for Official Dota 2 API
interface Dota2HeroData {
  id: number;
  name: string;
  name_loc: string;
  name_english_loc: string;
}

export const dota2ApiService = {
  async getOfficialHeroes(): Promise<Dota2HeroData[]> {
    try {
      const response = await axios.get(
        `${process.env.DOTA2_API_URL}/herolist?language=koreana`,
        {
          headers: {
            'User-Agent': 'DotaSpammerFinder/2.0',
          },
          timeout: 30000,
        }
      );

      return response.data?.result?.data?.heroes || [];
    } catch (error) {
      logger.error('Error getting official heroes:', error);
      return [];
    }
  },
};