"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

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