"use client";

import { PredictionForm } from "@/features/predict/components";

export function PredictPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Predictions</h1>
        <PredictionForm />
      </div>
    </div>
  );
}