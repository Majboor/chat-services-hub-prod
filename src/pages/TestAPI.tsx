
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { SideDrawer } from "@/components/SideDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { apiService } from "@/services/apiService";
import { useToast } from "@/hooks/use-toast";

export default function TestAPI() {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const form = useForm({
    defaultValues: {
      username: "marketer1",
      password: "pass123",
      listName: `list_${Date.now()}`,
      campaignName: `campaign_${Date.now()}`,
    },
  });

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
  };

  const runTest = async (data: any) => {
    setIsRunning(true);
    setLogs([]);
    try {
      // Register user
      addLog("➡️ Creating marketing user...");
      await apiService.registerUser(data.username, data.password, "marketer");
      addLog("✅ User created successfully");

      // Create number list
      addLog("➡️ Creating number list...");
      await apiService.createNumberList(data.listName, data.username);
      addLog("✅ Number list created successfully");

      // Add numbers to list
      addLog("➡️ Adding numbers to list...");
      for (let i = 1; i <= 5; i++) {
        await apiService.addNumberToList({
          list_name: data.listName,
          username: data.username,
          number: `+1234567890${i}`,
          name: `Test User ${i}`,
          interests: "Technology",
          age: "25-35",
          location: `City ${i}`,
          gender: "Other",
          language: "English",
          occupation: "Professional",
          preferred_contact_time: "Evening",
          tags: "test",
        });
        addLog(`✅ Added number ${i} to list`);
      }

      // Create campaign
      addLog("➡️ Creating campaign...");
      const formData = new FormData();
      formData.append("name", data.campaignName);
      formData.append("username", data.username);
      formData.append("number_list", data.listName);
      formData.append("content", "Test campaign message");
      
      const campaignResponse = await apiService.createCampaign(formData);
      addLog("✅ Campaign created successfully");

      // Execute campaign
      addLog("➡️ Starting campaign execution...");
      await apiService.executeCampaign(data.campaignName, 10, 0);
      addLog("✅ Campaign execution started");

      // List pending campaigns
      addLog("➡️ Checking pending campaigns...");
      const pendingCampaigns = await apiService.listPendingCampaigns();
      addLog(`✅ Found ${pendingCampaigns.length} pending campaigns`);

      toast({
        title: "Test Completed",
        description: "API test flow completed successfully",
      });
    } catch (error) {
      console.error("Test error:", error);
      toast({
        title: "Error",
        description: "An error occurred during the test",
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
        <h1 className="text-3xl font-bold mb-6">API Testing Interface</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(runTest)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isRunning}>
                    {isRunning ? "Running Test..." : "Run Test"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-y-auto bg-secondary p-4 rounded-md">
                {logs.map((log, index) => (
                  <div key={index} className="text-sm mb-2">
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
