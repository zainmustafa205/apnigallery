import { NextRequest, NextResponse } from "next/server";
import {
  uploadDesignImage,
  saveDesign,
  getDesign,
  deleteDesign,
  savePreviewSnapshot,
} from "@/lib/actions/design.actions";

// POST /api/test/design?action=upload   -> body: form-data { file }
// POST /api/test/design?action=save     -> body: json (SaveDesignInput)
// POST /api/test/design?action=preview  -> body: json { designId, dataUri }
export async function POST(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action");

  if (action === "upload") {
    const formData = await req.formData();
    const result = await uploadDesignImage(formData);
    return NextResponse.json(result);
  }

  if (action === "save") {
    const body = await req.json();
    const result = await saveDesign(body);
    return NextResponse.json(result);
  }

  if (action === "preview") {
    const body = await req.json();
    const result = await savePreviewSnapshot(body.designId, body.dataUri);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

// GET /api/test/design?designId=xxx
export async function GET(req: NextRequest) {
  const designId = req.nextUrl.searchParams.get("designId");
  if (!designId) {
    return NextResponse.json({ error: "designId required" }, { status: 400 });
  }
  const result = await getDesign(designId);
  return NextResponse.json(result);
}

// DELETE /api/test/design?designId=xxx
export async function DELETE(req: NextRequest) {
  const designId = req.nextUrl.searchParams.get("designId");
  if (!designId) {
    return NextResponse.json({ error: "designId required" }, { status: 400 });
  }
  const result = await deleteDesign(designId);
  return NextResponse.json(result);
}
