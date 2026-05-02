import Link from "next/link";
import { personalityTypes } from "@/../data/personalities";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import { ArrowRight } from "lucide-react";

export default function SolutionsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <FadeIn>
        <SectionHeading
          pretitle="Solutions"
          title="人格改善方案"
          description="针对每种人格类型，我们提供分步骤的行动改善指南"
          className="mb-16"
        />
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {personalityTypes.map((type, i) => (
          <FadeIn key={type.slug} delay={i * 0.08}>
            <Link
              href={`/solutions/${type.solutionSlug}`}
              className="block group"
            >
              <div
                className="relative bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: type.color }}
                />
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: type.color + "15",
                      color: type.color,
                    }}
                  >
                    {type.code}
                  </span>
                  <h3 className="font-bold text-foreground">{type.name}</h3>
                </div>
                <p className="text-sm text-muted mb-4 leading-relaxed">
                  {type.tagline}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  查看改善方案
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
