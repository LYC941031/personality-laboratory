"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Lightbulb,
  RotateCcw,
  Clock,
  Target,
  AlertCircle,
  Download,
} from "lucide-react";
import { useTestStore, type TestResult } from "@/store/test-store";
import { getPersonalityBySlug } from "@/../data/personalities";
import { DIMENSIONS } from "@/../data/dimensions";
import { getBooksByType } from "@/../data/books";
import { formatTime } from "@/lib/utils";
import { ResultRadarChart, DimensionBars } from "@/components/test/result-chart";
import { DimensionBar } from "@/components/type/dimension-bar";
import { BookCard } from "@/components/mdx/book-card";
import { PersonalityPortrait, downloadPortrait } from "@/components/result/personality-portrait";

function getResult(): TestResult | null {
  // Check sessionStorage first (synchronous, no hydration issues)
  try {
    const stored = sessionStorage.getItem("test-result");
    if (stored) {
      return JSON.parse(stored) as TestResult;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

export default function ResultPage() {
  const { result: storeResult, reset } = useTestStore();
  const result = storeResult || getResult();

  if (!result) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-amber-800 mb-2">
            暂无测试结果
          </h2>
          <p className="text-sm text-amber-600 mb-6">
            请先完成人格测试以查看结果
          </p>
          <Link
            href="/test"
            className="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-full hover:bg-primary-dark transition-colors"
          >
            开始测试
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const personality = getPersonalityBySlug(result.primaryType);
  const secondary = getPersonalityBySlug(result.secondaryType);
  const books = personality ? getBooksByType(personality.slug).slice(0, 3) : [];
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Result Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {personality && (
          <div
            className="relative overflow-hidden rounded-3xl p-8 sm:p-12 mb-12"
            style={{
              background: `linear-gradient(135deg, ${personality.color}18, ${personality.color}08)`,
              borderColor: personality.color + "30",
              borderWidth: 1,
            }}
          >
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Left: Text content */}
              <div className="flex-1 text-center lg:text-left">
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-4"
                  style={{ backgroundColor: personality.color }}
                >
                  {personality.code}
                </span>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                  {personality.name}
                </h1>

                <p
                  className="text-xl sm:text-2xl font-medium mb-4"
                  style={{ color: personality.color }}
                >
                  「{personality.tagline}」
                </p>

                <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    用时 {formatTime(result.timeSpent)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    置信度 {confidencePercent}%
                  </span>
                </div>

                {secondary && secondary.slug !== personality.slug && (
                  <p className="mt-4 text-sm text-muted">
                    你可能还具有{" "}
                    <Link
                      href={`/types/${secondary.slug}`}
                      className="font-medium underline"
                      style={{ color: secondary.color }}
                    >
                      {secondary.name}
                    </Link>{" "}
                    的某些特质
                  </p>
                )}
              </div>

              {/* Right: Portrait */}
              <div className="flex-shrink-0 flex flex-col items-center gap-3">
                <PersonalityPortrait
                  dimensionScores={result.dimensionScores}
                  primaryType={result.primaryType}
                  secondaryType={result.secondaryType}
                  confidence={result.confidence}
                  size={240}
                />
                <button
                  onClick={() => {
                    const canvas = document.querySelector(
                      '[aria-label="人格抽象画像"]'
                    ) as HTMLCanvasElement | null;
                    if (canvas) {
                      const typeName = personality?.name ?? "personality";
                      downloadPortrait(canvas, `${typeName}-portrait.png`);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-colors hover:bg-white/50"
                  style={{
                    color: personality.color,
                    borderColor: personality.color + "40",
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                  保存画像
                </button>
              </div>
            </div>

            <div
              className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10"
              style={{ backgroundColor: personality.color }}
            />
            <div
              className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full opacity-5"
              style={{ backgroundColor: personality.color }}
            />
          </div>
        )}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-gray-100"
        >
          <h3 className="font-semibold text-foreground mb-4">
            维度对比 · 你 vs {personality?.name}典型画像
          </h3>
          <ResultRadarChart
            dimensionScores={result.dimensionScores}
            primaryType={result.primaryType}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-gray-100"
        >
          <h3 className="font-semibold text-foreground mb-4">各维度得分</h3>
          <DimensionBars dimensionScores={result.dimensionScores} />
        </motion.div>
      </div>

      {/* Detailed Dimension Breakdown */}
      {personality && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 mb-12"
        >
          <h3 className="font-semibold text-foreground mb-6">维度详解</h3>
          <div className="space-y-6">
            {DIMENSIONS.map((dim, i) => (
              <DimensionBar
                key={dim.key}
                dimensionKey={dim.key}
                userScore={result.dimensionScores[dim.key]}
                typicalScore={personality.dimensions[dim.key]}
                index={i}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {personality && (
          <Link href={`/types/${personality.slug}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all cursor-pointer h-full"
            >
              <Lightbulb className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-1">深入了解</h4>
              <p className="text-sm text-muted">
                查看{personality.name}的详细介绍和成因分析
              </p>
              <span className="text-primary text-sm font-medium mt-3 inline-flex items-center gap-1">
                了解更多 <ArrowRight className="w-3 h-3" />
              </span>
            </motion.div>
          </Link>
        )}

        {personality && (
          <Link href={`/solutions/${personality.solutionSlug}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all cursor-pointer h-full"
            >
              <Lightbulb className="w-8 h-8 text-amber-500 mb-3" />
              <h4 className="font-semibold text-foreground mb-1">改善方案</h4>
              <p className="text-sm text-muted">
                获取针对性的行动改善建议
              </p>
              <span className="text-primary text-sm font-medium mt-3 inline-flex items-center gap-1">
                查看方案 <ArrowRight className="w-3 h-3" />
              </span>
            </motion.div>
          </Link>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          whileHover={{ y: -4 }}
          className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all cursor-pointer h-full"
          onClick={reset}
        >
          <RotateCcw className="w-8 h-8 text-green-500 mb-3" />
          <h4 className="font-semibold text-foreground mb-1">重新测试</h4>
          <p className="text-sm text-muted">
            如果感觉结果不太符合，可以重新测试
          </p>
          <span className="text-primary text-sm font-medium mt-3 inline-flex items-center gap-1">
            再做一次 <ArrowRight className="w-3 h-3" />
          </span>
        </motion.div>
      </div>

      {/* Related Books */}
      {books.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">推荐书籍</h3>
            <Link
              href="/books"
              className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
            >
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {books.map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
