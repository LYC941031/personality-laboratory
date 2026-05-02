import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { personalityTypes } from "@/../data/personalities";
import { getMdxContent } from "@/lib/mdx";
import { ArrowRight, AlertCircle, Lightbulb, Heart } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return personalityTypes.map((type) => ({ slug: type.solutionSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const type = personalityTypes.find((t) => t.solutionSlug === slug);
  if (!type) return { title: "未找到" };
  return {
    title: `${type.name}改善方案`,
    description: `针对${type.name}的行动改善指南`,
  };
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const type = personalityTypes.find((t) => t.solutionSlug === slug);

  if (!type) notFound();

  const mdxContent = await getMdxContent("solutions", slug);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-2xl p-8 sm:p-12 mb-12"
        style={{
          background: `linear-gradient(135deg, ${type.color}15, ${type.color}05)`,
          borderColor: type.color + "30",
          borderWidth: 1,
        }}
      >
        <div className="relative z-10">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-4"
            style={{ backgroundColor: type.color }}
          >
            {type.code} 改善方案
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {type.name}改善指南
          </h1>
          <p className="text-muted text-lg max-w-2xl">
            以下方案结合认知行为疗法和积极心理学，帮助你逐步改善{type.name}的核心困扰。
          </p>
        </div>
        <div
          className="absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: type.color }}
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
            {mdxContent ? (
              <article className="prose prose-gray max-w-none">
                {mdxContent.content}
              </article>
            ) : (
              <DefaultSolution type={type} />
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Tips */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">快速贴士</h3>
            </div>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• 改变需要时间，对自己有耐心</li>
              <li>• 记录每天的进步，哪怕很小</li>
              <li>• 寻找信任的人分享你的感受</li>
              <li>• 保持规律的作息和锻炼</li>
            </ul>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-amber-900">重要提示</h3>
            </div>
            <p className="text-sm text-amber-800 leading-relaxed">
              如果人格特质严重影响了你的日常生活和人际关系，建议寻求专业心理咨询师或精神科医生的帮助。
            </p>
          </div>

          {/* Link to type */}
          <Link
            href={`/types/${type.slug}`}
            className="block bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5" style={{ color: type.color }} />
              <h3 className="font-semibold text-foreground">了解{type.name}</h3>
            </div>
            <p className="text-sm text-muted mb-3">
              深入了解这种人格类型的特征、成因和表现
            </p>
            <span className="text-primary text-sm font-medium inline-flex items-center gap-1">
              查看详情 <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function DefaultSolution({ type }: { type: (typeof personalityTypes)[number] }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">改善建议</h2>
      <div className="space-y-6">
        <Step
          num={1}
          title="认识与接纳"
          description={`了解${type.name}的特征，认识到你的感受和反应方式是长期以来形成的模式，这本身不是你的错。接纳当前的自己，是改变的第一步。`}
        />
        <Step
          num={2}
          title="建立安全意识"
          description="寻找一个安全、支持性的环境或人际关系，在其中你可以逐渐练习新的行为模式，而不必担心被评判。"
        />
        <Step
          num={3}
          title="小步行动"
          description="设定小的、可控的行为目标。每次成功都是对自己的证明，帮助你积累信心。不要一步到位，改变是渐进的过程。"
        />
        <Step
          num={4}
          title="思维重塑"
          description="学习识别和挑战自动产生的负面思维。记录这些思维，问自己：这个想法是真实的吗？有什么证据支持或反对它？"
        />
        <Step
          num={5}
          title="寻求专业支持"
          description="考虑接受认知行为疗法(CBT)、辩证行为疗法(DBT)或心理动力学治疗等专业帮助。专业人士可以提供更系统的指导。"
        />
      </div>
    </div>
  );
}

function Step({
  num,
  title,
  description,
}: {
  num: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
        {num}
      </div>
      <div>
        <h4 className="font-semibold text-foreground mb-2">{title}</h4>
        <p className="text-muted text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
