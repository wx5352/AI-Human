import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";

function generateCode(): string {
  return randomBytes(4).toString("hex").toUpperCase(); // 8-char hex code
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { referralCode: true, referralBonusUsed: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate referral code if not exists
    if (!user.referralCode) {
      let code = generateCode();
      // Ensure uniqueness
      let exists = await prisma.user.findUnique({ where: { referralCode: code } });
      while (exists) {
        code = generateCode();
        exists = await prisma.user.findUnique({ where: { referralCode: code } });
      }

      user = await prisma.user.update({
        where: { id: session.user.id },
        data: { referralCode: code },
        select: { referralCode: true, referralBonusUsed: true },
      });
    }

    return NextResponse.json({
      referralCode: user.referralCode,
      referralBonusUsed: user.referralBonusUsed,
    });
  } catch (error) {
    console.error("Referral code error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
