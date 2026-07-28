import { NextResponse } from "next/server";

// Simple sanity-check route: GET /api/health
// Confirms the API routes segment is wired up correctly.
// Real APIs (catalog, cart, orders, payments) come in Chats 4-7.
export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
}