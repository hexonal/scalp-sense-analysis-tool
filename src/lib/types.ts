
export interface ScalpType {
  name: string;
  description: string;
  causes: string[];
  productRecommendations: {
    shampoo: string;
    frequency: string;
    specialCare: string;
  };
}

export interface Severity {
  level: string;
  advice: string;
}

export interface Analysis {
  features: {
    oilRatio: number;
    redRatio: number;
    textureRatio: number;
  };
  description: string;
}

export interface Solutions {
  immediate: string[];
  carePlan: string[];
}

export interface AiSuggestions {
  fullAnalysis: string;
  productRecommendations: {
    [key: string]: string;
  };
  immediateSolutions: string[];
}

export interface AnalysisResult {
  scalpType: ScalpType;
  severity: Severity;
  analysis: Analysis;
  solutions: Solutions;
  aiSuggestions: AiSuggestions;
}
