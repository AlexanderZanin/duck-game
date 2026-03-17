import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 3001;
const CORS_ORIGIN = "http://localhost:5173";

function randomBetween(minSeconds: number, maxSeconds: number) {
  const secs =
    Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
  return secs * 1000;
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

  (function scheduleNext() {
    const delayMs = randomBetween(10, 30);
    console.log(`Next round in ${delayMs}ms`);
    setTimeout(() => {
      const payload = {
        flightDuration: randomBetween(2, 3),
        nextRoundIn: delayMs,
      };
      console.log("emitting round:start", payload);
      io.emit("round:start", payload);
      scheduleNext();
    }, delayMs);
  })();
});
