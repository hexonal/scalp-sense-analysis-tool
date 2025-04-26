import { AnalysisResult, ApiResponse } from './types';
import { validateImage, handleAnalysisError, checkResponseStatus } from './errorHandler';

// 保持一致的 API 基础 URL 配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface ApiResponse<T> {
  success: boolean;
  result?: T;
  error?: string;
  error_code?: string;
  error_details?: {
    type: string;
    message: string;
    is_network_error: boolean;
  };
}

const request = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    // 构建API URL
    const apiPath = url.startsWith('/') ? url.slice(1) : url;
    const fullUrl = process.env.NODE_ENV === 'development'
      ? `/api/${apiPath}`  // 开发环境添加/api前缀
      : `${API_BASE_URL}/api/${apiPath}`;  // 生产环境使用完整URL

    console.log('【请求开始】', {
      原始路径: url,
      API路径: apiPath,
      完整URL: fullUrl,
      方法: options.method || 'GET',
      请求头: options.headers || {},
      请求体类型: options.body instanceof FormData ? 'FormData' : typeof options.body,
      运行环境: process.env.NODE_ENV,
      开发环境: process.env.NODE_ENV === 'development',
      Vite代理配置: {
        target: 'http://localhost:8001',
        路径: '/api'
      }
    });

    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': options.body instanceof FormData ? undefined : 'application/json',
        ...options.headers,
      }
    });

    console.log('【响应状态】', {
      状态码: response.status,
      状态文本: response.statusText,
      请求URL: fullUrl,
      响应类型: response.type,
      响应头: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      let errorText = '';
      let errorData = null;
      try {
        const responseText = await response.text();
        console.error('【错误响应】', {
          状态码: response.status,
          状态文本: response.statusText,
          请求URL: fullUrl,
          响应内容: responseText,
          响应头: Object.fromEntries(response.headers.entries()),
          响应类型: response.type
        });
        try {
          errorData = JSON.parse(responseText);
          errorText = errorData.message || errorData.error || responseText;
        } catch (jsonError) {
          errorText = responseText;
        }
      } catch (parseError) {
        console.error('【解析错误】', parseError);
      }

      throw new Error(`API请求失败 [${response.status}]: ${errorText}`);
    }

    let responseData;
    const responseText = await response.text();
    try {
      console.log('【原始响应文本】', responseText);
      responseData = responseText ? JSON.parse(responseText) : null;
      console.log('【解析后的响应数据】', responseData);
    } catch (e) {
      console.error('【JSON解析错误】', {
        错误: e,
        原始文本: responseText
      });
      throw new Error('响应格式错误：无法解析JSON');
    }

    return responseData;
  } catch (error) {
    console.error('【请求失败】', {
      错误类型: error.constructor.name,
      错误信息: error.message,
      错误堆栈: error.stack,
      是否为网络错误: error instanceof TypeError,
      请求URL: url,
      请求方法: options.method || 'GET'
    });

    if (error instanceof TypeError) {
      if (error.message.includes('NetworkError')) {
        console.error('【网络错误】可能是CORS问题或服务器未运行');
      } else if (error.message.includes('Failed to fetch')) {
        console.error('【连接失败】后端服务器可能未运行或不可访问');
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      error_code: error instanceof TypeError ? 'NETWORK_ERROR' : 'API_ERROR',
      error_details: {
        type: error.constructor.name,
        message: error.message,
        is_network_error: error instanceof TypeError
      }
    };
  }
};

export const api = {
  analyzeScalp: async (imageFile: File): Promise<ApiResponse<AnalysisResult>> => {
    try {
      // 验证图片
      const validationError = validateImage(imageFile);
      if (validationError) {
        throw validationError;
      }

      // 创建表单数据
      const formData = new FormData();
      formData.append('file', imageFile);

      // 发送请求
      console.log('开始分析头皮图片:', {
        文件大小: `${(imageFile.size / 1024 / 1024).toFixed(2)}MB`,
        文件类型: imageFile.type,
        时间戳: new Date().toISOString()
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 120秒超时

      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      }).then(checkResponseStatus);

      clearTimeout(timeoutId);

      const data = await response.json();

      console.log('收到分析响应:', {
        状态: response.status,
        成功: data.success,
        时间戳: new Date().toISOString()
      });

      // 检查响应格式
      if (typeof data.success !== 'boolean') {
        throw new Error('响应格式错误：缺少 success 字段');
      }

      if (!data.success && data.error) {
        throw new Error(data.error);
      }

      if (data.success && !data.result) {
        throw new Error('响应格式错误：成功响应缺少 result 字段');
      }

      return data as ApiResponse<AnalysisResult>;
    } catch (error) {
      console.error('分析请求失败:', error);
      const apiError = handleAnalysisError(error);
      return {
        success: false,
        error: apiError.error.message
      };
    }
  },

  checkHealth: async (): Promise<ApiResponse<{
    status: string;
    services: Record<string, boolean>;
    timestamp: string
  }>> => {
    type HealthCheckResponse = {
      status: string;
      services: Record<string, boolean>;
      timestamp: string;
    };

    try {
      const response = await request<HealthCheckResponse>('health');
      console.log('【健康检查响应】', response);

      // 处理直接返回的健康检查对象
      if ('status' in response && !('success' in response)) {
        console.log('【健康检查】收到直接响应格式');
        return {
          success: true,
          result: response as HealthCheckResponse
        };
      }

      // 处理已经包装在ApiResponse中的响应
      if ('success' in response) {
        console.log('【健康检查】收到ApiResponse格式');
        if (response.success && response.result) {
          return response as ApiResponse<HealthCheckResponse>;
        }
        // 如果是失败的ApiResponse，直接返回
        return response;
      }

      // 如果响应格式不符合预期
      console.error('【健康检查】响应格式异常:', response);
      return {
        success: false,
        error: '健康检查响应格式异常',
        error_code: 'INVALID_RESPONSE_FORMAT',
        error_details: {
          type: 'ValidationError',
          message: '响应格式不符合预期',
          is_network_error: false
        }
      };
    } catch (error) {
      console.error('【健康检查异常】', {
        错误类型: error.constructor.name,
        错误信息: error.message,
        错误堆栈: error.stack
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : '健康检查失败',
        error_code: 'HEALTH_CHECK_ERROR',
        error_details: {
          type: error.constructor.name,
          message: error instanceof Error ? error.message : '未知错误',
          is_network_error: error instanceof TypeError
        }
      };
    }
  },
};
