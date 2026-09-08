import { NextResponse } from "next/server";
import { cleanupOrphanedDesigns } from "@/lib/actions/design.actions";

// Vercel Cron hits this with an Authorization header matching CRON_SECRET —
// this prevents randoms on the internet from triggering bulk deletes.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const result = await cleanupOrphanedDesigns();
  return NextResponse.json(result);
}
