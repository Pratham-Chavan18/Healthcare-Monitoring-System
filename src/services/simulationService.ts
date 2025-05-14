import { Patient, VitalSign, vitalRanges, HealthAlert } from "@/types/health";

// Helper function to generate random value within a range
const getRandomValue = (min: number, max: number): number => {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10;
};

// Determine status based on value and ranges
const determineStatus = (
  value: number,
  type: "heartRate" | "bodyTemperature" | "oxygenSaturation"
): "normal" | "warning" | "alert" => {
  const ranges = vitalRanges[type];
  
  if (value >= ranges.normal.min && value <= ranges.normal.max) {
    return "normal";
  } else if (value >= ranges.warning.min && value <= ranges.warning.max) {
    return "warning";
  } else {
    return "alert";
  }
};

// Generate a simulated vital sign
const generateVitalSign = (
  type: "heartRate" | "bodyTemperature" | "oxygenSaturation",
  previousValue?: number
): VitalSign => {
  // Base ranges for normal values
  const ranges = {
    heartRate: { min: 60, max: 100 },
    bodyTemperature: { min: 36.1, max: 37.5 },
    oxygenSaturation: { min: 95, max: 100 }
  };

  // Units for each vital sign
  const units = {
    heartRate: "bpm",
    bodyTemperature: "°C",
    oxygenSaturation: "%"
  };

  // If there's a previous value, generate a slightly different value for continuity
  let value: number;
  if (previousValue !== undefined) {
    // Generate a small change from previous value
    const change = getRandomValue(-2, 2);
    value = Math.round((previousValue + change) * 10) / 10;
    
    // Occasionally generate an abnormal value for demo purposes (1 in 10 chance)
    if (Math.random() < 0.1) {
      // Outside normal range but still realistic
      const abnormalRanges = {
        heartRate: Math.random() < 0.5 ? { min: 40, max: 59 } : { min: 101, max: 130 },
        bodyTemperature: Math.random() < 0.5 ? { min: 35, max: 36 } : { min: 37.6, max: 39 },
        oxygenSaturation: { min: 85, max: 94 } // Only go below normal for O2
      };
      
      // Generate a value in the abnormal range
      value = getRandomValue(abnormalRanges[type].min, abnormalRanges[type].max);
    }
  } else {
    // Generate initial value within normal range most of the time
    const useNormalRange = Math.random() < 0.8;
    
    if (useNormalRange) {
      value = getRandomValue(ranges[type].min, ranges[type].max);
    } else {
      // Occasionally generate an abnormal value
      const abnormalRanges = {
        heartRate: Math.random() < 0.5 ? { min: 40, max: 59 } : { min: 101, max: 130 },
        bodyTemperature: Math.random() < 0.5 ? { min: 35, max: 36 } : { min: 37.6, max: 39 },
        oxygenSaturation: { min: 85, max: 94 }
      };
      
      value = getRandomValue(abnormalRanges[type].min, abnormalRanges[type].max);
    }
  }

  const status = determineStatus(value, type);
  const timestamp = new Date();

  return {
    value,
    unit: units[type],
    timestamp,
    status,
    history: [] // History will be built over time
  };
};

// Generate a new patient with the given parameters
export const generateNewPatient = (
  name: string,
  age: number,
  roomNumber: string
): Patient => {
  // Generate vital signs
  const heartRate = generateVitalSign("heartRate");
  const bodyTemperature = generateVitalSign("bodyTemperature");
  const oxygenSaturation = generateVitalSign("oxygenSaturation");

  // Create a history of readings for each vital
  const now = new Date();
  const history = Array.from({ length: 24 }).map((_, i) => {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000)); // hourly readings
    
    return {
      heartRate: {
        ...generateVitalSign("heartRate"),
        timestamp
      },
      bodyTemperature: {
        ...generateVitalSign("bodyTemperature"),
        timestamp
      },
      oxygenSaturation: {
        ...generateVitalSign("oxygenSaturation"),
        timestamp
      }
    };
  });

  // Add history to each vital
  heartRate.history = history.map(h => ({
    value: h.heartRate.value,
    timestamp: h.heartRate.timestamp,
    status: h.heartRate.status
  }));
  
  bodyTemperature.history = history.map(h => ({
    value: h.bodyTemperature.value,
    timestamp: h.bodyTemperature.timestamp,
    status: h.bodyTemperature.status
  }));
  
  oxygenSaturation.history = history.map(h => ({
    value: h.oxygenSaturation.value,
    timestamp: h.oxygenSaturation.timestamp,
    status: h.oxygenSaturation.status
  }));

  const admissionDate = new Date();

  return {
    id: `P${1000 + Math.floor(Math.random() * 9000)}`, // Generate a random 4-digit ID
    name,
    age,
    roomNumber,
    admissionDate,
    metrics: {
      heartRate,
      bodyTemperature,
      oxygenSaturation
    }
  };
};

