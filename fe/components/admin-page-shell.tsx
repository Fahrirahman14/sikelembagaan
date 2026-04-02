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
      router.replace("/publik/login");
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
          "relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(39,81,191,0.1),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(232,183,35,0.16),transparent_20%)] lg:pl-72",
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