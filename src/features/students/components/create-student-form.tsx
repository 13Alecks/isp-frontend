"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label } from "@/shared/components/ui";
import { useCreateStudent } from "@/features/students/api";
import type { CreateStudentPayload } from "@/features/students/types";

interface CreateStudentFormProps {
  onSuccess?: () => void;
}

export function CreateStudentForm({ onSuccess }: CreateStudentFormProps) {
  const router = useRouter();
  const createStudent = useCreateStudent();
  const [formData, setFormData] = React.useState<CreateStudentPayload>({
    name: "",
    age: 0,
    gender: "",
    class: "",
    attendance: 0,
    previousScore: 0,
    caScore: 0,
    testScore: 0,
    assignmentScore: 0,
    studyHours: 0,
    finalScore: 0,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.age || formData.age < 0 || formData.age > 100) newErrors.age = "Age must be between 0 and 100";
    if (!formData.gender.trim()) newErrors.gender = "Gender is required";
    if (!formData.class.trim()) newErrors.class = "Class is required";
    if (formData.attendance < 0 || formData.attendance > 100) newErrors.attendance = "Attendance must be between 0 and 100";
    if (formData.previousScore < 0 || formData.previousScore > 100) newErrors.previousScore = "Previous score must be between 0 and 100";
    if (formData.caScore < 0 || formData.caScore > 100) newErrors.caScore = "CA score must be between 0 and 100";
    if (formData.testScore < 0 || formData.testScore > 100) newErrors.testScore = "Test score must be between 0 and 100";
    if (formData.assignmentScore < 0 || formData.assignmentScore > 100) newErrors.assignmentScore = "Assignment score must be between 0 and 100";
    if (formData.studyHours < 0 || formData.studyHours > 10) newErrors.studyHours = "Study hours must be between 0 and 10";
    if (formData.finalScore < 0 || formData.finalScore > 100) newErrors.finalScore = "Final score must be between 0 and 100";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await createStudent.mutateAsync(formData);
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/students");
      }
    } catch (err) {
      console.error("Failed to create student:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes("Score") || name === "age" || name === "attendance" || name === "studyHours" 
        ? Number(value) || 0 
        : value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Student</CardTitle>
        <CardDescription>Enter the student details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter student name"
                value={formData.name}
                onChange={handleChange}
                disabled={createStudent.isPending}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="0-100"
                value={formData.age || ""}
                onChange={handleChange}
                disabled={createStudent.isPending}
              />
              {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                name="gender"
                placeholder="Male/Female/Other"
                value={formData.gender}
                onChange={handleChange}
                disabled={createStudent.isPending}
              />
              {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Input
                id="class"
                name="class"
                placeholder="e.g., 10A"
                value={formData.class}
                onChange={handleChange}
                disabled={createStudent.isPending}
              />
              {errors.class && <p className="text-sm text-destructive">{errors.class}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendance">Attendance (0-100)</Label>
            <Input
              id="attendance"
              name="attendance"
              type="number"
              placeholder="0-100"
              value={formData.attendance || ""}
              onChange={handleChange}
              disabled={createStudent.isPending}
            />
            {errors.attendance && <p className="text-sm text-destructive">{errors.attendance}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="previousScore">Previous Score (0-100)</Label>
              <Input
                id="previousScore"
                name="previousScore"
                type="number"
                placeholder="0-100"
                value={formData.previousScore || ""}
                onChange={handleChange}
                disabled={createStudent.isPending}
              />
              {errors.previousScore && <p className="text-sm text-destructive">{errors.previousScore}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="caScore">CA Score (0-100)</Label>
              <Input
                id="caScore"
                name="caScore"
                type="number"
                placeholder="0-100"
                value={formData.caScore || ""}
                onChange={handleChange}
                disabled={createStudent.isPending}
              />
              {errors.caScore && <p className="text-sm text-destructive">{errors.caScore}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testScore">Test Score (0-100)</Label>
              <Input
                id="testScore"
                name="testScore"
                type="number"
                placeholder="0-100"
                value={formData.testScore || ""}
                onChange={handleChange}
                disabled={createStudent.isPending}
              />
              {errors.testScore && <p className="text-sm text-destructive">{errors.testScore}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignmentScore">Assignment Score (0-100)</Label>
              <Input
                id="assignmentScore"
                name="assignmentScore"
                type="number"
                placeholder="0-100"
                value={formData.assignmentScore || ""}
                onChange={handleChange}
                disabled={createStudent.isPending}
              />
              {errors.assignmentScore && <p className="text-sm text-destructive">{errors.assignmentScore}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studyHours">Study Hours (0-10)</Label>
              <Input
                id="studyHours"
                name="studyHours"
                type="number"
                placeholder="0-10"
                value={formData.studyHours || ""}
                onChange={handleChange}
                disabled={createStudent.isPending}
              />
              {errors.studyHours && <p className="text-sm text-destructive">{errors.studyHours}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="finalScore">Final Score (0-100)</Label>
              <Input
                id="finalScore"
                name="finalScore"
                type="number"
                placeholder="0-100"
                value={formData.finalScore || ""}
                onChange={handleChange}
                disabled={createStudent.isPending}
              />
              {errors.finalScore && <p className="text-sm text-destructive">{errors.finalScore}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={createStudent.isPending}>
            {createStudent.isPending ? "Creating Student..." : "Add Student"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}