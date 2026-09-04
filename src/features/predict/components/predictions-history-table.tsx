"use client";

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/components/ui";
import type { PredictionHistory } from "@/features/predict/types";

interface PredictionsHistoryTableProps {
  predictions: PredictionHistory[];
}

export function PredictionsHistoryTable({ predictions }: PredictionsHistoryTableProps) {
  const getPerformanceBadge = (performance: string) => {
    const colors = {
      High: "bg-green-100 text-green-800",
      Average: "bg-yellow-100 text-yellow-800", 
      Low: "bg-red-100 text-red-800",
    };
    return colors[performance as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (predictions.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No predictions found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Predicted Performance</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {predictions.map((prediction) => (
            <TableRow key={prediction.id}>
              <TableCell className="font-medium">{prediction.studentName}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPerformanceBadge(prediction.predictedPerformance)}`}>
                  {prediction.predictedPerformance}
                </span>
              </TableCell>
              <TableCell>{prediction.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}