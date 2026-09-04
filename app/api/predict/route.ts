import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { finalScore, ...features } = body;

    // Determine performance based on final score
    let performance: "High" | "Average" | "Low";
    if (finalScore >= 70) {
      performance = "High";
    } else if (finalScore >= 50) {
      performance = "Average";
    } else {
      performance = "Low";
    }

    // Mock confidence calculation (in real app, this would come from ML model)
    const confidence = 0.85 + (Math.random() * 0.1); // 0.85-0.95

    const response = {
      performance,
      finalScore,
      confidence,
      features: {
        attendance: features.attendance || 0,
        previousScore: features.previousScore || 0,
        caScore: features.caScore || 0,
        testScore: features.testScore || 0,
        assignmentScore: features.assignmentScore || 0,
        studyHours: features.studyHours || 0,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}