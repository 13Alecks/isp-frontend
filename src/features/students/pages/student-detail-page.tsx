"use client";

import { Button } from "@/shared/components/ui";
import Link from "next/link";
import { EditStudentForm, PredictionsTable } from "@/features/students/components";
import { useStudent, usePredictions } from "@/features/students/api";

interface StudentDetailPageProps {
  studentId: string;
}

export function StudentDetailPage({ studentId }: StudentDetailPageProps) {
  const { data: student, isLoading: studentLoading, error: studentError } = useStudent(studentId);
  const { data: predictions, isLoading: predictionsLoading } = usePredictions(studentId);

  if (studentLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/students">
              <Button variant="outline">Back to Students</Button>
            </Link>
          </div>
          <p>Loading student details...</p>
        </div>
      </div>
    );
  }

  if (studentError) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/students">
              <Button variant="outline">Back to Students</Button>
            </Link>
          </div>
          <p className="text-destructive">Error loading student: {studentError.message}</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/students">
              <Button variant="outline">Back to Students</Button>
            </Link>
          </div>
          <p>Student not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/students">
            <Button variant="outline">Back to Students</Button>
          </Link>
        </div>

        <div className="space-y-8">
          {/* Editable Student Form */}
          <EditStudentForm student={student} />

          {/* Predictions Table */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Past Predictions</h2>
            {predictionsLoading ? (
              <p>Loading predictions...</p>
            ) : (
              <PredictionsTable predictions={predictions || []} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}