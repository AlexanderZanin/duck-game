import { io, Socket } from "socket.io-client";
import { gameStore } from "../stores/GameStore";
import type { RoundConfig } from "../types";

class SocketService {
  private socket: Socket | null = null;
  private readonly url = "http://localhost:3001";

  init() {
    if (this.socket) return;
    this.socket = io(this.url, {
      transports: ["websocket"],
      reconnection: true,
    });

    this.socket.on("connect", () => {
      console.log("connected to socket server", this.socket?.id);
      gameStore.setIsConnected(true);
    });

    this.socket.on("round:scheduled", (payload: { startsInMs: number; payload: RoundConfig }) => {
      console.log("received round:scheduled", payload);
      gameStore.setNextRoundIn(payload.startsInMs);
    });

    this.socket.on("round:start", (payload: RoundConfig) => {
      console.log("received round:start", payload);
      gameStore.setRoundConfig(payload);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("socket disconnected", reason);
    });
  }
}

export const socketService = new SocketService();
