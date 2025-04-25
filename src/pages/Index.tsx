
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScalpAnalysis from "@/components/ScalpAnalysis";
import { scalpTypes } from "@/lib/mockData";

const Index = () => {
  return (
    <div className="min-h-screen scalp-gradient">
      <header className="container mx-auto pt-8 pb-6 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-scalp-800 mb-2">
            智能头皮检测系统
          </h1>
          <p className="text-lg text-scalp-600 max-w-xl mx-auto">
            通过AI技术分析您的头皮状况，获取专业建议和个性化护理方案
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ScalpAnalysis />
          </div>
          
          <div className="space-y-6">
            <Card className="shadow-lg border-scalp-100">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-scalp-800 mb-4">如何使用</h2>
                <ol className="space-y-3 text-scalp-700">
                  <li className="flex items-start">
                    <span className="bg-scalp-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">1</span>
                    <span>拍照或上传您的头皮图片</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-scalp-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">2</span>
                    <span>等待AI分析您的头皮情况</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-scalp-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">3</span>
                    <span>获取专业分析结果与护理建议</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border-scalp-100">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-scalp-800 mb-4">常见头皮问题</h2>
                <Tabs defaultValue="oily">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="oily">油性</TabsTrigger>
                    <TabsTrigger value="dry">干性</TabsTrigger>
                    <TabsTrigger value="sensitive">敏感</TabsTrigger>
                  </TabsList>
                  
                  {scalpTypes.slice(0, 3).map((type) => (
                    <TabsContent key={type.id} value={type.id} className="text-sm text-scalp-700">
                      <h3 className="font-medium mb-1">{type.name}</h3>
                      <p>{type.description}</p>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="bg-scalp-500 text-white shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">专业头皮护理</h2>
                <p className="text-sm opacity-90 mb-4">
                  基于AI分析结果，获取针对您头皮问题的个性化护理方案
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">洗发产品推荐</span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">护理方案</span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">饮食建议</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6">
        <div className="container mx-auto px-4 text-center text-sm text-scalp-600">
          <p>© 2025 智能头皮检测系统 | 基于AI技术的头皮分析解决方案</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
