import { NextRequest, NextResponse } from "next/server";
import { exportUserData } from "@/lib/backup";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userId = body.userId as string;
  const password = body.password as string;
  if (!userId || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  try {
    const encrypted = await exportUserData(userId, password);
    return NextResponse.json({ encrypted });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Export failed" }, { status: 500 });
  }
}