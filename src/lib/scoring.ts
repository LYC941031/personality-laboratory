import { questions, getQuestionById } from "@/../data/questions";
import { personalityTypes } from "@/../data/personalities";
import { DIMENSION_KEYS, type DimensionKey } from "@/../data/dimensions";
import type { TestResult } from "@/store/test-store";

function cosineSimilarity(
  a: Record<string, number>,
  b: Record<string, number>
): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (const k of Object.keys(a)) {
    dot += a[k] * (b[k] || 0);
    normA += a[k] * a[k];
    normB += (b[k] || 0) * (b[k] || 0);
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function euclideanSimilarity(
  a: Record<string, number>,
  b: Record<string, number>
): number {
  const keys = Object.keys(a);
  let sumSq = 0;
  for (const k of keys) {
    const diff = a[k] - (b[k] || 0);
    sumSq += diff * diff;
  }
  const maxDist = Math.sqrt(keys.length);
  return 1 - Math.sqrt(sumSq) / maxDist;
}

function combinedSimilarity(
  a: Record<string, number>,
  b: Record<string, number>
): number {
  const cos = cosineSimilarity(a, b);
  const euc = euclideanSimilarity(a, b);
  return cos * 0.4 + euc * 0.6;
}

export function calculateResult(
  answers: Record<number, number>,
  startedAt: string
): TestResult {
  const dimensionTotals: Record<DimensionKey, number> = {
    socialAnxiety: 0,
    sensitivity: 0,
    selfEsteem: 0,
    dependency: 0,
    avoidance: 0,
    emotionalRegulation: 0,
  };
  const dimensionWeights: Record<DimensionKey, number> = {
    socialAnxiety: 0,
    sensitivity: 0,
    selfEsteem: 0,
    dependency: 0,
    avoidance: 0,
    emotionalRegulation: 0,
  };

  for (const [qIdStr, score] of Object.entries(answers)) {
    const qId = Number(qIdStr);
    const question = getQuestionById(qId);
    if (!question) continue;

    const effectiveScore = question.reverseScored ? 6 - score : score;
    const normalized = (effectiveScore - 1) / 4;

    for (const dim of DIMENSION_KEYS) {
      const w = question.weights[dim];
      if (w !== 0) {
        dimensionTotals[dim] += normalized * Math.abs(w);
        dimensionWeights[dim] += Math.abs(w);
      }
    }
  }

  const dimensionScores = {} as Record<DimensionKey, number>;
  for (const dim of DIMENSION_KEYS) {
    dimensionScores[dim] =
      dimensionWeights[dim] > 0
        ? Math.round((dimensionTotals[dim] / dimensionWeights[dim]) * 100) / 100
        : 0;
  }

  const matchScores: Record<string, number> = {};
  for (const type of personalityTypes) {
    matchScores[type.slug] =
      Math.round(combinedSimilarity(dimensionScores, type.dimensions) * 1000) /
      1000;
  }

  const sorted = Object.entries(matchScores).sort(
    ([, a], [, b]) => b - a
  );

  const timeSpent = Math.floor(
    (Date.now() - new Date(startedAt).getTime()) / 1000
  );

  return {
    dimensionScores,
    primaryType: sorted[0][0],
    secondaryType: sorted[1][0],
    matchScores,
    confidence: Math.round((sorted[0][1] - sorted[1][1]) * 1000) / 1000,
    completedAt: new Date().toISOString(),
    timeSpent,
    questionCount: Object.keys(answers).length,
  };
}
