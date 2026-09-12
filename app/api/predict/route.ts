import { NextRequest, NextResponse } from "next/server";
import { predict } from "@/features/predict/ml";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      attendance,
      previousScore,
      caScore,
      testScore,
      assignmentScore,
      studyHours,
      finalScore,
    } = body;

    // Run the ML prediction using the best trained model.
    const result = predict({
      attendance: Number(attendance) || 0,
      previousScore: Number(previousScore) || 0,
      caScore: Number(caScore) || 0,
      testScore: Number(testScore) || 0,
      assignmentScore: Number(assignmentScore) || 0,
      studyHours: Number(studyHours) || 0,
      finalScore: Number(finalScore) || 0,
    });

    return NextResponse.json({
      performance: result.performance,
      finalScore: Number(finalScore) || 0,
      confidence: result.confidence,
      modelUsed: result.modelUsed,
      features: {
        attendance: Number(attendance) || 0,
        previousScore: Number(previousScore) || 0,
        caScore: Number(caScore) || 0,
        testScore: Number(testScore) || 0,
        assignmentScore: Number(assignmentScore) || 0,
        studyHours: Number(studyHours) || 0,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
