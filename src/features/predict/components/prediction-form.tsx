"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Badge } from "@/shared/components/ui";
import { usePredict } from "@/features/predict/api";
import { useStudents } from "@/features/students/api";
import type { PredictionPayload, PredictionResponse } from "@/features/predict/types";
import type { Student } from "@/features/students/types";

export function PredictionForm() {
  const predict = usePredict();
  const { data: students } = useStudents();
  const [selectedStudentId, setSelectedStudentId] = React.useState<string>("");
  const [formData, setFormData] = React.useState<PredictionPayload>({
    attendance: 0,
    previousScore: 0,
    caScore: 0,
    testScore: 0,
    assignmentScore: 0,
    studyHours: 0,
    finalScore: 0,
  });
  const [predictionResult, setPredictionResult] = React.useState<PredictionResponse | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    const student = students?.find(s => s.id === studentId);
    if (student) {
      setFormData({
        studentId: student.id,
        attendance: student.attendance,
        previousScore: student.previousScore,
        caScore: student.caScore,
        testScore: student.testScore,
        assignmentScore: student.assignmentScore,
        studyHours: student.studyHours,
        finalScore: student.finalScore,
      });
      setPredictionResult(null); // Clear previous result
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

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

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await predict.mutateAsync(formData);
      setPredictionResult(result);
    } catch (err) {
      console.error("Prediction failed:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "studentId" ? value : Number(value) || 0,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    // Clear prediction result when form changes
    setPredictionResult(null);
  };

  const getPerformanceBadge = (performance: string) => {
    const colors = {
      High: "bg-green-100 text-green-800",
      Average: "bg-yellow-100 text-yellow-800", 
      Low: "bg-red-100 text-red-800",
    };
    return colors[performance as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Performance Prediction</CardTitle>
        <CardDescription>Select a student or enter scores manually to predict performance</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePredict} className="space-y-6">
          {/* Student Selection */}
          <div className="space-y-2">
            <Label htmlFor="student">Select Student (Optional)</Label>
            <select
              id="student"
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedStudentId}
              onChange={(e) => handleStudentSelect(e.target.value)}
            >
              <option value="">-- Select a student --</option>
              {students?.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.class})
                </option>
              ))}
            </select>
          </div>

          {/* Manual Score Entry */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Academic Performance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="attendance">Attendance (0-100)</Label>
                <Input
                  id="attendance"
                  name="attendance"
                  type="number"
                  placeholder="0-100"
                  value={formData.attendance || ""}
                  onChange={handleChange}
                  disabled={predict.isPending}
                />
                {errors.attendance && <p className="text-sm text-destructive">{errors.attendance}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="previousScore">Previous Score (0-100)</Label>
                <Input
                  id="previousScore"
                  name="previousScore"
                  type="number"
                  placeholder="0-100"
                  value={formData.previousScore || ""}
                  onChange={handleChange}
                  disabled={predict.isPending}
                />
                {errors.previousScore && <p className="text-sm text-destructive">{errors.previousScore}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caScore">CA Score (0-100)</Label>
                <Input
                  id="caScore"
                  name="caScore"
                  type="number"
                  placeholder="0-100"
                  value={formData.caScore || ""}
                  onChange={handleChange}
                  disabled={predict.isPending}
                />
                {errors.caScore && <p className="text-sm text-destructive">{errors.caScore}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="testScore">Test Score (0-100)</Label>
                <Input
                  id="testScore"
                  name="testScore"
                  type="number"
                  placeholder="0-100"
                  value={formData.testScore || ""}
                  onChange={handleChange}
                  disabled={predict.isPending}
                />
                {errors.testScore && <p className="text-sm text-destructive">{errors.testScore}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignmentScore">Assignment Score (0-100)</Label>
                <Input
                  id="assignmentScore"
                  name="assignmentScore"
                  type="number"
                  placeholder="0-100"
                  value={formData.assignmentScore || ""}
                  onChange={handleChange}
                  disabled={predict.isPending}
                />
                {errors.assignmentScore && <p className="text-sm text-destructive">{errors.assignmentScore}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studyHours">Study Hours (0-10)</Label>
                <Input
                  id="studyHours"
                  name="studyHours"
                  type="number"
                  placeholder="0-10"
                  value={formData.studyHours || ""}
                  onChange={handleChange}
                  disabled={predict.isPending}
                />
                {errors.studyHours && <p className="text-sm text-destructive">{errors.studyHours}</p>}
              </div>
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
                disabled={predict.isPending}
              />
              {errors.finalScore && <p className="text-sm text-destructive">{errors.finalScore}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={predict.isPending}>
            {predict.isPending ? "Predicting..." : "Predict"}
          </Button>

          {/* Prediction Result */}
          {predictionResult && (
            <div className="mt-6 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Predicted Performance</p>
                  <p className="text-xs text-muted-foreground">Based on final score: {predictionResult.finalScore}</p>
                </div>
                <Badge className={getPerformanceBadge(predictionResult.performance)}>
                  {predictionResult.performance}
                </Badge>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Confidence: {(predictionResult.confidence * 100).toFixed(1)}%
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}