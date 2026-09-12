/**
 * Synthetic student dataset generator for ML training.
 *
 * Generates realistic student records with correlations between academic
 * features and performance outcomes. The data is synthetic but follows
 * realistic patterns so the trained models produce meaningful predictions.
 */

export interface StudentFeatures {
  attendance: number;
  previousScore: number;
  caScore: number;
  testScore: number;
  assignmentScore: number;
  studyHours: number;
  finalScore: number;
}

export type PerformanceLabel = 0 | 1 | 2; // 0=Low, 1=Average, 2=High

export interface TrainingSample {
  features: number[]; // Ordered: [attendance, previousScore, caScore, testScore, assignmentScore, studyHours, finalScore]
  label: PerformanceLabel;
}

export interface Dataset {
  trainX: number[][];
  trainY: number[];
  testX: number[][];
  testY: number[];
}

/** Feature order — keep consistent everywhere. */
export const FEATURE_NAMES = [
  "attendance",
  "previousScore",
  "caScore",
  "testScore",
  "assignmentScore",
  "studyHours",
  "finalScore",
] as const;

/** Deterministic PRNG (mulberry32) so the dataset is reproducible. */
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

/**
 * Generate a single synthetic student record.
 * The performance tier is derived from a weighted combination of features
 * plus noise, then thresholded into Low / Average / High.
 */
function generateStudent(rand: () => number): TrainingSample {
  // Base "ability" factor — influences all scores together (realistic correlation).
  const ability = rand(); // 0-1

  // Attendance: higher ability → higher attendance, with noise.
  const attendance = Math.round(
    Math.max(40, Math.min(100, 55 + ability * 40 + (rand() - 0.5) * 25))
  );

  // Previous score correlates with ability.
  const previousScore = Math.round(
    Math.max(20, Math.min(100, 30 + ability * 55 + (rand() - 0.5) * 25))
  );

  // CA score (continuous assessment) — correlates with attendance and ability.
  const caScore = Math.round(
    Math.max(
      20,
      Math.min(
        100,
        25 + ability * 50 + (attendance / 100) * 15 + (rand() - 0.5) * 20
      )
    )
  );

  // Test score — correlates strongly with ability.
  const testScore = Math.round(
    Math.max(15, Math.min(100, 25 + ability * 60 + (rand() - 0.5) * 25))
  );

  // Assignment score — correlates with ability and study hours.
  const studyHours = Math.round(
    Math.max(0, Math.min(10, 1 + ability * 6 + (rand() - 0.5) * 3))
  );
  const assignmentScore = Math.round(
    Math.max(
      20,
      Math.min(
        100,
        25 + ability * 50 + studyHours * 3 + (rand() - 0.5) * 20
      )
    )
  );

  // Final score — weighted combination of all above plus noise.
  const finalScore = Math.round(
    Math.max(
      10,
      Math.min(
        100,
        previousScore * 0.2 +
          caScore * 0.2 +
          testScore * 0.3 +
          assignmentScore * 0.2 +
          studyHours * 2 +
          (rand() - 0.5) * 15
      )
    )
  );

  // Derive the label from a weighted score (same features the model sees).
  const weightedScore =
    attendance * 0.1 +
    previousScore * 0.15 +
    caScore * 0.15 +
    testScore * 0.2 +
    assignmentScore * 0.15 +
    studyHours * 5 * 0.1 + // scale studyHours (0-10) to 0-50, weight 0.1
    finalScore * 0.3;

  let label: PerformanceLabel;
  if (weightedScore >= 70) {
    label = 2; // High
  } else if (weightedScore >= 50) {
    label = 1; // Average
  } else {
    label = 0; // Low
  }

  return {
    features: [
      attendance,
      previousScore,
      caScore,
      testScore,
      assignmentScore,
      studyHours,
      finalScore,
    ],
    label,
  };
}

/**
 * Generate the full dataset and split into train/test (80/20).
 * Uses a fixed seed for reproducibility.
 */
export function generateDataset(numSamples = 800, seed = 42): Dataset {
  const rand = mulberry32(seed);
  const samples: TrainingSample[] = [];

  for (let i = 0; i < numSamples; i++) {
    samples.push(generateStudent(rand));
  }

  // Shuffle with the same PRNG for reproducibility.
  for (let i = samples.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [samples[i], samples[j]] = [samples[j], samples[i]];
  }

  const splitIndex = Math.floor(samples.length * 0.8);
  const trainSamples = samples.slice(0, splitIndex);
  const testSamples = samples.slice(splitIndex);

  return {
    trainX: trainSamples.map((s) => s.features),
    trainY: trainSamples.map((s) => s.label),
    testX: testSamples.map((s) => s.features),
    testY: testSamples.map((s) => s.label),
  };
}

/** Convert label number to performance string. */
export function labelToString(label: number): "Low" | "Average" | "High" {
  if (label === 2) return "High";
  if (label === 1) return "Average";
  return "Low";
}
