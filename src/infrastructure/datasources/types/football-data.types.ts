import type {
  ApiCompetition,
  ApiHeadToHeadSummary,
  ApiMatch,
  ApiPlayer,
  ApiResultSet,
  ApiScorer,
  ApiSeason,
  ApiStandingGroup,
  ApiTeam,
} from "./entities.types";
import type { ApiFilters } from "./filters.types";

export * from "./entities.types";
export * from "./filters.types";

export interface ApiCompetitionsResponse {
  count?: number;
  filters?: ApiFilters;
  competitions: ApiCompetition[];
}

export type ApiCompetitionResponse = ApiCompetition;

export type ApiMatchResponse = ApiMatch;

export interface ApiMatchesResponse {
  count?: number;
  filters?: ApiFilters;
  competition?: ApiCompetition;
  resultSet?: ApiResultSet;
  matches: ApiMatch[];
}

export interface ApiMatchesByTeamResponse {
  count?: number;
  filters?: ApiFilters;
  competition?: ApiCompetition;
  resultSet?: ApiResultSet;
  matches: ApiMatch[];
}

export interface ApiStandingsResponse {
  filters?: ApiFilters;
  competition: ApiCompetition;
  season: ApiSeason;
  standings: ApiStandingGroup[];
}

export interface ApiTeamsResponse {
  count?: number;
  filters?: ApiFilters;
  competition: ApiCompetition;
  season: ApiSeason;
  teams: ApiTeam[];
}

export interface ApiTeamResponse extends ApiTeam {
  coach?: ApiPlayer;
  squad?: ApiPlayer[];
  runningCompetitions?: ApiCompetition[];
  founded?: number;
  colors?: string;
}

export interface ApiTopScorersResponse {
  count?: number;
  filters?: ApiFilters;
  competition: ApiCompetition;
  season: ApiSeason;
  scorers: ApiScorer[];
}

export interface ApiHeadToHeadResponse {
  filters?: ApiFilters;
  resultSet?: ApiResultSet;
  match?: ApiMatch;
  head2head: ApiHeadToHeadSummary;
  matches: ApiMatch[];
}

export interface ApiScoreTiming {
  home?: number | null;
  away?: number | null;
}

export interface ApiTeamMatchFilters extends ApiFilters {
  season?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}

export interface ApiHeadToHeadFilters extends ApiFilters {
  limit?: number;
}
