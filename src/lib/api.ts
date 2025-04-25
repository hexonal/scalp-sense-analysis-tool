
import { AnalysisResult } from './types';

// 保持一致的 API 基础 URL 配置
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '/api' 
  : 'https://api.yourservice.com/api';  // 确保生产环境也包含 /api 前缀

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
    // 确保参数名称与后端期望的一致："image"
    formData.append('image', imageFile);
    
    console.log('Analyzing scalp with file:', imageFile.name, imageFile.size, imageFile.type);

    // 确保使用正确的路径：现在变为 "/api/analyze"
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
