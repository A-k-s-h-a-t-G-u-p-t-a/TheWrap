import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import prisma from "@/lib/prisma"; // your Prisma instance

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  return new Promise((resolve, reject) => {
    // Call the Python script inside /scripts
    exec(`python3 scripts/embed_query.py "${query}"`, async (err, stdout) => {
      if (err) {
        console.error("Embedding error:", err);
        return reject(NextResponse.json({ error: "Embedding failed" }));
      }

      const vector = JSON.parse(stdout); // Parse the output from Python

      const tools = await prisma.$queryRawUnsafe(`
        SELECT * FROM tools
        ORDER BY embedding <#> '${JSON.stringify(vector)}'
        LIMIT 5;
      `);

      resolve(NextResponse.json(tools));
    });
  });
}
