
import { AnalysisResult } from './types';

const API_BASE_URL = 'http://localhost:8000';

export interface ApiResponse<T> {
  success: boolean;
  result?: T;
  error?: string;
  error_code?: string;
}

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
};

export const api = {
  analyzeScalp: async (imageFile: File): Promise<ApiResponse<AnalysisResult>> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
      headers: {
        'X-API-Key': 'your_api_key', // 注意：实际项目中应从环境变量获取
      },
    });

    return handleResponse<AnalysisResult>(response);
  },

  checkHealth: async (): Promise<ApiResponse<{ status: string; services: Record<string, boolean>; timestamp: string }>> => {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      headers: {
        'X-API-Key': 'your_api_key',
      },
    });

    return handleResponse<{ status: string; services: Record<string, boolean>; timestamp: string }>(response);
  },
};
