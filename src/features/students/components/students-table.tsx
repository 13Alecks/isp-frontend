"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import {
  Input,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui";
import { useDeleteStudent } from "@/features/students/api";
import type { Student } from "@/features/students/types";

interface StudentsTableProps {
  students: Student[];
  onSearch?: (query: string) => void;
}

export function StudentsTable({ students, onSearch }: StudentsTableProps) {
  const router = useRouter();
  const deleteStudent = useDeleteStudent();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [studentToDelete, setStudentToDelete] = React.useState<Student | null>(null);

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

  const handleDelete = async () => {
    if (!studentToDelete) return;
    try {
      await deleteStudent.mutateAsync(studentToDelete.id);
      setStudentToDelete(null);
    } catch (err) {
      console.error("Failed to delete student:", err);
    }
  };

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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
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
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setStudentToDelete(student);
                      }}
                      aria-label="Delete student"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!studentToDelete}
        onOpenChange={(open) => !open && setStudentToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete student?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {studentToDelete?.name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStudentToDelete(null)}
              disabled={deleteStudent.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteStudent.isPending}
            >
              {deleteStudent.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
