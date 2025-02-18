import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { SideDrawer } from "@/components/SideDrawer";
import { useToast } from "@/hooks/use-toast";

const BASE_URL = "https://whatsappmarket.applytocollege.pk";

interface ApiResponse {
  status: number;
  data: any;
}

interface NumberStatus {
  number: string;
  name: string;
  status?: 'pending' | 'sent' | 'failed';
  feedback?: {
    interest_level?: string;
    follow_up?: boolean;
    preferred_time?: string;
    error_type?: string;
    retry_recommended?: boolean;
  };
}

interface CampaignDetails {
  name: string;
  owner: string;
  number_list: string;
  content: string;
  media_files: string[];
  numbers?: NumberStatus[];
}

interface CrowdsourceAccount {
  username: string;
  credits: number;
}

const getTimestampSuffix = () => new Date().getTime().toString().slice(-4);

const getDemoData = () => {
  const timestamp = getTimestampSuffix();
  return {
    register: {
      username: `demo_user_${timestamp}`,
      password: "demo_password",
      role: "marketer"
    },
    login: {
      username: `demo_user_${timestamp}`,
      password: "demo_password"
    },
    createList: {
      list_name: `demo_list_${timestamp}`,
      username: `demo_user_${timestamp}`
    },
    addContact: {
      list_name: `demo_list_${timestamp}`,
      username: `demo_user_${timestamp}`,
      number: "+1234567890",
      name: "John Doe",
      interests: "Technology",
      age: "25-30",
      location: "New York",
      gender: "Male",
      language: "English",
      occupation: "Engineer",
      preferred_contact_time: "Evening",
      tags: "tech,engineering",
      additional_details: JSON.stringify({
        social_media: {
          facebook: "john.doe",
          twitter: "@johndoe"
        }
      })
    }
  };
};

const getCrowdsourceDemo = () => {
  const timestamp = getTimestampSuffix();
  return {
    register: {
      username: `demo_crowd_${timestamp}`,
      password: "demo_password",
      role: "crowdsource"
    }
  };
};

const getCampaignDemoData = (username: string, listName: string) => ({
  name: `Demo Campaign ${getTimestampSuffix()}`,
  username,
  number_list: listName,
  content: "Hello! This is a demo campaign message."
});

const executionDemoData = {
  batch_size: 10,
  offset: 0
};

const numberStatusDemoData = {
  campaign_id: "demo_campaign",
  number: "+1234567890",
  status: "sent",
  notes: "Message delivered successfully",
  feedback: {
    interest_level: "high",
    follow_up: true,
    preferred_time: "evening"
  }
};

const reviewDemoData = {
  campaign_id: "demo_campaign",
  number: "+1234567890",
  approved: true,
  notes: "Good response, follow up recommended"
};

