export interface Book {
  slug: string;
  title: string;
  author: string;
  coverColor: string;
  summary: string;
  relatedTypes: string[];
  tags: string[];
}

export const books: Book[] = [
  {
    slug: "avoidant-cure",
    title: "回避型人格的自我疗愈",
    author: "马丁·安东尼 / 理查德·斯文森",
    coverColor: "#7C3AED",
    summary:
      "专门针对回避型人格障碍的自助指南，基于认知行为疗法(CBT)，提供系统的社交焦虑缓解方案。",
    relatedTypes: ["avoidant", "schizoid"],
    tags: ["认知行为疗法", "自助", "社交焦虑"],
  },
  {
    slug: "shyness-social-anxiety",
    title: "害羞与社交焦虑症",
    author: "林恩·亨德森",
    coverColor: "#6C5CE7",
    summary:
      "系统介绍社交焦虑的成因与治疗方法，包含实用的社交技能训练和暴露练习方案。",
    relatedTypes: ["avoidant", "schizoid"],
    tags: ["社交焦虑", "认知行为疗法", "暴露治疗"],
  },
  {
    slug: "self-compassion",
    title: "自我关怀的力量",
    author: "克里斯汀·内夫",
    coverColor: "#EC4899",
    summary:
      "探讨如何培养对自己的善意和接纳，尤其适合自尊水平较低、对自己过于苛刻的读者。",
    relatedTypes: ["avoidant", "borderline", "dependent"],
    tags: ["自我关怀", "自尊", "正念"],
  },
  {
    slug: "dbt-skills",
    title: "DBT情绪调节手册",
    author: "玛莎·莱恩汉",
    coverColor: "#EC4899",
    summary:
      "辩证行为疗法(DBT)创始人亲著，提供系统的情绪调节、痛苦耐受和人际效能技能训练。",
    relatedTypes: ["borderline", "histrionic"],
    tags: ["辩证行为疗法", "情绪调节", "自助"],
  },
  {
    slug: "stop-walking-eggshells",
    title: "不再如履薄冰",
    author: "保罗·梅森 / 兰迪·克莱格",
    coverColor: "#EC4899",
    summary:
      "帮助边缘型人格障碍患者及其家属理解BPD，提供切实可行的应对策略和边界设置方法。",
    relatedTypes: ["borderline"],
    tags: ["边缘型人格", "家庭关系", "边界"],
  },
  {
    slug: "borderline-mother",
    title: "边缘型母亲",
    author: "克里斯汀·安·劳森",
    coverColor: "#EC4899",
    summary:
      "专门探讨由边缘型人格障碍母亲抚养长大的经历及其影响，提供疗愈与重建的路径。",
    relatedTypes: ["borderline", "dependent"],
    tags: ["边缘型人格", "原生家庭", "创伤疗愈"],
  },
  {
    slug: "codependent-no-more",
    title: "不再依赖",
    author: "梅洛迪·贝蒂",
    coverColor: "#F59E0B",
    summary:
      "经典的共依赖康复指南，帮助读者认识到过度依赖的模式，学会为自己而活。",
    relatedTypes: ["dependent", "histrionic"],
    tags: ["共依赖", "独立", "康复"],
  },
  {
    slug: "boundaries",
    title: "界限：何时说是，如何说不",
    author: "亨利·克劳德 / 约翰·汤森德",
    coverColor: "#F59E0B",
    summary:
      "教导如何建立和维护健康的人际边界，特别适合过度顺从、难以拒绝他人的读者。",
    relatedTypes: ["dependent", "avoidant"],
    tags: ["边界", "人际关系", "自我成长"],
  },
  {
    slug: "assertiveness-workbook",
    title: "果敢力训练手册",
    author: "兰迪·帕特森",
    coverColor: "#F59E0B",
    summary:
      "提供系统的自信训练，帮助读者学会在不伤害他人的前提下坚定表达自己的需求。",
    relatedTypes: ["dependent", "avoidant"],
    tags: ["果敢力", "自信", "沟通"],
  },
  {
    slug: "too-perfect",
    title: "过于完美：当完美主义变成困扰",
    author: "马丁·安东尼",
    coverColor: "#3B82F6",
    summary:
      "深入剖析完美主义的根源，提供接受「足够好」的实用策略，减轻强迫型人格的心理负担。",
    relatedTypes: ["obsessive"],
    tags: ["完美主义", "认知行为疗法", "强迫型人格"],
  },
  {
    slug: "mindfulness-ocd",
    title: "正念与强迫症",
    author: "乔恩·赫什菲尔德",
    coverColor: "#3B82F6",
    summary:
      "结合正念冥想和认知行为疗法，帮助读者减少强迫思维和行为带来的痛苦。",
    relatedTypes: ["obsessive", "avoidant"],
    tags: ["正念", "强迫症", "认知行为疗法"],
  },
  {
    slug: "perfectionism-trap",
    title: "完美主义陷阱",
    author: "托马斯·库伦",
    coverColor: "#3B82F6",
    summary:
      "揭示现代社会完美主义盛行的根源，帮助读者认识并摆脱「不够好」的内在声音。",
    relatedTypes: ["obsessive"],
    tags: ["完美主义", "社会心理学", "自我接纳"],
  },
  {
    slug: "trust-after-trauma",
    title: "在创伤后学会信任",
    author: "阿弗洛蒂·马瑟",
    coverColor: "#EF4444",
    summary:
      "帮助经历过创伤的读者重建对他人的信任，减少过度警惕和偏执倾向。",
    relatedTypes: ["paranoid", "avoidant"],
    tags: ["创伤疗愈", "信任", "PTSD"],
  },
  {
    slug: "cbt-paranoia",
    title: "认知行为疗法治疗偏执",
    author: "丹尼尔·弗里曼",
    coverColor: "#EF4444",
    summary:
      "专门针对偏执思维开发的CBT治疗方案，包含大量练习和工作表。",
    relatedTypes: ["paranoid"],
    tags: ["偏执", "认知行为疗法", "思维矫正"],
  },
  {
    slug: "feeling-good",
    title: "伯恩斯新情绪疗法",
    author: "大卫·伯恩斯",
    coverColor: "#EF4444",
    summary:
      "畅销数十年的经典自助读物，基于认知行为疗法，提供对抗负面思维的实用技巧。",
    relatedTypes: ["paranoid", "avoidant", "borderline", "dependent", "obsessive"],
    tags: ["认知行为疗法", "抑郁", "焦虑", "经典"],
  },
  {
    slug: "drama-of-gifted-child",
    title: "天才儿童的悲剧",
    author: "爱丽丝·米勒",
    coverColor: "#10B981",
    summary:
      "探讨童年情感需求未被满足对成年后人格的影响，理解表演型行为背后的深层需求。",
    relatedTypes: ["histrionic", "borderline", "narcissistic"],
    tags: ["童年创伤", "精神分析", "自我探索"],
  },
  {
    slug: "emotional-intelligence",
    title: "情商：为什么情商比智商更重要",
    author: "丹尼尔·戈尔曼",
    coverColor: "#10B981",
    summary:
      "全面介绍情商的概念与重要性，帮助读者认识和调节自己的情绪。",
    relatedTypes: ["histrionic", "borderline", "narcissistic"],
    tags: ["情商", "情绪管理", "自我认知"],
  },
  {
    slug: "attached",
    title: "依附：亲密关系中的科学",
    author: "阿米尔·列文 / 蕾切尔·海勒",
    coverColor: "#10B981",
    summary:
      "基于依恋理论，帮助读者理解亲密关系中的行为模式及其根源。",
    relatedTypes: ["histrionic", "dependent", "borderline", "avoidant"],
    tags: ["依恋理论", "亲密关系", "成人依恋"],
  },
  {
    slug: "loneliness",
    title: "孤独：人类社交需求的科学",
    author: "约翰·卡乔波",
    coverColor: "#8B5CF6",
    summary:
      "深入探讨孤独感的神经科学基础，帮助理解社交疏离的心理机制及其健康影响。",
    relatedTypes: ["schizoid", "avoidant"],
    tags: ["孤独", "神经科学", "社交"],
  },
  {
    slug: "introvert-power",
    title: "内向者的优势",
    author: "玛蒂·奥尔森·莱尼",
    coverColor: "#8B5CF6",
    summary:
      "帮助内向者认识自己的优势，在以外向为主流的社会中找到舒适的生活和工作方式。",
    relatedTypes: ["schizoid", "avoidant"],
    tags: ["内向", "自我接纳", "社会科学"],
  },
  {
    slug: "social-intelligence",
    title: "社交智能",
    author: "丹尼尔·戈尔曼",
    coverColor: "#8B5CF6",
    summary:
      "探讨人类社交互动背后的脑科学机制，帮助理解并改善人际关系质量。",
    relatedTypes: ["schizoid", "avoidant", "paranoid"],
    tags: ["社交智能", "神经科学", "人际关系"],
  },
  {
    slug: "narcissism-epidemic",
    title: "自恋时代",
    author: "简·腾格 / 基思·坎贝尔",
    coverColor: "#F97316",
    summary:
      "分析当代社会中自恋文化蔓延的原因和影响，提供认识和控制自恋倾向的视角。",
    relatedTypes: ["narcissistic", "histrionic"],
    tags: ["自恋", "社会心理学", "文化批评"],
  },
  {
    slug: "disarming-narcissist",
    title: "如何与自恋者相处",
    author: "温迪·贝哈里",
    coverColor: "#F97316",
    summary:
      "提供与自恋型人格相处的实用策略，同时帮助自恋者本人认识自身问题。",
    relatedTypes: ["narcissistic"],
    tags: ["自恋型人格", "人际关系", "沟通"],
  },
  {
    slug: "empathy-effect",
    title: "共情的力量",
    author: "海伦·里斯",
    coverColor: "#F97316",
    summary:
      "基于神经科学研究，展示共情如何改善人际关系，并提供共情能力的训练方法。",
    relatedTypes: ["narcissistic", "antisocial", "schizoid"],
    tags: ["共情", "神经科学", "人际训练"],
  },
  {
    slug: "without-conscience",
    title: "没有良知",
    author: "罗伯特·黑尔",
    coverColor: "#6B7280",
    summary:
      "精神变态研究领域的经典著作，帮助读者理解和识别反社会人格的特征。",
    relatedTypes: ["antisocial"],
    tags: ["反社会人格", "精神变态", "心理学经典"],
  },
  {
    slug: "sociopath-next-door",
    title: "隔壁的反社会者",
    author: "玛莎·斯图特",
    coverColor: "#6B7280",
    summary:
      "揭示日常生活中反社会人格者的行为和思维模式，帮助识别和保护自己。",
    relatedTypes: ["antisocial", "narcissistic"],
    tags: ["反社会人格", "自我保护", "识别"],
  },
  {
    slug: "psychopath-inside",
    title: "内在的精神变态",
    author: "詹姆斯·法伦",
    coverColor: "#6B7280",
    summary:
      "一位神经科学家发现自己的大脑扫描图与精神变态者高度相似后的自述与探索。",
    relatedTypes: ["antisocial"],
    tags: ["精神变态", "神经科学", "自传"],
  },
];

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

export function getBooksByType(typeSlug: string): Book[] {
  return books.filter((b) => b.relatedTypes.includes(typeSlug));
}
