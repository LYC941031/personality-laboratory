"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, BookOpen, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import { TypeCard } from "@/components/type/type-card";
import { personalityTypes } from "@/../data/personalities";

const features = [
  {
    icon: Brain,
    title: "科学评估",
    description:
      "基于心理学维度模型，通过 30 道精心设计的题目，评估你的核心人格倾向",
    color: "#6C5CE7",
  },
  {
    icon: Sparkles,
    title: "个性化洞察",
    description:
      "获取六维度得分雷达图，精确了解你在社交焦虑、自尊、情绪调节等方面的表现",
    color: "#EC4899",
  },
  {
    icon: BookOpen,
    title: "改善方案",
    description: "针对每种人格类型提供分步骤的行动改善建议和推荐书单",
    color: "#10B981",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div
          className="absolute top-20 right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.08]"
          style={{
            background:
              "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              已有 12,000+ 人完成测试
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-tight">
              了解你的
              <span className="text-primary">内在人格</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted leading-relaxed max-w-xl mx-auto">
              通过科学的心理学维度测评，深入了解自己的人格特质，
              发现成长的方向，开启自我认知之旅。
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/test">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-full text-lg transition-all shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30"
                >
                  开始免费测试
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link
                href="/types"
                className="text-muted hover:text-foreground font-medium transition-colors"
              >
                先了解人格类型 →
              </Link>
            </div>

            <p className="mt-6 text-xs text-muted">
              约 5 分钟完成 · 免费 · 无需注册
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              pretitle="How it works"
              title="三步了解你的内在人格"
              description="不要担心，这个过程简单、私密、而且完全免费"
            />
          </FadeIn>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 0.15}>
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: feature.color + "15" }}
                  >
                    <feature.icon
                      className="w-7 h-7"
                      style={{ color: feature.color }}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {feature.description}
                  </p>
                  <div
                    className="absolute top-0 right-0 w-24 h-24 opacity-[0.03]"
                    style={{ color: feature.color }}
                  >
                    <feature.icon className="w-full h-full" />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Personality Types Preview */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              pretitle="Explore"
              title="探索九种人格类型"
              description="每种人格都有其独特的思考和感受方式"
            />
          </FadeIn>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalityTypes.slice(0, 6).map((type, i) => (
              <TypeCard key={type.slug} type={type} index={i} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/types"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              查看全部 9 种人格类型
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-10 sm:p-16 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  准备好了解真正的自己了吗？
                </h2>
                <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
                  只需 5 分钟，开启你的自我认知之旅
                </p>
                <Link href="/test">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-full text-lg transition-all hover:shadow-2xl"
                  >
                    开始免费测试
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
