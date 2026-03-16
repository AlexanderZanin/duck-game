# Copilot Instructions — Duck Hunt

## Tech Stack

- React 19 + Vite + TypeScript
- MobX 6 + mobx-react-lite
- Howler.js for audio
- HTML + CSS for duck animation (no canvas)
- socket.io-client on frontend, socket.io + Node.js on backend

---

## Project Structure

```
src/
  assets/         # duck_sprite.svg, quack.mp3, awp.mp3
  components/     # Presentational React components only
  hooks/          # Custom domain hooks (bridge between UI and stores)
  stores/         # MobX store classes
  services/       # Non-MobX singletons (e.g. SoundService)
server/
  index.ts        # Node.js + socket.io server
```

---

## MobX Rules

- All store classes use MobX 6 `makeAutoObservable(this)` in the constructor
- All state mutations must happen inside MobX `action`s — never mutate observables directly outside of actions
- Stores are instantiated as singletons and exported from their file
- Computed values must use `get` getters — do not derive state inside components
- Do not use decorators (`@observable`, `@action`) — use `makeAutoObservable` only

```js
// CORRECT
class GameStore {
  totalRounds = 0;
  totalHits = 0;
  isRoundActive = false;

  constructor() {
    makeAutoObservable(this);
  }

  startRound() {
    this.totalRounds += 1;
    this.isRoundActive = true;
  }
}

export const gameStore = new GameStore();
```

---

## Component Rules

- Components are purely presentational — they receive props, render UI, handle DOM events
- Components never import stores directly
- All store interaction goes through custom hooks in `src/hooks/`
- Wrap components that consume observables with `observer()` from `mobx-react-lite`
- Keep components in `src/components/`, one component per file

```jsx
// CORRECT
const Duck = observer(({ x, y, isHit, animationFrame }) => { ... });

// WRONG
import { duckStore } from '../stores/DuckStore';
```

---

## Custom Hook Rules

- All domain logic is accessed via hooks in `src/hooks/`
- Hooks import store singletons and services, compose them, and expose a clean API to components
- Components call hooks, not stores
- The primary hook is `useGame` — it is the single entry point for all game interactions

```ts
// useGame.ts exposes:
// { totalRounds, totalHits, isRoundActive, duck, shootAt, startRound }
```

---

## Animation Rules

- Duck position (`x`, `y`) is stored as percentage values (0–100) in DuckStore
- Position is updated via `requestAnimationFrame` inside a MobX action
- CSS handles sprite frame switching via `background-position` — not JS animation libraries
- The duck element is absolutely positioned inside a full-viewport relative container
- Wing flapping: toggle between frame 0 and frame 1 every 300ms using a MobX observable `animationFrame`
- Hit state: set `background-position` to frame 3, stop flapping animation via a CSS class `duck--hit`
- `steps(1)` timing is used in CSS transitions to snap between frames (no interpolation)

### Sprite Layout

- File: `src/assets/duck_-_sprite.svg`
- 3 frames laid out **horizontally**
- Frame 0 (wings down): `background-position: 0px 0px`
- Frame 1 (wings up): `background-position: -[FRAME_WIDTH]px 0px`
- Frame 2 (hit): `background-position: -[FRAME_WIDTH * 2]px 0px`
- Replace `[FRAME_WIDTH]` with the actual pixel width of a single frame once known

---

## Sound Rules

- All audio is handled by `SoundService` in `src/services/SoundService.ts`
- Uses Howler.js — no native `Audio` API
- `SoundService` is a plain class singleton (not MobX)
- Methods: `playQuack()` (loops), `stopQuack()`, `playShot()` (plays once)
- Audio files: `src/assets/quack.mp3`, `src/assets/awp.mp3`

```js
// CORRECT
import { Howl } from "howler";
class SoundService {
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
```

---

## Game Logic Rules

- Round launch timing is owned by `GameStore` — not by a React `useEffect` or component
- Default launch interval: random between 10–30 seconds (20s ± 10s)
- Duck flight duration: 5 seconds, moving left to right
- Duck start Y position: random, constrained to keep the duck fully visible in viewport
- On hit: show hit frame, stop movement, play shot sound, duck disappears after 3 seconds
- If round ends without a hit: duck flies off screen, no hit recorded
- Score format in HUD: `hits/rounds` (e.g. `3/5`)

---

## Socket.io Rules

- Server lives in `server/index.ts`, runs on port 3001
- Server owns round launch timing — it emits `round:start` to all clients
- `round:start` payload: `{ durationMs: number, nextRoundInMs: number }`
- Frontend listens via a `SocketService` in `src/services/SocketService.ts`
- On `round:start`, `SocketService` calls `gameStore.startRound()` with the payload
- Do not put socket logic inside React components or hooks

---

## General Rules

- Do not install dependencies not listed in the tech stack without asking
- Do not use `class` components — functional components only
- Do not use `React.useContext` for store access — use hooks from `src/hooks/`
- Do not add CSS-in-JS libraries (no styled-components, no Emotion)
- CSS lives in `.css` files co-located with their component, or in `src/styles/`
- All async operations inside stores use `runInAction` to wrap state mutations

```js
// CORRECT async pattern in a store
async fetchSomething() {
  const result = await api.get();
  runInAction(() => {
    this.data = result;
  });
}
```
