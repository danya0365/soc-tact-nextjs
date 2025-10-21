/**
 * Football Data Datasource
 * Handles HTTP requests to Football-Data.org API
 * Following Single Responsibility Principle (SOLID)
 */

import axios, { AxiosError, AxiosInstance } from "axios";
import { FOOTBALL_API_CONFIG } from "../config/football-api.config";
import type {
  ApiCompetitionsResponse,
  ApiFilters,
  ApiHeadToHeadFilters,
  ApiHeadToHeadResponse,
  ApiMatchQueryFilters,
  ApiMatchResponse,
  ApiMatchesByTeamResponse,
  ApiMatchesResponse,
  ApiStandingsResponse,
  ApiTeamMatchFilters,
  ApiTeamResponse,
  ApiTeamsResponse,
  ApiTopScorersResponse,
} from "./types/football-data.types";

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
  async get<T>(endpoint: string, params?: ApiFilters): Promise<T> {
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
  async getCompetitions(): Promise<ApiCompetitionsResponse> {
    return this.get<ApiCompetitionsResponse>("/competitions");
  }

  /**
   * Get competition by ID
   */
  async getCompetitionById(
    competitionId: number
  ): Promise<ApiCompetitionsResponse["competitions"][number]> {
    return this.get<ApiCompetitionsResponse["competitions"][number]>(
      `/competitions/${competitionId}`
    );
  }

  /**
   * Get matches by competition
   */
  async getMatchesByCompetition(
    competitionId: number,
    filters?: ApiMatchQueryFilters
  ): Promise<ApiMatchesResponse> {
    return this.get<ApiMatchesResponse>(
      `/competitions/${competitionId}/matches`,
      filters
    );
  }

  /**
   * Get standings by competition
   */
  async getStandingsByCompetition(
    competitionId: number,
    season?: number
  ): Promise<ApiStandingsResponse> {
    const params = season ? { season } : undefined;
    return this.get<ApiStandingsResponse>(
      `/competitions/${competitionId}/standings`,
      params
    );
  }

  /**
   * Get top scorers by competition
   */
  async getTopScorersByCompetition(
    competitionId: number,
    season?: number
  ): Promise<ApiTopScorersResponse> {
    const params = season ? { season } : undefined;
    return this.get<ApiTopScorersResponse>(
      `/competitions/${competitionId}/scorers`,
      params
    );
  }

  /**
   * Get match by ID
   */
  async getMatchById(matchId: number): Promise<ApiMatchResponse> {
    return this.get<ApiMatchResponse>(`/matches/${matchId}`);
  }

  /**
   * Get matches by date
   */
  async getMatchesByDate(date: string): Promise<ApiMatchesResponse> {
    return this.get<ApiMatchesResponse>("/matches", { date });
  }

  /**
   * Get matches by date range
   */
  async getMatchesByDateRange(
    dateFrom: string,
    dateTo: string
  ): Promise<ApiMatchesResponse> {
    return this.get<ApiMatchesResponse>("/matches", { dateFrom, dateTo });
  }

  /**
   * Get team by ID
   */
  async getTeamById(teamId: number): Promise<ApiTeamResponse> {
    return this.get<ApiTeamResponse>(`/teams/${teamId}`);
  }

  /**
   * Get teams by competition
   */
  async getTeamsByCompetition(
    competitionId: number
  ): Promise<ApiTeamsResponse> {
    return this.get<ApiTeamsResponse>(`/competitions/${competitionId}/teams`);
  }

  /**
   * Get team matches
   */
  async getTeamMatches(
    teamId: number,
    filters?: ApiTeamMatchFilters
  ): Promise<ApiMatchesByTeamResponse> {
    return this.get<ApiMatchesByTeamResponse>(
      `/teams/${teamId}/matches`,
      filters
    );
  }

  /**
   * Get head to head matches
   */
  async getHeadToHead(
    matchId: number,
    filters?: ApiHeadToHeadFilters
  ): Promise<ApiHeadToHeadResponse> {
    return this.get<ApiHeadToHeadResponse>(
      `/matches/${matchId}/head2head`,
      filters
    );
  }
}
