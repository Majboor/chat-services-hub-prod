
import Navbar from "@/components/Navbar";
import { SideDrawer } from "@/components/SideDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const BASE_URL = "https://whatsappmarket.applytocollege.pk";

interface ApiResponse {
  status: number;
  data: any;
}

// Demo data for quick testing
const demoData = {
  register: {
    username: "demo_user",
    password: "demo123",
    role: "marketer"
  },
  login: {
    username: "demo_user",
    password: "demo123"
  },
  credits: {
    add: {
      username: "demo_user",
      amount: 100.50
    },
    remove: {
      username: "demo_user",
      amount: 25.75
    }
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
    age: "25-34",
    location: "New York",
    gender: "Male",
    language: "English",
    occupation: "Marketing Manager",
    preferred_contact_time: "Morning",
    tags: "VIP",
    additional_details: {
      social_media: {
        facebook: "johndoe",
        twitter: "@johndoe"
      },
      custom_fields: {
        company: "Tech Corp"
      }
    }
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
  const [customPayload, setCustomPayload] = useState(
    demoPayload ? JSON.stringify(demoPayload, null, 2) : ""
  );
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null);

  const handleTest = async (useDemoData: boolean) => {
    try {
      setLoading(true);
      let payload;
      
      if (isMultipart) {
        const formData = new FormData();
        const data = useDemoData ? demoPayload : JSON.parse(customPayload);
        
        // Add all fields to FormData
        Object.entries(data).forEach(([key, value]) => {
          if (key !== 'media') {
            formData.append(key, value as string);
          }
        });

        // Add media files if present
        if (mediaFiles) {
          Array.from(mediaFiles).forEach(file => {
            formData.append('media', file);
          });
        }
        payload = formData;
      } else if (method !== "GET") {
        payload = useDemoData ? demoPayload : JSON.parse(customPayload);
      }

      const result = await onTest(payload);
      setResponse(result);
      toast.success("API call completed");
    } catch (error) {
      toast.error("Error in API call: " + (error as Error).message);
      setResponse({
        status: 500,
        data: { error: (error as Error).message }
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

export default function APITesting() {
  const campaignDemoData = {
    name: "Demo Campaign",
    username: "demo_user",
    number_list: "demo_list",
    content: "Hello! This is a demo campaign message."
  };

  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      <SideDrawer />
      
      <div className="container mx-auto pt-24 px-4">
        <h1 className="text-3xl font-bold mb-8">API Testing Dashboard</h1>
        
        <Tabs defaultValue="auth">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
            <TabsTrigger value="contacts">Contact Management</TabsTrigger>
            <TabsTrigger value="campaigns">Campaign Management</TabsTrigger>
            <TabsTrigger value="execution">Campaign Execution</TabsTrigger>
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
              demoPayload={demoData.credits.add}
              onTest={(payload) => makeRequest("/credits/add", "POST", payload)}
            />
            <EndpointCard
              title="Remove Credits"
              endpoint="/credits/remove"
              method="POST"
              demoPayload={demoData.credits.remove}
              onTest={(payload) => makeRequest("/credits/remove", "POST", payload)}
            />
            <EndpointCard
              title="Check Credits"
              endpoint="/credits/check/{username}"
              method="GET"
              onTest={(payload) => makeRequest(`/credits/check/${payload?.username || 'demo_user'}`, "GET")}
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
              demoPayload={{ list_name: "demo_list", username: "demo_user" }}
              onTest={(payload) => makeRequest(`/numbers/list?list_name=${payload.list_name}&username=${payload.username}`, "GET")}
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
              demoPayload={{ name: "Demo Campaign" }}
              onTest={(payload) => makeRequest(`/campaign/${payload.name}`, "GET")}
            />
          </TabsContent>

          <TabsContent value="execution" className="mt-6">
            <EndpointCard
              title="Start Campaign Execution"
              endpoint="/campaign/execute/{campaign_name}"
              method="POST"
              demoPayload={{ 
                campaign_name: "Demo Campaign",
                batch_size: 10,
                offset: 0
              }}
              onTest={(payload) => {
                const { campaign_name, ...body } = payload;
                return makeRequest(`/campaign/execute/${campaign_name}`, "POST", body);
              }}
            />
            <EndpointCard
              title="Update Number Status"
              endpoint="/campaign/number-status"
              method="POST"
              demoPayload={{
                campaign_id: "demo_1",
                number: "+1234567890",
                status: "sent",
                notes: "Delivered successfully",
                error_message: "",
                additional_data: {
                  delivery_time: new Date().toISOString(),
                  custom_field: "value"
                }
              }}
              onTest={(payload) => makeRequest("/campaign/number-status", "POST", payload)}
            />
            <EndpointCard
              title="Get Campaign Status"
              endpoint="/campaign/status/{campaign_name}"
              method="GET"
              demoPayload={{ campaign_name: "Demo Campaign" }}
              onTest={(payload) => makeRequest(`/campaign/status/${payload.campaign_name}`, "GET")}
            />
            <EndpointCard
              title="Check Number Status"
              endpoint="/campaign/number-status"
              method="GET"
              demoPayload={{ 
                campaign_id: "demo_1",
                number: "+1234567890"
              }}
              onTest={(payload) => makeRequest(`/campaign/number-status?campaign_id=${payload.campaign_id}&number=${payload.number}`, "GET")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
