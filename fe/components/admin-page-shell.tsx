"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface AdminPageShellProps {
  children: ReactNode;
  mainClassName?: string;
  contentClassName?: string;
}

export function AdminPageShell({
  children,
  mainClassName,
  contentClassName,
}: AdminPageShellProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <main
        className={cn(
          "relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(0,24,57,0.10),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(254,197,3,0.10),transparent_22%)] lg:pl-72",
          mainClassName,
        )}
      >
        <div className="absolute left-0 top-10 -z-10 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className={cn("p-6 lg:p-8", contentClassName)}>{children}</div>
      </main>
    </div>
  );
}