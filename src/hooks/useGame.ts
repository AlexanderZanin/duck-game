import { useCallback, useEffect } from "react";
import { gameStore } from "../stores/GameStore";
import { duckStore } from "../stores/DuckStore";
import { soundService } from "../services/SoundService";

const START_Y_MIN = 5; // percent
const START_Y_MAX = 75; // percent

const FLIGHT_DURATION_MIN_SEC = 2;
const FLIGHT_DURATION_MAX_SEC = 10;
const MS_PER_SEC = 1000;

const LAUNCH_INTERVAL_MS = 10000;

const DUCK_DISAPPEAR_AFTER_HIT_MS = 3000;

function randomStartY() {
  const range = START_Y_MAX - START_Y_MIN;
  return Math.floor(Math.random() * (range + 1)) + START_Y_MIN;
}

function randomFlightDuration() {
  const secs =
    Math.floor(
      Math.random() * (FLIGHT_DURATION_MAX_SEC - FLIGHT_DURATION_MIN_SEC + 1),
    ) + FLIGHT_DURATION_MIN_SEC;
  return secs * MS_PER_SEC;
}

export function useGame() {
  const launchRound = useCallback(() => {
    const startY = randomStartY();
    gameStore.startRound();
    soundService.playQuack();

    const durationMs = randomFlightDuration();
    duckStore.startFlight(startY, durationMs, () => {
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

    setTimeout(() => {
      duckStore.setX(-100);
      duckStore.setIsHit(false);
      gameStore.endRound();
    }, DUCK_DISAPPEAR_AFTER_HIT_MS);
  }, []);

  useEffect(() => {
    launchRound();
    const id = setInterval(launchRound, LAUNCH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [launchRound]);

  return {
    gameStore,
    duckStore,
    launchRound,
    hitDuck,
  };
}
