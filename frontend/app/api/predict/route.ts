// frontend/app/api/predict/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Dynamically resolve host domain to construct absolute URLs on the server
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";

    // 2. Determine default backend (localhost:8000 for local dev, or absolute Vercel Service URL in production)
    const defaultBackendUrl = host.includes("localhost")
      ? "http://localhost:8000"
      : `${protocol}://${host}/_/backend`;

    const backendUrl = process.env.BACKEND_API_URL || defaultBackendUrl;
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server Configuration Error: API_KEY environment variable is not configured." },
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
