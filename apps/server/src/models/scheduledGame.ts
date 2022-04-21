export interface ScheduledGame {
  description: string;
  level: null;
  startTime: string;
  matchNumber: number;
  field: Field;
  tournamentLevel: TournamentLevel;
  teams: Team[];
}

export enum Field {
  Primary = 'Primary',
}

export interface Team {
  teamNumber: number;
  station: Station;
  surrogate: boolean;
}

export type Color = 'Blue' | 'Red';
export type StationNumber = 1 | 2 | 3;
export type Station = `${Color}${StationNumber}`;

export enum TournamentLevel {
  Qualification = 'Qualification',
  Playoff = 'Playoff',
}
