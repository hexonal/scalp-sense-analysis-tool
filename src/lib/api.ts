
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
    console.log(`准备发送 API 请求: ${url}`, {
      method: options.method || 'GET',
      headers: options.headers || {},
      hasBody: !!options.body
    });
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': options.body instanceof FormData ? undefined : 'application/json',
        ...options.headers,
      }
    });
    
    console.log(`收到响应状态码: ${response.status}`);
    
    if (!response.ok) {
      // 尝试解析错误响应
      let errorText = '';
      try {
        const errorData = await response.text();
        console.error('错误响应:', errorData);
        errorText = errorData;
      } catch (parseError) {
        console.error('解析错误响应失败:', parseError);
      }
      
      throw new Error(`API 请求失败，状态码 ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('API 响应数据:', data);
    return data;
  } catch (error) {
    console.error('API 请求失败:', error);
    
    if (error instanceof TypeError && error.message.includes('NetworkError')) {
      console.error('网络错误: 可能是 CORS 问题或服务器未运行');
    }
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('获取失败: 后端服务器可能未运行或不可访问');
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      error_code: error instanceof TypeError ? 'NETWORK_ERROR' : 'API_ERROR'
    };
  }
};

export const api = {
  analyzeScalp: async (imageFile: File): Promise<ApiResponse<AnalysisResult>> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    console.log('开始分析头皮图片:', 
      { 
        文件名: imageFile.name, 
        大小: `${(imageFile.size / 1024).toFixed(2)}KB`, 
        类型: imageFile.type 
      }
    );

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
