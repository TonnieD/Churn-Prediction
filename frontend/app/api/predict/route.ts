// frontend/app/api/predict/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";

    const backendUrl = host.includes("localhost")
      ? "http://localhost:8000"
      : process.env.BACKEND_API_URL || `https://${protocol}://${host}/_/backend`;

    const apiKey = process.env.API_KEY;

    console.log(`[Proxy POST] Request headers host: "${host}"`);
    console.log(`[Proxy POST] Final resolved backendUrl: "${backendUrl}"`);
    console.log(`[Proxy POST] API Key present in env: ${!!apiKey}`);
    console.log(`[Proxy POST] API Key length: ${apiKey?.length}`);
    console.log(`[Proxy POST] API Key first 3: "${apiKey?.substring(0, 3)}"`);

    if (!apiKey) {
      console.error("[Proxy POST] Error: API_KEY environment variable is missing!");
      return NextResponse.json(
        { error: "Server Configuration Error: API_KEY is not configured." },
        { status: 500 }
      );
    }

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

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error(`[Proxy POST] Non-JSON response from backend: ${text.substring(0, 200)}`);
      return NextResponse.json(
        { error: "Backend returned an unexpected response" },
        { status: 502 }
      );
    }

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