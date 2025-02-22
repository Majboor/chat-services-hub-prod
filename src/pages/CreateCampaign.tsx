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

const USERNAME = "Farhana";

interface LocationState {
  listName?: string;
  username?: string;
}

export default function CreateCampaign() {
  const navigate = useNavigate();
  const location = useLocation();
  const { listName } = location.state as LocationState || {};
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [numberLists, setNumberLists] = useState<string[]>([]);
  const [campaignData, setCampaignData] = useState({
    name: "",
    message: "",
    selectedList: listName || "",
    start_time: "09:00",
    end_time: "17:00",
    timezone: "Asia/Karachi"
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        console.log("Fetching number lists for user:", USERNAME);
        const response = await apiService.getNumberLists(USERNAME);
        console.log("Fetched lists:", response);
        setNumberLists(response.lists || []);
      } catch (error) {
        console.error("Error fetching number lists:", error);
        toast({
          title: "Error",
          description: "Failed to fetch number lists. Please try creating a list first.",
          variant: "destructive",
        });
        navigate("/create-list");
      }
    };
    fetchLists();
  }, [toast, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignData.name || !campaignData.message || !campaignData.selectedList) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      console.log("Creating campaign with user:", USERNAME);
      const result = await apiService.createCampaign({
        name: campaignData.name,
        message: campaignData.message,
        start_time: campaignData.start_time,
        end_time: campaignData.end_time,
        timezone: campaignData.timezone,
        created_by: USERNAME,
        image: mediaFile
      });

      if (result.status === "success" && result.campaign_id) {
        toast({
          title: "Success",
          description: "Campaign created successfully",
        });
        navigate("/campaigns");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
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
                <Label htmlFor="message">Message Content</Label>
                <Textarea
                  id="message"
                  value={campaignData.message}
                  onChange={(e) => setCampaignData({
                    ...campaignData,
                    message: e.target.value
                  })}
                  placeholder="Enter message content"
                  className="h-32"
                  required
                />
              </div>

              <div>
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={campaignData.start_time}
                  onChange={(e) => setCampaignData({
                    ...campaignData,
                    start_time: e.target.value
                  })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={campaignData.end_time}
                  onChange={(e) => setCampaignData({
                    ...campaignData,
                    end_time: e.target.value
                  })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="media">Media (Optional)</Label>
                <Input
                  id="media"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
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
