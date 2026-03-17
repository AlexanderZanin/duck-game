import { useCallback, useEffect } from "react";
import { reaction } from "mobx";
import { gameStore } from "../stores/GameStore";
import { duckStore } from "../stores/DuckStore";
import { soundService } from "../services/SoundService";
import { animationService } from "../services/AnimationService";

const START_Y_MIN = 5; // percent
const START_Y_MAX = 95; // percent

const MS_PER_SEC = 1000;

const LAUNCH_INTERVAL_MS = 10000;

const DUCK_DISAPPEAR_AFTER_HIT_MS = 3000;

function randomStartY() {
  const range = START_Y_MAX - START_Y_MIN;
  return Math.floor(Math.random() * (range + 1)) + START_Y_MIN;
}

const DEFAULT_FLIGHT_DURATION_SEC = 5 * MS_PER_SEC;

export function useGame() {
  const launchRound = useCallback(() => {
    console.log("Launching round");
    const startY = randomStartY();
    const durationMs =
      gameStore.roundConfig?.durationMs ?? DEFAULT_FLIGHT_DURATION_SEC;

    gameStore.startRound();
    soundService.playQuack();

    animationService.start({
      startY,
      durationMs,
      onFinish: () => {
        soundService.stopQuack();
      },
    });
  }, []);

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

  useEffect(() => {
    const disposer = reaction(
      () => gameStore.roundConfig,
      (roundConfig) => {
        const id = setTimeout(
          launchRound,
          roundConfig?.nextRoundInMs ?? LAUNCH_INTERVAL_MS,
        );
        return () => clearTimeout(id);
      },
    );
    return () => {
      disposer();
    };
  }, [launchRound]);

  return {
    gameStore,
    duckStore,
    hitDuck,
  };
}
