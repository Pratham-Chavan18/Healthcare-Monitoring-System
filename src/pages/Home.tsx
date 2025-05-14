
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Activity, Heart, BarChart2, Bell } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">Welcome to MediPulse</h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            A simple healthcare monitoring system for tracking patient vital signs in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-t-4 border-health-blue shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <Activity className="h-8 w-8 text-health-blue mb-2" />
              <CardTitle>Real-time Monitoring</CardTitle>
              <CardDescription>View patient vital signs as they update</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-t-4 border-health-teal shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="h-8 w-8 text-health-teal mb-2" />
              <CardTitle>Critical Alerts</CardTitle>
              <CardDescription>Receive notifications when readings are abnormal</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-t-4 border-health-indigo shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart2 className="h-8 w-8 text-health-indigo mb-2" />
              <CardTitle>Health Trends</CardTitle>
              <CardDescription>Track changes in patient health over time</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-t-4 border-health-normal shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <Bell className="h-8 w-8 text-health-normal mb-2" />
              <CardTitle>Alert Management</CardTitle>
              <CardDescription>Acknowledge and resolve patient alerts</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Start Monitoring Patient Health</CardTitle>
            <CardDescription>Access the dashboard to view patient data and alerts</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <img 
              src="https://wallpaperaccess.com/full/4532937.jpg" 
              alt="MediPulse Dashboard Preview" 
              className="rounded-lg shadow border border-gray-200 max-w-full h-auto"
              width={600}
              height={320}
            />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild size="lg" className="px-8">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
