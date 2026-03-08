import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { openai } from "@/lib/openai";
import { getSystemPrompt, getUserPrompt, type RewriteMode } from "@/lib/prompts";
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

    const { text, mode, ghostModel = "ghost4.0" } = (await req.json()) as {
      text: string;
      mode: RewriteMode;
      ghostModel?: string;
    };

    if (!text || !mode) {
      return NextResponse.json(
        { error: "Please provide text and rewrite mode" },
        { status: 400 }
      );
    }

    if (!["light", "medium", "deep"].includes(mode)) {
      return NextResponse.json(
        { error: "Invalid rewrite mode" },
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    const lastReset = new Date(user.lastUsageReset);
    const isNewDay =
      now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
      now.getUTCMonth() !== lastReset.getUTCMonth() ||
      now.getUTCDate() !== lastReset.getUTCDate();

    if (isNewDay) {
      await prisma.user.update({
        where: { id: user.id },
        data: { usageCount: 0, lastUsageReset: now },
      });
      user.usageCount = 0;
    }

    if (user.usageCount >= user.maxUsage) {
      return NextResponse.json(
        {
          error: `Daily limit reached (${user.maxUsage} uses). Please try again tomorrow.`,
          usageCount: user.usageCount,
          maxUsage: user.maxUsage,
        },
        { status: 429 }
      );
    }

    const model = "gpt-4o-mini";
    const maxTokens = Math.max(Math.ceil(wordCount * 1.5), 800);

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: getSystemPrompt(mode, ghostModel) },
        { role: "user", content: getUserPrompt(text, ghostModel) },
      ],
      temperature: 0.9,
      top_p: 0.95,
      frequency_penalty: 0.3,
      presence_penalty: 0.2,
      max_tokens: maxTokens,
    });

    const rewrittenText = completion.choices[0]?.message?.content || "";

    if (!rewrittenText) {
      return NextResponse.json(
        { error: "Rewrite failed, please try again" },
        { status: 500 }
      );
    }

    const detection = analyzeText(rewrittenText);
    const { aiRate, breakdown } = detection;

    // Update usage count
    await prisma.user.update({
      where: { id: user.id },
      data: { usageCount: { increment: 1 } },
    });

    return NextResponse.json({
      rewrittenText,
      wordCount,
      usageCount: user.usageCount + 1,
      maxUsage: user.maxUsage,
      aiRate,
      breakdown,
    });
  } catch (error) {
    console.error("Rewrite error:", error);
    return NextResponse.json(
      { error: "Server error, please try again later" },
      { status: 500 }
    );
  }
}
