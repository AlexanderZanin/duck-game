import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 3001;
const CORS_ORIGIN = "http://localhost:5173";

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDurationMs() {
  return randomBetween(2, 3) * 1000;
}

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("client connected", socket.id);
  socket.on("disconnect", () => console.log("client disconnected", socket.id));
});

httpServer.listen(PORT, () => {
  console.log(`Socket.io server listening on port ${PORT}`);

  // Start the timed loop
  (function scheduleNext() {
    const delay = randomBetween(5000, 7000);
    console.log(`Next round in ${delay}ms`);
    setTimeout(() => {
      const payload = {
        durationMs: randomDurationMs(),
        nextRoundInMs: delay,
      };
      console.log("emitting round:start", payload);
      io.emit("round:start", payload);
      scheduleNext();
    }, delay);
  })();
});
