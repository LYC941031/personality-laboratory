"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/../data/questions";
import { cn } from "@/lib/utils";

const likertOptions = [
  { value: 1, label: "完全不符合" },
  { value: 2, label: "比较不符合" },
  { value: 3, label: "不确定" },
  { value: 4, label: "比较符合" },
  { value: 5, label: "完全符合" },
];

interface QuestionCardProps {
  question: Question;
  selectedValue: number | null;
  onSelect: (questionId: number, score: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionCard({
  question,
  selectedValue,
  onSelect,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted uppercase tracking-wider">
            {question.category}
          </span>
          <span className="text-xs text-muted">
            {questionNumber} / {totalQuestions}
          </span>
        </div>

        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${((questionNumber - 1) / totalQuestions) * 100}%`,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="mb-10"
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground text-center leading-relaxed">
            {question.text}
          </h3>
        </motion.div>
      </AnimatePresence>

      <div className="space-y-2.5">
        {likertOptions.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <motion.button
              key={option.value}
              onClick={() => onSelect(question.id, option.value)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all duration-200",
                "hover:border-primary/40 hover:bg-primary/5",
                isSelected
                  ? "border-primary bg-primary/5 text-primary font-medium shadow-sm"
                  : "border-gray-100 text-foreground bg-white"
              )}
            >
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-gray-300"
                  )}
                >
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-white"
                    />
                  )}
                </span>
                <span>{option.label}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
