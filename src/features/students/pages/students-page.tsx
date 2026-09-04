"use client";

import { StudentsTable } from "@/features/students/components";
import { useStudents } from "@/features/students/api";

export function StudentsPage() {
  const { data: students, isLoading, error } = useStudents();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Students</h1>
          <p>Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Students</h1>
          <p className="text-destructive">Error loading students: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Students</h1>
        <StudentsTable students={students || []} />
      </div>
    </div>
  );
}