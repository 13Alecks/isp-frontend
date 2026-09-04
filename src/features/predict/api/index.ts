import { useMutation, useQuery } from "@tanstack/react-query";
import type { PredictionPayload, PredictionResponse, PredictionHistory } from "@/features/predict/types";

async function predictPerformance(payload: PredictionPayload): Promise<PredictionResponse> {
  const response = await fetch("/api/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to predict performance");
  }

  return response.json();
}

export function usePredict() {
  return useMutation({
    mutationFn: predictPerformance,
  });
}

async function fetchPredictionHistory(): Promise<PredictionHistory[]> {
  // Mock data for now - replace with actual API call
  return [
    {
      id: "1",
      studentName: "John Smith",
      studentId: "1",
      predictedPerformance: "High",
      date: "2026-08-15"
    },
    {
      id: "2",
      studentName: "Emma Johnson",
      studentId: "2",
      predictedPerformance: "Average",
      date: "2026-08-14"
    },
    {
      id: "3",
      studentName: "Michael Brown",
      studentId: "3",
      predictedPerformance: "Low",
      date: "2026-08-13"
    },
    {
      id: "4",
      studentName: "Sarah Davis",
      studentId: "4",
      predictedPerformance: "High",
      date: "2026-08-12"
    },
    {
      id: "5",
      studentName: "James Wilson",
      studentId: "5",
      predictedPerformance: "Average",
      date: "2026-08-11"
    }
  ];
}

export function usePredictionHistory() {
  return useQuery({
    queryKey: ["predictionHistory"],
    queryFn: fetchPredictionHistory,
    staleTime: 1000 * 60 * 5,
  });
}