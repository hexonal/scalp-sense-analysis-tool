
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2, Upload, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import UploadPhoto from "./UploadPhoto";

const ScalpAnalysis = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [retries, setRetries] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleImage = (capturedImage: string) => {
    setImage(capturedImage);
  };
  
  const startAnalysis = async () => {
    if (!image) {
      toast({
        title: "请先上传图片",
        description: "需要头皮图片才能进行分析",
        variant: "destructive",
      });
      return;
    }
    
    setAnalyzing(true);
    
    try {
      console.log("开始分析头皮图片...");
      
      // Convert base64 to file
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], "scalp-image.jpg", { type: "image/jpeg" });
      
      console.log("已创建文件对象:", file.name, file.size, file.type);
      
      // 添加健康检查
      console.log("检查 API 健康状态...");
      const healthCheck = await api.checkHealth();
      console.log("API 健康状态:", healthCheck);
      
      if (!healthCheck.success) {
        throw new Error("API 服务不可用，请检查后端服务是否正常运行");
      }
      
      const result = await api.analyzeScalp(file);
      
      console.log("分析结果:", result);
      
      if (result.success && result.result) {
        navigate("/result", { state: { image, analysisResult: result.result } });
      } else {
        throw new Error(result.error || '分析失败，服务器未返回有效结果');
      }
    } catch (error) {
      console.error("分析过程中出错:", error);
      
      // 显示更具体的错误信息
      let errorMessage = error instanceof Error ? error.message : "请稍后重试";
      
      if (errorMessage.includes("Failed to fetch") || 
          errorMessage.includes("NetworkError") ||
          errorMessage.includes("ECONNRESET")) {
        errorMessage = "无法连接到分析服务器，请确保后端服务正在运行";
      }
      
      toast({
        title: "分析失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };
  
  const retryAnalysis = () => {
    setRetries(prev => prev + 1);
    startAnalysis();
  };
  
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl overflow-hidden border-scalp-100">
      <CardContent className="p-6">
        <div className="mb-6">
          <UploadPhoto onUpload={handleImage} />
        </div>
        
        <div className="mt-6">
          <Button
            onClick={startAnalysis}
            disabled={!image || analyzing}
            className="w-full py-6 text-lg bg-scalp-500 hover:bg-scalp-600"
          >
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                正在分析头皮...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                开始分析
              </>
            )}
          </Button>
          
          {retries > 0 && (
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                onClick={retryAnalysis} 
                disabled={analyzing}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                重试 ({retries})
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScalpAnalysis;
