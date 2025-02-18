import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { SideDrawer } from "@/components/SideDrawer";

const BASE_URL = "https://whatsappmarket.applytocollege.pk";

interface ApiResponse {
  status: number;
  data: any;
}

interface NumberStatus {
  number: string;
  name: string;
  status?: 'pending' | 'sent' | 'failed';
}

interface CampaignDetails {
  name: string;
  owner: string;
  number_list: string;
  content: string;
  media_files: string[];
  numbers?: NumberStatus[];
}

const demoData = {
  register: {
    username: "demo_user",
    password: "demo_password",
    role: "marketer"
  },
  login: {
    username: "demo_user",
    password: "demo_password"
  },
  addCredits: {
    username: "demo_user",
    amount: 100.50
  },
  removeCredits: {
    username: "demo_user",
    amount: 25.75
  },
  createList: {
    list_name: "demo_list",
    username: "demo_user"
  },
  addContact: {
    list_name: "demo_list",
    username: "demo_user",
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
    additional_details: {
      social_media: {
        facebook: "john.doe",
        twitter: "@johndoe"
      },
      custom_fields: {
        key1: "value1"
      }
    }
  }
};

const campaignDemoData = {
  name: "Demo Campaign",
  username: "demo_user",
  number_list: "demo_list",
  content: "Hello! This is a demo campaign message."
};

const executionDemoData = {
  batch_size: 10,
  offset: 0
};

const numberStatusDemoData = {
  campaign_id: "demo_campaign",
  number: "+1234567890",
  status: "sent",
  notes: "Message delivered successfully",
  error_message: "",
  additional_data: {
    delivery_time: new Date().toISOString(),
    custom_field: "value"
  }
};

