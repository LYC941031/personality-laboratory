"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTestStore } from "@/store/test-store";
import { questions, TOTAL_QUESTIONS } from "@/../data/questions";
import { calculateResult } from "@/lib/scoring";
import { QuestionCard } from "@/components/test/question-card";

export default function QuizPage() {
  const router = useRouter();
  const { step, answers, setAnswer, setResult, startedAt, startQuiz } =
    useTestStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Redirect if not in quiz step
  useEffect(() => {
    if (step !== "quiz") {
      startQuiz();
      setCurrentIndex(0);
    }
  }, [step, startQuiz]);

  const currentQuestion = questions[currentIndex];
  const selectedValue = answers[currentQuestion?.id] ?? null;
  const isLastQuestion = currentIndex === TOTAL_QUESTIONS - 1;
  const canProceed = selectedValue !== null;

  const handleSelect = useCallback(
    (questionId: number, score: number) => {
      setAnswer(questionId, score);
    },
    [setAnswer]
  );

  const goNext = useCallback(() => {
    if (isLastQuestion && canProceed && startedAt) {
      try {
        // Use getState() to always get the latest answers
        const latestAnswers = useTestStore.getState().answers;
        const result = calculateResult(latestAnswers, startedAt);
        setResult(result);
        sessionStorage.setItem("test-result", JSON.stringify(result));
        router.push("/test/result");
      } catch (err) {
        console.error("计算结果出错:", err);
      }
    } else if (currentIndex < TOTAL_QUESTIONS - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [
    isLastQuestion,
    canProceed,
    startedAt,
    currentIndex,
    setResult,
    router,
  ]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight" || e.key === "Enter") goNext();
      if (e.key >= "1" && e.key <= "5") {
        handleSelect(currentQuestion.id, parseInt(e.key));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext, handleSelect, currentQuestion.id]);

  if (!currentQuestion) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-muted">加载题目中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col justify-center py-8 sm:py-12">
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6">
        <QuestionCard
          question={currentQuestion}
          selectedValue={selectedValue}
          onSelect={handleSelect}
          questionNumber={currentIndex + 1}
          totalQuestions={TOTAL_QUESTIONS}
        />

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mt-8"
        >
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            上一题
          </button>

          <span className="text-xs text-muted">
            键盘 1-5 快捷选择 · 方向键切换
          </span>

          <button
            onClick={goNext}
            disabled={!canProceed}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-full text-sm transition-all"
          >
            {isLastQuestion ? "查看结果" : "下一题"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