// Mock patient data generator
export const generateMockPatients = (count: number = 5): Patient[] => {
  const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Susan"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez"];
  const rooms = ["101", "102", "103", "104", "105", "201", "202", "203", "204", "205", "301", "302"];
  
  return Array.from({ length: count }).map((_, idx) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const age = Math.floor(Math.random() * 50) + 20;
    const daysBack = Math.floor(Math.random() * 10);
    const admissionDate = new Date();
    admissionDate.setDate(admissionDate.getDate() - daysBack);
    
    // Generate vital signs
    const heartRate = generateVitalSign("heartRate");
    const bodyTemperature = generateVitalSign("bodyTemperature");
    const oxygenSaturation = generateVitalSign("oxygenSaturation");

    // Create a history of readings for each vital
    const now = new Date();
    const history = Array.from({ length: 24 }).map((_, i) => {
      const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000)); // hourly readings
      
      return {
        heartRate: {
          ...generateVitalSign("heartRate"),
          timestamp
        },
        bodyTemperature: {
          ...generateVitalSign("bodyTemperature"),
          timestamp
        },
        oxygenSaturation: {
          ...generateVitalSign("oxygenSaturation"),
          timestamp
        }
      };
    });

    // Add history to each vital
    heartRate.history = history.map(h => ({
      value: h.heartRate.value,
      timestamp: h.heartRate.timestamp,
      status: h.heartRate.status
    }));
    
    bodyTemperature.history = history.map(h => ({
      value: h.bodyTemperature.value,
      timestamp: h.bodyTemperature.timestamp,
      status: h.bodyTemperature.status
    }));
    
    oxygenSaturation.history = history.map(h => ({
      value: h.oxygenSaturation.value,
      timestamp: h.oxygenSaturation.timestamp,
      status: h.oxygenSaturation.status
    }));

    return {
      id: `P${1000 + idx}`,
      name: `${firstName} ${lastName}`,
      age,
      roomNumber: rooms[Math.floor(Math.random() * rooms.length)],
      admissionDate,
      metrics: {
        heartRate,
        bodyTemperature,
        oxygenSaturation
      }
    };
  });
};

// Update a patient's vital signs
export const updatePatientVitals = (patient: Patient): Patient => {
  const updatedPatient = { ...patient };
  
  // Update each vital sign based on previous value
  const heartRate = generateVitalSign("heartRate", patient.metrics.heartRate.value);
  const bodyTemperature = generateVitalSign("bodyTemperature", patient.metrics.bodyTemperature.value);
  const oxygenSaturation = generateVitalSign("oxygenSaturation", patient.metrics.oxygenSaturation.value);
  
  // Add new readings to history
  heartRate.history = [
    {
      value: heartRate.value,
      timestamp: heartRate.timestamp,
      status: heartRate.status
    },
    ...patient.metrics.heartRate.history
  ].slice(0, 48); // Keep last 48 readings (2 days)
  
  bodyTemperature.history = [
    {
      value: bodyTemperature.value,
      timestamp: bodyTemperature.timestamp,
      status: bodyTemperature.status
    },
    ...patient.metrics.bodyTemperature.history
  ].slice(0, 48);
  
  oxygenSaturation.history = [
    {
      value: oxygenSaturation.value,
      timestamp: oxygenSaturation.timestamp,
      status: oxygenSaturation.status
    },
    ...patient.metrics.oxygenSaturation.history
  ].slice(0, 48);
  
  updatedPatient.metrics = {
    heartRate,
    bodyTemperature,
    oxygenSaturation
  };
  
  return updatedPatient;
};

// Generate alerts based on patient data
export const generateAlertsFromPatients = (patients: Patient[]): HealthAlert[] => {
  const alerts: HealthAlert[] = [];
  
  patients.forEach(patient => {
    const { heartRate, bodyTemperature, oxygenSaturation } = patient.metrics;
    
    // Check heart rate
    if (heartRate.status === "alert") {
      alerts.push({
        id: `alert-hr-${patient.id}-${Date.now()}`,
        patientId: patient.id,
        patientName: patient.name,
        metric: "heartRate",
        value: heartRate.value,
        threshold: {
          min: vitalRanges.heartRate.warning.min,
          max: vitalRanges.heartRate.warning.max
        },
        timestamp: heartRate.timestamp,
        status: "new"
      });
    }
    
    // Check body temperature
    if (bodyTemperature.status === "alert") {
      alerts.push({
        id: `alert-temp-${patient.id}-${Date.now()}`,
        patientId: patient.id,
        patientName: patient.name,
        metric: "bodyTemperature",
        value: bodyTemperature.value,
        threshold: {
          min: vitalRanges.bodyTemperature.warning.min,
          max: vitalRanges.bodyTemperature.warning.max
        },
        timestamp: bodyTemperature.timestamp,
        status: "new"
      });
    }
    
    // Check oxygen saturation
    if (oxygenSaturation.status === "alert") {
      alerts.push({
        id: `alert-ox-${patient.id}-${Date.now()}`,
        patientId: patient.id,
        patientName: patient.name,
        metric: "oxygenSaturation",
        value: oxygenSaturation.value,
        threshold: {
          min: vitalRanges.oxygenSaturation.warning.min,
          max: vitalRanges.oxygenSaturation.warning.max
        },
        timestamp: oxygenSaturation.timestamp,
        status: "new"
      });
    }
  });
  
  return alerts;
};
