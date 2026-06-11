import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_SYSTEM_PROMPT } from "@/data/aiContext";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "AI assistant is not configured. Please set GEMINI_API_KEY." },
      { status: 500 }
    );
  }

  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: AI_SYSTEM_PROMPT + "\n\nUser question: " + message }] }
      ],
    });

    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error("AI Assistant error:", error);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}
