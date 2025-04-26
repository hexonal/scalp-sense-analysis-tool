import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2, Upload, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import UploadPhoto from "./UploadPhoto";
import { Progress } from "@/components/ui/progress";

const ScalpAnalysis = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [retries, setRetries] = useState(0);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
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
    setProgress(0);
    setProgressText("准备分析...");

    // 启动进度模拟
    const startTime = Date.now();
    const expectedDuration = 60000; // 60秒
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / expectedDuration) * 100, 95);
      setProgress(newProgress);

      if (elapsed < 5000) {
        setProgressText("正在上传图片...");
      } else if (elapsed < 15000) {
        setProgressText("正在进行图像预处理...");
      } else if (elapsed < 30000) {
        setProgressText("正在分析头皮特征...");
      } else if (elapsed < 45000) {
        setProgressText("正在生成分析报告...");
      } else {
        setProgressText("即将完成分析...");
      }
    }, 1000);

    try {
      console.log("开始分析头皮图片...");

      // Convert base64 to file
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], "scalp-image.png", { type: blob.type });

      console.log("已创建文件对象:", file.name, file.size, file.type);

      // 添加健康检查
      console.log("开始健康检查...");
      try {
        const healthCheck = await api.checkHealth();
        console.log("健康检查响应:", healthCheck);

        if (!healthCheck.success) {
          if (healthCheck.error_code === 'NETWORK_ERROR') {
            console.error("健康检查网络错误:", healthCheck.error_details);
            throw new Error(`无法连接到后端服务 (${healthCheck.error})`);
          } else {
            console.error("健康检查失败:", healthCheck);
            throw new Error(healthCheck.error || "API 服务不可用，请检查后端服务是否正常运行");
          }
        }

        // 验证健康检查结果
        const healthStatus = healthCheck.result;
        if (healthStatus.status !== 'healthy') {
          console.error("后端服务不健康:", healthStatus);
          throw new Error(`后端服务状态异常: ${healthStatus.status}`);
        }

        console.log("健康检查通过，后端服务正常运行");
      } catch (healthError) {
        console.error("健康检查异常:", {
          错误类型: healthError.constructor.name,
          错误信息: healthError.message,
          错误堆栈: healthError.stack
        });
        throw healthError;
      }

      console.log("开始发送分析请求...");
      const result = await api.analyzeScalp(file);

      clearInterval(progressInterval);
      setProgress(100);
      setProgressText("分析完成！");

      console.log("分析响应:", {
        成功: result.success,
        错误码: result.error_code,
        错误信息: result.error,
        详细信息: result.error_details,
        结果: result.result
      });

      if (result.success && result.result) {
        navigate("/result", { state: { image, analysisResult: result.result } });
      } else {
        throw new Error(result.error || '分析失败，服务器未返回有效结果');
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error("分析过程中出错:", error);

      // 显示更具体的错误信息
      let errorMessage = error instanceof Error ? error.message : "请稍后重试";

      if (errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("NetworkError") ||
        errorMessage.includes("ECONNRESET")) {
        errorMessage = "无法连接到分析服务器，请确保后端服务正在运行";
      } else if (errorMessage.includes("aborted")) {
        errorMessage = "分析请求超时，请稍后重试";
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
          {analyzing && (
            <div className="mb-4">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center mt-2 text-gray-600">{progressText}</p>
            </div>
          )}

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
