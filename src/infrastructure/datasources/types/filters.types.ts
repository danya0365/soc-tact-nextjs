export interface ApiFilters {
  [key: string]: string | number | boolean | undefined;
}

export interface ApiMatchQueryFilters extends ApiFilters {
  season?: number;
  matchday?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
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
