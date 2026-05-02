"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PersonalityType } from "@/../data/personalities";
import { ArrowRight } from "lucide-react";

interface TypeCardProps {
  type: PersonalityType;
  index: number;
}

export function TypeCard({ type, index }: TypeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={`/types/${type.slug}`} className="block group">
        <div className="relative bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: type.color }}
          />

          <div className="flex items-start justify-between mb-4">
            <div>
              <span
                className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-2"
                style={{
                  backgroundColor: type.color + "15",
                  color: type.color,
                }}
              >
                {type.code}
              </span>
              <h3 className="text-lg font-bold text-foreground">{type.name}</h3>
              <p className="text-xs text-muted mt-0.5">{type.nameEn}</p>
            </div>
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: type.color + "10" }}
              whileHover={{ x: 2 }}
            >
              <ArrowRight className="w-4 h-4" style={{ color: type.color }} />
            </motion.div>
          </div>

          <p className="text-sm text-muted leading-relaxed mb-3">
            {type.tagline}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {Object.entries(type.dimensions)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([key, value]) => (
                <span
                  key={key}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-50 text-muted"
                >
                  {getDimShortLabel(key)} {(value * 100).toFixed(0)}%
                </span>
              ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function getDimShortLabel(key: string): string {
  const map: Record<string, string> = {
    socialAnxiety: "社交焦虑",
    sensitivity: "敏感度",
    selfEsteem: "自尊",
    dependency: "依赖",
    avoidance: "回避",
    emotionalRegulation: "情绪调节",
  };
  return map[key] || key;
}
