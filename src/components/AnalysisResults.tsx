import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomProgress } from "@/components/ui/custom-progress";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle, 
  DropletIcon, 
  Flame,
  Clock, 
  CheckCircle2, 
  BeakerIcon, 
  ShowerHead 
} from "lucide-react";
import { AnalysisResult } from "@/lib/types";
import { mockAnalysisResult } from "@/lib/mockData";

interface AnalysisResultsProps {
  image: string;
  analysisResult?: AnalysisResult;
}

const AnalysisResults = ({ 
  image,
  analysisResult = mockAnalysisResult 
}: AnalysisResultsProps) => {
  const { scalpType, severity, analysis, solutions, aiSuggestions } = analysisResult;
  
  const getSeverityColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "轻度": return "text-green-500";
      case "中度": return "text-orange-500";
      case "重度": return "text-red-500";
      default: return "text-blue-500";
    }
  };
  
  const getSeverityProgressColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "轻度": return "bg-green-500";
      case "中度": return "bg-orange-500";
      case "重度": return "bg-red-500";
      default: return "bg-blue-500";
    }
  };
  
  const getSeverityProgress = (level: string) => {
    switch (level.toLowerCase()) {
      case "轻度": return 33;
      case "中度": return 66;
      case "重度": return 100;
      default: return 50;
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <div className="h-64 overflow-hidden">
            <img 
              src={image} 
              alt="头皮图片" 
              className="w-full h-full object-cover" 
            />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-scalp-800">头皮分析结果</CardTitle>
            <CardDescription>图像扫描与AI分析结果</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">问题严重程度</span>
                  <span className={`text-sm font-semibold ${getSeverityColor(severity.level)}`}>
                    {severity.level}
                  </span>
                </div>
                <CustomProgress 
                  value={getSeverityProgress(severity.level)}
                  className="h-2"
                  indicatorClassName={getSeverityProgressColor(severity.level)}
                />
              </div>
              
              <div className="flex space-x-3 text-sm text-muted-foreground">
                <div className="flex flex-col items-center">
                  <DropletIcon className="h-5 w-5 text-blue-500 mb-1" />
                  <span>油脂：{Math.round(analysis.features.oilRatio * 100)}%</span>
                </div>
                <div className="flex flex-col items-center">
                  <Flame className="h-5 w-5 text-red-500 mb-1" />
                  <span>发红：{Math.round(analysis.features.redRatio * 100)}%</span>
                </div>
                <div className="flex flex-col items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mb-1" />
                  <span>纹理：{Math.round(analysis.features.textureRatio * 100)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-scalp-800 flex items-center">
              <BeakerIcon className="h-5 w-5 mr-2 text-scalp-500" />
              头皮类型
            </CardTitle>
            <CardDescription>{scalpType.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{scalpType.description}</p>
            
            <h4 className="font-medium text-sm mb-2">可能原因：</h4>
            <ul className="list-disc pl-5 text-sm space-y-1 mb-4">
              {scalpType.causes.map((cause, index) => (
                <li key={index}>{cause}</li>
              ))}
            </ul>
            
            <Separator className="my-4" />
            
            <h4 className="font-medium flex items-center mb-3">
              <ShowerHead className="h-4 w-4 mr-2 text-scalp-500" />
              产品建议
            </h4>
            <div className="space-y-2 text-sm">
              <p><strong>洗发水：</strong> {scalpType.productRecommendations.shampoo}</p>
              <p><strong>使用频率：</strong> {scalpType.productRecommendations.frequency}</p>
              <p><strong>特殊护理：</strong> {scalpType.productRecommendations.specialCare}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-scalp-800 flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-scalp-500" />
              解决方案
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">立即可采取的措施：</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {solutions.immediate.map((solution, index) => (
                    <li key={index}>{solution}</li>
                  ))}
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-scalp-500" />
                  长期护理计划：
                </h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {solutions.carePlan.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-scalp-800">AI 详细分析</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{aiSuggestions.fullAnalysis}</p>
            
            <h4 className="font-medium text-sm mb-2">推荐产品：</h4>
            <ul className="text-sm space-y-1 mb-4">
              {Object.entries(aiSuggestions.productRecommendations).map(([type, product], index) => (
                <li key={index} className="flex items-start">
                  <span className="font-medium mr-2">{type}:</span>
                  <span>{product}</span>
                </li>
              ))}
            </ul>
            
            <Separator className="my-4" />
            
            <h4 className="font-medium text-sm mb-2">即时建议：</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {aiSuggestions.immediateSolutions.map((solution, index) => (
                <li key={index}>{solution}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisResults;
