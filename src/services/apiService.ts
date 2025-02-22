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
  // Campaign Creation
  createCampaign: async (data: {
    name: string;
    message: string;
    start_time: string;
    end_time: string;
    timezone: string;
    created_by: string;
    image: File | null;
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

    const response = await fetch(`${BASE_URL}/campaign/create`, {
      method: 'POST',
      body: formData,
    });
    
    const responseData = await response.json();
    
    if (responseData.status !== "success") {
      throw new Error(responseData.error || "Failed to create campaign");
    }
    
    return responseData;
  },

  // Add Numbers to Campaign
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

  // Check Campaign Status
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

  // Get Next Number from Campaign
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

  // Update Message Status
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

  // List All Campaign Numbers
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

  // List User Campaigns
  listAllCampaigns: async (username: string): Promise<{ status: string; campaigns: CampaignDetails[] }> => {
    const response = await fetch(`${BASE_URL}/campaign/list/${username}`);
    if (!response.ok) {
      throw new Error('Failed to fetch campaigns');
    }
    const data = await response.json();
    if (data.status !== "success") {
      throw new Error(data.error || "Failed to list campaigns");
    }
    return data;
  },

  // Add these new methods

  // Get Number Lists
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

  // Register User
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

  // Create Number List
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

  // Add Number to List
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

  // Get Next Number for Review
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

  // Update Review Status
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
