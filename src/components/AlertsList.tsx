
import { HealthAlert } from "@/types/health";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check } from "lucide-react";

interface AlertsListProps {
  alerts: HealthAlert[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}

export function AlertsList({ alerts, onAcknowledge, onResolve }: AlertsListProps) {
  // Filter out resolved alerts and sort by timestamp (newest first)
  const activeAlerts = alerts
    .filter(alert => alert.status !== "resolved")
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  // Helper function to format metric names
  const formatMetricName = (metric: string) => {
    const metricNames: Record<string, string> = {
      "heartRate": "Heart Rate",
      "bodyTemperature": "Temperature",
      "oxygenSaturation": "O₂ Saturation"
    };
    return metricNames[metric] || metric;
  };

  if (activeAlerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
        <Bell size={24} />
        <p className="mt-2">No active alerts</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2 pr-4">
        {activeAlerts.map(alert => (
          <div 
            key={alert.id} 
            className="border rounded-lg p-3 bg-muted/30"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">
                  {alert.patientName}
                </div>
                <div className="text-sm">
                  {formatMetricName(alert.metric as string)}: {alert.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => alert.status === "new" ? onAcknowledge(alert.id) : onResolve(alert.id)}
              >
                {alert.status === "new" ? "Acknowledge" : "Resolve"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
