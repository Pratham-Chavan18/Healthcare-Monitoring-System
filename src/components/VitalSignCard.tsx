
import { VitalSign } from "@/types/health";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip 
} from "recharts";
import { formatDistanceToNow } from "date-fns";

interface VitalSignCardProps {
  title: string;
  vitalSign: VitalSign;
  lowerThreshold?: number;
  upperThreshold?: number;
}

export function VitalSignCard({ 
  title, 
  vitalSign,
  lowerThreshold,
  upperThreshold
}: VitalSignCardProps) {
  const statusColors = {
    normal: "text-health-normal",
    warning: "text-health-warning",
    alert: "text-health-alert"
  };

  const chartColors = {
    normal: "#10b981",
    warning: "#f59e0b",
    alert: "#ef4444"
  };

  // Prepare chart data - last 12 readings (reverse to show oldest to newest)
  const chartData = [...vitalSign.history]
    .slice(0, 12)
    .reverse()
    .map(reading => ({
      value: reading.value,
      time: formatDistanceToNow(reading.timestamp, { addSuffix: true }),
      status: reading.status
    }));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className={`text-2xl font-bold ${statusColors[vitalSign.status]} ${vitalSign.status === "alert" ? "animate-pulse-subtle" : ""}`}>
            {vitalSign.value} <span className="text-sm font-normal">{vitalSign.unit}</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Last update: {formatDistanceToNow(vitalSign.timestamp, { addSuffix: true })}
        </div>
      </CardHeader>
      <CardContent className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={chartColors[vitalSign.status]} 
                  stopOpacity={0.8}
                />
                <stop 
                  offset="95%" 
                  stopColor={chartColors[vitalSign.status]} 
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10 }} 
              interval="preserveEnd" 
              minTickGap={10}
              tickFormatter={(value) => value.replace(" ago", "")}
            />
            <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide={false} />
            <Tooltip 
              formatter={(value) => [`${value} ${vitalSign.unit}`, title]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="value"
              stroke={chartColors[vitalSign.status]} 
              fill="url(#colorValue)" 
              strokeWidth={2}
            />
            {lowerThreshold !== undefined && (
              <YAxis 
                yAxisId="threshold"
                orientation="right"
                domain={[lowerThreshold, upperThreshold || lowerThreshold + 1]}
                hide={true}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