const EndpointCard = ({ 
  title, 
  endpoint, 
  method, 
  demoPayload,
  onTest,
  isMultipart = false
}: { 
  title: string;
  endpoint: string;
  method: string;
  demoPayload?: any;
  onTest: (payload: any) => Promise<ApiResponse>;
  isMultipart?: boolean;
}) => {
  const [customPayload, setCustomPayload] = useState("");
  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async (useDemo: boolean) => {
    setLoading(true);
    try {
      let payload;
      if (method === "GET") {
        payload = undefined;
      } else if (isMultipart) {
        const formData = new FormData();
        const data = useDemo ? demoPayload : JSON.parse(customPayload);
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
        if (mediaFiles) {
          Array.from(mediaFiles).forEach((file) => {
            formData.append("media", file);
          });
        }
        payload = formData;
      } else {
        payload = useDemo ? demoPayload : JSON.parse(customPayload);
      }
      
      const result = await onTest(payload);
      setResponse(result);
    } catch (error) {
      console.error("Error in API call:", error);
      setResponse({
        status: 500,
        data: { error: "Error in API call: " + (error as Error).message }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {method} {endpoint}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {method !== "GET" && (
            <>
              <Textarea 
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                placeholder="Enter request payload (JSON)"
                className="font-mono text-sm h-[200px]"
              />
              {isMultipart && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Media Files:</label>
                  <Input
                    type="file"
                    multiple
                    onChange={(e) => setMediaFiles(e.target.files)}
                    className="cursor-pointer"
                  />
                </div>
              )}
            </>
          )}
          <div className="flex gap-2">
            <Button 
              onClick={() => handleTest(false)} 
              disabled={loading}
              variant="default"
            >
              {method === "GET" ? "Send Request" : "Test with Custom Data"}
            </Button>
            {demoPayload && method !== "GET" && (
              <Button 
                onClick={() => handleTest(true)} 
                disabled={loading}
                variant="outline"
              >
                Test with Demo Data
              </Button>
            )}
          </div>
          {response && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Response:</h4>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[200px] text-sm">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const FlowSection = () => {
  const { toast } = useToast();
  const [demoData] = useState(getDemoData());
  const [marketerAccount, setMarketerAccount] = useState<{ username: string } | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignDetails[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignDetails | null>(null);
  const [numbers, setNumbers] = useState<NumberStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const makeApiCall = async (endpoint: string, method: string, payload?: any) => {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: payload ? JSON.stringify(payload) : undefined,
      };

      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'API call failed');
      }
      return data;
    } catch (error) {
      console.error("API Error:", error);
      const errorMessage = (error as Error).message;
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const createMarketerAccount = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(demoData.register),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Registration failed');
      }

      setMarketerAccount({ username: demoData.register.username });
      setCurrentStep(2);
      setError(null);
      
      toast({
        title: "Success",
        description: "Marketer account created successfully",
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCrowdsourceAccount = async () => {
    setLoading(true);
    const crowdsourceDemo = getCrowdsourceDemo();
    try {
      await makeApiCall('/auth/register', 'POST', crowdsourceDemo.register);
      setCrowdsourceAccount({
        username: crowdsourceDemo.register.username,
        credits: 0
      });
      setCurrentStep(3);
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createNumberList = async () => {
    setLoading(true);
    try {
      await makeApiCall('/numbers/create-list', 'POST', demoData.createList);
      await makeApiCall('/numbers/add', 'POST', demoData.addContact);
      setCurrentStep(4);
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    setLoading(true);
    try {
      if (!marketerAccount) throw new Error('Marketer account not created');
      const campaignData = getCampaignDemoData(marketerAccount.username, demoData.createList.list_name);
      await makeApiCall('/campaign/create', 'POST', campaignData);
      setCurrentStep(5);
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall('/campaign/list', 'GET');
      setCampaigns(response);
    } finally {
      setLoading(false);
    }
  };

  const selectCampaign = async (campaign: CampaignDetails) => {
    setLoading(true);
    try {
      const numbersResponse = await makeApiCall(
        `/numbers/list?list_name=${encodeURIComponent(campaign.number_list)}&username=${encodeURIComponent(campaign.owner)}`, 
        'GET'
      );
      
      try {
        const statusResponse = await makeApiCall(`/campaign/status/${encodeURIComponent(campaign.name)}`, 'GET');
        const processedNumbers = new Set(statusResponse.details?.map((d: any) => d.number) || []);
        const availableNumbers = numbersResponse.filter((n: NumberStatus) => !processedNumbers.has(n.number));
        setNumbers(availableNumbers);
      } catch (statusError) {
        console.log("Campaign status not found, using all numbers");
        setNumbers(numbersResponse);
      }
      
      setSelectedCampaign(campaign);
      setError(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load campaign details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateNumberStatus = async (number: string, status: 'sent' | 'failed') => {
    setLoading(true);
    try {
      await makeApiCall('/campaign/process-number', 'POST', {
        campaign_id: selectedCampaign?.name,
        number,
        status,
        notes: status === 'sent' ? 'Message delivered successfully' : 'Message delivery failed',
        feedback: status === 'sent' ? {
          interest_level: "medium",
          follow_up: true,
          preferred_time: "evening"
        } : {
          error_type: "delivery_failed",
          retry_recommended: true
        }
      });

      setNumbers(numbers.filter(n => n.number !== number));
      
      if (numbers.length <= 1) {
        setError("Campaign completed! All numbers have been processed.");
        setSelectedCampaign(null);
        setNumbers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Testing Flow</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className={`p-4 rounded-md mb-4 ${
              error.includes('already exists') 
                ? 'bg-yellow-50 text-yellow-600' 
                : 'bg-red-50 text-red-600'
            }`}>
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Step 1: Create Marketer Account</h3>
              {marketerAccount ? (
                <div className="text-green-600">✓ Marketer account created: {marketerAccount.username}</div>
              ) : (
                <Button onClick={createMarketerAccount} disabled={loading}>
                  Create Marketer Account
                </Button>
              )}
            </div>

            {currentStep >= 2 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 2: Create Number List</h3>
                <Button onClick={() => createNumberList()} disabled={loading || currentStep > 2}>
                  Create Number List
                </Button>
              </div>
            )}

            {currentStep >= 3 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 3: Create Campaign</h3>
                <Button onClick={() => createCampaign()} disabled={loading || currentStep > 3}>
                  Create Campaign
                </Button>
              </div>
            )}

            {currentStep >= 4 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 4: Process Campaign</h3>
                <Button onClick={fetchCampaigns} disabled={loading}>
                  Fetch Campaigns
                </Button>

                {campaigns.length > 0 && !selectedCampaign && (
                  <div className="grid gap-4 mt-4">
                    {campaigns.map((campaign) => (
                      <Card key={campaign.name} className="cursor-pointer hover:bg-gray-50" onClick={() => selectCampaign(campaign)}>
                        <CardHeader>
                          <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-gray-600">
                            Owner: {campaign.owner}
                            <br />
                            List: {campaign.number_list}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {selectedCampaign && (
                  <div className="space-y-4 mt-4">
                    <h4 className="font-medium">Processing Campaign: {selectedCampaign.name}</h4>
                    {numbers.map((number) => (
                      <Card key={number.number}>
                        <CardContent className="flex items-center justify-between py-4">
                          <div>
                            <div className="font-medium">{number.name}</div>
                            <div className="text-sm text-gray-600">{number.number}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="bg-green-50 hover:bg-green-100"
                              onClick={() => updateNumberStatus(number.number, 'sent')}
                              disabled={loading}
                            >
                              ✓
                            </Button>
                            <Button
                              variant="outline"
                              className="bg-red-50 hover:bg-red-100"
                              onClick={() => updateNumberStatus(number.number, 'failed')}
                              disabled={loading}
                            >
                              ✗
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function APITesting() {
  const { toast } = useToast();
  
  const makeRequest = async (endpoint: string, method: string, payload?: any): Promise<ApiResponse> => {
    let url = `${BASE_URL}${endpoint}`;
    
    if (method === "GET" && payload) {
      const params = new URLSearchParams();
      Object.entries(payload).forEach(([key, value]) => {
        params.append(key, value as string);
      });
      url = `${url}?${params.toString()}`;
    }
    
    try {
      const options: RequestInit = {
        method,
        headers: payload instanceof FormData 
          ? {
              'Accept': 'application/json',
            }
          : method !== "GET" 
            ? {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              }
            : {
                'Accept': 'application/json',
              },
        body: method !== "GET" 
          ? (payload instanceof FormData 
            ? payload 
            : payload 
              ? JSON.stringify(payload) 
              : undefined)
          : undefined,
      };

      const response = await fetch(url, options);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
      }

      return {
        status: response.status,
        data
      };
    } catch (error) {
      console.error("API call failed:", error);
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const demoData = getDemoData();
  const demoPayloadForCampaign = getCampaignDemoData(demoData.register.username, demoData.createList.list_name);

  return (
    <div className="min-h-screen">
      <Navbar />
      <SideDrawer />
      <div className="container mx-auto py-6 px-4 space-y-6">
        <h1 className="text-3xl font-bold">API Testing Interface</h1>
        
        <Tabs defaultValue="auth">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
            <TabsTrigger value="flow">Flow</TabsTrigger>
          </TabsList>

          <TabsContent value="auth" className="mt-6">
            <EndpointCard
              title="Register User"
              endpoint="/auth/register"
              method="POST"
              demoPayload={demoData.register}
              onTest={(payload) => makeRequest("/auth/register", "POST", payload)}
            />
          </TabsContent>

          <TabsContent value="contacts" className="mt-6">
            <EndpointCard
              title="List Numbers"
              endpoint="/numbers/list"
              method="GET"
              demoPayload={{ 
                list_name: getDemoData().createList.list_name,
                username: getDemoData().register.username 
              }}
              onTest={(payload) => {
                const params = new URLSearchParams(payload);
                return makeRequest(`/numbers/list?${params.toString()}`, "GET");
              }}
            />
            <EndpointCard
              title="Create Number List"
              endpoint="/numbers/create-list"
              method="POST"
              demoPayload={demoData.createList}
              onTest={(payload) => makeRequest("/numbers/create-list", "POST", payload)}
            />
            <EndpointCard
              title="Add Contact"
              endpoint="/numbers/add"
              method="POST"
              demoPayload={demoData.addContact}
              onTest={(payload) => makeRequest("/numbers/add", "POST", payload)}
            />
          </TabsContent>

          <TabsContent value="campaigns" className="mt-6">
            <EndpointCard
              title="Create Campaign"
              endpoint="/campaign/create"
              method="POST"
              demoPayload={demoPayloadForCampaign}
              onTest={(payload) => makeRequest("/campaign/create", "POST", payload)}
              isMultipart={true}
            />
            <EndpointCard
              title="List All Campaigns"
              endpoint="/campaign/list-all"
              method="GET"
              onTest={() => makeRequest("/campaign/list-all", "GET")}
            />
            <EndpointCard
              title="List Pending Campaigns"
              endpoint="/campaign/list-pending"
              method="GET"
              onTest={() => makeRequest("/campaign/list-pending", "GET")}
            />
          </TabsContent>

          <TabsContent value="execution" className="mt-6">
            <EndpointCard
              title="Execute Campaign"
              endpoint="/campaign/execute/{campaign_name}"
              method="POST"
              demoPayload={executionDemoData}
              onTest={(payload) => makeRequest("/campaign/execute/Demo%20Campaign", "POST", payload)}
            />
            <EndpointCard
              title="Get Next Number"
              endpoint="/campaign/{campaign_name}/next-number"
              method="GET"
              onTest={() => makeRequest("/campaign/Demo%20Campaign/next-number", "GET")}
            />
            <EndpointCard
              title="Process Number"
              endpoint="/campaign/process-number"
              method="POST"
              demoPayload={numberStatusDemoData}
              onTest={(payload) => makeRequest("/campaign/process-number", "POST", payload)}
            />
          </TabsContent>

          <TabsContent value="review" className="mt-6">
            <EndpointCard
              title="Get Next Number for Review"
              endpoint="/campaign/{campaign_name}/review-next"
              method="GET"
              onTest={() => makeRequest("/campaign/Demo%20Campaign/review-next", "GET")}
            />
            <EndpointCard
              title="Update Review"
              endpoint="/campaign/update-review"
              method="POST"
              demoPayload={reviewDemoData}
              onTest={(payload) => makeRequest("/campaign/update-review", "POST", payload)}
            />
          </TabsContent>

          <TabsContent value="flow" className="mt-6">
            <FlowSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
