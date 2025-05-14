
import { Patient, HealthAlert } from "@/types/health";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardSummaryProps {
  patients: Patient[];
  alerts: HealthAlert[];
}

export function DashboardSummary({ patients, alerts }: DashboardSummaryProps) {
  // Count patients by status
  const patientStatusCount = {
    normal: 0,
    warning: 0,
    alert: 0
  };
  
  patients.forEach(patient => {
    const { heartRate, bodyTemperature, oxygenSaturation } = patient.metrics;
    
    if (heartRate.status === "alert" || bodyTemperature.status === "alert" || oxygenSaturation.status === "alert") {
      patientStatusCount.alert++;
    } else if (heartRate.status === "warning" || bodyTemperature.status === "warning" || oxygenSaturation.status === "warning") {
      patientStatusCount.warning++;
    } else {
      patientStatusCount.normal++;
    }
  });
  
  // Count active alerts
  const activeAlerts = alerts.filter(alert => alert.status !== "resolved").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{patients.length}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Patient Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Stable</span>
              <span className="font-medium text-health-normal">{patientStatusCount.normal}</span>
            </div>
            <div className="flex justify-between">
              <span>Warning</span>
              <span className="font-medium text-health-warning">{patientStatusCount.warning}</span>
            </div>
            <div className="flex justify-between">
              <span>Alert</span>
              <span className="font-medium text-health-alert">{patientStatusCount.alert}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{activeAlerts}</p>
        </CardContent>
      </Card>
    </div>
  );
}
