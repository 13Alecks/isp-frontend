import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Student, CreateStudentPayload, UpdateStudentPayload, Prediction } from "@/features/students/types";

async function fetchStudents(): Promise<Student[]> {
  // Mock data for now - replace with actual API call
  return [
    {
      id: "1",
      name: "John Smith",
      age: 16,
      gender: "Male",
      class: "10A",
      attendance: 92,
      previousScore: 78,
      caScore: 80,
      testScore: 75,
      assignmentScore: 85,
      studyHours: 6,
      finalScore: 85,
      lastPredictedPerformance: "High"
    },
    {
      id: "2",
      name: "Emma Johnson",
      age: 15,
      gender: "Female",
      class: "10B",
      attendance: 88,
      previousScore: 82,
      caScore: 85,
      testScore: 80,
      assignmentScore: 82,
      studyHours: 7,
      finalScore: 79,
      lastPredictedPerformance: "Medium"
    },
    {
      id: "3",
      name: "Michael Brown",
      age: 17,
      gender: "Male",
      class: "11A",
      attendance: 75,
      previousScore: 65,
      caScore: 70,
      testScore: 68,
      assignmentScore: 72,
      studyHours: 4,
      finalScore: 70,
      lastPredictedPerformance: "Low"
    },
    {
      id: "4",
      name: "Sarah Davis",
      age: 16,
      gender: "Female",
      class: "11B",
      attendance: 95,
      previousScore: 90,
      caScore: 92,
      testScore: 88,
      assignmentScore: 95,
      studyHours: 8,
      finalScore: 92,
      lastPredictedPerformance: "High"
    },
    {
      id: "5",
      name: "James Wilson",
      age: 18,
      gender: "Male",
      class: "12A",
      attendance: 80,
      previousScore: 72,
      caScore: 75,
      testScore: 70,
      assignmentScore: 78,
      studyHours: 5,
      finalScore: 75,
      lastPredictedPerformance: "Medium"
    }
  ];
}

async function createStudent(payload: CreateStudentPayload): Promise<Student> {
  // Mock API call - replace with actual API call
  const newStudent: Student = {
    id: Math.random().toString(36).substr(2, 9),
    ...payload,
    lastPredictedPerformance: "Medium" // Default prediction
  };
  return newStudent;
}

async function fetchStudent(id: string): Promise<Student> {
  // Mock API call - replace with actual API call
  const mockStudents: Student[] = [
    {
      id: "1",
      name: "John Smith",
      age: 16,
      gender: "Male",
      class: "10A",
      attendance: 92,
      previousScore: 78,
      caScore: 80,
      testScore: 75,
      assignmentScore: 85,
      studyHours: 6,
      finalScore: 85,
      lastPredictedPerformance: "High"
    },
    {
      id: "2",
      name: "Emma Johnson",
      age: 15,
      gender: "Female",
      class: "10B",
      attendance: 88,
      previousScore: 82,
      caScore: 85,
      testScore: 80,
      assignmentScore: 82,
      studyHours: 7,
      finalScore: 79,
      lastPredictedPerformance: "Medium"
    },
    {
      id: "3",
      name: "Michael Brown",
      age: 17,
      gender: "Male",
      class: "11A",
      attendance: 75,
      previousScore: 65,
      caScore: 70,
      testScore: 68,
      assignmentScore: 72,
      studyHours: 4,
      finalScore: 70,
      lastPredictedPerformance: "Low"
    },
    {
      id: "4",
      name: "Sarah Davis",
      age: 16,
      gender: "Female",
      class: "11B",
      attendance: 95,
      previousScore: 90,
      caScore: 92,
      testScore: 88,
      assignmentScore: 95,
      studyHours: 8,
      finalScore: 92,
      lastPredictedPerformance: "High"
    },
    {
      id: "5",
      name: "James Wilson",
      age: 18,
      gender: "Male",
      class: "12A",
      attendance: 80,
      previousScore: 72,
      caScore: 75,
      testScore: 70,
      assignmentScore: 78,
      studyHours: 5,
      finalScore: 75,
      lastPredictedPerformance: "Medium"
    }
  ];
  
  const student = mockStudents.find(s => s.id === id);
  if (!student) {
    throw new Error("Student not found");
  }
  return student;
}

async function updateStudent(id: string, payload: UpdateStudentPayload): Promise<Student> {
  // Mock API call - replace with actual API call
  const updatedStudent: Student = {
    id,
    ...payload,
    lastPredictedPerformance: "Medium" // Default prediction
  };
  return updatedStudent;
}

async function fetchPredictions(studentId: string): Promise<Prediction[]> {
  // Mock API call - replace with actual API call
  return [
    {
      id: "1",
      studentId,
      predictedPerformance: "High",
      predictedScore: 88,
      date: "2026-08-15",
      modelVersion: "v1.0"
    },
    {
      id: "2",
      studentId,
      predictedPerformance: "Medium",
      predictedScore: 75,
      date: "2026-07-20",
      modelVersion: "v1.0"
    },
    {
      id: "3",
      studentId,
      predictedPerformance: "High",
      predictedScore: 82,
      date: "2026-06-10",
      modelVersion: "v0.9"
    }
  ];
}

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => fetchStudent(id),
    enabled: !!id,
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStudentPayload }) => 
      updateStudent(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["student", id] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function usePredictions(studentId: string) {
  return useQuery({
    queryKey: ["predictions", studentId],
    queryFn: () => fetchPredictions(studentId),
    enabled: !!studentId,
  });
}