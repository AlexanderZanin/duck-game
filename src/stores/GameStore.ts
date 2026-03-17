import { makeAutoObservable } from "mobx";
import type { RoundConfig } from "../types";

class GameStore {
  totalRounds = 0;
  totalHits = 0;
  roundConfig?: RoundConfig = undefined;
  isConnected = false;
  nextRoundIn = 0;

  constructor() {
    makeAutoObservable(this);
  }

  startRound() {
    this.totalRounds += 1;
  }

  setRoundConfig(config: RoundConfig) {
    this.roundConfig = config;
  }

  recordHit() {
    this.totalHits += 1;
  }

  setIsConnected(val: boolean) {
    this.isConnected = val;
  }

  setNextRoundIn(val: number) {
    this.nextRoundIn = val;
  }
}

export const gameStore = new GameStore();
