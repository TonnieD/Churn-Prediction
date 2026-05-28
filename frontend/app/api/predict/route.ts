// frontend/app/api/predict/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Load configs from server environment variables
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server Configuration Error: API_KEY environment variable is not set." },
        { status: 500 }
      );
    }

    // Call FastAPI backend securely
    const response = await fetch(`${backendUrl}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail?.error || data.error || "Backend inference failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error in API Proxy" },
      { status: 500 }
    );
  }
}
