
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Patient, HealthAlert } from '@/types/health';
import { generateMockPatients, updatePatientVitals, generateAlertsFromPatients, generateNewPatient } from '@/services/simulationService';
import { useToast } from "@/components/ui/use-toast";

interface HealthMonitorContextType {
  patients: Patient[];
  alerts: HealthAlert[];
  loading: boolean;
  selectedPatient: Patient | null;
  selectPatient: (id: string) => void;
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  addPatient: (name: string, age: number, roomNumber: string) => void;
  deletePatient: (id: string) => void;
}

const HealthMonitorContext = createContext<HealthMonitorContextType | undefined>(undefined);

export function HealthMonitorProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { toast } = useToast();

  // Initialize with mock data
  useEffect(() => {
    const mockPatients = generateMockPatients(8);
    setPatients(mockPatients);
    
    const initialAlerts = generateAlertsFromPatients(mockPatients);
    setAlerts(initialAlerts);
    
    setLoading(false);
  }, []);

  // Update patient vitals every 30 seconds
  useEffect(() => {
    if (loading) return;

    const intervalId = setInterval(() => {
      setPatients(prevPatients => {
        const updatedPatients = prevPatients.map(patient => updatePatientVitals(patient));
        
        // Generate new alerts based on updated values
        const newAlerts = generateAlertsFromPatients(updatedPatients);
        
        if (newAlerts.length > 0) {
          // Update alerts state
          setAlerts(prevAlerts => [...newAlerts, ...prevAlerts]);
          
          // Show toast notification for each new alert
          newAlerts.forEach(alert => {
            toast({
              title: `Alert: ${alert.patientName}`,
              description: `${getMetricName(alert.metric)}: ${alert.value} ${getMetricUnit(alert.metric)}`,
              variant: "destructive"
            });
          });
        }
        
        // Update selected patient if needed
        if (selectedPatient) {
          const updatedSelectedPatient = updatedPatients.find(p => p.id === selectedPatient.id) || null;
          setSelectedPatient(updatedSelectedPatient);
        }
        
        return updatedPatients;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(intervalId);
  }, [loading, selectedPatient, toast]);

  const selectPatient = (id: string) => {
    const patient = patients.find(p => p.id === id) || null;
    setSelectedPatient(patient);
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === id ? { ...alert, status: 'acknowledged' } : alert
      )
    );
  };

  const resolveAlert = (id: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === id ? { ...alert, status: 'resolved' } : alert
      )
    );
  };

  const addPatient = (name: string, age: number, roomNumber: string) => {
    const newPatient = generateNewPatient(name, age, roomNumber);
    
    setPatients(prevPatients => [...prevPatients, newPatient]);
    
    toast({
      title: "Patient Added",
      description: `${name} has been added to the system`
    });
  };

  const deletePatient = (id: string) => {
    // Check if the patient to be deleted is currently selected
    if (selectedPatient && selectedPatient.id === id) {
      setSelectedPatient(null);
    }
    
    // Get patient name for the toast message
    const patientName = patients.find(p => p.id === id)?.name || "Patient";
    
    // Remove patient from state
    setPatients(prevPatients => prevPatients.filter(p => p.id !== id));
    
    // Remove related alerts
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.patientId !== id));
    
    toast({
      title: "Patient Removed",
      description: `${patientName} has been removed from the system`
    });
  };

  // Helper functions for displaying metric names and units
  const getMetricName = (metric: keyof Patient['metrics']) => {
    const names = {
      heartRate: 'Heart Rate',
      bodyTemperature: 'Temperature',
      oxygenSaturation: 'O₂ Saturation'
    };
    return names[metric];
  };

  const getMetricUnit = (metric: keyof Patient['metrics']) => {
    const units = {
      heartRate: 'bpm',
      bodyTemperature: '°C',
      oxygenSaturation: '%'
    };
    return units[metric];
  };

  return (
    <HealthMonitorContext.Provider
      value={{
        patients,
        alerts,
        loading,
        selectedPatient,
        selectPatient,
        acknowledgeAlert,
        resolveAlert,
        addPatient,
        deletePatient
      }}
    >
      {children}
    </HealthMonitorContext.Provider>
  );
}

export function useHealthMonitor() {
  const context = useContext(HealthMonitorContext);
  if (context === undefined) {
    throw new Error('useHealthMonitor must be used within a HealthMonitorProvider');
  }
  return context;
}
