// app/api/summarize/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: `Summarize this into bullet points:\n\n${prompt}` }],
    }),
  });

  const data = await res.json();
  const summary = data.choices?.[0]?.message?.content || "";

  return NextResponse.json({ summary });
}
