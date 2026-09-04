"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  AlertTriangle,
  Brain,
  TrendingUp,
  ArrowRight,
  Plus,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, Button } from "@/shared/components/ui";
import { useStudents } from "@/features/students/api";
import { useAuth } from "@/providers";

export function DashboardPage() {
  const { user } = useAuth();
  const { data: students, isLoading } = useStudents();

  const totalStudents = students?.length ?? 0;
  const atRiskStudents =
    students?.filter((s) => s.lastPredictedPerformance === "Low").length ?? 0;
  const highPerformers =
    students?.filter((s) => s.lastPredictedPerformance === "High").length ?? 0;
  const avgScore = students?.length
    ? Math.round(
        students.reduce((sum, s) => sum + s.finalScore, 0) / students.length
      )
    : 0;

  const stats = [
    {
      label: "Total Students",
      value: totalStudents,
      icon: Users,
      sub: `${highPerformers} high performers`,
    },
    {
      label: "At-Risk Students",
      value: atRiskStudents,
      icon: AlertTriangle,
      iconColor: "text-destructive",
      iconBg: "bg-destructive/10",
      sub: totalStudents
        ? `${Math.round((atRiskStudents / totalStudents) * 100)}% of total`
        : "No data yet",
    },
    {
      label: "Average Final Score",
      value: avgScore,
      suffix: "/100",
      icon: TrendingUp,
      iconColor: "text-green-600",
      iconBg: "bg-green-500/10",
      sub: "Across all students",
    },
    {
      label: "Predictions Made",
      value: totalStudents,
      icon: Brain,
      iconColor: "text-accent-foreground",
      iconBg: "bg-accent",
      sub: "Based on student records",
    },
  ];

  const recentStudents = students?.slice(0, 5) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s an overview of your students and predictions.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="shadow-sm shadow-foreground/5 transition-shadow hover:shadow-md hover:shadow-foreground/10"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex size-10 items-center justify-center rounded-xl ${stat.iconBg ?? "bg-primary/10"}`}
                    >
                      <Icon className={`size-5 ${stat.iconColor ?? "text-primary"}`} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-3xl font-bold tracking-tight">
                      {isLoading ? (
                        <span className="inline-block h-8 w-16 animate-pulse rounded bg-muted" />
                      ) : (
                        <>
                          {stat.value}
                          {stat.suffix && (
                            <span className="text-lg text-muted-foreground">
                              {stat.suffix}
                            </span>
                          )}
                        </>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.sub}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent students + quick actions */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Recent students */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold">Recent Students</h2>
                <Link
                  href="/students"
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View all
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-14 animate-pulse rounded-lg bg-muted"
                    />
                  ))}
                </div>
              ) : recentStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                    <GraduationCap className="size-6 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-sm font-medium">No students yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Add your first student to get started.
                  </p>
                  <Link href="/students/new" className="mt-4">
                    <Button size="sm">
                      <Plus className="size-4" />
                      Add Student
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentStudents.map((student) => (
                    <Link
                      key={student.id}
                      href={`/students/${student.id}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.class} · Score: {student.finalScore}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          student.lastPredictedPerformance === "High"
                            ? "bg-green-500/10 text-green-600"
                            : student.lastPredictedPerformance === "Medium"
                            ? "bg-yellow-500/10 text-yellow-600"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {student.lastPredictedPerformance}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-base font-semibold">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  href="/students/new"
                  className="flex items-center gap-3 rounded-lg border border-border p-3.5 transition-colors hover:bg-muted/60"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <Plus className="size-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Add Student</p>
                    <p className="text-xs text-muted-foreground">
                      Create a new student record
                    </p>
                  </div>
                </Link>

                <Link
                  href="/predict"
                  className="flex items-center gap-3 rounded-lg border border-border p-3.5 transition-colors hover:bg-muted/60"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <Brain className="size-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Predict Performance</p>
                    <p className="text-xs text-muted-foreground">
                      Run a new prediction
                    </p>
                  </div>
                </Link>

                <Link
                  href="/predictions"
                  className="flex items-center gap-3 rounded-lg border border-border p-3.5 transition-colors hover:bg-muted/60"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="size-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">View History</p>
                    <p className="text-xs text-muted-foreground">
                      See past predictions
                    </p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
