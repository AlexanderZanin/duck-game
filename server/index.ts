import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 3001;
const CORS_ORIGIN = "http://localhost:5173";

const MIN_ROUND_DELAY_S = 10;
const MAX_ROUND_DELAY_S = 30;

const MIN_FLIGHT_DURATION_S = 2;
const MAX_FLIGHT_DURATION_S = 8;

const randomBetweenMs = (minSeconds: number, maxSeconds: number): number =>
  (Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds) *
  1000;

const buildRoundPayload = () => ({
  flightDurationMs: randomBetweenMs(
    MIN_FLIGHT_DURATION_S,
    MAX_FLIGHT_DURATION_S,
  ),
});

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
  },
});

let nextRoundAt: number = 0;
let nextRoundPayload: ReturnType<typeof buildRoundPayload> | null = null;

function scheduleNextRound() {
  const delayMs = randomBetweenMs(MIN_ROUND_DELAY_S, MAX_ROUND_DELAY_S);
  nextRoundAt = Date.now() + delayMs;
  nextRoundPayload = buildRoundPayload();

  console.log(`Next round in ${delayMs}ms`);

  io.emit("round:scheduled", {
    startsInMs: delayMs,
    payload: nextRoundPayload,
  });

  setTimeout(() => {
    console.log("Emitting round:start", nextRoundPayload);
    io.emit("round:start", nextRoundPayload);
    scheduleNextRound();
  }, delayMs);
}

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  const msUntilNext = nextRoundAt - Date.now();
  socket.emit("round:scheduled", {
    startsInMs: msUntilNext,
    payload: nextRoundPayload,
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket.io server listening on port ${PORT}`);
  scheduleNextRound();
});
