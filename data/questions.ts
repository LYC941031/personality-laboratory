export interface Question {
  id: number;
  text: string;
  reverseScored: boolean;
  weights: {
    socialAnxiety: number;
    sensitivity: number;
    selfEsteem: number;
    dependency: number;
    avoidance: number;
    emotionalRegulation: number;
  };
  category: string;
}

export const questions: Question[] = [
  // ===== 社交情境 (Social Situations) =====
  {
    id: 1,
    text: "我常常担心别人会拒绝我",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.9,
      sensitivity: 0.7,
      selfEsteem: 0.6,
      dependency: 0.3,
      avoidance: 0.4,
      emotionalRegulation: 0.3,
    },
    category: "社交情境",
  },
  {
    id: 2,
    text: "在聚会或社交场合中，我感到紧张和不自在",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.95,
      sensitivity: 0.3,
      selfEsteem: 0.4,
      dependency: 0.1,
      avoidance: 0.6,
      emotionalRegulation: 0.2,
    },
    category: "社交情境",
  },
  {
    id: 3,
    text: "我尽量避免和不熟悉的人打交道",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.7,
      sensitivity: 0.2,
      selfEsteem: 0.3,
      dependency: 0.1,
      avoidance: 0.9,
      emotionalRegulation: 0.1,
    },
    category: "社交情境",
  },
  {
    id: 4,
    text: "和人相处时，我总是在想他们对我的看法",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.75,
      sensitivity: 0.85,
      selfEsteem: 0.5,
      dependency: 0.4,
      avoidance: 0.2,
      emotionalRegulation: 0.3,
    },
    category: "社交情境",
  },
  {
    id: 5,
    text: "我喜欢成为众人关注的焦点",
    reverseScored: true,
    weights: {
      socialAnxiety: -0.4,
      sensitivity: 0.2,
      selfEsteem: -0.3,
      dependency: 0.5,
      avoidance: -0.5,
      emotionalRegulation: 0.1,
    },
    category: "社交情境",
  },

  // ===== 自我认知 (Self-Perception) =====
  {
    id: 6,
    text: "我觉得自己不如别人",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.4,
      sensitivity: 0.3,
      selfEsteem: 0.9,
      dependency: 0.35,
      avoidance: 0.3,
      emotionalRegulation: 0.2,
    },
    category: "自我认知",
  },
  {
    id: 7,
    text: "即使成功了，我也觉得自己只是运气好",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.2,
      sensitivity: 0.1,
      selfEsteem: 0.9,
      dependency: 0.3,
      avoidance: 0.15,
      emotionalRegulation: 0.1,
    },
    category: "自我认知",
  },
  {
    id: 8,
    text: "我对自己有很高的标准，必须做到完美",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.2,
      sensitivity: 0.4,
      selfEsteem: 0.3,
      dependency: 0.1,
      avoidance: 0.2,
      emotionalRegulation: 0.6,
    },
    category: "自我认知",
  },
  {
    id: 9,
    text: "我相信自己有能力处理好大多数事情",
    reverseScored: true,
    weights: {
      socialAnxiety: -0.5,
      sensitivity: -0.3,
      selfEsteem: -0.9,
      dependency: -0.7,
      avoidance: -0.5,
      emotionalRegulation: -0.4,
    },
    category: "自我认知",
  },
  {
    id: 10,
    text: "我经常怀疑自己的决定是否正确",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.25,
      sensitivity: 0.2,
      selfEsteem: 0.75,
      dependency: 0.7,
      avoidance: 0.3,
      emotionalRegulation: 0.2,
    },
    category: "自我认知",
  },

  // ===== 情绪反应 (Emotional Response) =====
  {
    id: 11,
    text: "我的情绪起伏很大，很难控制",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.2,
      sensitivity: 0.6,
      selfEsteem: 0.3,
      dependency: 0.35,
      avoidance: 0.1,
      emotionalRegulation: 0.95,
    },
    category: "情绪反应",
  },
  {
    id: 12,
    text: "一点小事就能让我心烦很久",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.15,
      sensitivity: 0.85,
      selfEsteem: 0.3,
      dependency: 0.2,
      avoidance: 0.15,
      emotionalRegulation: 0.7,
    },
    category: "情绪反应",
  },
  {
    id: 13,
    text: "我常常因为害怕被抛弃而做出极端行为",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.4,
      sensitivity: 0.5,
      selfEsteem: 0.5,
      dependency: 0.8,
      avoidance: 0.2,
      emotionalRegulation: 0.65,
    },
    category: "情绪反应",
  },
  {
    id: 14,
    text: "我感到愤怒时很难控制自己的言行",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.1,
      sensitivity: 0.3,
      selfEsteem: 0.2,
      dependency: 0.2,
      avoidance: 0.1,
      emotionalRegulation: 0.8,
    },
    category: "情绪反应",
  },
  {
    id: 15,
    text: "即使遇到困难，我也能保持情绪稳定",
    reverseScored: true,
    weights: {
      socialAnxiety: -0.3,
      sensitivity: -0.4,
      selfEsteem: -0.3,
      dependency: -0.25,
      avoidance: -0.2,
      emotionalRegulation: -0.85,
    },
    category: "情绪反应",
  },

  // ===== 行为模式 (Behavioral Patterns) =====
  {
    id: 16,
    text: "遇到困难时我倾向于逃避而不是面对",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.4,
      sensitivity: 0.2,
      selfEsteem: 0.4,
      dependency: 0.3,
      avoidance: 0.9,
      emotionalRegulation: 0.35,
    },
    category: "行为模式",
  },
  {
    id: 17,
    text: "没有他人的建议和保证，我很难做出决定",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.35,
      sensitivity: 0.3,
      selfEsteem: 0.7,
      dependency: 0.95,
      avoidance: 0.25,
      emotionalRegulation: 0.2,
    },
    category: "行为模式",
  },
  {
    id: 18,
    text: "我不太相信别人的好意，总觉得他们有目的",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.5,
      sensitivity: 0.75,
      selfEsteem: 0.2,
      dependency: 0.05,
      avoidance: 0.55,
      emotionalRegulation: 0.2,
    },
    category: "行为模式",
  },
  {
    id: 19,
    text: "比起和人相处，我更喜欢一个人待着",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.4,
      sensitivity: 0.1,
      selfEsteem: 0.15,
      dependency: 0.05,
      avoidance: 0.85,
      emotionalRegulation: 0.1,
    },
    category: "行为模式",
  },
  {
    id: 20,
    text: "为了获得别人的认可，我会做任何事",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.5,
      sensitivity: 0.6,
      selfEsteem: 0.6,
      dependency: 0.85,
      avoidance: 0.05,
      emotionalRegulation: 0.4,
    },
    category: "行为模式",
  },

  // ===== 人际关系 (Interpersonal) =====
  {
    id: 21,
    text: "我经常觉得别人在背后议论我",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.65,
      sensitivity: 0.85,
      selfEsteem: 0.4,
      dependency: 0.25,
      avoidance: 0.4,
      emotionalRegulation: 0.3,
    },
    category: "人际关系",
  },
  {
    id: 22,
    text: "我很难对别人说「不」",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.5,
      sensitivity: 0.4,
      selfEsteem: 0.5,
      dependency: 0.8,
      avoidance: 0.35,
      emotionalRegulation: 0.25,
    },
    category: "人际关系",
  },
  {
    id: 23,
    text: "关系中稍有冷淡，我就会担心对方要离开我",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.55,
      sensitivity: 0.75,
      selfEsteem: 0.5,
      dependency: 0.85,
      avoidance: 0.3,
      emotionalRegulation: 0.55,
    },
    category: "人际关系",
  },
  {
    id: 24,
    text: "我对他人的感受和需求缺乏共鸣",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.05,
      sensitivity: -0.5,
      selfEsteem: -0.3,
      dependency: 0.1,
      avoidance: 0.1,
      emotionalRegulation: 0.2,
    },
    category: "人际关系",
  },
  {
    id: 25,
    text: "与人亲近让我感到安全和满足",
    reverseScored: true,
    weights: {
      socialAnxiety: -0.7,
      sensitivity: -0.4,
      selfEsteem: -0.5,
      dependency: -0.3,
      avoidance: -0.8,
      emotionalRegulation: -0.3,
    },
    category: "人际关系",
  },

  // ===== 额外补充题 =====
  {
    id: 26,
    text: "我经常为了取悦别人而牺牲自己的需求",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.45,
      sensitivity: 0.5,
      selfEsteem: 0.6,
      dependency: 0.8,
      avoidance: 0.25,
      emotionalRegulation: 0.3,
    },
    category: "人际关系",
  },
  {
    id: 27,
    text: "我的自我评价常常取决于别人怎么看我",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.5,
      sensitivity: 0.8,
      selfEsteem: 0.55,
      dependency: 0.7,
      avoidance: 0.2,
      emotionalRegulation: 0.35,
    },
    category: "自我认知",
  },
  {
    id: 28,
    text: "事情不按计划进行时，我会非常焦虑",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.3,
      sensitivity: 0.4,
      selfEsteem: 0.25,
      dependency: 0.15,
      avoidance: 0.35,
      emotionalRegulation: 0.7,
    },
    category: "行为模式",
  },
  {
    id: 29,
    text: "我不在乎规则和规范，我想做什么就做什么",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.0,
      sensitivity: -0.2,
      selfEsteem: -0.2,
      dependency: 0.05,
      avoidance: 0.0,
      emotionalRegulation: 0.5,
    },
    category: "行为模式",
  },
  {
    id: 30,
    text: "当我感到被忽视时，会用夸张的方式吸引注意",
    reverseScored: false,
    weights: {
      socialAnxiety: 0.3,
      sensitivity: 0.5,
      selfEsteem: 0.4,
      dependency: 0.75,
      avoidance: -0.1,
      emotionalRegulation: 0.6,
    },
    category: "人际关系",
  },
];

export function getQuestionById(id: number): Question | undefined {
  return questions.find((q) => q.id === id);
}

export const QUESTION_CATEGORIES = [
  "社交情境",
  "自我认知",
  "情绪反应",
  "行为模式",
  "人际关系",
];

export const TOTAL_QUESTIONS = questions.length;
