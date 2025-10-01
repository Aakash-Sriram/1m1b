const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// API service for communicating with the backend
export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Profile API
  async getProfile(clerkUserId: string) {
    const response = await fetch(`${this.baseUrl}/api/profiles/${clerkUserId}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  }

  async updateProfile(clerkUserId: string, data: { display_name: string; preferences: any }) {
    const response = await fetch(`${this.baseUrl}/api/profiles/${clerkUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  }

  // Chat API
  async getChatHistory(clerkUserId: string, limit = 50) {
    const response = await fetch(`${this.baseUrl}/api/chat/${clerkUserId}?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch chat history');
    return response.json();
  }

  async saveChatMessage(clerkUserId: string, message: string, response: string) {
    const res = await fetch(`${this.baseUrl}/api/chat/${clerkUserId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, response }),
    });
    if (!res.ok) throw new Error('Failed to save chat message');
    return res.json();
  }

  // Suggestions API
  async getSuggestions(clerkUserId: string) {
    const response = await fetch(`${this.baseUrl}/api/suggestions/${clerkUserId}`);
    if (!response.ok) throw new Error('Failed to fetch suggestions');
    return response.json();
  }

  async createSuggestion(clerkUserId: string, suggestion: string, status = 'pending') {
    const response = await fetch(`${this.baseUrl}/api/suggestions/${clerkUserId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suggestion, status }),
    });
    if (!response.ok) throw new Error('Failed to create suggestion');
    return response.json();
  }

  // AI Results API
  async getAIResults(clerkUserId: string) {
    const response = await fetch(`${this.baseUrl}/api/ai-results/${clerkUserId}`);
    if (!response.ok) throw new Error('Failed to fetch AI results');
    return response.json();
  }

  async saveAIResult(clerkUserId: string, inputData: any, resultData: any) {
    const response = await fetch(`${this.baseUrl}/api/ai-results/${clerkUserId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input_data: inputData, result_data: resultData }),
    });
    if (!response.ok) throw new Error('Failed to save AI result');
    return response.json();
  }
}

// Export a singleton instance
export const apiService = new ApiService();
