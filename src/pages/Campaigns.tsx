
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Check, Clock, X, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import { SideDrawer } from "@/components/SideDrawer";
import { apiService, CampaignStatus } from "@/services/apiService";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  campaign_id: string;
  name: string;
  status: CampaignStatus;
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const allCampaigns = await apiService.listAllCampaigns();
        const campaignsWithStatus = await Promise.all(
          allCampaigns.map(async (campaign: any) => {
            const status = await apiService.getCampaignStatus(campaign.campaign_id);
            return {
              ...campaign,
              status,
            };
          })
        );
        setCampaigns(campaignsWithStatus);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load campaigns",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
    // Refresh every 30 seconds
    const interval = setInterval(fetchCampaigns, 30000);
    return () => clearInterval(interval);
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SideDrawer />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Clock className="animate-spin h-8 w-8 text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Failed</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.campaign_id}>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {campaign.status.pending > 0 ? (
                            <>
                              <Clock className="h-4 w-4 text-yellow-500" />
                              <span>In Progress</span>
                            </>
                          ) : campaign.status.failed > 0 ? (
                            <>
                              <X className="h-4 w-4 text-red-500" />
                              <span>Has Failures</span>
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 text-green-500" />
                              <span>Completed</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-green-500" />
                          {campaign.status.sent}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          {campaign.status.pending}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <X className="h-4 w-4 text-red-500" />
                          {campaign.status.failed}
                        </div>
                      </TableCell>
                      <TableCell>{campaign.status.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
