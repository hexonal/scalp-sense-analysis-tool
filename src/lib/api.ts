
import { AnalysisResult } from './types';

// 微信小程序开发环境和生产环境的基础URL
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8000' 
  : 'https://api.yourservice.com';

export interface ApiResponse<T> {
  success: boolean;
  result?: T;
  error?: string;
  error_code?: string;
}

const request = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      }
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const api = {
  analyzeScalp: async (imageFile: File): Promise<ApiResponse<AnalysisResult>> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    return request<AnalysisResult>(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
    });
  },

  checkHealth: async (): Promise<ApiResponse<{ 
    status: string; 
    services: Record<string, boolean>; 
    timestamp: string 
  }>> => {
    return request(`${API_BASE_URL}/api/health`);
  },
};
