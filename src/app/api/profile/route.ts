import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please sign in first" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        image: true,
        plan: true,
        usageCount: true,
        maxUsage: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      image: user.image,
      plan: user.plan,
      usageCount: user.usageCount,
      maxUsage: user.maxUsage,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
