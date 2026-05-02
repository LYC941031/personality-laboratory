import { create } from "zustand";

export interface TestResult {
  dimensionScores: {
    socialAnxiety: number;
    sensitivity: number;
    selfEsteem: number;
    dependency: number;
    avoidance: number;
    emotionalRegulation: number;
  };
  primaryType: string;
  secondaryType: string;
  matchScores: Record<string, number>;
  confidence: number;
  completedAt: string;
  timeSpent: number;
  questionCount: number;
}

export type TestStep = "intro" | "quiz" | "result";

interface TestState {
  step: TestStep;
  answers: Record<number, number>;
  result: TestResult | null;
  startedAt: string | null;
  setAnswer: (questionId: number, score: number) => void;
  setStep: (step: TestStep) => void;
  setResult: (result: TestResult) => void;
  startQuiz: () => void;
  reset: () => void;
}

export const useTestStore = create<TestState>()((set) => ({
  step: "intro",
  answers: {},
  result: null,
  startedAt: null,

  setAnswer: (questionId, score) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: score },
    })),

  setStep: (step) => set({ step }),

  setResult: (result) => set({ result, step: "result" }),

  startQuiz: () =>
    set({
      step: "quiz",
      answers: {},
      result: null,
      startedAt: new Date().toISOString(),
    }),

  reset: () =>
    set({
      step: "intro",
      answers: {},
      result: null,
      startedAt: null,
    }),
}));
