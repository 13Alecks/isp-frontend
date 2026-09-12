/**
 * Client-side ML training using real Firestore student data.
 *
 * Trains all four algorithms on the user's real students, with synthetic
 * data as a supplement when there aren't enough real records. The best
 * model is cached and used for predictions — no server round-trip needed.
 */

import { RandomForestClassifier } from "ml-random-forest";
import LogisticRegression from "ml-logistic-regression";
import { Matrix } from "ml-matrix";
import KNN from "ml-knn";
import SVM from "ml-svm";
import type { Student } from "@/features/students/types";

export type ModelName = "RandomForest" | "LogisticRegression" | "KNN" | "SVM";

export interface ModelResult {
  name: ModelName;
  accuracy: number;
  predict: (features: number[]) => "High" | "Average" | "Low";
}

export interface ModelComparison {
  models: { name: ModelName; accuracy: number }[];
  best: ModelResult;
  trainingSize: number;
  realStudentCount: number;
  syntheticCount: number;
}

/** Map performance string to label number. */
function performanceToLabel(perf: string): 0 | 1 | 2 {
  if (perf === "High") return 2;
  if (perf === "Average" || perf === "Medium") return 1;
  return 0;
}

/** Map label number to performance string. */
function labelToPerformance(label: number): "High" | "Average" | "Low" {
  if (label === 2) return "High";
  if (label === 1) return "Average";
  return "Low";
}

/** Convert a Student to a feature vector + label. */
function studentToSample(student: Student): { features: number[]; label: number } {
  return {
    features: [
      student.attendance,
      student.previousScore,
      student.caScore,
      student.testScore,
      student.assignmentScore,
      student.studyHours,
      student.finalScore,
    ],
    label: performanceToLabel(student.lastPredictedPerformance),
  };
}

/** Deterministic PRNG for synthetic supplement. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Generate a synthetic student sample (for supplementing real data). */
function generateSyntheticSample(rand: () => number) {
  const ability = rand();
  const attendance = Math.round(Math.max(50, Math.min(100, 55 + ability * 40 + (rand() - 0.5) * 20)));
  const previousScore = Math.round(Math.max(20, Math.min(100, 30 + ability * 55 + (rand() - 0.5) * 20)));
  const caScore = Math.round(Math.max(20, Math.min(100, 25 + ability * 50 + (attendance / 100) * 15 + (rand() - 0.5) * 15)));
  const testScore = Math.round(Math.max(15, Math.min(100, 25 + ability * 60 + (rand() - 0.5) * 20)));
  const studyHours = Math.round(Math.max(0, Math.min(10, 1 + ability * 6 + (rand() - 0.5) * 3)));
  const assignmentScore = Math.round(Math.max(20, Math.min(100, 25 + ability * 50 + studyHours * 3 + (rand() - 0.5) * 15)));
  const finalScore = Math.round(
    Math.max(10, Math.min(100, previousScore * 0.2 + caScore * 0.2 + testScore * 0.3 + assignmentScore * 0.2 + studyHours * 2 + (rand() - 0.5) * 10))
  );

  const weightedScore =
    attendance * 0.1 + previousScore * 0.15 + caScore * 0.15 + testScore * 0.2 +
    assignmentScore * 0.15 + studyHours * 5 * 0.1 + finalScore * 0.3;

  let label: 0 | 1 | 2;
  if (weightedScore >= 70) label = 2;
  else if (weightedScore >= 50) label = 1;
  else label = 0;

  return { features: [attendance, previousScore, caScore, testScore, assignmentScore, studyHours, finalScore], label };
}

/** Compute accuracy. */
function computeAccuracy(actual: number[], predicted: number[]): number {
  let correct = 0;
  for (let i = 0; i < actual.length; i++) {
    if (actual[i] === predicted[i]) correct++;
  }
  return correct / actual.length;
}

/**
 * Build the training dataset from real students, supplemented with
 * synthetic data to reach a minimum of 50 samples.
 */
function buildDataset(realStudents: Student[]) {
  const realSamples = realStudents.map(studentToSample);

  // Supplement with synthetic data if we have fewer than 50 real students.
  const MIN_SAMPLES = 50;
  const syntheticNeeded = Math.max(0, MIN_SAMPLES - realSamples.length);
  const rand = mulberry32(42);
  const syntheticSamples = Array.from({ length: syntheticNeeded }, () =>
    generateSyntheticSample(rand)
  );

  const allSamples = [...realSamples, ...syntheticSamples];

  // Shuffle.
  for (let i = allSamples.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [allSamples[i], allSamples[j]] = [allSamples[j], allSamples[i]];
  }

  // Split 80/20 for train/test.
  const splitIndex = Math.floor(allSamples.length * 0.8);
  const train = allSamples.slice(0, splitIndex);
  const test = allSamples.slice(splitIndex);

  return {
    trainX: train.map((s) => s.features),
    trainY: train.map((s) => s.label),
    testX: test.map((s) => s.features),
    testY: test.map((s) => s.label),
    realCount: realSamples.length,
    syntheticCount: syntheticSamples.length,
    totalSize: allSamples.length,
  };
}

