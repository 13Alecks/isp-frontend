"use client";

import { PredictionsHistoryTable } from "@/features/predict/components";
import { usePredictionHistory } from "@/features/predict/api";

export function PredictionsHistoryPage() {
  const { data: predictions, isLoading, error } = usePredictionHistory();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Prediction History</h1>
          <p>Loading predictions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Prediction History</h1>
          <p className="text-destructive">Error loading predictions: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Prediction History</h1>
        <PredictionsHistoryTable predictions={predictions || []} />
      </div>
    </div>
  );
}