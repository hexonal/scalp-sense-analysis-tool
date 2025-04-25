export interface ScalpType {
  name: string;
  description: string;
  causes: string[];
  product_recommendations: {
    shampoo: string;
    frequency: string;
    special_care: string;
  };
}

export interface Severity {
  level: string;
  advice: string;
}

export interface Analysis {
  features: {
    oil_ratio: number;
    red_ratio: number;
    texture_ratio: number;
  };
  description: string;
}

export interface Solutions {
  immediate: string[];
  care_plan: string[];
}

export interface AiSuggestions {
  full_analysis: string;
  product_recommendations: {
    [key: string]: string;
  };
  immediate_solutions: string[];
}

export interface AnalysisResult {
  scalp_type: ScalpType;
  severity: Severity;
  analysis: Analysis;
  solutions: Solutions;
  ai_suggestions: AiSuggestions;
}

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

export interface ApiError {
  code: string;
  message: string;
  details?: {
    field?: string;
    reason?: string;
    suggestion?: string;
  };
}

export interface ApiErrorResponse {
  error: ApiError;
  timestamp: string;
  path: string;
  requestId: string;
}
