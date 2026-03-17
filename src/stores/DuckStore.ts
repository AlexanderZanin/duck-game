import { makeAutoObservable } from "mobx";

export class DuckStore {
  x = -100;
  y = 0;
  isHit = false;
  animationFrame: 0 | 1 = 0;
  isActive = false;

  constructor() {
    makeAutoObservable(this);
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setX(x: number) {
    this.x = x;
  }

  setY(y: number) {
    this.y = y;
  }

  setIsHit(val: boolean) {
    this.isHit = val;
  }

  setAnimationFrame(val: 0 | 1) {
    this.animationFrame = val;
  }

  setActive(val: boolean) {
    this.isActive = val;
  }

  hit() {
    this.isHit = true;
  }
}

export const duckStore = new DuckStore();
