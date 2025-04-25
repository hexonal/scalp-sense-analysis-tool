
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Download, Printer } from "lucide-react";
import AnalysisResults from "@/components/AnalysisResults";
import { useToast } from "@/components/ui/use-toast";
import { mockAnalysisResult } from "@/lib/mockData";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get image from location state, or use a default if not available
  const image = location.state?.image || "https://source.unsplash.com/random/800x600/?scalp";
  
  const handleShare = () => {
    // In a real app, this would open a sharing dialog
    toast({
      title: "分享功能",
      description: "分享功能尚未实现。在实际应用中，这里会打开分享对话框。",
    });
  };
  
  const handleDownload = () => {
    // In a real app, this would download the report as PDF
    toast({
      title: "下载功能",
      description: "下载功能尚未实现。在实际应用中，这里会下载分析报告PDF。",
    });
  };
  
  const handlePrint = () => {
    // In a real app, this would open the print dialog
    toast({
      title: "打印功能",
      description: "打印功能尚未实现。在实际应用中，这里会打印分析报告。",
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-scalp-50 to-white">
      <header className="container mx-auto pt-6 pb-4 px-4">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            className="flex items-center text-scalp-800"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              分享
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              下载
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" />
              打印
            </Button>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-scalp-800 mb-1">
            头皮分析报告
          </h1>
          <p className="text-scalp-600">
            分析时间: {new Date().toLocaleString("zh-CN", { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-16">
        <AnalysisResults 
          image={image} 
          analysisResult={mockAnalysisResult} 
        />
        
        <div className="mt-10 text-center">
          <Button
            variant="default"
            size="lg"
            className="bg-scalp-500 hover:bg-scalp-600"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            重新分析
          </Button>
        </div>
      </main>
      
      <footer className="bg-white py-6">
        <div className="container mx-auto px-4 text-center text-sm text-scalp-600">
          <p>© 2025 智能头皮检测系统 | 基于AI技术的头皮分析解决方案</p>
          <p className="mt-2 text-xs opacity-70">
            本结果仅供参考，不构成医疗诊断。如有严重问题，请咨询专业皮肤科医生
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Result;
