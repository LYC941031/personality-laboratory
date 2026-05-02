import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  getPersonalityBySlug,
  getRelatedTypes,
  personalityTypes,
} from "@/../data/personalities";
import { getBooksByType } from "@/../data/books";
import { getMdxContent } from "@/lib/mdx";
import { TypeHero } from "@/components/type/type-hero";
import { TypeCard } from "@/components/type/type-card";
import { BookCard } from "@/components/mdx/book-card";
import { ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return personalityTypes.map((type) => ({ slug: type.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const type = getPersonalityBySlug(slug);
  if (!type) return { title: "未找到" };
  return {
    title: type.name,
    description: type.summary,
  };
}

export default async function TypeDetailPage({ params }: Props) {
  const { slug } = await params;
  const type = getPersonalityBySlug(slug);

  if (!type) notFound();

  const mdxContent = await getMdxContent("types", slug);
  const relatedTypes = getRelatedTypes(slug);
  const books = getBooksByType(slug);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <TypeHero type={type} />

      {/* MDX Content */}
      {mdxContent && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 mb-12">
          <article className="prose prose-gray max-w-none">
            {mdxContent.content}
          </article>
        </div>
      )}

      {!mdxContent && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 mb-12">
          <h2 className="text-xl font-bold text-foreground mb-4">详细介绍</h2>
          <p className="text-muted leading-relaxed">{type.summary}</p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3">核心特征</h3>
              <ul className="space-y-2 text-sm text-muted">
                {Object.entries(type.dimensions)
                  .filter(([, v]) => v > 0.6)
                  .map(([key]) => (
                    <li key={key} className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      {getTraitLabel(key, true)}
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">相对优势</h3>
              <ul className="space-y-2 text-sm text-muted">
                {Object.entries(type.dimensions)
                  .filter(([, v]) => v < 0.4)
                  .map(([key]) => (
                    <li key={key} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      {getTraitLabel(key, false)}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Related Books */}
      {books.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">相关书籍</h2>
            <Link
              href="/books"
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {books.slice(0, 3).map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>
        </div>
      )}

      {/* Solution Link */}
      <div className="mb-12">
        <Link
          href={`/solutions/${type.solutionSlug}`}
          className="block bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">查看改善方案</h2>
              <p className="text-white/80 text-sm">
                获取针对{type.name}的行动改善建议
              </p>
            </div>
            <ArrowRight className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Related Types */}
      {relatedTypes.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-6">
            相关人格类型
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTypes.map((t, i) => (
              <TypeCard key={t.slug} type={t} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getTraitLabel(key: string, isHigh: boolean): string {
  const map: Record<string, [string, string]> = {
    socialAnxiety: ["高度社交焦虑", "较低的社交焦虑"],
    sensitivity: ["高度敏感", "较低的敏感度"],
    selfEsteem: ["较低的自尊水平", "较高的自尊水平"],
    dependency: ["高度的情感依赖", "较低的依赖性"],
    avoidance: ["明显的回避行为", "较低的回避倾向"],
    emotionalRegulation: ["情绪调节困难", "较好的情绪调节能力"],
  };
  const pair = map[key];
  return pair ? (isHigh ? pair[0] : pair[1]) : key;
}
