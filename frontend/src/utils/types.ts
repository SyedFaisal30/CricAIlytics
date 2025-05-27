export interface OpponentStats {
  opponent: string;
  matches: number;
  runs: number;
  average: number;
  strike_rate: number;
  fifties: number;
  hundreds: number;
  high_score: string;
  wickets: number;
  best: string;
  economy: number;
  four_wicket_hauls: number;
  five_wicket_hauls: number;
}

export interface BattingStats {
  matches: number;
  innings: number;
  runs: number;
  average: number;
  strike_rate: number;
  fifties: number;
  hundreds: number;
  high_score: string;
  batting_vs_opponents: OpponentStats[];
}

export interface BowlingStats {
  matches: number;
  innings_bowled: number;
  wickets: number;
  average: number;
  economy: number;
  best: string;
  four_wicket_hauls: number;
  five_wicket_hauls: number;
  bowling_vs_opponents: OpponentStats[];
}

export interface FieldingStats {
  catches: number;
  stumpings: number;
  run_outs: number;
}

export interface FormatStats {
  batting: BattingStats;
  bowling: BowlingStats;
  fielding: FieldingStats;
  batting_vs_opponents: OpponentStats[];
  bowling_vs_opponents: OpponentStats[];
}

export interface PlayerFormats {
  Test: FormatStats;
  ODI: FormatStats;
  T20I: FormatStats;
  IPL: FormatStats;
}

export interface PlayerOrigin {
  country: string;
  state: string;
  teams: string[];
}

export interface PlayerProfile {
  name: string;
  also_known_as: string;
  age_as_of_jan_2025: number;
  origin: PlayerOrigin;
  background: string;
}

export interface PlayerInfo {
  role: string;
  batting_handedness: string;
  bowling_style: string;
}

export interface PlayerData {
  player_profile: PlayerProfile;
  player_info: PlayerInfo;
  formats: PlayerFormats;
  summary: string;
  achievements: string[];
  image_url: string;
  note: string;
}
