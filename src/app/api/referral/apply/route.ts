import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const { referralCode } = (await req.json()) as { referralCode: string };

    if (!referralCode) {
      return NextResponse.json({ error: "Referral code is required" }, { status: 400 });
    }

    // Check if current user already has a referrer
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { referredBy: true, referralCode: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Can't use own referral code
    if (currentUser.referralCode === referralCode) {
      return NextResponse.json({ error: "Cannot use your own referral code" }, { status: 400 });
    }

    // Already referred
    if (currentUser.referredBy) {
      return NextResponse.json({ error: "Already used a referral code" }, { status: 400 });
    }

    // Find referrer
    const referrer = await prisma.user.findUnique({
      where: { referralCode },
      select: { id: true, referralBonusUsed: true, maxUsage: true },
    });

    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
    }

    // Apply referral: mark current user as referred
    await prisma.user.update({
      where: { id: session.user.id },
      data: { referredBy: referralCode },
    });

    // Give referrer +3 bonus uses if not already applied
    if (!referrer.referralBonusUsed) {
      await prisma.user.update({
        where: { id: referrer.id },
        data: {
          maxUsage: { increment: 3 },
          referralBonusUsed: true,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Referral apply error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
