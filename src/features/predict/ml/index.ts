/**
 * Public ML API for the predict feature.
 *
 * Lazily trains all four algorithms on first use, caches the best-performing
 * model in memory, and exposes a simple predict() function.
 */

import { trainAndCompareModels, type ModelComparison, type ModelResult } from "./models";
import { labelToString } from "./dataset";

let cachedComparison: ModelComparison | null = null;

/**
 * Get the trained model comparison (trains on first call, caches after).
 * Subsequent calls return the cached result instantly.
 */
export function getModelComparison(): ModelComparison {
  if (!cachedComparison) {
    cachedComparison = trainAndCompareModels();
  }
  return cachedComparison;
}

/**
 * Get the best-performing trained model.
 */
export function getPredictionModel(): ModelResult {
  return getModelComparison().best;
}

export interface PredictionInput {
  attendance: number;
  previousScore: number;
  caScore: number;
  testScore: number;
  assignmentScore: number;
  studyHours: number;
  finalScore: number;
}

export interface PredictionOutput {
  performance: "High" | "Average" | "Low";
  confidence: number;
  modelUsed: string;
}

/**
 * Predict student performance using the best trained ML model.
 *
 * Confidence is estimated based on how far the weighted feature score is
 * from the classification thresholds — predictions near a threshold boundary
 * have lower confidence than predictions far from boundaries.
 */
export function predict(input: PredictionInput): PredictionOutput {
  const model = getPredictionModel();

  const features = [
    input.attendance,
    input.previousScore,
    input.caScore,
    input.testScore,
    input.assignmentScore,
    input.studyHours,
    input.finalScore,
  ];

  const labelNumber = model.predict(features);
  const performance = labelToString(labelNumber);

  // Estimate confidence based on distance from the nearest threshold.
  // Weighted score uses the same logic as the dataset labeler.
  const weightedScore =
    input.attendance * 0.1 +
    input.previousScore * 0.15 +
    input.caScore * 0.15 +
    input.testScore * 0.2 +
    input.assignmentScore * 0.15 +
    input.studyHours * 5 * 0.1 +
    input.finalScore * 0.3;

  // Thresholds: 50 (Low/Average) and 70 (Average/High).
  const distToLowAvg = Math.abs(weightedScore - 50);
  const distToAvgHigh = Math.abs(weightedScore - 70);
  const minDist = Math.min(distToLowAvg, distToAvgHigh);

  // Map distance (0-30) to confidence (0.5-0.95).
  // Far from threshold → high confidence, near threshold → lower confidence.
  const confidence = Math.min(0.95, 0.5 + (minDist / 30) * 0.45);

  return {
    performance,
    confidence,
    modelUsed: model.name,
  };
}

export type { ModelComparison, ModelResult, ModelName } from "./models";
