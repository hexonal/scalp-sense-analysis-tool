
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import CameraComponent from "./Camera";
import UploadPhoto from "./UploadPhoto";
import { useToast } from "@/components/ui/use-toast";

const ScalpAnalysis = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleImage = (capturedImage: string) => {
    setImage(capturedImage);
  };
  
  const startAnalysis = async () => {
    if (!image) {
      toast({
        title: "请先拍照或上传图片",
        description: "需要头皮图片才能进行分析",
        variant: "destructive",
      });
      return;
    }
    
    setAnalyzing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, we'd send the image to the API and get results back
      // For now, we'll just navigate to the results page
      setAnalyzing(false);
      navigate("/result", { state: { image } });
    }, 3000);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl overflow-hidden border-scalp-100">
      <CardContent className="p-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upload" className="text-base">上传图片</TabsTrigger>
            <TabsTrigger value="camera" className="text-base">拍照</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-0">
            <UploadPhoto onUpload={handleImage} />
          </TabsContent>
          
          <TabsContent value="camera" className="mt-0">
            <CameraComponent onCapture={handleImage} />
          </TabsContent>
        </Tabs>
        
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
                开始分析
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScalpAnalysis;
