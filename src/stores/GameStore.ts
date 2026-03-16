import { makeAutoObservable } from "mobx";

class GameStore {
  totalRounds = 0;
  totalHits = 0;
  isRoundActive = false;

  constructor() {
    makeAutoObservable(this);
  }

  startRound() {
    this.totalRounds += 1;
    this.isRoundActive = true;
  }

  endRound() {
    this.isRoundActive = false;
  }

  recordHit() {
    this.totalHits += 1;
  }
}

export const gameStore = new GameStore();
