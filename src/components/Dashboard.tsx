
import { useState } from "react";
import { useHealthMonitor } from "@/contexts/HealthMonitorContext";
import { PatientCard } from "./PatientCard";
import { PatientDetail } from "./PatientDetail";
import { AlertsList } from "./AlertsList";
import { DashboardSummary } from "./DashboardSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell, Activity, User, Users, Plus, UserMinus } from "lucide-react";
import { PatientForm } from "./PatientForm";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  const { 
    patients, 
    alerts, 
    loading, 
    selectedPatient,
    selectPatient,
    acknowledgeAlert,
    resolveAlert,
    deletePatient
  } = useHealthMonitor();

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading patient data...</p>
        </div>
      </div>
    );
  }

  // Count active alerts
  const activeAlertsCount = alerts.filter(alert => alert.status !== "resolved").length;

  const handleDeletePatient = () => {
    if (patientToDelete) {
      deletePatient(patientToDelete);
      setPatientToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Healthcare Monitoring System</h1>
      
      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="patients" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span>Patients</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            <span>Alerts</span>
            {activeAlertsCount > 0 && (
              <span className="ml-1 bg-health-alert text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeAlertsCount > 9 ? '9+' : activeAlertsCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DashboardSummary patients={patients} alerts={alerts} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <AlertsList 
                  alerts={alerts.slice(0, 5)} 
                  onAcknowledge={acknowledgeAlert} 
                  onResolve={resolveAlert} 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Patient Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {patients.slice(0, 4).map(patient => (
                    <PatientCard
                      key={patient.id}
                      patient={patient}
                      isSelected={selectedPatient?.id === patient.id}
                      onSelect={() => {
                        selectPatient(patient.id);
                        setActiveTab("patients");
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Patient Management</h2>
            <PatientForm />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="md:col-span-1 space-y-4">
              {patients.map(patient => (
                <div key={patient.id} className="flex items-center gap-2">
                  <PatientCard
                    patient={patient}
                    isSelected={selectedPatient?.id === patient.id}
                    onSelect={() => selectPatient(patient.id)}
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => setPatientToDelete(patient.id)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Patient</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this patient? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPatientToDelete(null)}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletePatient} className="bg-red-500 hover:bg-red-600">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
            
            <div className="md:col-span-2">
              {selectedPatient ? (
                <PatientDetail patient={selectedPatient} />
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <User className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-lg font-medium">Select a patient to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>All Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertsList 
                alerts={alerts} 
                onAcknowledge={acknowledgeAlert} 
                onResolve={resolveAlert} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
