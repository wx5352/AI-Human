import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";

const MAX_FEEDBACK_PER_DAY = 5;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const { message } = (await req.json()) as { message: string };

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (message.length > 100) {
      return NextResponse.json({ error: "Message exceeds 100 characters" }, { status: 400 });
    }

    // Check daily feedback limit
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { feedbackCount: true, lastFeedbackReset: true, name: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Reset daily count if new day
    const now = new Date();
    const lastReset = new Date(user.lastFeedbackReset);
    const isNewDay =
      now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
      now.getUTCMonth() !== lastReset.getUTCMonth() ||
      now.getUTCDate() !== lastReset.getUTCDate();

    let currentCount = user.feedbackCount;
    if (isNewDay) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { feedbackCount: 0, lastFeedbackReset: now },
      });
      currentCount = 0;
    }

    if (currentCount >= MAX_FEEDBACK_PER_DAY) {
      return NextResponse.json(
        { error: `Daily feedback limit reached (${MAX_FEEDBACK_PER_DAY}/day)` },
        { status: 429 }
      );
    }

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.FEEDBACK_EMAIL || "contact@example.com",
      subject: `[HumanizeAI Feedback] from ${user.name || user.email}`,
      text: `User: ${user.name} (${user.email})\nTime: ${now.toISOString()}\n\nFeedback:\n${message}`,
    });

    // Increment feedback count
    await prisma.user.update({
      where: { id: session.user.id },
      data: { feedbackCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Server error, please try again later" }, { status: 500 });
  }
}
