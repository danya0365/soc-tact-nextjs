export interface ApiArea {
  id?: number;
  name?: string;
  code?: string;
  flag?: string;
}

export interface ApiSeason {
  id?: number;
  startDate?: string;
  endDate?: string;
  currentMatchday?: number;
  winner?: unknown;
}

export interface ApiCompetition {
  id?: number;
  name?: string;
  code?: string;
  type?: string;
  emblem?: string;
  area?: ApiArea;
  plan?: string;
  lastUpdated?: string;
  currentSeason?: ApiSeason;
  seasons?: ApiSeason[];
}

export interface ApiTeam {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
  crestUrl?: string;
  founded?: number;
  clubColors?: string;
  venue?: string;
  website?: string;
  area?: ApiArea;
  address?: string;
  email?: string;
  phone?: string;
}

export interface ApiPlayer {
  id: number;
  name: string;
  position?: string;
  dateOfBirth?: string;
  nationality?: string;
  shirtNumber?: number;
}

export interface ApiScoreTiming {
  home?: number | null;
  away?: number | null;
}

export interface ApiScore {
  winner?: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
  duration?: "REGULAR" | "EXTRA_TIME" | "PENALTY_SHOOTOUT" | string | null;
  fullTime?: ApiScoreTiming;
  halfTime?: ApiScoreTiming;
  regularTime?: ApiScoreTiming;
  extraTime?: ApiScoreTiming;
  penalties?: ApiScoreTiming;
  home?: number | null;
  away?: number | null;
}

export interface ApiReferee {
  id: number;
  name: string;
  type?: string;
  nationality?: string;
}

export interface ApiMatchTeam extends ApiTeam {
  coach?: ApiPlayer;
  captain?: ApiPlayer;
  formation?: string;
  lineup?: ApiPlayer[];
  bench?: ApiPlayer[];
}

export interface ApiMatch {
  area?: ApiArea;
  competition?: ApiCompetition;
  season?: ApiSeason;
  id: number;
  utcDate: string;
  status: string;
  stage?: string | null;
  group?: string | null;
  matchday?: number | null;
  lastUpdated?: string;
  venue?: string | null;
  minute?: number | null;
  attendance?: number | null;
  homeTeam: ApiMatchTeam;
  awayTeam: ApiMatchTeam;
  score?: ApiScore;
  referees?: ApiReferee[];
}

export interface ApiResultSet {
  count?: number;
  first?: string;
  last?: string;
  played?: number;
  wins?: number;
  draws?: number;
  losses?: number;
}

export interface ApiStandingsTeam {
  position: number;
  team: ApiTeam;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string | null;
  description?: string | null;
}

export interface ApiStandingGroup {
  stage?: string;
  type?: string;
  group?: string | null;
  table: ApiStandingsTeam[];
}

export interface ApiScorer {
  player: ApiPlayer & { nationality: string; position?: string };
  team: ApiTeam;
  playedMatches?: number;
  goals?: number;
  assists?: number;
  penalties?: number;
}

export interface ApiHeadToHeadTotals {
  wins: number;
  draws: number;
  losses: number;
}

export interface ApiHeadToHeadSummary {
  numberOfMatches: number;
  totalGoals: number;
  homeTeam: ApiHeadToHeadTotals;
  awayTeam: ApiHeadToHeadTotals;
}
