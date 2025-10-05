/**
 * Football Data Datasource
 * Handles HTTP requests to Football-Data.org API
 * Following Single Responsibility Principle (SOLID)
 */

import axios, { AxiosInstance, AxiosError } from "axios";
import { FOOTBALL_API_CONFIG } from "../config/football-api.config";

export class FootballDataDatasource {
  private axiosInstance: AxiosInstance;
  private requestCount: number = 0;
  private lastRequestTime: number = Date.now();

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: FOOTBALL_API_CONFIG.FOOTBALL_DATA.BASE_URL,
      headers: FOOTBALL_API_CONFIG.FOOTBALL_DATA.HEADERS,
      timeout: 10000,
    });

    // Request interceptor for rate limiting
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        await this.checkRateLimit();
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Check rate limit (10 requests per minute for free tier)
   */
  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const timeDiff = now - this.lastRequestTime;

    // Reset counter every minute
    if (timeDiff > 60000) {
      this.requestCount = 0;
      this.lastRequestTime = now;
    }

    // Wait if rate limit exceeded
    if (this.requestCount >= 10) {
      const waitTime = 60000 - timeDiff;
      console.warn(`Rate limit reached. Waiting ${waitTime}ms...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.lastRequestTime = Date.now();
    }

    this.requestCount++;
  }

  /**
   * Handle API errors
   */
  private handleError(error: AxiosError): void {
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as any)?.message || error.message;

      switch (status) {
        case 400:
          console.error("Bad Request:", message);
          break;
        case 403:
          console.error("Forbidden: Invalid API key or rate limit exceeded");
          break;
        case 404:
          console.error("Not Found:", message);
          break;
        case 429:
          console.error("Too Many Requests: Rate limit exceeded");
          break;
        case 500:
          console.error("Internal Server Error:", message);
          break;
        default:
          console.error(`API Error (${status}):`, message);
      }
    } else if (error.request) {
      console.error("Network Error: No response received");
    } else {
      console.error("Error:", error.message);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all competitions/leagues
   */
  async getCompetitions(): Promise<any> {
    return this.get("/competitions");
  }

  /**
   * Get competition by ID
   */
  async getCompetitionById(competitionId: number): Promise<any> {
    return this.get(`/competitions/${competitionId}`);
  }

  /**
   * Get matches by competition
   */
  async getMatchesByCompetition(
    competitionId: number,
    filters?: {
      season?: number;
      matchday?: number;
      status?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<any> {
    return this.get(`/competitions/${competitionId}/matches`, filters);
  }

  /**
   * Get standings by competition
   */
  async getStandingsByCompetition(
    competitionId: number,
    season?: number
  ): Promise<any> {
    const params = season ? { season } : undefined;
    return this.get(`/competitions/${competitionId}/standings`, params);
  }

  /**
   * Get top scorers by competition
   */
  async getTopScorersByCompetition(
    competitionId: number,
    season?: number
  ): Promise<any> {
    const params = season ? { season } : undefined;
    return this.get(`/competitions/${competitionId}/scorers`, params);
  }

  /**
   * Get match by ID
   */
  async getMatchById(matchId: number): Promise<any> {
    return this.get(`/matches/${matchId}`);
  }

  /**
   * Get matches by date
   */
  async getMatchesByDate(date: string): Promise<any> {
    return this.get("/matches", { date });
  }

  /**
   * Get matches by date range
   */
  async getMatchesByDateRange(dateFrom: string, dateTo: string): Promise<any> {
    return this.get("/matches", { dateFrom, dateTo });
  }

  /**
   * Get team by ID
   */
  async getTeamById(teamId: number): Promise<any> {
    return this.get(`/teams/${teamId}`);
  }

  /**
   * Get teams by competition
   */
  async getTeamsByCompetition(competitionId: number): Promise<any> {
    return this.get(`/competitions/${competitionId}/teams`);
  }

  /**
   * Get team matches
   */
  async getTeamMatches(
    teamId: number,
    filters?: {
      season?: number;
      status?: string;
      dateFrom?: string;
      dateTo?: string;
      limit?: number;
    }
  ): Promise<any> {
    return this.get(`/teams/${teamId}/matches`, filters);
  }

  /**
   * Get head to head matches
   */
  async getHeadToHead(matchId: number): Promise<any> {
    return this.get(`/matches/${matchId}/head2head`);
  }
}
