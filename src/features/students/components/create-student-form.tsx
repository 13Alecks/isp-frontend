"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  Separator,
} from "@/shared/components/ui";
import { useCreateStudent } from "@/features/students/api";
import type { CreateStudentPayload } from "@/features/students/types";

interface CreateStudentFormProps {
  onSuccess?: () => void;
}

const NUMERIC_FIELDS = new Set([
  "age",
  "attendance",
  "previousScore",
  "caScore",
  "testScore",
  "assignmentScore",
  "studyHours",
  "finalScore",
]);

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
  const [submitError, setSubmitError] = React.useState("");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.age || formData.age < 1 || formData.age > 100)
      newErrors.age = "Age must be between 1 and 100";
    if (!formData.gender) newErrors.gender = "Please select a gender";
    if (!formData.class.trim()) newErrors.class = "Class is required";
    if (formData.attendance < 0 || formData.attendance > 100)
      newErrors.attendance = "Must be between 0 and 100";
    if (formData.previousScore < 0 || formData.previousScore > 100)
      newErrors.previousScore = "Must be between 0 and 100";
    if (formData.caScore < 0 || formData.caScore > 100)
      newErrors.caScore = "Must be between 0 and 100";
    if (formData.testScore < 0 || formData.testScore > 100)
      newErrors.testScore = "Must be between 0 and 100";
    if (formData.assignmentScore < 0 || formData.assignmentScore > 100)
      newErrors.assignmentScore = "Must be between 0 and 100";
    if (formData.studyHours < 0 || formData.studyHours > 10)
      newErrors.studyHours = "Must be between 0 and 10";
    if (formData.finalScore < 0 || formData.finalScore > 100)
      newErrors.finalScore = "Must be between 0 and 100";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    try {
      await createStudent.mutateAsync(formData);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/students");
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to create student. Please try again."
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: NUMERIC_FIELDS.has(name) ? Number(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Student</CardTitle>
        <CardDescription>
          Fill in the student&apos;s information below. All fields are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- Basic Information --- */}
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-primary">
                Basic Information
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Student identity and enrollment details
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., John Smith"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={createStudent.isPending}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min={1}
                  max={100}
                  placeholder="e.g., 16"
                  value={formData.age || ""}
                  onChange={handleChange}
                  disabled={createStudent.isPending}
                />
                {errors.age && (
                  <p className="text-sm text-destructive">{errors.age}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <div className="relative">
                  <Select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={createStudent.isPending}
                  >
                    <option value="">Select gender...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                {errors.gender && (
                  <p className="text-sm text-destructive">{errors.gender}</p>
                )}
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
                {errors.class && (
                  <p className="text-sm text-destructive">{errors.class}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* --- Academic Performance --- */}
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-primary">
                Academic Performance
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Scores and study habits used for performance prediction
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendance">Attendance (%)</Label>
              <Input
                id="attendance"
                name="attendance"
                type="number"
                min={0}
                max={100}
                placeholder="0 - 100"
                value={formData.attendance || ""}
                onChange={handleChange}
                disabled={createStudent.isPending}
              />
              {errors.attendance && (
                <p className="text-sm text-destructive">{errors.attendance}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="previousScore">Previous Score</Label>
                <Input
                  id="previousScore"
                  name="previousScore"
                  type="number"
                  min={0}
                  max={100}
                  placeholder="0 - 100"
                  value={formData.previousScore || ""}
                  onChange={handleChange}
                  disabled={createStudent.isPending}
                />
                {errors.previousScore && (
                  <p className="text-sm text-destructive">
                    {errors.previousScore}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="caScore">CA Score</Label>
                <Input
                  id="caScore"
                  name="caScore"
                  type="number"
                  min={0}
                  max={100}
                  placeholder="0 - 100"
                  value={formData.caScore || ""}
                  onChange={handleChange}
                  disabled={createStudent.isPending}
                />
                {errors.caScore && (
                  <p className="text-sm text-destructive">{errors.caScore}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testScore">Test Score</Label>
                <Input
                  id="testScore"
                  name="testScore"
                  type="number"
                  min={0}
                  max={100}
                  placeholder="0 - 100"
                  value={formData.testScore || ""}
                  onChange={handleChange}
                  disabled={createStudent.isPending}
                />
                {errors.testScore && (
                  <p className="text-sm text-destructive">{errors.testScore}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignmentScore">Assignment Score</Label>
                <Input
                  id="assignmentScore"
                  name="assignmentScore"
                  type="number"
                  min={0}
                  max={100}
                  placeholder="0 - 100"
                  value={formData.assignmentScore || ""}
                  onChange={handleChange}
                  disabled={createStudent.isPending}
                />
                {errors.assignmentScore && (
                  <p className="text-sm text-destructive">
                    {errors.assignmentScore}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studyHours">Study Hours / Day</Label>
                <Input
                  id="studyHours"
                  name="studyHours"
                  type="number"
                  min={0}
                  max={10}
                  step={0.5}
                  placeholder="0 - 10"
                  value={formData.studyHours || ""}
                  onChange={handleChange}
                  disabled={createStudent.isPending}
                />
                {errors.studyHours && (
                  <p className="text-sm text-destructive">
                    {errors.studyHours}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="finalScore">Final Score</Label>
                <Input
                  id="finalScore"
                  name="finalScore"
                  type="number"
                  min={0}
                  max={100}
                  placeholder="0 - 100"
                  value={formData.finalScore || ""}
                  onChange={handleChange}
                  disabled={createStudent.isPending}
                />
                {errors.finalScore && (
                  <p className="text-sm text-destructive">
                    {errors.finalScore}
                  </p>
                )}
              </div>
            </div>
          </div>

          {submitError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {submitError}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/students")}
              disabled={createStudent.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createStudent.isPending}
            >
              {createStudent.isPending ? "Adding Student..." : "Add Student"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
