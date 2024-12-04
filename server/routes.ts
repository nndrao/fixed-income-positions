import type { Express } from "express";
import type { Server } from "http";
import { setupWebSocketServer } from "./websocket";
import { startPositionSimulator } from "./position-simulator";

export function registerRoutes(app: Express, server: Server) {
  const wss = setupWebSocketServer(server);
  startPositionSimulator(wss);
}
