
import { useState, useEffect } from "react";
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

interface LocationState {
  listName?: string;
  username?: string;
}

export default function CreateCampaign() {
  const navigate = useNavigate();
  const location = useLocation();
  const { listName, username } = location.state as LocationState || {};
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [numberLists, setNumberLists] = useState<string[]>([]);
  const [campaignData, setCampaignData] = useState({
    name: "",
    content: "",
    goals: "",
    expectedResponse: "",
    selectedList: listName || "",
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  useEffect(() => {
    if (!username) {
      toast({
        title: "Error",
        description: "No user credentials found. Please create a list first.",
        variant: "destructive",
      });
      navigate("/create-list");
      return;
    }

    // Fetch available number lists for the specific user
    const fetchLists = async () => {
      try {
        console.log("Fetching number lists for user:", username);
        const response = await apiService.getNumberLists();
        console.log("Fetched lists:", response);
        setNumberLists(response.lists || []);
      } catch (error) {
        console.error("Error fetching number lists:", error);
        toast({
          title: "Error",
          description: "Failed to fetch number lists",
          variant: "destructive",
        });
      }
    };
    fetchLists();
  }, [username, toast, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignData.name || !campaignData.content || !campaignData.selectedList) {
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
      formData.append("number_list", campaignData.selectedList);
      formData.append("owner", username || ""); // Use the passed username
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
                <Label htmlFor="listSelect">Select Number List</Label>
                <select
                  id="listSelect"
                  className="w-full p-2 border rounded-md bg-white"
                  value={campaignData.selectedList}
                  onChange={(e) => {
                    console.log("Selected list:", e.target.value);
                    setCampaignData({
                      ...campaignData,
                      selectedList: e.target.value
                    });
                  }}
                  required
                >
                  <option value="">Select a list</option>
                  {numberLists.map((list) => (
                    <option key={list} value={list}>
                      {list}
                    </option>
                  ))}
                </select>
              </div>

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
                  required
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
                  required
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
