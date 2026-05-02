"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, ArrowRight, Brain, Lock } from "lucide-react";
import { useTestStore } from "@/store/test-store";

const highlights = [
  {
    icon: Clock,
    title: "约 5 分钟",
    description: "30 道题目，快速完成",
  },
  {
    icon: ShieldCheck,
    title: "科学评估",
    description: "基于多维度人格模型",
  },
  {
    icon: Lock,
    title: "完全私密",
    description: "所有数据保存在你的设备上",
  },
];

export default function TestIntroPage() {
  const router = useRouter();
  const startQuiz = useTestStore((s) => s.startQuiz);

  const handleStart = () => {
    startQuiz();
    router.push("/test/quiz");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
          <Brain className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          人格维度测试
        </h1>

        <p className="text-lg text-muted leading-relaxed max-w-xl mx-auto mb-12">
          本测试通过 30 道题目评估你在 6 个心理学维度上的表现，
          帮助你全面了解自己的人格特质。
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {highlights.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
            className="bg-white rounded-xl p-6 border border-gray-100 text-center"
          >
            <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
            <p className="text-xs text-muted">{item.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/10 mb-10"
      >
        <h3 className="font-semibold text-foreground mb-4">测试说明</h3>
        <ul className="space-y-3 text-sm text-muted">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">1.</span>
            每道题有 5 个选项，从「完全不符合」到「完全符合」
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">2.</span>
            请根据你的真实感受作答，没有「正确」答案
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">3.</span>
            测试结果仅保存在你的设备上，完全私密
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">4.</span>
            随时可以返回上一题修改答案
          </li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleStart}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-10 py-4 rounded-full text-lg transition-all shadow-xl shadow-primary/25"
        >
          开始答题
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        <p className="mt-4 text-xs text-muted">
          共 30 题，预计 5 分钟完成
        </p>
      </motion.div>
    </div>
  );
}
