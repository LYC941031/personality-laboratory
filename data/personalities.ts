export interface PersonalityType {
  slug: string;
  name: string;
  nameEn: string;
  code: string;
  tagline: string;
  color: string;
  dimensions: {
    socialAnxiety: number;
    sensitivity: number;
    selfEsteem: number;
    dependency: number;
    avoidance: number;
    emotionalRegulation: number;
  };
  summary: string;
  relatedBooks: string[];
  solutionSlug: string;
  iconUrl: string;
}

export const personalityTypes: PersonalityType[] = [
  {
    slug: "avoidant",
    name: "回避型人格",
    nameEn: "Avoidant Personality",
    code: "AVPD",
    tagline: "渴望亲密，却又害怕靠近",
    color: "#7C3AED",
    dimensions: {
      socialAnxiety: 0.85,
      sensitivity: 0.9,
      selfEsteem: 0.8,
      dependency: 0.2,
      avoidance: 0.95,
      emotionalRegulation: 0.65,
    },
    summary:
      "回避型人格的核心特征是对社交抑制、能力不足感和对负面评价极其敏感。他们渴望亲密关系，但因害怕被拒绝而主动回避社交场合。",
    relatedBooks: ["avoidant-cure", "shyness-social-anxiety", "self-compassion"],
    solutionSlug: "avoidant-plan",
    iconUrl: "/images/types/avoidant.svg",
  },
  {
    slug: "borderline",
    name: "边缘型人格",
    nameEn: "Borderline Personality",
    code: "BPD",
    tagline: "在情绪的漩涡中寻找自我",
    color: "#EC4899",
    dimensions: {
      socialAnxiety: 0.6,
      sensitivity: 0.9,
      selfEsteem: 0.7,
      dependency: 0.75,
      avoidance: 0.4,
      emotionalRegulation: 0.95,
    },
    summary:
      "边缘型人格的特征包括不稳定的人际关系、自我形象和情绪波动。他们常有强烈的被抛弃恐惧，情绪体验比常人更为剧烈和不稳定。",
    relatedBooks: ["dbt-skills", "stop-walking-eggshells", "borderline-mother"],
    solutionSlug: "borderline-plan",
    iconUrl: "/images/types/borderline.svg",
  },
  {
    slug: "dependent",
    name: "依赖型人格",
    nameEn: "Dependent Personality",
    code: "DPD",
    tagline: "把决定权交给他人的灵魂",
    color: "#F59E0B",
    dimensions: {
      socialAnxiety: 0.5,
      sensitivity: 0.7,
      selfEsteem: 0.85,
      dependency: 0.95,
      avoidance: 0.3,
      emotionalRegulation: 0.5,
    },
    summary:
      "依赖型人格的个体过度需要被照顾，导致顺从和黏着行为。他们对分离有强烈的恐惧，很难独立做出决定，需要他人反复确认和保证。",
    relatedBooks: ["codependent-no-more", "boundaries", "assertiveness-workbook"],
    solutionSlug: "dependent-plan",
    iconUrl: "/images/types/dependent.svg",
  },
  {
    slug: "obsessive",
    name: "强迫型人格",
    nameEn: "Obsessive-Compulsive Personality",
    code: "OCPD",
    tagline: "完美是唯一的及格线",
    color: "#3B82F6",
    dimensions: {
      socialAnxiety: 0.45,
      sensitivity: 0.6,
      selfEsteem: 0.5,
      dependency: 0.1,
      avoidance: 0.55,
      emotionalRegulation: 0.75,
    },
    summary:
      "强迫型人格以对秩序、完美和控制的极端关注为特征。他们可能过度专注于规则、细节和日程，以至于忽略了活动的实际目的。",
    relatedBooks: ["too-perfect", "mindfulness-ocd", "perfectionism-trap"],
    solutionSlug: "obsessive-plan",
    iconUrl: "/images/types/obsessive.svg",
  },
  {
    slug: "paranoid",
    name: "偏执型人格",
    nameEn: "Paranoid Personality",
    code: "PPD",
    tagline: "世界充满看不见的威胁",
    color: "#EF4444",
    dimensions: {
      socialAnxiety: 0.75,
      sensitivity: 0.9,
      selfEsteem: 0.35,
      dependency: 0.15,
      avoidance: 0.7,
      emotionalRegulation: 0.55,
    },
    summary:
      "偏执型人格以对他人的普遍不信任和怀疑为特征，将他人的动机解释为恶意。他们总是高度警惕，难以放松，也很难信任他人。",
    relatedBooks: ["trust-after-trauma", "cbt-paranoia", "feeling-good"],
    solutionSlug: "paranoid-plan",
    iconUrl: "/images/types/paranoid.svg",
  },
  {
    slug: "histrionic",
    name: "表演型人格",
    nameEn: "Histrionic Personality",
    code: "HPD",
    tagline: "聚光灯是我存在的证明",
    color: "#10B981",
    dimensions: {
      socialAnxiety: 0.2,
      sensitivity: 0.8,
      selfEsteem: 0.6,
      dependency: 0.8,
      avoidance: 0.1,
      emotionalRegulation: 0.8,
    },
    summary:
      "表演型人格的特征是过度的情绪化和寻求关注。他们可能通过夸张的言行、不适当地诱惑性行为来获得他人的注意。",
    relatedBooks: ["drama-of-gifted-child", "emotional-intelligence", "attached"],
    solutionSlug: "histrionic-plan",
    iconUrl: "/images/types/histrionic.svg",
  },
  {
    slug: "schizoid",
    name: "分裂型人格",
    nameEn: "Schizoid Personality",
    code: "SPD",
    tagline: "一个人的世界就很好",
    color: "#8B5CF6",
    dimensions: {
      socialAnxiety: 0.8,
      sensitivity: 0.4,
      selfEsteem: 0.4,
      dependency: 0.05,
      avoidance: 0.9,
      emotionalRegulation: 0.3,
    },
    summary:
      "分裂型人格的特征是对社会关系的疏离和情感表达的受限。他们似乎不需要亲密关系，更享受独处，对表扬或批评都显得漠不关心。",
    relatedBooks: ["loneliness", "introvert-power", "social-intelligence"],
    solutionSlug: "schizoid-plan",
    iconUrl: "/images/types/schizoid.svg",
  },
  {
    slug: "narcissistic",
    name: "自恋型人格",
    nameEn: "Narcissistic Personality",
    code: "NPD",
    tagline: "镜中的自己最完美",
    color: "#F97316",
    dimensions: {
      socialAnxiety: 0.3,
      sensitivity: 0.85,
      selfEsteem: 0.15,
      dependency: 0.5,
      avoidance: 0.25,
      emotionalRegulation: 0.7,
    },
    summary:
      "自恋型人格的特征是夸大自我重要性、需要被崇拜和缺乏共情。他们往往高估自己的能力，对批评异常敏感，难以建立真正平等的关系。",
    relatedBooks: ["narcissism-epidemic", "disarming-narcissist", "empathy-effect"],
    solutionSlug: "narcissistic-plan",
    iconUrl: "/images/types/narcissistic.svg",
  },
  {
    slug: "antisocial",
    name: "反社会型人格",
    nameEn: "Antisocial Personality",
    code: "ASPD",
    tagline: "规则是为别人准备的",
    color: "#6B7280",
    dimensions: {
      socialAnxiety: 0.1,
      sensitivity: 0.15,
      selfEsteem: 0.1,
      dependency: 0.05,
      avoidance: 0.15,
      emotionalRegulation: 0.6,
    },
    summary:
      "反社会型人格的特征是漠视和侵犯他人权利。他们可能表现出欺骗、冲动、易怒和缺乏悔意，对社会规范和他人权益缺乏基本尊重。",
    relatedBooks: ["without-conscience", "sociopath-next-door", "psychopath-inside"],
    solutionSlug: "antisocial-plan",
    iconUrl: "/images/types/antisocial.svg",
  },
];

export function getPersonalityBySlug(slug: string): PersonalityType | undefined {
  return personalityTypes.find((p) => p.slug === slug);
}

export function getRelatedTypes(slug: string): PersonalityType[] {
  const current = getPersonalityBySlug(slug);
  if (!current) return [];
  return personalityTypes
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const simA = cosineSimilarity(current.dimensions, a.dimensions);
      const simB = cosineSimilarity(current.dimensions, b.dimensions);
      return simB - simA;
    })
    .slice(0, 3);
}

function cosineSimilarity(
  a: Record<string, number>,
  b: Record<string, number>
): number {
  const keys = Object.keys(a);
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (const k of keys) {
    dot += a[k] * (b[k] || 0);
    normA += a[k] * a[k];
    normB += (b[k] || 0) * (b[k] || 0);
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
