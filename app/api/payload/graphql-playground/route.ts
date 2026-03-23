import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      message: "GraphQL Playground is disabled in this self-hosted setup.",
    },
    { status: 404 },
  );
}
