import { getDb } from "@/db";
import { notes } from "@/examples/d1/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const db = getDb();
  const rows = await db.select().from(notes).all();
  return NextResponse.json({ notes: rows });
}

export async function POST(request: Request) {
  const db = getDb();
  const { body } = await request.json<{ body?: string }>();
  const trimmed = body?.trim();
  if (!trimmed) {
    return NextResponse.json({ error: "body is required" }, { status: 400 });
  }

  const [note] = await db
    .insert(notes)
    .values({ body: trimmed, createdAt: new Date() })
    .returning();

  return NextResponse.json({ note }, { status: 201 });
}
