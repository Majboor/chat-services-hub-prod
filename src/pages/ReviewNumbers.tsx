import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { SideDrawer } from "@/components/SideDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/apiService";
import { CheckIcon, XIcon } from "lucide-react";
import { sanitizeCampaignName } from "@/utils/sanitize";

interface Campaign {
  name: string;
  total: number;
  pending: number;
  sent: number;
  failed: number;
}

interface NumberDetails {
  campaign: string;
  number: string;
  notes: string;
  number_details: any;
  remaining: number;
  sent_at?: string;
  status: string;
}

export default function ReviewNumbers() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [currentNumber, setCurrentNumber] = useState<NumberDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userCredits, setUserCredits] = useState(100);
  const [username, setUsername] = useState("Farhana");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await apiService.listAllCampaigns(username);
        setCampaigns(data.campaigns);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };
    fetchCampaigns();
  }, [username]);

  const loadNextNumber = async () => {
    if (!selectedCampaign) return;
    
    setIsLoading(true);
    try {
      const sanitizedCampaign = sanitizeCampaignName(selectedCampaign);
      console.log("Requesting next number for campaign:", sanitizedCampaign);
      const number = await apiService.getNextNumberForReview(sanitizedCampaign);
      setCurrentNumber(number);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (approved: boolean) => {
    if (!currentNumber || !selectedCampaign) return;

    setIsLoading(true);
    try {
      const sanitizedCampaign = sanitizeCampaignName(selectedCampaign);
      await apiService.updateReview({
        campaign_id: sanitizedCampaign,
        number: currentNumber.number,
        approved,
        notes: approved ? "Approved" : "Rejected",
      });

      if (approved) {
        setUserCredits(prev => prev + 0.5);
      }

      await loadNextNumber();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCampaignSelect = (campaignName: string) => {
    const sanitizedName = sanitizeCampaignName(campaignName);
    setSelectedCampaign(sanitizedName);
    setCurrentNumber(null);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <SideDrawer />
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Review Numbers</h1>
          <div className="text-lg font-semibold">
            Credits: {userCredits.toFixed(1)}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Select Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedCampaign}
                  onChange={(e) => handleCampaignSelect(e.target.value)}
                >
                  <option value="">Select a campaign</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.name} value={campaign.name}>
                      {campaign.name} ({campaign.pending} pending)
                    </option>
                  ))}
                </select>

                {selectedCampaign && !currentNumber && (
                  <Button 
                    onClick={loadNextNumber}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Start Reviewing
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {currentNumber && (
            <Card>
              <CardHeader>
                <CardTitle>Review Number</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-4">
                      {currentNumber.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Remaining: {currentNumber.remaining}
                    </div>
                  </div>

                  {currentNumber.number_details && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {Object.entries(currentNumber.number_details).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium">{key}: </span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4 justify-center">
                    <Button
                      variant="destructive"
                      onClick={() => handleReview(false)}
                      disabled={isLoading}
                    >
                      <XIcon className="mr-2" />
                      Reject
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => handleReview(true)}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckIcon className="mr-2" />
                      Approve (+0.5 credits)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
