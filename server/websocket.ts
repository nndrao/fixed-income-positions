import { WebSocket, WebSocketServer } from 'ws';
import type { Express } from "express";
import * as http from 'http';

export function setupWebSocketServer(server: http.Server) {
  const wss = new WebSocketServer({ 
    server,
    path: '/ws'
  });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
}

export function broadcastPositions(wss: WebSocketServer, positions: any) {
  const message = JSON.stringify({
    destination: '/topic/positions',
    body: JSON.stringify(positions)
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
