
import { HealthMonitorProvider } from "@/contexts/HealthMonitorContext";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  return (
    <HealthMonitorProvider>
      <div className="min-h-screen bg-gray-50">
        <Dashboard />
      </div>
    </HealthMonitorProvider>
  );
};

export default Index;
