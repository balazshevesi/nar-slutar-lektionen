import { NextResponse, NextRequest } from "next/server";
export async function GET(request: Request) {
  return NextResponse.json(
    { message: "there's nothing here" },
    { status: 400 },
  );
}
