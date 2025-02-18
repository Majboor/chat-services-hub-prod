
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { SideDrawer } from "@/components/SideDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/apiService";

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [campaignData, setCampaignData] = useState({
    name: "",
    content: "",
    goals: "",
    expectedResponse: "",
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignData.name || !campaignData.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append("name", campaignData.name);
      formData.append("content", campaignData.content);
      formData.append("number_list", state?.listName || "");
      formData.append("owner", "marketer1"); // TODO: Replace with actual username
      if (mediaFile) {
        formData.append("media", mediaFile);
      }
      formData.append("additional_details", JSON.stringify({
        goals: campaignData.goals,
        expectedResponse: campaignData.expectedResponse,
      }));

      const result = await apiService.createCampaign(formData);
      
      toast({
        title: "Success",
        description: "Campaign created successfully",
      });

      // Navigate to review page
      navigate("/review-numbers");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <SideDrawer />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Create Campaign</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  value={campaignData.name}
                  onChange={(e) => setCampaignData({
                    ...campaignData,
                    name: e.target.value
                  })}
                  placeholder="Enter campaign name"
                />
              </div>

              <div>
                <Label htmlFor="content">Message Content</Label>
                <Textarea
                  id="content"
                  value={campaignData.content}
                  onChange={(e) => setCampaignData({
                    ...campaignData,
                    content: e.target.value
                  })}
                  placeholder="Enter message content"
                  className="h-32"
                />
              </div>

              <div>
                <Label htmlFor="media">Media (Optional)</Label>
                <Input
                  id="media"
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                />
              </div>

              <div>
                <Label htmlFor="goals">Campaign Goals</Label>
                <Textarea
                  id="goals"
                  value={campaignData.goals}
                  onChange={(e) => setCampaignData({
                    ...campaignData,
                    goals: e.target.value
                  })}
                  placeholder="Enter campaign goals"
                />
              </div>

              <div>
                <Label htmlFor="expectedResponse">Expected Response</Label>
                <Textarea
                  id="expectedResponse"
                  value={campaignData.expectedResponse}
                  onChange={(e) => setCampaignData({
                    ...campaignData,
                    expectedResponse: e.target.value
                  })}
                  placeholder="Enter expected response"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating Campaign..." : "Create Campaign"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
