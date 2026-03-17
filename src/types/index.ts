export type RoundConfig = {
  flightDurationMs: number;
};

export interface Duck {
  x: number;
  y: number;
  isHit: boolean;
  isActive: boolean;
  animationFrame: 0 | 1;
}

export interface Game {
  totalRounds: number;
  totalHits: number;
  nextRoundIn: number;
  roundConfig?: RoundConfig;
  isConnected: boolean;
}