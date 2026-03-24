import { NextRequest, NextResponse } from "next/server";
import { importUserData } from "@/lib/backup";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userId = body.userId as string;
  const encryptedData = body.encryptedData as string;
  const password = body.password as string;
  if (!userId || !encryptedData || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  try {
    await importUserData(userId, encryptedData, password);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Import failed" }, { status: 400 });
  }
}