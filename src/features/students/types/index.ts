export interface Student {
  id: string;
  name: string;
  age: number;
  gender: string;
  class: string;
  attendance: number;
  previousScore: number;
  caScore: number;
  testScore: number;
  assignmentScore: number;
  studyHours: number;
  finalScore: number;
  lastPredictedPerformance: string;
}

export interface CreateStudentPayload {
  name: string;
  age: number;
  gender: string;
  class: string;
  attendance: number;
  previousScore: number;
  caScore: number;
  testScore: number;
  assignmentScore: number;
  studyHours: number;
  finalScore: number;
}

export interface UpdateStudentPayload {
  name: string;
  age: number;
  gender: string;
  class: string;
  attendance: number;
  previousScore: number;
  caScore: number;
  testScore: number;
  assignmentScore: number;
  studyHours: number;
  finalScore: number;
}

export interface Prediction {
  id: string;
  studentId: string;
  predictedPerformance: string;
  predictedScore: number;
  date: string;
  modelVersion: string;
}