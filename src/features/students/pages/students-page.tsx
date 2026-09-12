"use client";

import * as React from "react";
import Link from "next/link";
import { Database, Plus } from "lucide-react";
import { StudentsTable } from "@/features/students/components";
import { Button } from "@/shared/components/ui";
import { useStudents, useSeedStudents } from "@/features/students/api";

export function StudentsPage() {
  const { data: students, isLoading, error } = useStudents();
  const seedStudents = useSeedStudents();
  const [seedMessage, setSeedMessage] = React.useState<string>("");

  const handleSeed = async () => {
    setSeedMessage("");
    try {
      const count = await seedStudents.mutateAsync();
      setSeedMessage(
        count > 0
          ? `Added ${count} sample students.`
          : "You already have 20 or more students."
      );
    } catch (err) {
      setSeedMessage(
        err instanceof Error ? err.message : "Failed to seed students."
      );
    }
  };

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Students</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleSeed}
              disabled={seedStudents.isPending}
            >
              <Database className="size-4" />
              {seedStudents.isPending ? "Seeding..." : "Seed Sample Data"}
            </Button>
            <Link href="/students/new">
              <Button>
                <Plus className="size-4" />
                Add Student
              </Button>
            </Link>
          </div>
        </div>

        {seedMessage && (
          <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
            {seedMessage}
          </div>
        )}

        <StudentsTable students={students || []} />
      </div>
    </div>
  );
}
