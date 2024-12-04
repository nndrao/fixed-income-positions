import { WebSocketServer } from 'ws';
import { broadcastPositions } from './websocket';

interface Position {
  id: string;
  symbol: string;
  quantity: number;
  price: number;
  marketValue: number;
  pnl: number;
  timestamp: string;
}

const SYMBOLS = [
  'US10Y', 'US30Y', 'DE10Y', 'UK10Y', 'JGB10Y',
  'TIPS5Y', 'TIPS10Y', 'CORP_AAA', 'CORP_BBB', 'HY_IDX'
];

function generateInitialPositions(): Position[] {
  return SYMBOLS.map((symbol) => ({
    id: symbol,
    symbol,
    quantity: Math.floor(Math.random() * 1000000) + 100000,
    price: 95 + Math.random() * 10,
    marketValue: 0,
    pnl: 0,
    timestamp: new Date().toISOString()
  }));
}

function updatePosition(position: Position): Position {
  const priceChange = (Math.random() - 0.5) * 0.1;
  const newPrice = position.price * (1 + priceChange);
  const newMarketValue = position.quantity * newPrice;
  const newPnl = newMarketValue - (position.quantity * position.price);

  return {
    ...position,
    price: newPrice,
    marketValue: newMarketValue,
    pnl: newPnl,
    timestamp: new Date().toISOString()
  };
}

export function startPositionSimulator(wss: WebSocketServer) {
  let positions = generateInitialPositions();

  // Calculate initial market values
  positions = positions.map(pos => ({
    ...pos,
    marketValue: pos.quantity * pos.price,
    pnl: 0
  }));

  // Broadcast initial positions
  broadcastPositions(wss, positions);

  // Update positions every second
  setInterval(() => {
    positions = positions.map(updatePosition);
    broadcastPositions(wss, positions);
  }, 1000);
}
