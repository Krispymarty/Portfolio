import Groq from "groq-sdk";
import { AI_SYSTEM_PROMPT } from "@/data/aiContext";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "AI assistant is not configured. Please set GROQ_API_KEY." },
      { status: 500 }
    );
  }

  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const groq = new Groq({ apiKey });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: AI_SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_completion_tokens: 500,
    });

    const response = chatCompletion.choices[0]?.message?.content || "I couldn't generate a response.";

    return NextResponse.json({ response });
  } catch (error) {
    console.error("AI Assistant error:", error);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}
