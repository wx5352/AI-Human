import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please sign in" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        usageCount: true,
        maxUsage: true,
        lastUsageReset: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if we need to reset
    const now = new Date();
    const lastReset = new Date(user.lastUsageReset);
    const isNewDay =
      now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
      now.getUTCMonth() !== lastReset.getUTCMonth() ||
      now.getUTCDate() !== lastReset.getUTCDate();

    if (isNewDay) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { usageCount: 0, lastUsageReset: now },
      });
      return NextResponse.json({
        usageCount: 0,
        maxUsage: user.maxUsage,
      });
    }

    return NextResponse.json({
      usageCount: user.usageCount,
      maxUsage: user.maxUsage,
    });
  } catch (error) {
    console.error("Usage error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
