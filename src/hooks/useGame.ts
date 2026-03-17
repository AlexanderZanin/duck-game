import { useCallback } from "react";
import { gameStore } from "../stores/GameStore";
import { duckStore } from "../stores/DuckStore";
import { soundService } from "../services/SoundService";
import { animationService } from "../services/AnimationService";

const DUCK_DISAPPEAR_AFTER_HIT_MS = 3000;

export function useGame() {
  const hitDuck = useCallback(() => {
    if (duckStore.isHit) return;
    duckStore.hit();
    animationService.stop();
    soundService.stopQuack();
    soundService.playShot();
    gameStore.recordHit();

    setTimeout(() => {
      duckStore.setX(-100);
      duckStore.setIsHit(false);
    }, DUCK_DISAPPEAR_AFTER_HIT_MS);
  }, []);

  return {
    gameStore,
    duckStore,
    hitDuck,
  };
}
