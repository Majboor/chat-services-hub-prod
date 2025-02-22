
import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import { SideDrawer } from "@/components/SideDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/apiService";

export default function TestAPI() {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
  };

  const runTest = async () => {
    setIsRunning(true);
    setLogs([]);
    
    try {
      // Create campaign
      addLog("➡️ Creating campaign...");
      const formData = new FormData();
      formData.append("name", "Farhana Campaign");
      formData.append("message", "Hello from Magic PK! Check out our new Leather Style Mini Handbag. Small, cute, and goes with anything. Limited stock, hurry up and grab yours!");
      formData.append("start_time", "09:00");
      formData.append("end_time", "17:00");
      formData.append("timezone", "Asia/Karachi");
      formData.append("created_by", "Farhana");
      
      if (fileInputRef.current?.files?.[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }
      
      const response = await fetch("https://whatsappmarket.applytocollege.pk/campaign/create", {
        method: 'POST',
        body: formData,
      });

      const campaignData = await response.json();
      
      if (campaignData.status === "success") {
        addLog("✅ Campaign created successfully");
        addLog(`Campaign ID: ${campaignData.campaign_id}`);

        // Add numbers to campaign
        addLog("➡️ Adding numbers to campaign...");
        const numbersResponse = await fetch(`https://whatsappmarket.applytocollege.pk/campaign/add_numbers/${campaignData.campaign_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            numbers: [
              { name: "Customer 1", phone: "923001234567" },
              { name: "Customer 2", phone: "923001234568" }
            ]
          }),
        });

        const numbersData = await numbersResponse.json();
        
        if (numbersData.status === "success") {
          addLog(`✅ Added ${numbersData.total_numbers} numbers to campaign`);
        } else {
          throw new Error("Failed to add numbers to campaign");
        }
      } else {
        throw new Error("Campaign creation failed");
      }

      toast({
        title: "Success",
        description: "Campaign created and numbers added successfully",
      });
    } catch (error: any) {
      console.error("Test error:", error);
      const errorMessage = error.message || "An error occurred during the test";
      addLog(`❌ Error: ${errorMessage}`);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <SideDrawer />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">API Testing</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Creation Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Campaign Image (Optional)
                </label>
                <Input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                />
              </div>
              
              <Button 
                onClick={runTest}
                disabled={isRunning}
              >
                {isRunning ? "Running Test..." : "Run Test"}
              </Button>

              <div className="mt-4 bg-muted p-4 rounded-md">
                <h3 className="font-semibold mb-2">Test Logs:</h3>
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="text-sm">{log}</div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
