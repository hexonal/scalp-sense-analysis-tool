
import React from "react";
import { Loader2 } from "lucide-react";

export const WxLoading = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      <span className="ml-2 text-sm text-gray-500">加载中...</span>
    </div>
  );
};
