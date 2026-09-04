"use client";

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/components/ui";
import type { Prediction } from "@/features/students/types";

interface PredictionsTableProps {
  predictions: Prediction[];
}

export function PredictionsTable({ predictions }: PredictionsTableProps) {
  if (predictions.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No predictions found for this student
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Predicted Performance</TableHead>
            <TableHead>Predicted Score</TableHead>
            <TableHead>Model Version</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {predictions.map((prediction) => (
            <TableRow key={prediction.id}>
              <TableCell>{prediction.date}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  prediction.predictedPerformance === "High" 
                    ? "bg-green-100 text-green-800" 
                    : prediction.predictedPerformance === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {prediction.predictedPerformance}
                </span>
              </TableCell>
              <TableCell>{prediction.predictedScore}</TableCell>
              <TableCell className="text-muted-foreground">{prediction.modelVersion}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}