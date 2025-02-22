
const BASE_URL = "https://whatsappmarket.applytocollege.pk";

export interface NumberDetails {
  list_name: string;
  owner: string;
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
  messages_failed: number;
  name: string;
  start_time: string;
  status: string;
  timezone: string;
  total_numbers: number;
}

export interface CampaignStatus {
  status: string;
  campaign: {
    name: string;
    total_numbers: number;
    messages_sent: number;
    messages_pending: number;
    status: string;
    time_window: string;
  };
}

export interface CampaignNumberResponse {
  status: string;
  campaign_name: string;
  total_numbers: number;
  numbers: Array<{
    name: string;
    phone: string;
    status: 'sent' | 'pending' | 'failed';
  }>;
}

export interface NextNumberResponse {
  status: string;
  data: {
    name: string;
    phone: string;
    message: string;
    image_url: string;
  };
}

export interface UpdateStatusResponse {
  status: string;
  campaign_stats: {
    messages_sent: number;
    messages_failed: number;
    campaign_status: string;
  };
}

export const apiService = {
  createCampaign: async (data: {
    name: string;
    message: string;
    start_time: string;
    end_time: string;
    timezone: string;
    created_by: string;
    image: File | null;
    list_name: string;
  }) => {
    if (!data.image) {
      throw new Error("Image file is required");
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('message', data.message);
    formData.append('start_time', data.start_time);
    formData.append('end_time', data.end_time);
    formData.append('timezone', data.timezone);
    formData.append('created_by', data.created_by);
    formData.append('image', data.image);
    formData.append('list_name', data.list_name);

    const response = await fetch(`${BASE_URL}/campaign/create`, {
      method: 'POST',
      body: formData,
    });
    
    const responseData = await response.json();
    console.log("API Response:", responseData);
    
    if (responseData.status !== "success") {
      throw new Error(responseData.error || "Failed to create campaign");
    }
    
    return responseData;
  },

  addNumbersToCampaign: async (campaignId: string, numbers: Array<{ name: string; phone: string }>) => {
    const response = await fetch(`${BASE_URL}/campaign/add_numbers/${campaignId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ numbers }),
    });
    
    const data = await response.json();
    
    if (data.status !== "success") {
      throw new Error(data.error || "Failed to add numbers to campaign");
    }
    
    return data;
  },

  getCampaignStatus: async (campaignId: string): Promise<CampaignStatus> => {
    const response = await fetch(`${BASE_URL}/campaign/status/${campaignId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch campaign status');
    }
    const data = await response.json();
    if (data.status !== "success") {
      throw new Error(data.error || "Failed to get campaign status");
    }
    return data;
  },

  getNextNumber: async (campaignId: string): Promise<NextNumberResponse> => {
    const response = await fetch(`${BASE_URL}/campaign/numbers/${campaignId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch next number');
    }
    const data = await response.json();
    if (data.status !== "success") {
      throw new Error(data.error || "Failed to get next number");
    }
    return data;
  },

  updateMessageStatus: async (campaignId: string, phone: string, status: 'sent' | 'failed'): Promise<UpdateStatusResponse> => {
    const response = await fetch(`${BASE_URL}/campaign/update_status/${campaignId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, status }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update message status');
    }
    
    const data = await response.json();
    if (data.status !== "success") {
      throw new Error(data.error || "Failed to update status");
    }
    
    return data;
  },

  getCampaignNumbers: async (campaignId: string): Promise<CampaignNumberResponse> => {
    const response = await fetch(`${BASE_URL}/campaign/all_numbers/${campaignId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch campaign numbers');
    }
    const data = await response.json();
    if (data.status !== "success") {
      throw new Error(data.error || "Failed to get campaign numbers");
    }
    return data;
  },

  listAllCampaigns: async (username: string): Promise<{ status: string; campaigns: CampaignDetails[] }> => {
    try {
      const response = await fetch(`${BASE_URL}/campaign/list/${username}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Raw API Response:", data);

      if (!data || data.status !== "success" || !Array.isArray(data.campaigns)) {
        throw new Error("Invalid response format from server");
      }

      // Process each campaign individually to handle potential data issues
      const processedCampaigns = data.campaigns.map(campaign => ({
        campaign_id: String(campaign.campaign_id || ''),
        created_at: String(campaign.created_at || ''),
        created_by: String(campaign.created_by || ''),
        end_time: String(campaign.end_time || ''),
        image_url: String(campaign.image_url || ''),
        message: String(campaign.message || ''),
        messages_pending: isNaN(Number(campaign.messages_pending)) ? 0 : Number(campaign.messages_pending),
        messages_sent: isNaN(Number(campaign.messages_sent)) ? 0 : Number(campaign.messages_sent),
        messages_failed: isNaN(Number(campaign.messages_failed)) ? 0 : Number(campaign.messages_failed),
        name: String(campaign.name || ''),
        start_time: String(campaign.start_time || ''),
        status: String(campaign.status || ''),
        timezone: String(campaign.timezone || ''),
        total_numbers: isNaN(Number(campaign.total_numbers)) ? 0 : Number(campaign.total_numbers)
      }));

      return {
        status: "success",
        campaigns: processedCampaigns
      };
    } catch (error) {
      console.error("Error in listAllCampaigns:", error);
      throw error;
    }
  },

  getNumberLists: async (username: string): Promise<{ lists: string[] }> => {
    const response = await fetch(`${BASE_URL}/lists/${username}`);
    if (!response.ok) {
      throw new Error('Failed to fetch number lists');
    }
    const data = await response.json();
    if (data.status !== "success") {
      throw new Error(data.error || "Failed to get number lists");
    }
    return data;
  },

  registerUser: async (username: string, password: string, role: string): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, role }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to register user');
    }
    const data = await response.json();
    if (data.status !== "success") {
      throw new Error(data.error || "Failed to register user");
    }
    return data;
  },

  createNumberList: async (listName: string, username: string): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/lists/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ list_name: listName, username }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create list');
    }
    const data = await response.json();
    if (data.status !== "success") {
      throw new Error(data.error || "Failed to create list");
    }
    return data;
  },

  addNumberToList: async (numberData: NumberDetails): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/lists/add_number`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(numberData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add number');
    }
    const data = await response.json();
    if (data.status !== "success") {
      throw new Error(data.error || "Failed to add number");
    }
    return data;
  },

  getNextNumberForReview: async (campaignId: string) => {
    const response = await fetch(`${BASE_URL}/campaign/review/${campaignId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch next number for review');
    }
    const data = await response.json();
    if (data.status !== "success") {
      throw new Error(data.error || "Failed to get next number");
    }
    return data;
  },

  updateReview: async (data: {
    campaign_id: string;
    number: string;
    approved: boolean;
    notes: string;
  }): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/campaign/review/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update review');
    }
    const data_response = await response.json();
    if (data_response.status !== "success") {
      throw new Error(data_response.error || "Failed to update review");
    }
    return data_response;
  },
};
