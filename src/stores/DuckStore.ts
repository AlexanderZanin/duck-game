import { makeAutoObservable } from "mobx";

export class DuckStore {
  x = 0; // percent 0..100
  y = 0; // percent 0..100
  isHit = false;
  animationFrame: 0 | 1 = 0; // 0 or 1

  // internal handles (not observable)
  private _rafId: number | null = null;
  private _flapIntervalId: number | null = null;
  private _startTime: number | null = null;
  private _duration = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // Actions for mutations
  setX(val: number) {
    this.x = val;
  }

  setY(val: number) {
    this.y = val;
  }

  setIsHit(val: boolean) {
    this.isHit = val;
  }

  setAnimationFrame(val: 0 | 1) {
    this.animationFrame = val;
  }

  // Start a flight: place at x=0, y=startY and animate to x=110 over durationMs
  // onFinish is called when the duck fully exits the screen (natural end)
  startFlight(startY: number, durationMs: number, onFinish?: () => void) {
    this.stopFlight();

    this.setX(0);
    this.setY(startY);
    this.setIsHit(false);
    this._duration = Math.max(1, durationMs);
    this._startTime = null;

    // start wing-flap toggler every 300ms
    this._flapIntervalId = window.setInterval(() => {
      this.setAnimationFrame(this.animationFrame === 0 ? 1 : 0);
    }, 300);

    const EXIT_PERCENT = 110; // animate to 110% so duck fully leaves viewport
    const step = (timestamp: number) => {
      if (this._startTime == null) this._startTime = timestamp;
      const elapsed = timestamp - this._startTime;
      const progress = Math.min(elapsed / this._duration, 1);
      // map progress [0..1] to x [0..EXIT_PERCENT]
      this.setX(progress * EXIT_PERCENT);

      if (progress >= 1) {
        // natural end: duck fully exited
        if (onFinish) onFinish();
        this.stopFlight();
        return;
      }

      if (this.isHit) {
        // if hit, simply stop movement (caller handles end logic)
        this.stopFlight();
        return;
      }

      this._rafId = window.requestAnimationFrame(step);
    };

    this._rafId = window.requestAnimationFrame(step);
  }

  // Mark as hit and stop flight/timers
  hit() {
    this.setIsHit(true);
    // stop movement and flap immediately
    if (this._rafId != null) {
      window.cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    if (this._flapIntervalId != null) {
      clearInterval(this._flapIntervalId);
      this._flapIntervalId = null;
    }
    // do not call onFinish here — caller schedules round end after 3s
  }

  // Stop RAF and intervals
  stopFlight() {
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
  }
}

export const duckStore = new DuckStore();
