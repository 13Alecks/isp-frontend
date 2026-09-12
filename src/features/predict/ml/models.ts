/**
 * Train and evaluate all four ML algorithms on the synthetic student dataset.
 * Returns the best-performing model along with a comparison report.
 */

import { RandomForestClassifier } from "ml-random-forest";
import LogisticRegression from "ml-logistic-regression";
import { Matrix } from "ml-matrix";
import KNN from "ml-knn";
import SVM from "ml-svm";

import {
  generateDataset,
  type Dataset,
  type PerformanceLabel,
} from "./dataset";

export type ModelName = "RandomForest" | "LogisticRegression" | "KNN" | "SVM";

export interface ModelResult {
  name: ModelName;
  accuracy: number;
  predictions: number[];
  predict: (features: number[]) => PerformanceLabel;
}

export interface ModelComparison {
  models: { name: ModelName; accuracy: number }[];
  best: ModelResult;
  datasetSize: { train: number; test: number };
}

/** Compute accuracy: fraction of correct predictions. */
function computeAccuracy(actual: number[], predicted: number[]): number {
  let correct = 0;
  for (let i = 0; i < actual.length; i++) {
    if (actual[i] === predicted[i]) correct++;
  }
  return correct / actual.length;
}

/** Train and evaluate Random Forest. */
function trainRandomForest(data: Dataset): ModelResult {
  const options = {
    seed: 42,
    maxFeatures: 0.8,
    replacement: true,
    nEstimators: 25,
  };

  const classifier = new RandomForestClassifier(options);
  classifier.train(data.trainX, data.trainY);

  const predictions = classifier.predict(data.testX);
  const accuracy = computeAccuracy(data.testY, predictions);

  return {
    name: "RandomForest",
    accuracy,
    predictions,
    predict: (features: number[]) =>
      classifier.predict([features])[0] as PerformanceLabel,
  };
}

/** Train and evaluate Logistic Regression. */
function trainLogisticRegression(data: Dataset): ModelResult {
  const X = new Matrix(data.trainX);
  const Y = Matrix.columnVector(data.trainY);

  const logreg = new LogisticRegression({
    numSteps: 1000,
    learningRate: 0.01,
  });
  logreg.train(X, Y);

  const Xtest = new Matrix(data.testX);
  const rawPredictions = logreg.predict(Xtest);
  const predictions = rawPredictions.map((p: number) => Math.round(p) as number);
  const accuracy = computeAccuracy(data.testY, predictions);

  return {
    name: "LogisticRegression",
    accuracy,
    predictions,
    predict: (features: number[]) => {
      const result = logreg.predict(new Matrix([features]));
      return Math.round(result[0]) as PerformanceLabel;
    },
  };
}

/** Train and evaluate KNN. */
function trainKNN(data: Dataset): ModelResult {
  const knn = new KNN(data.trainX, data.trainY, { k: 5 });
  const predictions = (knn.predict(data.testX) as number[]).map((p) =>
    Math.round(p)
  );
  const accuracy = computeAccuracy(data.testY, predictions);

  return {
    name: "KNN",
    accuracy,
    predictions,
    predict: (features: number[]) => {
      const result = knn.predict([features]) as number[];
      return Math.round(result[0]) as PerformanceLabel;
    },
  };
}

/** Train and evaluate SVM. */
function trainSVM(data: Dataset): ModelResult {
  const options = {
    C: 1,
    tol: 10e-4,
    maxPasses: 10,
    maxIterations: 10000,
    kernel: "rbf" as const,
    kernelOptions: { sigma: 0.5 },
  };

  const svm = new SVM(options);
  svm.train(data.trainX, data.trainY);

  const predictions = data.testX.map((row) => svm.predict(row) as number);
  const accuracy = computeAccuracy(data.testY, predictions);

  return {
    name: "SVM",
    accuracy,
    predictions,
    predict: (features: number[]) =>
      svm.predict(features) as PerformanceLabel,
  };
}

/**
 * Train all four models, evaluate on the test set, and return the best one.
 */
export function trainAndCompareModels(): ModelComparison {
  const dataset = generateDataset(800, 42);

  const results: ModelResult[] = [
    trainRandomForest(dataset),
    trainLogisticRegression(dataset),
    trainKNN(dataset),
    trainSVM(dataset),
  ];

  // Sort by accuracy descending.
  results.sort((a, b) => b.accuracy - a.accuracy);

  return {
    models: results.map((r) => ({ name: r.name, accuracy: r.accuracy })),
    best: results[0],
    datasetSize: {
      train: dataset.trainX.length,
      test: dataset.testX.length,
    },
  };
}
