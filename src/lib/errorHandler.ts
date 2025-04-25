import { ApiError, ApiErrorResponse } from './types';
import { API_ERROR_CODES, ERROR_MESSAGES, ERROR_SUGGESTIONS } from './errors';

export class ApiErrorHandler {
  static createErrorResponse(
    code: keyof typeof API_ERROR_CODES,
    path: string,
    details?: ApiError['details']
  ): ApiErrorResponse {
    return {
      error: {
        code: API_ERROR_CODES[code],
        message: ERROR_MESSAGES[API_ERROR_CODES[code]],
        details: {
          ...details,
          suggestion: ERROR_SUGGESTIONS[API_ERROR_CODES[code]]
        }
      },
      timestamp: new Date().toISOString(),
      path,
      requestId: generateRequestId()
    };
  }

  static isApiError(error: unknown): error is ApiErrorResponse {
    return (
      typeof error === 'object' &&
      error !== null &&
      'error' in error &&
      typeof (error as any).error === 'object' &&
      'code' in (error as any).error &&
      'message' in (error as any).error
    );
  }

  static handleError(error: unknown): ApiErrorResponse {
    if (this.isApiError(error)) {
      return error;
    }

    // 处理网络错误
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return this.createErrorResponse('SERVICE_UNAVAILABLE', '/api/analyze');
    }

    // 处理其他未知错误
    console.error('Unexpected error:', error);
    return this.createErrorResponse('UNKNOWN_ERROR', '/api/analyze', {
      reason: error instanceof Error ? error.message : '未知错误'
    });
  }

  static getErrorMessage(error: ApiErrorResponse): string {
    const { code, message, details } = error.error;
    if (details?.field) {
      return `${message} (${details.field})`;
    }
    return message;
  }

  static getSuggestion(error: ApiErrorResponse): string {
    return error.error.details?.suggestion || ERROR_SUGGESTIONS[error.error.code as keyof typeof API_ERROR_CODES];
  }
}

// 生成唯一的请求ID
function generateRequestId(): string {
  return 'req_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// 验证图片
export function validateImage(file: File): ApiErrorResponse | null {
  // 检查文件是否存在
  if (!file) {
    return ApiErrorHandler.createErrorResponse('IMAGE_EMPTY', '/api/analyze');
  }

  // 检查文件大小（5MB）
  if (file.size > 5 * 1024 * 1024) {
    return ApiErrorHandler.createErrorResponse('IMAGE_TOO_LARGE', '/api/analyze');
  }

  // 检查文件类型
  const validTypes = ['image/jpeg', 'image/png'];
  if (!validTypes.includes(file.type)) {
    return ApiErrorHandler.createErrorResponse('IMAGE_FORMAT_INVALID', '/api/analyze');
  }

  return null;
}

// 处理分析错误
export function handleAnalysisError(error: unknown): ApiErrorResponse {
  return ApiErrorHandler.handleError(error);
}

// 检查响应状态
export function checkResponseStatus(response: Response): Promise<Response> {
  if (!response.ok) {
    switch (response.status) {
      case 401:
        throw ApiErrorHandler.createErrorResponse('UNAUTHORIZED', '/api/analyze');
      case 403:
        throw ApiErrorHandler.createErrorResponse('FORBIDDEN', '/api/analyze');
      case 429:
        throw ApiErrorHandler.createErrorResponse('RATE_LIMIT_EXCEEDED', '/api/analyze');
      case 500:
        throw ApiErrorHandler.createErrorResponse('SERVER_ERROR', '/api/analyze');
      case 503:
        throw ApiErrorHandler.createErrorResponse('SERVICE_UNAVAILABLE', '/api/analyze');
      default:
        throw ApiErrorHandler.createErrorResponse('UNKNOWN_ERROR', '/api/analyze');
    }
  }
  return Promise.resolve(response);
} 