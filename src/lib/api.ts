
import { AnalysisResult } from './types';

// 使用相对路径，这样请求会通过Vite的代理
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '/api' 
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
        'Content-Type': options.body instanceof FormData ? undefined : 'application/json',
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

    return request<AnalysisResult>(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });
  },

  checkHealth: async (): Promise<ApiResponse<{ 
    status: string; 
    services: Record<string, boolean>; 
    timestamp: string 
  }>> => {
    return request(`${API_BASE_URL}/health`);
  },
};
