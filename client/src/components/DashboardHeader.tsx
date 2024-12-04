import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CircleDot, CircleSlash } from "lucide-react";

interface DashboardHeaderProps {
  connected: boolean;
}

export function DashboardHeader({ connected }: DashboardHeaderProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Fixed Income Positions</h1>
        <Badge 
          variant={connected ? "default" : "destructive"}
          className="flex items-center gap-1"
        >
          {connected ? (
            <>
              <CircleDot className="w-4 h-4" />
              <span>Connected</span>
            </>
          ) : (
            <>
              <CircleSlash className="w-4 h-4" />
              <span>Disconnected</span>
            </>
          )}
        </Badge>
      </div>
      <Separator className="my-4" />
    </div>
  );
}
