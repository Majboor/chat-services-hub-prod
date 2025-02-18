
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function APIDocumentation() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Endpoints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">POST /auth/register</h3>
            <p className="text-sm text-muted-foreground">Register a new user</p>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Request Body:</span> {`{ username: string, password: string, role: string }`}</p>
              <p><span className="font-medium">Success Response:</span> {`{ message: "User created successfully" }`}</p>
              <p><span className="font-medium">Error Response:</span> {`{ message: string }`}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Number List Endpoints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">POST /numbers/create-list</h3>
            <p className="text-sm text-muted-foreground">Create a new number list</p>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Request Body:</span> {`{ list_name: string, username: string }`}</p>
              <p><span className="font-medium">Success Response:</span> {`{ message: string }`}</p>
              <p><span className="font-medium">Error Response:</span> {`{ message: string }`}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">POST /numbers/add</h3>
            <p className="text-sm text-muted-foreground">Add a number to a list</p>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Request Body:</span></p>
              <pre className="bg-secondary p-2 rounded-md text-xs">
{`{
  list_name: string,
  username: string,
  number: string,
  name: string,
  interests: string,
  age: string,
  location: string,
  gender: string,
  language: string,
  occupation: string,
  preferred_contact_time: string,
  tags: string
}`}
              </pre>
              <p><span className="font-medium">Success Response:</span> {`{ message: string }`}</p>
              <p><span className="font-medium">Error Response:</span> {`{ message: string }`}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Endpoints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">POST /campaign/create</h3>
            <p className="text-sm text-muted-foreground">Create a new campaign</p>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Request Body:</span> FormData with fields:</p>
              <pre className="bg-secondary p-2 rounded-md text-xs">
{`{
  name: string,
  username: string,
  number_list: string,
  content: string,
  media?: File
}`}
              </pre>
              <p><span className="font-medium">Success Response:</span> {`{ campaign_id: string, ...data }`}</p>
              <p><span className="font-medium">Error Response:</span> {`{ message: string }`}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">POST /campaign/execute/{"{campaignId}"}</h3>
            <p className="text-sm text-muted-foreground">Execute a campaign</p>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Request Body:</span> {`{ batch_size: number, offset: number }`}</p>
              <p><span className="font-medium">Success Response:</span> Execution status object</p>
              <p><span className="font-medium">Error Response:</span> {`{ message: string }`}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">GET /campaign/status/{"{campaignId}"}</h3>
            <p className="text-sm text-muted-foreground">Get campaign status</p>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Success Response:</span></p>
              <pre className="bg-secondary p-2 rounded-md text-xs">
{`{
  failed: number,
  pending: number,
  sent: number,
  total: number,
  details?: Array<{
    campaign_id: string,
    number: string,
    status: 'pending' | 'sent' | 'failed',
    notes?: string,
    sent_at?: string,
    error_message?: string,
    additional_data?: string,
    number_details?: string
  }>
}`}
              </pre>
              <p><span className="font-medium">Error Response:</span> {`{ message: string } or plain text error`}</p>
              <p><span className="font-medium">Note:</span> Response may be JSON or plain text</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">GET /campaign/list-pending</h3>
            <p className="text-sm text-muted-foreground">List pending campaigns</p>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Success Response:</span> {`{ pending: number }`}</p>
              <p><span className="font-medium">Error Response:</span> {`{ message: string }`}</p>
              <p><span className="font-medium">Note:</span> Returns {`{ pending: 0 }`} if response parsing fails</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">POST /campaign/process-number</h3>
            <p className="text-sm text-muted-foreground">Process a number in a campaign</p>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Request Body:</span></p>
              <pre className="bg-secondary p-2 rounded-md text-xs">
{`{
  campaign_id: string,
  number: string,
  status: string,
  notes: string,
  feedback: Record<string, any>
}`}
              </pre>
              <p><span className="font-medium">Success Response:</span> {`{ is_completed: boolean, message: string, remaining_count: number }`}</p>
              <p><span className="font-medium">Error Response:</span> {`{ message: string }`}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">GET /campaign/{"{campaignId}"}/review-next</h3>
            <p className="text-sm text-muted-foreground">Get next number for review</p>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Success Response:</span></p>
              <pre className="bg-secondary p-2 rounded-md text-xs">
{`{
  campaign: string,
  notes: string,
  number: string,
  number_details: NumberDetails,
  remaining: number,
  sent_at?: string,
  status: string
}`}
              </pre>
              <p><span className="font-medium">Error Response:</span> {`{ message: string }`}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">POST /campaign/update-review</h3>
            <p className="text-sm text-muted-foreground">Update review status</p>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Request Body:</span></p>
              <pre className="bg-secondary p-2 rounded-md text-xs">
{`{
  campaign_id: string,
  number: string,
  approved: boolean,
  notes: string
}`}
              </pre>
              <p><span className="font-medium">Success Response:</span> {`{ is_completed: boolean, message: string, remaining: number }`}</p>
              <p><span className="font-medium">Error Response:</span> {`{ message: string }`}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Error Handling Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">General Error Handling</h3>
            <ul className="list-disc pl-4 mt-2 space-y-2">
              <li>All endpoints may return network errors or 4xx/5xx status codes</li>
              <li>Campaign status endpoint may return non-JSON responses</li>
              <li>List pending campaigns endpoint falls back to {`{ pending: 0 }`} on parse errors</li>
              <li>Media upload errors in campaign creation should be handled</li>
              <li>Review operations may fail if campaign is completed</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Response Validation</h3>
            <ul className="list-disc pl-4 mt-2 space-y-2">
              <li>Always check response.ok before processing</li>
              <li>Handle both JSON and text responses where noted</li>
              <li>Verify expected response properties exist</li>
              <li>Use type guards for campaign status responses</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
