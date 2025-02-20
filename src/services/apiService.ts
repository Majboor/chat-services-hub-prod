const BASE_URL = "https://whatsappmarket.applytocollege.pk";

export interface NumberDetails {
  list_name: string;
  owner: string;
  number: number;
  name: string;
  interests: string;
  age: string;
  location: string;
  gender: string;
  language: string;
  occupation: string;
  preferred_contact_time: string;
  tags: string;
  additional_details: string;
}

export interface CampaignDetails {
  campaign_id: string;
  created_at: string;
  created_by: string;
  end_time: string;
  image_url: string;
  message: string;
  messages_pending: number;
  messages_sent: number;
  name: string;
  start_time: string;
  status: string;
  timezone: string;
  total_numbers: number;
}

export interface CampaignStatus {
  failed: number;
  pending: number;
  sent: number;
  total: number;
  details?: Array<{
    campaign_id: string;
    number: string;
    status: 'pending' | 'sent' | 'failed';
    notes?: string;
    sent_at?: string;
    error_message?: string;
    additional_data?: string;
    number_details?: string;
  }>;
}

export const apiService = {
  // Auth
  registerUser: async (username: string, password: string, role: string) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data;
    } catch (error: any) {
      if (error.message === "Username already exists") {
        throw new Error("This username is already taken. Please try a different one.");
      }
      throw error;
    }
  },

  // Number Lists
  createNumberList: async (list_name: string, username: string) => {
    const response = await fetch(`${BASE_URL}/numbers/create-list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ list_name, username }),
    });
    return await response.json();
  },

  addNumberToList: async (data: {
    list_name: string;
    username: string;
    number: string;
    name: string;
    interests: string;
    age: string;
    location: string;
    gender: string;
    language: string;
    occupation: string;
    preferred_contact_time: string;
    tags: string;
  }) => {
    const response = await fetch(`${BASE_URL}/numbers/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  // Campaigns
  createCampaign: async (formData: FormData) => {
    console.log("Creating campaign with name:", formData.get('name'));
    const response = await fetch(`${BASE_URL}/campaign/create`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log("Campaign creation response:", data);
    return {
      campaign_id: formData.get('name') as string,
      ...data
    };
  },

  executeCampaign: async (campaignId: string, batch_size: number, offset: number) => {
    console.log("Executing campaign:", campaignId);
    const response = await fetch(`${BASE_URL}/campaign/execute/${campaignId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batch_size, offset }),
    });
    const data = await response.json();
    console.log("Campaign execution response:", data);
    return data;
  },

  listPendingCampaigns: async () => {
    try {
      const response = await fetch(`${BASE_URL}/campaign/list-pending`);
      if (!response.ok) {
        throw new Error('Failed to fetch pending campaigns');
      }
      const data = await response.text();
      try {
        return JSON.parse(data);
      } catch {
        return { pending: 0 }; // Default value if parsing fails
      }
    } catch (error: any) {
      console.error("Error listing pending campaigns:", error);
      throw error;
    }
  },

  getNextNumber: async (campaignId: string) => {
    console.log("Getting next number for campaign:", campaignId);
    const response = await fetch(`${BASE_URL}/campaign/${campaignId}/next-number`);
    const data = await response.json();
    console.log("Next number response:", data);
    return data;
  },

  processNumber: async (data: {
    campaign_id: string;
    number: string;
    status: string;
    notes: string;
    feedback: Record<string, any>;
  }) => {
    console.log("Processing number for campaign:", data.campaign_id);
    const response = await fetch(`${BASE_URL}/campaign/process-number`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log("Process number response:", responseData);
    return responseData;
  },

  getCampaignStatus: async (campaignId: string): Promise<CampaignStatus | { message: string }> => {
    console.log("Getting status for campaign:", campaignId);
    try {
      const response = await fetch(`${BASE_URL}/campaign/status/${campaignId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch campaign status');
      }
      const text = await response.text();
      try {
        const jsonData = JSON.parse(text);
        console.log("Campaign status parsed successfully:", jsonData);
        return jsonData;
      } catch (parseError) {
        console.log("Campaign status is not JSON, returning as message:", text);
        return { message: text };
      }
    } catch (error) {
      console.error("Error getting campaign status:", error);
      throw error;
    }
  },

  listAllCampaigns: async (username: string) => {
    const response = await fetch(`${BASE_URL}/campaign/list/${username}`);
    const data = await response.json();
    return data.campaigns || [];
  },

  getCampaignNumbers: async (campaignId: string) => {
    const response = await fetch(`${BASE_URL}/campaign/numbers/${campaignId}`);
    return await response.json();
  },

  getNextNumberForReview: async (campaignId: string) => {
    console.log("Getting next review number for campaign:", campaignId);
    const response = await fetch(`${BASE_URL}/campaign/${campaignId}/review-next`);
    const data = await response.json();
    console.log("Next review number response:", data);
    return data;
  },

  updateReview: async (data: {
    campaign_id: string;
    number: string;
    approved: boolean;
    notes: string;
  }) => {
    console.log("Updating review for campaign:", data.campaign_id);
    const response = await fetch(`${BASE_URL}/campaign/update-review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log("Update review response:", responseData);
    return responseData;
  },

  getNumberLists: async (username: string) => {
    try {
      const response = await fetch(`${BASE_URL}/numbers/lists?username=${username}`);
      const data = await response.json();
      
      if (data.message === "No numbers found") {
        console.log("No lists found for user:", username);
        return { lists: [] };
      }
      
      console.log("Available number lists for user:", username, data);
      return data;
    } catch (error) {
      console.error("Error fetching number lists:", error);
      throw error;
    }
  },
};
