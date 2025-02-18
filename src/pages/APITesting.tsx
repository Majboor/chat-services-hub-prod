
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
}
