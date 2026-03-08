"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppTopbar } from "@/components/AppTopbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
