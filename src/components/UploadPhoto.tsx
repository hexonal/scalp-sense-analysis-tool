
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const UploadPhoto = ({
  onUpload
}: {
  onUpload: (image: string) => void;
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      
      // 检查文件类型和大小
      if (!file.type.match('image.*')) {
        toast({
          title: "文件类型错误",
          description: "请上传图片文件",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 4 * 1024 * 1024) { // 微信小程序限制4MB
        toast({
          title: "文件过大",
          description: "图片大小不能超过4MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clearPreview = () => {
    setPreview(null);
  };
  
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files)}
        id="upload-input"
      />
      
      {preview ? (
        <div className="relative w-full">
          <img 
            src={preview} 
            alt="头皮图片预览" 
            className="w-full h-64 object-cover rounded-lg shadow-sm" 
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
            onClick={clearPreview}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label 
          htmlFor="upload-input"
          className="w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50 hover:bg-gray-100 border-gray-300 hover:border-gray-400"
        >
          <Upload className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-base font-medium text-gray-600">点击上传图片</p>
          <p className="text-sm text-gray-500 mt-1">支持 JPG、PNG 格式</p>
          <p className="text-xs text-gray-400 mt-1">大小不超过 4MB</p>
        </label>
      )}
    </div>
  );
};

export default UploadPhoto;