/** Train and evaluate all four models. */
export function trainModels(realStudents: Student[]): ModelComparison {
  const data = buildDataset(realStudents);

  const results: ModelResult[] = [];

  // 1. Random Forest
  try {
    const rf = new RandomForestClassifier({
      seed: 42,
      maxFeatures: 0.8,
      replacement: true,
      nEstimators: 25,
    });
    rf.train(data.trainX, data.trainY);
    const predictions = rf.predict(data.testX);
    results.push({
      name: "RandomForest",
      accuracy: computeAccuracy(data.testY, predictions),
      predict: (features: number[]) => labelToPerformance(rf.predict([features])[0]),
    });
  } catch {
    // Skip if training fails.
  }

  // 2. Logistic Regression
  try {
    const X = new Matrix(data.trainX);
    const Y = Matrix.columnVector(data.trainY);
    const logreg = new LogisticRegression({ numSteps: 1000, learningRate: 0.01 });
    logreg.train(X, Y);
    const Xtest = new Matrix(data.testX);
    const rawPreds = logreg.predict(Xtest);
    const predictions = rawPreds.map((p: number) => Math.round(p));
    results.push({
      name: "LogisticRegression",
      accuracy: computeAccuracy(data.testY, predictions),
      predict: (features: number[]) => labelToPerformance(Math.round(logreg.predict(new Matrix([features]))[0])),
    });
  } catch {
    // Skip if training fails.
  }

  // 3. KNN
  try {
    const knn = new KNN(data.trainX, data.trainY, { k: 5 });
    const predictions = (knn.predict(data.testX) as number[]).map((p) => Math.round(p));
    results.push({
      name: "KNN",
      accuracy: computeAccuracy(data.testY, predictions),
      predict: (features: number[]) => labelToPerformance(Math.round((knn.predict([features]) as number[])[0])),
    });
  } catch {
    // Skip if training fails.
  }

  // 4. SVM
  try {
    const svm = new SVM({
      C: 1,
      tol: 10e-4,
      maxPasses: 10,
      maxIterations: 10000,
      kernel: "rbf",
      kernelOptions: { sigma: 0.5 },
    });
    svm.train(data.trainX, data.trainY);
    const predictions = data.testX.map((row) => svm.predict(row));
    results.push({
      name: "SVM",
      accuracy: computeAccuracy(data.testY, predictions),
      predict: (features: number[]) => labelToPerformance(svm.predict(features)),
    });
  } catch {
    // Skip if training fails.
  }

  // Sort by accuracy descending.
  results.sort((a, b) => b.accuracy - a.accuracy);

  return {
    models: results.map((r) => ({ name: r.name, accuracy: r.accuracy })),
    best: results[0],
    trainingSize: data.totalSize,
    realStudentCount: data.realCount,
    syntheticCount: data.syntheticCount,
  };
}

/**
 * Predict performance using a trained model.
 */
export function predictWithModel(
  model: ModelResult,
  features: {
    attendance: number;
    previousScore: number;
    caScore: number;
    testScore: number;
    assignmentScore: number;
    studyHours: number;
    finalScore: number;
  }
): { performance: "High" | "Average" | "Low"; confidence: number; modelUsed: string } {
  const featureVector = [
    features.attendance,
    features.previousScore,
    features.caScore,
    features.testScore,
    features.assignmentScore,
    features.studyHours,
    features.finalScore,
  ];

  const performance = model.predict(featureVector);

  // Confidence based on distance from thresholds.
  const weightedScore =
    features.attendance * 0.1 +
    features.previousScore * 0.15 +
    features.caScore * 0.15 +
    features.testScore * 0.2 +
    features.assignmentScore * 0.15 +
    features.studyHours * 5 * 0.1 +
    features.finalScore * 0.3;

  const distToLowAvg = Math.abs(weightedScore - 50);
  const distToAvgHigh = Math.abs(weightedScore - 70);
  const minDist = Math.min(distToLowAvg, distToAvgHigh);
  const confidence = Math.min(0.95, 0.5 + (minDist / 30) * 0.45);

  return {
    performance,
    confidence,
    modelUsed: model.name,
  };
}
