import { makeAutoObservable } from "mobx";
import type { RoundConfig } from "../types";

class GameStore {
  totalRounds = 0;
  totalHits = 0;
  isRoundActive = false;
  roundConfig?: RoundConfig = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  startRound() {
    this.totalRounds += 1;
    this.isRoundActive = true;
  }

  setRoundConfig(config: RoundConfig) {
    this.roundConfig = config;
  }

  endRound() {
    this.isRoundActive = false;
  }

  recordHit() {
    this.totalHits += 1;
  }
}

export const gameStore = new GameStore();
