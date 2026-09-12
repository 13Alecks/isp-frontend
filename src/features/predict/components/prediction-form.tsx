"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Badge,
} from "@/shared/components/ui";
import { useStudents } from "@/features/students/api";
import { trainModels, predictWithModel, type ModelComparison } from "@/features/predict/ml/client-trainer";
import type { PredictionPayload, PredictionResponse } from "@/features/predict/types";

export function PredictionForm() {
  const { data: students, isLoading: studentsLoading } = useStudents();
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
  const [modelComparison, setModelComparison] = React.useState<ModelComparison | null>(null);

  // Derive training state: students loaded but model not yet trained.
  const isTraining = !!students && students.length > 0 && !modelComparison && !studentsLoading;

  // Train the ML model when students data is available.
  React.useEffect(() => {
    if (!students || students.length === 0) return;

    let cancelled = false;

    // Defer training to next tick so the UI can update.
    const timer = setTimeout(() => {
      try {
        const comparison = trainModels(students);
        if (!cancelled) {
          setModelComparison(comparison);
        }
      } catch (err) {
        console.error("Model training failed:", err);
      }
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [students]);

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    const student = students?.find((s) => s.id === studentId);
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
      setPredictionResult(null);
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
    if (!modelComparison) {
      setErrors({ form: "Model is still training. Please wait a moment." });
      return;
    }

    const result = predictWithModel(modelComparison.best, formData);
    setPredictionResult({
      performance: result.performance,
      finalScore: formData.finalScore,
      confidence: result.confidence,
      modelUsed: result.modelUsed,
      features: {
        attendance: formData.attendance,
        previousScore: formData.previousScore,
        caScore: formData.caScore,
        testScore: formData.testScore,
        assignmentScore: formData.assignmentScore,
        studyHours: formData.studyHours,
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "studentId" ? value : Number(value) || 0,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setPredictionResult(null);
  };

  const getPerformanceBadge = (performance: string) => {
    const colors: Record<string, string> = {
      High: "bg-green-100 text-green-800",
      Average: "bg-yellow-100 text-yellow-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-red-100 text-red-800",
    };
    return colors[performance] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Performance Prediction</CardTitle>
        <CardDescription>
          Select a student or enter scores manually to predict performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Model status */}
        <div className="mb-4 rounded-lg border bg-muted/30 p-3">
          {studentsLoading || isTraining ? (
            <p className="text-sm text-muted-foreground">
              {studentsLoading
                ? "Loading students..."
                : "Training ML models on your student data..."}
            </p>
          ) : modelComparison ? (
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Model: {modelComparison.best.name}{" "}
                <span className="text-muted-foreground">
                  ({(modelComparison.best.accuracy * 100).toFixed(1)}% accuracy)
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Trained on {modelComparison.trainingSize} samples{" "}
                ({modelComparison.realStudentCount} real + {modelComparison.syntheticCount} synthetic)
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {modelComparison.models.map((m) => (
                  <Badge
                    key={m.name}
                    className={
                      m.name === modelComparison.best.name
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {m.name}: {(m.accuracy * 100).toFixed(0)}%
                  </Badge>
                ))}
              </div>
            </div>
          ) : students && students.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No students found. Add students or seed sample data to train the model.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Model not trained.</p>
          )}
        </div>

        <form onSubmit={handlePredict} className="space-y-6">
          {/* Student Selection */}
          <div className="space-y-2">
            <Label htmlFor="student">Select Student (Optional)</Label>
            <select
              id="student"
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedStudentId}
              onChange={(e) => handleStudentSelect(e.target.value)}
              disabled={isTraining}
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
                <Input id="attendance" name="attendance" type="number" placeholder="0-100" value={formData.attendance || ""} onChange={handleChange} disabled={isTraining} />
                {errors.attendance && <p className="text-sm text-destructive">{errors.attendance}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousScore">Previous Score (0-100)</Label>
                <Input id="previousScore" name="previousScore" type="number" placeholder="0-100" value={formData.previousScore || ""} onChange={handleChange} disabled={isTraining} />
                {errors.previousScore && <p className="text-sm text-destructive">{errors.previousScore}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caScore">CA Score (0-100)</Label>
                <Input id="caScore" name="caScore" type="number" placeholder="0-100" value={formData.caScore || ""} onChange={handleChange} disabled={isTraining} />
                {errors.caScore && <p className="text-sm text-destructive">{errors.caScore}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="testScore">Test Score (0-100)</Label>
                <Input id="testScore" name="testScore" type="number" placeholder="0-100" value={formData.testScore || ""} onChange={handleChange} disabled={isTraining} />
                {errors.testScore && <p className="text-sm text-destructive">{errors.testScore}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignmentScore">Assignment Score (0-100)</Label>
                <Input id="assignmentScore" name="assignmentScore" type="number" placeholder="0-100" value={formData.assignmentScore || ""} onChange={handleChange} disabled={isTraining} />
                {errors.assignmentScore && <p className="text-sm text-destructive">{errors.assignmentScore}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="studyHours">Study Hours (0-10)</Label>
                <Input id="studyHours" name="studyHours" type="number" placeholder="0-10" value={formData.studyHours || ""} onChange={handleChange} disabled={isTraining} />
                {errors.studyHours && <p className="text-sm text-destructive">{errors.studyHours}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="finalScore">Final Score (0-100)</Label>
              <Input id="finalScore" name="finalScore" type="number" placeholder="0-100" value={formData.finalScore || ""} onChange={handleChange} disabled={isTraining} />
              {errors.finalScore && <p className="text-sm text-destructive">{errors.finalScore}</p>}
            </div>
          </div>

          {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}

          <Button type="submit" className="w-full" disabled={isTraining || !modelComparison}>
            {isTraining ? "Training model..." : "Predict"}
          </Button>

          {/* Prediction Result */}
          {predictionResult && (
            <div className="mt-6 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Predicted Performance</p>
                  <p className="text-xs text-muted-foreground">
                    Based on final score: {predictionResult.finalScore}
                  </p>
                </div>
                <Badge className={getPerformanceBadge(predictionResult.performance)}>
                  {predictionResult.performance}
                </Badge>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Confidence: {(predictionResult.confidence * 100).toFixed(1)}%
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Model: {predictionResult.modelUsed}
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
