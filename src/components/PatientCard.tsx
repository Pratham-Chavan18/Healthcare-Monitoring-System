
import { Patient } from "@/types/health";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface PatientCardProps {
  patient: Patient;
  isSelected: boolean;
  onSelect: () => void;
}

export function PatientCard({ patient, isSelected, onSelect }: PatientCardProps) {
  const { heartRate, bodyTemperature, oxygenSaturation } = patient.metrics;
  
  // Determine overall status based on individual vital signs
  const determineOverallStatus = () => {
    if (heartRate.status === "alert" || bodyTemperature.status === "alert" || oxygenSaturation.status === "alert") {
      return "alert";
    }
    if (heartRate.status === "warning" || bodyTemperature.status === "warning" || oxygenSaturation.status === "warning") {
      return "warning";
    }
    return "normal";
  };
  
  const overallStatus = determineOverallStatus();
  
  const statusColors = {
    normal: "bg-health-normal text-white",
    warning: "bg-health-warning text-white",
    alert: "bg-health-alert text-white animate-pulse-subtle"
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onSelect}
    >
      <CardHeader className={`${statusColors[overallStatus]} rounded-t-lg py-2 px-4`}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">{patient.name}</CardTitle>
          <Badge variant={overallStatus === "normal" ? "outline" : "destructive"}>Room {patient.roomNumber}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground text-xs">Heart Rate</span>
            <span className={`font-bold ${heartRate.status === "alert" ? "text-health-alert" : heartRate.status === "warning" ? "text-health-warning" : ""}`}>
              {heartRate.value} bpm
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground text-xs">Temp.</span>
            <span className={`font-bold ${bodyTemperature.status === "alert" ? "text-health-alert" : bodyTemperature.status === "warning" ? "text-health-warning" : ""}`}>
              {bodyTemperature.value}°C
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground text-xs">O₂</span>
            <span className={`font-bold ${oxygenSaturation.status === "alert" ? "text-health-alert" : oxygenSaturation.status === "warning" ? "text-health-warning" : ""}`}>
              {oxygenSaturation.value}%
            </span>
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Admitted {formatDistanceToNow(patient.admissionDate)} ago
        </div>
      </CardContent>
    </Card>
  );
}
