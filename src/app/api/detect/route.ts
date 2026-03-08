import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyzeText } from "@/lib/ai-detector";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please sign in first" },
        { status: 401 }
      );
    }

    const { text } = (await req.json()) as { text: string };

    if (!text) {
      return NextResponse.json(
        { error: "Please provide text" },
        { status: 400 }
      );
    }

    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount > 2000) {
      return NextResponse.json(
        { error: "Text exceeds 2000 word limit" },
        { status: 400 }
      );
    }

    const { aiRate, breakdown } = analyzeText(text);

    return NextResponse.json({ aiRate, breakdown, wordCount });
  } catch (error) {
    console.error("Detect error:", error);
    return NextResponse.json(
      { error: "Server error, please try again later" },
      { status: 500 }
    );
  }
}
