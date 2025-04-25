
import React, { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, FlipHorizontal, Video } from "lucide-react";

const CameraComponent = ({
  onCapture
}: {
  onCapture: (image: string) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  
  const startCamera = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
        
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };
  
  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };
  
  const switchCamera = () => {
    stopCamera();
    setFacingMode(prevMode => 
      prevMode === "user" ? "environment" : "user"
    );
    setTimeout(() => startCamera(), 300);
  };
  
  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/jpeg");
        onCapture(imageDataUrl);
        stopCamera();
      }
    }
  }, [onCapture]);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md overflow-hidden rounded-lg bg-scalp-50 shadow-md">
        {isCameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="h-80 w-full object-cover"
          />
        ) : (
          <div className="flex h-80 w-full items-center justify-center bg-scalp-50">
            <Video className="h-16 w-16 text-scalp-400 opacity-50" />
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="mt-4 flex w-full max-w-md justify-between space-x-2">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 bg-white"
          onClick={toggleCamera}
        >
          <Camera className="mr-2 h-4 w-4" />
          {isCameraActive ? "关闭相机" : "打开相机"}
        </Button>
        
        {isCameraActive && (
          <>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 bg-white"
              onClick={switchCamera}
            >
              <FlipHorizontal className="mr-2 h-4 w-4" />
              切换相机
            </Button>
            
            <Button
              variant="default"
              size="lg"
              className="flex-1 bg-scalp-500 hover:bg-scalp-600"
              onClick={captureImage}
            >
              拍照分析
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraComponent;
