"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui";
import { CreateStudentForm } from "@/features/students/components";

export function NewStudentPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/students">
            <Button variant="outline">Back to Students</Button>
          </Link>
        </div>

        <CreateStudentForm />
      </div>
    </div>
  );
}
