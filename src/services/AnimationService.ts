import { duckStore } from "../stores/DuckStore";

type StartPayload = {
  startY: number;
  durationMs: number;
  onFinish?: () => void;
};

class AnimationService {
  private _rafId: number | null = null;
  private _flapIntervalId: number | null = null;
  private _startTime: number | null = null;
  private _duration = 0;

  private readonly EXIT_PERCENT = 110;
  private readonly FLAP_INTERVAL_MS = 300;

  start(payload: StartPayload) {
    this.stop();

    const { startY, durationMs, onFinish } = payload;
    this._duration = Math.max(1, durationMs);
    this._startTime = null;

    duckStore.setPosition(0, startY);
    duckStore.setIsHit(false);
    duckStore.setActive(true);

    this._flapIntervalId = window.setInterval(() => {
      duckStore.setAnimationFrame(duckStore.animationFrame === 0 ? 1 : 0);
    }, this.FLAP_INTERVAL_MS);

    const step = (timestamp: number) => {
      if (this._startTime == null) this._startTime = timestamp;
      const elapsed = timestamp - this._startTime;
      const progress = Math.min(elapsed / this._duration, 1);
      const x = progress * this.EXIT_PERCENT;
      duckStore.setX(x);

      if (duckStore.isHit) {
        this.stop();
        return;
      }

      if (progress >= 1) {
        this.stop();
        if (onFinish) onFinish();
        return;
      }

      this._rafId = window.requestAnimationFrame(step);
    };

    this._rafId = window.requestAnimationFrame(step);
  }

  stop() {
    if (this._rafId != null) {
      window.cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    if (this._flapIntervalId != null) {
      clearInterval(this._flapIntervalId);
      this._flapIntervalId = null;
    }
    this._startTime = null;
    this._duration = 0;
    duckStore.setActive(false);
  }
}

export const animationService = new AnimationService();
