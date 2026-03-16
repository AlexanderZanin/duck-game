import { useCallback } from "react";
import { gameStore } from "../stores/GameStore";

export function useGame() {
  const startRound = useCallback(() => gameStore.startRound(), []);
  const endRound = useCallback(() => gameStore.endRound(), []);

  return {
    totalRounds: gameStore.totalRounds,
    totalHits: gameStore.totalHits,
    isRoundActive: gameStore.isRoundActive,
    startRound,
    endRound,
  };
}
