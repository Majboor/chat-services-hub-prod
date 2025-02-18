import { useState, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const timestamp = Date.now();
  const form = useForm({
    defaultValues: {
      username: "marketer1",
      password: "pass123",
      listName: `list_${timestamp}`,
      campaignName: `campaign_${timestamp}`,
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
      const registerResponse = await apiService.registerUser(data.username, data.password, "marketer");
      if (registerResponse.message === "User created successfully") {
        addLog("✅ User created successfully");
      } else {
        throw new Error(registerResponse.message || "Failed to create user");
      }

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

      // Create campaign with media file
      addLog("➡️ Creating campaign...");
      const formData = new FormData();
      formData.append("name", data.campaignName);
      formData.append("username", data.username);
      formData.append("number_list", data.listName);
      formData.append("content", "Test campaign message");
      
      if (fileInputRef.current?.files?.[0]) {
        formData.append("media", fileInputRef.current.files[0]);
      }
      
      const campaignResponse = await apiService.createCampaign(formData);
      const campaignId = campaignResponse.campaign_id;
      if (!campaignId) {
        throw new Error("Campaign creation failed - no campaign ID returned");
      }
      addLog("✅ Campaign created successfully");

      // Execute campaign
      addLog("➡️ Starting campaign execution...");
      await apiService.executeCampaign(campaignId, 10, 0);
      addLog("✅ Campaign execution started");

      // Process numbers
      addLog("➡️ Processing campaign numbers...");
      
      // Get and process first number
      const firstNumber = await apiService.getNextNumber(campaignId);
      if (firstNumber.number) {
        await apiService.processNumber({
          campaign_id: campaignId,
          number: `+12345678901`, // Fixed number to match bash script exactly
          status: "sent",
          notes: "Interested in product",
          feedback: {
            interest_level: "high",
            follow_up: true,
            preferred_time: "morning"
          }
        });
        addLog("✅ Processed first number with success status");
      }

      // Get and process second number
      const secondNumber = await apiService.getNextNumber(campaignId);
      if (secondNumber.number) {
        await apiService.processNumber({
          campaign_id: campaignId,
          number: `+12345678902`, // Fixed number to match bash script exactly
          status: "failed",
          notes: "Number not reachable",
          feedback: {
            error_type: "invalid_number",
            retry_recommended: false
          }
        });
        addLog("✅ Processed second number with failure status");
      }

      // Review Flow
      addLog("➡️ Starting review flow...");
      
      // Get first number for review
      const reviewNumber1 = await apiService.getNextNumberForReview(campaignId);
      if (reviewNumber1.number) {
        await apiService.updateReview({
          campaign_id: campaignId,
          number: `+12345678901`, // Fixed number to match bash script exactly
          approved: true,
          notes: "Good response, follow up needed"
        });
        addLog("✅ Reviewed first number (approved)");
      }

      // Get second number for review
      const reviewNumber2 = await apiService.getNextNumberForReview(campaignId);
      if (reviewNumber2.number) {
        await apiService.updateReview({
          campaign_id: campaignId,
          number: `+12345678902`, // Fixed number to match bash script exactly
          approved: false,
          notes: "Invalid number, remove from list"
        });
        addLog("✅ Reviewed second number (rejected)");
      }

      // Check final campaign status
      addLog("➡️ Checking pending campaigns...");
      try {
        const pendingCampaigns = await apiService.listPendingCampaigns();
        const pendingCount = typeof pendingCampaigns === 'string' 
          ? JSON.parse(pendingCampaigns).pending || 0 
          : pendingCampaigns.pending || 0;
        addLog(`✅ Found ${pendingCount} pending campaigns`);
      } catch (error: any) {
        addLog(`⚠️ Could not fetch pending campaigns: ${error.message}`);
      }

      // Update final status check
      try {
        const campaignStatus = await apiService.getCampaignStatus(data.campaignName);
        const statusMessage = 'message' in campaignStatus 
          ? campaignStatus.message 
          : JSON.stringify(campaignStatus);
        addLog(`✅ Final campaign status: ${statusMessage}`);
      } catch (error: any) {
        addLog(`⚠️ Could not fetch final status: ${error.message}`);
      }

      toast({
        title: "Test Completed",
        description: "API test flow completed successfully",
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
                  <FormItem>
                    <FormLabel>Campaign Media (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                      />
                    </FormControl>
                  </FormItem>
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
