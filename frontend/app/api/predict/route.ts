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

    const backendUrl = process.env.BACKEND_URL || process.env.BACKEND_API_URL || defaultBackendUrl;
    const apiKey = process.env.API_KEY;

    console.log(`[Proxy POST] Request headers host: "${host}"`);
    console.log(`[Proxy POST] Protocol: "${protocol}"`);
    console.log(`[Proxy POST] Environment BACKEND_URL: "${process.env.BACKEND_URL || ''}"`);
    console.log(`[Proxy POST] Environment BACKEND_API_URL: "${process.env.BACKEND_API_URL || ''}"`);
    console.log(`[Proxy POST] Final resolved backendUrl: "${backendUrl}"`);
    console.log(`[Proxy POST] API Key present in env: ${!!apiKey}`);

    if (!apiKey) {
      console.error("[Proxy POST] Error: API_KEY environment variable is missing on Next.js server!");
      return NextResponse.json(
        { error: "Server Configuration Error: API_KEY environment variable is not configured." },
        { status: 500 }
      );
    }

    // Call FastAPI backend securely
    const targetUrl = `${backendUrl}/predict`;
    console.log(`[Proxy POST] Fetching backend URL: "${targetUrl}"`);

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(body),
    });

    console.log(`[Proxy POST] Backend response status code: ${response.status}`);
    const data = await response.json();

    if (!response.ok) {
      console.error("[Proxy POST] Backend error payload:", data);
      return NextResponse.json(
        { error: data.detail?.error || data.detail || data.error || "Backend inference failed" },
        { status: response.status }
      );
    }

    console.log("[Proxy POST] Successful prediction returned from backend!");
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Proxy POST] Exception thrown in Next.js API Proxy handler:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error in API Proxy" },
      { status: 500 }
    );
  }
}

