export type PredictionPerformance = "High" | "Average" | "Low";

export interface PredictionPayload {
  studentId?: string;
  attendance: number;
  previousScore: number;
  caScore: number;
  testScore: number;
  assignmentScore: number;
  studyHours: number;
  finalScore: number;
}

export interface PredictionResponse {
  performance: PredictionPerformance;
  finalScore: number;
  confidence: number;
  features: {
    attendance: number;
    previousScore: number;
    caScore: number;
    testScore: number;
    assignmentScore: number;
    studyHours: number;
  };
}

export interface PredictionHistory {
  id: string;
  studentName: string;
  studentId: string;
  predictedPerformance: PredictionPerformance;
  date: string;
}