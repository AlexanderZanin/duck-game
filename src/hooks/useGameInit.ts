import { useEffect } from "react";
import { reaction } from "mobx";
import { gameStore } from "../stores/GameStore";
import { soundService } from "../services/SoundService";
import { animationService } from "../services/AnimationService";

const START_Y_MIN = 5;
const START_Y_MAX = 95;

const MS_PER_SEC = 1000;

function randomStartY() {
  const range = START_Y_MAX - START_Y_MIN;
  return Math.floor(Math.random() * (range + 1)) + START_Y_MIN;
}

const DEFAULT_FLIGHT_DURATION_SEC = 5 * MS_PER_SEC;

export function useGameInit() {
  useEffect(() => {
    const disposer = reaction(
      () => gameStore.roundConfig,
      (roundConfig) => {
        const startY = randomStartY();
        const durationMs =
          roundConfig?.flightDurationMs ?? DEFAULT_FLIGHT_DURATION_SEC;

        gameStore.startRound();
        soundService.playQuack();

        animationService.start({
          startY,
          durationMs,
          onFinish: () => {
            soundService.stopQuack();
          },
        });
      },
    );
    return () => {
      disposer();
    };
  }, []);
}
