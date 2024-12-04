import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { PositionGrid } from "../components/PositionGrid";
import { DashboardHeader } from "../components/DashboardHeader";
import { StompClient } from "../lib/stomp-client";
import { useToast } from "@/hooks/use-toast";

export interface Position {
  id: string;
  symbol: string;
  quantity: number;
  price: number;
  marketValue: number;
  pnl: number;
  timestamp: string;
}

export default function PositionDashboard() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const client = new StompClient();

    client.onConnect = () => {
      setConnected(true);
      toast({
        title: "Connected",
        description: "Real-time position updates active",
      });

      client.subscribe("/topic/positions", (message) => {
        const newPositions = JSON.parse(message.body);
        setPositions(newPositions);
      });
    };

    client.onDisconnect = () => {
      setConnected(false);
      toast({
        title: "Disconnected",
        description: "Connection lost. Attempting to reconnect...",
        variant: "destructive",
      });
    };

    client.connect();

    return () => {
      client.disconnect();
    };
  }, [toast]);

  return (
    <div className="min-h-screen p-4 bg-background">
      <Card className="max-w-[1400px] mx-auto p-6">
        <DashboardHeader connected={connected} />
        <PositionGrid positions={positions} />
      </Card>
    </div>
  );
}
