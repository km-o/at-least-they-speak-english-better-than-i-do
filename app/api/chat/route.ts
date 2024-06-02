import { NextResponse } from "next/server";
import { connectDatabase } from "../db";

// @see: https://nextjs.org/docs/app/building-your-application/routing/route-handlers#convention
export async function GET(request: Request) {
  const db = await connectDatabase();
  const data = await db.all("SELECT * FROM chat");
  return Response.json({ data: data });
}

export async function POST(request: Request) {
  const { role, text } = await request.json();
  
  try {
    const db = await connectDatabase();
    const result = await db.run(
      "INSERT INTO chat (role, text, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
      [role, text]
    );
    return Response.json({ result: result })
  } catch (error) {
    return Response.json({ error: "ERROR" })
  }
}