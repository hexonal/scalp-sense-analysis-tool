
import { AnalysisResult } from "./types";

export const mockAnalysisResult: AnalysisResult = {
  scalpType: {
    name: "油性头皮",
    description: "头皮出油过多，可能导致头痒、头皮屑增多，严重时可引起毛囊炎症。",
    causes: [
      "皮脂腺分泌旺盛",
      "激素水平变化",
      "清洁不当",
      "饮食过于油腻"
    ],
    productRecommendations: {
      shampoo: "控油洗发水，含有水杨酸成分",
      frequency: "建议2-3天清洗一次头发",
      specialCare: "每周使用一次深层清洁洗发水"
    }
  },
  severity: {
    level: "中度",
    advice: "需要改善日常护理习惯，并考虑使用专业产品控制油脂分泌"
  },
  analysis: {
    features: {
      oilRatio: 0.75,
      redRatio: 0.25,
      textureRatio: 0.40
    },
    description: "图像分析显示头皮油脂分泌旺盛，部分区域有轻微发红，头皮表面纹理不均。"
  },
  solutions: {
    immediate: [
      "使用温和控油洗发水",
      "减少洗发频率，避免刺激",
      "使用温水洗发，避免热水"
    ],
    carePlan: [
      "调整饮食结构，减少高脂肪食物摄入",
      "保持规律作息，避免熬夜",
      "定期使用头皮净化产品",
      "每月进行一次专业头皮护理"
    ]
  },
  aiSuggestions: {
    fullAnalysis: "AI分析显示您的头皮属于油性类型，油脂分泌旺盛，同时伴有轻微的炎症反应。这种情况在年轻人群中较为常见，主要是由于皮脂腺活跃和不当的护理习惯造成的。油脂过多会导致毛囊堵塞，长期可能引发脱发问题。",
    productRecommendations: {
      shampoo: "科颜氏氨基酸洗发水",
      conditioner: "馥绿德雅清爽控油护发素",
      treatment: "欧莱雅头皮舒缓精华"
    },
    immediateSolutions: [
      "立即停用含有硅油的护发产品",
      "晚上睡前避免使用发胶等定型产品",
      "保持枕套清洁，建议每周更换一次"
    ]
  }
};

export const scalpTypes = [
  {
    id: "oily",
    name: "油性头皮",
    description: "头皮出油过多，可能导致头痒、头皮屑增多"
  },
  {
    id: "dry",
    name: "干性头皮",
    description: "头皮干燥，容易出现头皮屑和瘙痒感"
  },
  {
    id: "sensitive",
    name: "敏感头皮",
    description: "头皮容易发红、瘙痒，对多种成分可能过敏"
  },
  {
    id: "dandruff",
    name: "头皮屑问题",
    description: "明显可见的头皮屑，伴有瘙痒感"
  },
  {
    id: "hair_loss",
    name: "脱发问题",
    description: "头发稀疏，有明显脱发现象"
  }
];
