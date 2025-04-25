
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

const UploadPhoto = ({
  onUpload
}: {
  onUpload: (image: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      
      // Check if file is an image
      if (!file.type.match('image.*')) {
        alert('请上传图片文件');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB');
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
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileChange(e.dataTransfer.files);
  };
  
  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files)}
      />
      
      {preview ? (
        <div className="relative w-full">
          <img 
            src={preview} 
            alt="头皮图片预览" 
            className="w-full h-80 object-cover rounded-lg shadow-md" 
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 bg-white bg-opacity-70"
            onClick={clearPreview}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`w-full h-80 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragActive ? 'border-scalp-400 bg-scalp-50' : 'border-scalp-200 bg-scalp-50/30'
          }`}
          onClick={handleButtonClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-16 w-16 text-scalp-400 mb-4" />
          <p className="text-lg font-medium text-scalp-700">点击或拖放图片到此处</p>
          <p className="text-sm text-scalp-600 mt-2">支持 JPG, PNG 格式 (最大 5MB)</p>
        </div>
      )}
      
      {!preview && (
        <Button
          variant="default"
          size="lg"
          className="mt-4 bg-scalp-500 hover:bg-scalp-600 w-full"
          onClick={handleButtonClick}
        >
          <Upload className="mr-2 h-4 w-4" />
          选择头皮图片
        </Button>
      )}
    </div>
  );
};

export default UploadPhoto;
