import { Howl } from "howler";

class SoundService {
  private _quack: Howl;
  private _shot: Howl;

  constructor() {
    this._quack = new Howl({ src: ["/src/assets/quack.mp3"], loop: true });
    this._shot = new Howl({ src: ["/src/assets/awp.mp3"] });
  }

  playQuack() {
    this._quack.play();
  }

  stopQuack() {
    this._quack.stop();
  }

  playShot() {
    this._shot.play();
  }
}

export const soundService = new SoundService();
