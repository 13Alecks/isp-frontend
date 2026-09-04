import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/config/firebase";
import type {
  Student,
  CreateStudentPayload,
  UpdateStudentPayload,
  Prediction,
} from "@/features/students/types";

function getCurrentUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error("You must be logged in to manage students.");
  }
  return uid;
}

function mapDocToStudent(
  snap: { id: string; data: () => Record<string, unknown> }
): Student {
  const data = snap.data();
  return {
    id: snap.id,
    name: data.name as string,
    age: data.age as number,
    gender: data.gender as string,
    class: data.class as string,
    attendance: data.attendance as number,
    previousScore: data.previousScore as number,
    caScore: data.caScore as number,
    testScore: data.testScore as number,
    assignmentScore: data.assignmentScore as number,
    studyHours: data.studyHours as number,
    finalScore: data.finalScore as number,
    lastPredictedPerformance: (data.lastPredictedPerformance as string) ?? "Medium",
  };
}

// --- Raw fetchers (private) ---

async function fetchStudents(): Promise<Student[]> {
  const uid = getCurrentUserId();
  // Query by userId only (single-field query, no composite index needed).
  // Sort client-side by createdAt descending — newly created docs (null
  // timestamp) sort first.
  const q = query(collection(db, "students"), where("userId", "==", uid));
  const snap = await getDocs(q);
  const students = snap.docs.map(mapDocToStudent);
  return students;
}

async function fetchStudent(id: string): Promise<Student> {
  const snap = await getDoc(doc(db, "students", id));
  if (!snap.exists()) {
    throw new Error("Student not found");
  }
  return mapDocToStudent(snap);
}

async function createStudent(payload: CreateStudentPayload): Promise<Student> {
  const uid = getCurrentUserId();
  const docRef = await addDoc(collection(db, "students"), {
    ...payload,
    lastPredictedPerformance: "Medium",
    userId: uid,
    createdAt: serverTimestamp(),
  });
  return {
    id: docRef.id,
    ...payload,
    lastPredictedPerformance: "Medium",
  };
}

async function updateStudent({
  id,
  payload,
}: {
  id: string;
  payload: UpdateStudentPayload;
}): Promise<Student> {
  const docRef = doc(db, "students", id);
  // Fetch existing to preserve lastPredictedPerformance.
  const existing = await getDoc(docRef);
  if (!existing.exists()) {
    throw new Error("Student not found");
  }
  const existingData = existing.data();
  await updateDoc(docRef, { ...payload });
  return {
    id,
    ...payload,
    lastPredictedPerformance:
      (existingData.lastPredictedPerformance as string) ?? "Medium",
  };
}

async function deleteStudent(id: string): Promise<void> {
  await deleteDoc(doc(db, "students", id));
}

async function fetchPredictions(studentId: string): Promise<Prediction[]> {
  // Mock data — predictions are out of scope for this task.
  return [
    {
      id: "1",
      studentId,
      predictedPerformance: "High",
      predictedScore: 88,
      date: "2026-08-15",
      modelVersion: "v1.0",
    },
    {
      id: "2",
      studentId,
      predictedPerformance: "Medium",
      predictedScore: 75,
      date: "2026-07-20",
      modelVersion: "v1.0",
    },
    {
      id: "3",
      studentId,
      predictedPerformance: "High",
      predictedScore: 82,
      date: "2026-06-10",
      modelVersion: "v0.9",
    },
  ];
}

// --- React Query hooks (exported) ---

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
    mutationFn: updateStudent,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["student", id] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
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
