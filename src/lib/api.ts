
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
    console.log(`Making API request to: ${url}`, options);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': options.body instanceof FormData ? undefined : 'application/json',
        ...options.headers,
      }
    });
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      // 尝试解析错误响应
      let errorText = '';
      try {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        errorText = errorData;
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('API response data:', data);
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
};

export const api = {
  analyzeScalp: async (imageFile: File): Promise<ApiResponse<AnalysisResult>> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    console.log('Analyzing scalp with file:', imageFile.name, imageFile.size, imageFile.type);

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
