import { useCallback, useEffect } from "react";
import { gameStore } from "../stores/GameStore";
import { duckStore } from "../stores/DuckStore";
import { soundService } from "../services/SoundService";

function randomStartY() {
  // keep duck fully visible: between 5% and 75%
  return Math.floor(Math.random() * 70) + 5;
}

export function useGame() {
  const launchRound = useCallback(() => {
    const startY = randomStartY();
    gameStore.startRound();
    soundService.playQuack();

    duckStore.startFlight(startY, 5000, () => {
      // natural end (duck flew off)
      soundService.stopQuack();
      gameStore.endRound();
    });
  }, []);

  const hitDuck = useCallback(() => {
    if (duckStore.isHit) return;
    duckStore.hit();
    soundService.stopQuack();
    soundService.playShot();
    gameStore.recordHit();

    // after 3s duck disappears and round ends
    setTimeout(() => {
      // hide/reset duck
      duckStore.setX(-100);
      duckStore.setIsHit(false);
      gameStore.endRound();
    }, 3000);
  }, []);

  useEffect(() => {
    // start immediately, then every 10s
    launchRound();
    const id = setInterval(launchRound, 10000);
    return () => clearInterval(id);
  }, [launchRound]);

  return {
    gameStore,
    duckStore,
    launchRound,
    hitDuck,
  };
}
