"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import { TypeCard } from "@/components/type/type-card";
import { personalityTypes } from "@/../data/personalities";

export default function TypesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <FadeIn>
        <SectionHeading
          pretitle="Personality Types"
          title="探索九大人格类型"
          description="每种人格类型都有其独特的思维模式、情感体验和行为方式"
          className="mb-16"
        />
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {personalityTypes.map((type, i) => (
          <TypeCard key={type.slug} type={type} index={i} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="mt-16 bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center"
      >
        <h3 className="font-semibold text-amber-800 mb-2">重要提醒</h3>
        <p className="text-sm text-amber-700 max-w-lg mx-auto leading-relaxed">
          人格类型的划分仅供参考，大多数人可能同时具备多种类型的特质。
          本测试不能替代专业心理诊断。如有心理健康方面的困扰，请寻求专业帮助。
        </p>
      </motion.div>
    </div>
  );
}
