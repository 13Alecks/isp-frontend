"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/components/ui";
import type { Student } from "@/features/students/types";

interface StudentsTableProps {
  students: Student[];
  onSearch?: (query: string) => void;
}

export function StudentsTable({ students, onSearch }: StudentsTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const filteredStudents = React.useMemo(() => {
    if (!searchQuery) return students;
    const query = searchQuery.toLowerCase();
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.class.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search students..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
        <Link href="/students/new">
          <Button>Add New Student</Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Previous Score</TableHead>
              <TableHead>Final Score</TableHead>
              <TableHead>Predicted Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow 
                  key={student.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/students/${student.id}`)}
                >
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.attendance}%</TableCell>
                  <TableCell>{student.previousScore}</TableCell>
                  <TableCell>{student.finalScore}</TableCell>
                  <TableCell>{student.lastPredictedPerformance}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}