const crowdsourceDemo = {
  register: {
    username: "demo_crowdsource",
    password: "demo_password",
    role: "crowdsource"
  }
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
  const [marketerAccount, setMarketerAccount] = useState<{ username: string } | null>(null);
  const [crowdsourceAccount, setCrowdsourceAccount] = useState<{ username: string, credits: number } | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignDetails[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignDetails | null>(null);
  const [numbers, setNumbers] = useState<NumberStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const makeApiCall = async (endpoint: string, method: string, payload?: any) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload ? JSON.stringify(payload) : undefined,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'API call failed');
      return data;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    }
  };

  const createMarketerAccount = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall('/auth/register', 'POST', demoData.register);
      setMarketerAccount({ username: demoData.register.username });
      setCurrentStep(2);
    } catch (error) {
      if ((error as Error).message.includes('already exists')) {
        setMarketerAccount({ username: demoData.register.username });
        setCurrentStep(2);
      }
    } finally {
      setLoading(false);
    }
  };

  const createCrowdsourceAccount = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall('/auth/register', 'POST', crowdsourceDemo.register);
      const creditsResponse = await makeApiCall(`/credits/check/${crowdsourceDemo.register.username}`, 'GET');
      setCrowdsourceAccount({ 
        username: crowdsourceDemo.register.username,
        credits: creditsResponse.credits || 0
      });
      setCurrentStep(3);
    } catch (error) {
      if ((error as Error).message.includes('already exists')) {
        const creditsResponse = await makeApiCall(`/credits/check/${crowdsourceDemo.register.username}`, 'GET');
        setCrowdsourceAccount({ 
          username: crowdsourceDemo.register.username,
          credits: creditsResponse.credits || 0
        });
        setCurrentStep(3);
      }
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
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    setLoading(true);
    try {
      await makeApiCall('/campaign/create', 'POST', campaignDemoData);
      setCurrentStep(5);
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
      const numbersResponse = await makeApiCall('/numbers/list', 'GET', {
        list_name: campaign.number_list,
        username: campaign.owner
      });
      
      const statusResponse = await makeApiCall(`/campaign/status/${campaign.name}`, 'GET');
      const processedNumbers = new Set(statusResponse.details.map((d: any) => d.number));
      
      const availableNumbers = numbersResponse.filter((n: NumberStatus) => !processedNumbers.has(n.number));
      setNumbers(availableNumbers);
      setSelectedCampaign(campaign);
    } finally {
      setLoading(false);
    }
  };

  const updateNumberStatus = async (number: string, status: 'sent' | 'failed') => {
    setLoading(true);
    try {
      await makeApiCall('/campaign/number-status', 'POST', {
        campaign_id: selectedCampaign?.name,
        number,
        status,
        notes: status === 'sent' ? 'Message delivered successfully' : 'Message delivery failed',
        error_message: status === 'failed' ? 'User rejected message' : '',
        additional_data: {
          delivery_time: new Date().toISOString()
        }
      });

      if (status === 'sent' && crowdsourceAccount) {
        await makeApiCall('/credits/add', 'POST', {
          username: crowdsourceAccount.username,
          amount: 0.5
        });
        
        const creditsResponse = await makeApiCall(`/credits/check/${crowdsourceAccount.username}`, 'GET');
        setCrowdsourceAccount({
          ...crowdsourceAccount,
          credits: creditsResponse.credits
        });
      }

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
          <CardTitle>Automated Testing Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
                {error}
              </div>
            )}
            
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
                <h3 className="text-lg font-semibold">Step 2: Create Crowdsource Account</h3>
                {crowdsourceAccount ? (
                  <div className="text-green-600">
                    ✓ Crowdsource account created: {crowdsourceAccount.username}
                    <div className="text-sm">Credits: {crowdsourceAccount.credits}</div>
                  </div>
                ) : (
                  <Button onClick={createCrowdsourceAccount} disabled={loading}>
                    Create Crowdsource Account
                  </Button>
                )}
              </div>
            )}

            {currentStep >= 3 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 3: Create Number List</h3>
                <Button onClick={createNumberList} disabled={loading || currentStep > 3}>
                  Create Number List
                </Button>
              </div>
            )}

            {currentStep >= 4 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 4: Create Campaign</h3>
                <Button onClick={createCampaign} disabled={loading || currentStep > 4}>
                  Create Campaign
                </Button>
              </div>
            )}

            {currentStep >= 5 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 5: Process Campaign</h3>
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
  const makeRequest = async (endpoint: string, method: string, payload?: any): Promise<ApiResponse> => {
    const url = `${BASE_URL}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: payload instanceof FormData 
        ? {} 
        : method !== "GET" 
          ? { 'Content-Type': 'application/json' }
          : {},
      body: payload instanceof FormData 
        ? payload 
        : payload 
          ? JSON.stringify(payload) 
          : undefined,
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return {
        status: response.status,
        data
      };
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <SideDrawer />
      <div className="container mx-auto py-6 px-4 space-y-6">
        <h1 className="text-3xl font-bold">API Testing Interface</h1>
        
        <Tabs defaultValue="auth">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
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
            <EndpointCard
              title="Login"
              endpoint="/auth/login"
              method="POST"
              demoPayload={demoData.login}
              onTest={(payload) => makeRequest("/auth/login", "POST", payload)}
            />
          </TabsContent>

          <TabsContent value="credits" className="mt-6">
            <EndpointCard
              title="Add Credits"
              endpoint="/credits/add"
              method="POST"
              demoPayload={demoData.addCredits}
              onTest={(payload) => makeRequest("/credits/add", "POST", payload)}
            />
            <EndpointCard
              title="Remove Credits"
              endpoint="/credits/remove"
              method="POST"
              demoPayload={demoData.removeCredits}
              onTest={(payload) => makeRequest("/credits/remove", "POST", payload)}
            />
            <EndpointCard
              title="Check Credits"
              endpoint="/credits/check/{username}"
              method="GET"
              onTest={() => makeRequest("/credits/check/demo_user", "GET")}
            />
          </TabsContent>

          <TabsContent value="contacts" className="mt-6">
            <EndpointCard
              title="Create Number List"
              endpoint="/numbers/create-list"
              method="POST"
              demoPayload={demoData.createList}
              onTest={(payload) => makeRequest("/numbers/create-list", "POST", payload)}
            />
            <EndpointCard
              title="List Numbers"
              endpoint="/numbers/list"
              method="GET"
              onTest={() => makeRequest("/numbers/list?list_name=demo_list&username=demo_user", "GET")}
            />
            <EndpointCard
              title="Add Contact"
              endpoint="/numbers/add"
              method="POST"
              demoPayload={demoData.addContact}
              onTest={(payload) => makeRequest("/numbers/add", "POST", payload)}
            />
            <EndpointCard
              title="Remove Numbers"
              endpoint="/numbers/remove"
              method="DELETE"
              demoPayload={{
                list_name: "demo_list",
                username: "demo_user",
                numbers: ["+1234567890"]
              }}
              onTest={(payload) => makeRequest("/numbers/remove", "DELETE", payload)}
            />
          </TabsContent>

          <TabsContent value="campaigns" className="mt-6">
            <EndpointCard
              title="Create Campaign"
              endpoint="/campaign/create"
              method="POST"
              demoPayload={campaignDemoData}
              onTest={(payload) => makeRequest("/campaign/create", "POST", payload)}
              isMultipart={true}
            />
            <EndpointCard
              title="List Campaigns"
              endpoint="/campaign/list"
              method="GET"
              onTest={() => makeRequest("/campaign/list", "GET")}
            />
            <EndpointCard
              title="Get Campaign Details"
              endpoint="/campaign/{name}"
              method="GET"
              onTest={() => makeRequest("/campaign/Demo%20Campaign", "GET")}
            />
          </TabsContent>

          <TabsContent value="execution" className="mt-6">
            <EndpointCard
              title="Start Campaign Execution"
              endpoint="/campaign/execute/{campaign_name}"
              method="POST"
              demoPayload={executionDemoData}
              onTest={(payload) => makeRequest("/campaign/execute/Demo%20Campaign", "POST", payload)}
            />
            <EndpointCard
              title="Update Number Status"
              endpoint="/campaign/number-status"
              method="POST"
              demoPayload={numberStatusDemoData}
              onTest={(payload) => makeRequest("/campaign/number-status", "POST", payload)}
            />
            <EndpointCard
              title="Get Campaign Status"
              endpoint="/campaign/status/{campaign_name}"
              method="GET"
              onTest={() => makeRequest("/campaign/status/Demo%20Campaign", "GET")}
            />
            <EndpointCard
              title="Check Number Status"
              endpoint="/campaign/number-status"
              method="GET"
              onTest={() => makeRequest("/campaign/number-status?campaign_id=demo_campaign&number=%2B1234567890", "GET")}
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
