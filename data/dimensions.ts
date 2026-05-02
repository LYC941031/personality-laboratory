export const DIMENSION_KEYS = [
  "socialAnxiety",
  "sensitivity",
  "selfEsteem",
  "dependency",
  "avoidance",
  "emotionalRegulation",
] as const;

export type DimensionKey = (typeof DIMENSION_KEYS)[number];

export interface DimensionInfo {
  key: DimensionKey;
  label: string;
  labelEn: string;
  description: string;
  color: string;
}

export const DIMENSIONS: DimensionInfo[] = [
  {
    key: "socialAnxiety",
    label: "社交焦虑",
    labelEn: "Social Anxiety",
    description: "在社交情境中感到紧张、不安或恐惧的程度",
    color: "#7C3AED",
  },
  {
    key: "sensitivity",
    label: "敏感度",
    labelEn: "Sensitivity",
    description: "对他人评价、拒绝或批评的敏感程度",
    color: "#EC4899",
  },
  {
    key: "selfEsteem",
    label: "自尊水平",
    labelEn: "Self-Esteem",
    description: "对自我价值和能力的整体评价（得分越高表示自尊越低）",
    color: "#F59E0B",
  },
  {
    key: "dependency",
    label: "依赖性",
    labelEn: "Dependency",
    description: "在情感和决策上依赖他人的程度",
    color: "#3B82F6",
  },
  {
    key: "avoidance",
    label: "回避行为",
    labelEn: "Avoidance",
    description: "面对困难或不适情境时选择退缩或逃避的倾向",
    color: "#EF4444",
  },
  {
    key: "emotionalRegulation",
    label: "情绪调节",
    labelEn: "Emotional Regulation",
    description: "管理和调节情绪反应的能力（得分越高表示调节能力越弱）",
    color: "#10B981",
  },
];
