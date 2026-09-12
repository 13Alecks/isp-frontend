declare module "ml-logistic-regression" {
  interface LogisticRegressionModel {
    [key: string]: unknown;
  }

  export default class LogisticRegression {
    constructor(options?: { numSteps?: number; learningRate?: number });
    train(X: unknown, Y: unknown): void;
    predict(X: unknown): number[];
    toJSON(): LogisticRegressionModel;
    static load(model: LogisticRegressionModel): LogisticRegression;
  }
}

declare module "ml-knn" {
  interface KNNModel {
    [key: string]: unknown;
  }

  export default class KNN {
    constructor(
      dataset: number[][],
      labels: number[],
      options?: { k?: number; distance?: (a: number[], b: number[]) => number }
    );
    predict(dataset: number[][] | number[]): number[] | number;
    toJSON(): KNNModel;
    static load(model: KNNModel): KNN;
  }
}

declare module "ml-svm" {
  interface SVMModel {
    [key: string]: unknown;
  }

  export default class SVM {
    constructor(options?: {
      C?: number;
      tol?: number;
      maxPasses?: number;
      maxIterations?: number;
      kernel?: string;
      kernelOptions?: { sigma?: number };
    });
    train(features: number[][], labels: number[]): void;
    predict(features: number[]): number;
    supportVectors(): number[][];
    toJSON(): SVMModel;
    static load(model: SVMModel): SVM;
  }
}
