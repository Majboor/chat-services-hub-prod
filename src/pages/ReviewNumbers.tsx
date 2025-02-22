import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { SideDrawer } from "@/components/SideDrawer";
import { apiService } from "@/services/apiService";

interface Campaign {
  campaign_id: string;
  name: string;
  total: number;
  pending: number;
  sent: number;
  failed: number;
}

export default function ReviewNumbers() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [nextNumber, setNextNumber] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const username = "Farhana";

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await apiService.listAllCampaigns(username);
        // Transform CampaignDetails[] to Campaign[]
        const transformedCampaigns: Campaign[] = data.campaigns.map(camp => ({
          campaign_id: camp.campaign_id,
          name: camp.name,
          total: camp.total_numbers,
          pending: camp.messages_pending,
          sent: camp.messages_sent,
          failed: camp.messages_failed
        }));
        setCampaigns(transformedCampaigns);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch campaigns",
          variant: "destructive",
        });
      }
    };
    fetchCampaigns();
  }, [toast, username]);

  const fetchNextNumber = async () => {
    if (!selectedCampaign) return;
    setIsLoading(true);
    try {
      const data = await apiService.getNextNumberForReview(selectedCampaign);
      setNextNumber(data.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch next number",
        variant: "destructive",
      });
      setNextNumber(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNextNumber();
  }, [selectedCampaign, toast]);

  const handleApprove = async () => {
    if (!nextNumber) return;
    setIsLoading(true);
    try {
      await apiService.updateReview({
        campaign_id: selectedCampaign,
        number: nextNumber.phone,
        approved: true,
        notes: notes,
      });
      toast({
        title: "Success",
        description: "Number approved",
      });
      setNotes("");
      fetchNextNumber();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve number",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!nextNumber) return;
    setIsLoading(true);
    try {
      await apiService.updateReview({
        campaign_id: selectedCampaign,
        number: nextNumber.phone,
        approved: false,
        notes: notes,
      });
      toast({
        title: "Success",
        description: "Number rejected",
      });
      setNotes("");
      fetchNextNumber();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject number",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SideDrawer />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Review Numbers</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {campaigns.map((campaign) => (
                  <Button
                    key={campaign.campaign_id}
                    variant={selectedCampaign === campaign.campaign_id ? "secondary" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCampaign(campaign.campaign_id)}
                  >
                    {campaign.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Number for Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <p>Loading...</p>
              ) : nextNumber ? (
                <>
                  <div>
                    <Label>Phone</Label>
                    <p className="font-bold">{nextNumber.phone}</p>
                  </div>
                  <div>
                    <Label>Message</Label>
                    <p>{nextNumber.message}</p>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add notes here"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button onClick={handleReject} variant="destructive" disabled={isLoading}>
                      Reject
                    </Button>
                    <Button onClick={handleApprove} disabled={isLoading}>
                      Approve
                    </Button>
                  </div>
                </>
              ) : (
                <p>No numbers to review for this campaign.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
