import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Check, Clock, X, MessageSquare, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { SideDrawer } from "@/components/SideDrawer";
import { apiService, CampaignDetails } from "@/services/apiService";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const USERNAME = "Farhana";

interface CampaignNumber {
  name: string;
  phone: string;
  status: 'sent' | 'pending' | 'failed';
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<CampaignDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingNumbers, setIsLoadingNumbers] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [campaignNumbers, setCampaignNumbers] = useState<CampaignNumber[]>([]);
  const [showNumbersDialog, setShowNumbersDialog] = useState(false);
  const [selectedCampaignName, setSelectedCampaignName] = useState<string>("");
  const { toast } = useToast();

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching campaigns for:", USERNAME);
      const response = await apiService.listAllCampaigns(USERNAME);
      console.log("Campaigns response:", response);
      
      if (response.status === "success" && Array.isArray(response.campaigns)) {
        setCampaigns(response.campaigns);
      } else {
        console.error("Invalid response format:", response);
        toast({
          title: "Error",
          description: "Invalid response format from server",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast({
        title: "Error",
        description: "Failed to load campaigns. Please try again later.",
        variant: "destructive",
      });
      setCampaigns([]); // Reset campaigns on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    const interval = setInterval(fetchCampaigns, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCampaignClick = async (campaignId: string) => {
    try {
      setSelectedCampaign(campaignId);
      setShowNumbersDialog(true);
      setIsLoadingNumbers(true);
      
      const response = await apiService.getCampaignNumbers(campaignId);
      console.log("Numbers Response:", response);
      if (response.status === "success") {
        setCampaignNumbers(response.numbers.map(number => ({
          ...number,
          phone: String(number.phone)
        })));
        setSelectedCampaignName(response.campaign_name);
      } else {
        setCampaignNumbers([]);
        toast({
          title: "Error",
          description: "Failed to load campaign numbers",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading campaign numbers:", error);
      toast({
        title: "Error",
        description: "Failed to load campaign numbers",
        variant: "destructive",
      });
      setCampaignNumbers([]);
    } finally {
      setIsLoadingNumbers(false);
    }
  };

  const isCampaignCompleted = (campaign: CampaignDetails) => {
    return (
      campaign.status === "completed" ||
      (campaign.messages_pending <= 0 &&
        campaign.messages_sent + campaign.messages_failed >= campaign.total_numbers)
    );
  };

  const activeCampaigns = campaigns.filter(c => !isCampaignCompleted(c));
  const completedCampaigns = campaigns.filter(c => isCampaignCompleted(c));

  const CampaignTable = ({ campaigns, title }: { campaigns: CampaignDetails[], title: string }) => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>People Reached</TableHead>
              <TableHead>Pending</TableHead>
              <TableHead>Messages Sent</TableHead>
              <TableHead>Messages Failed</TableHead>
              <TableHead>Total Numbers</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow 
                key={campaign.campaign_id}
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleCampaignClick(campaign.campaign_id)}
              >
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {isCampaignCompleted(campaign) ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Completed</span>
                      </>
                    ) : campaign.messages_pending > 0 ? (
                      <>
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span>In Progress</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>Scheduled</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    {campaign.messages_sent}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    {campaign.messages_pending}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    {campaign.messages_sent}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-500" />
                    {campaign.messages_failed || 0}
                  </div>
                </TableCell>
                <TableCell>{campaign.total_numbers}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SideDrawer />
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Clock className="animate-spin h-8 w-8 text-muted-foreground" />
          </div>
        ) : (
          <>
            {activeCampaigns.length > 0 && (
              <CampaignTable campaigns={activeCampaigns} title="Active Campaigns" />
            )}
            {completedCampaigns.length > 0 && (
              <CampaignTable campaigns={completedCampaigns} title="Completed Campaigns" />
            )}
            {campaigns.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No campaigns found
              </div>
            )}
          </>
        )}

        <Dialog open={showNumbersDialog} onOpenChange={setShowNumbersDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedCampaignName || 'Campaign Numbers'}</DialogTitle>
            </DialogHeader>
            {isLoadingNumbers ? (
              <div className="flex justify-center items-center h-32">
                <Clock className="animate-spin h-8 w-8 text-muted-foreground" />
              </div>
            ) : campaignNumbers && campaignNumbers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Number</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignNumbers.map((number, index) => (
                    <TableRow key={index}>
                      <TableCell>{number.name}</TableCell>
                      <TableCell>{number.phone}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {number.status === 'sent' ? (
                            <>
                              <Check className="h-4 w-4 text-green-500" />
                              <span>Sent</span>
                            </>
                          ) : number.status === 'pending' ? (
                            <>
                              <Clock className="h-4 w-4 text-yellow-500" />
                              <span>Pending</span>
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 text-red-500" />
                              <span>Failed</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No numbers found for this campaign
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
