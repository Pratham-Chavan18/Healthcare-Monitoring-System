
import { Patient } from "@/types/health";
import { VitalSignCard } from "./VitalSignCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { vitalRanges } from "@/types/health";

interface PatientDetailProps {
  patient: Patient;
}

export function PatientDetail({ patient }: PatientDetailProps) {
  const { heartRate, bodyTemperature, oxygenSaturation } = patient.metrics;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Name</div>
              <div>{patient.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Age</div>
              <div>{patient.age} years</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Room</div>
              <div>{patient.roomNumber}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Admission Date</div>
              <div>{format(patient.admissionDate, "MMM d, yyyy")}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <VitalSignCard 
          title="Heart Rate" 
          vitalSign={heartRate} 
          lowerThreshold={vitalRanges.heartRate.normal.min}
          upperThreshold={vitalRanges.heartRate.normal.max}
        />
        <VitalSignCard 
          title="Body Temperature" 
          vitalSign={bodyTemperature}
          lowerThreshold={vitalRanges.bodyTemperature.normal.min}
          upperThreshold={vitalRanges.bodyTemperature.normal.max}
        />
        <VitalSignCard 
          title="Oxygen Saturation" 
          vitalSign={oxygenSaturation}
          lowerThreshold={vitalRanges.oxygenSaturation.normal.min}
          upperThreshold={vitalRanges.oxygenSaturation.normal.max}
        />
      </div>
    </div>
  );
}
