"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

interface AdminPageHeaderProps {
  icon: ElementType;
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
  className?: string;
}

export function AdminPageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  actions,
  aside,
  className,
}: AdminPageHeaderProps) {
  return (
    <section
      className={cn(
        "mb-8 overflow-hidden rounded-4xl border border-white/60 bg-card/85 p-6 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8",
        className,
      )}
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
        <div className="space-y-6 animate-in fade-in-0 slide-in-from-top-4 duration-700">
          <Badge className="inline-flex rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Icon className="mr-2 h-4 w-4" />
            {eyebrow}
          </Badge>

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              {description}
            </p>
          </div>

          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>

        {aside ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 animate-in fade-in-0 slide-in-from-right-6 duration-700">
            {aside}
          </div>
        ) : null}
      </div>
    </section>
  );
}