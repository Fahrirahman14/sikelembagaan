"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Building2, Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/publik" },
  { label: "Capaian SAKIP", href: "/publik/sakip" },
  { label: "Analisis Jabatan", href: "/publik/anjab" },
];

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/40 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/publik" className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/15">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
                SIKELEMBAGAAN
              </h1>
              <Badge className="hidden rounded-full border border-primary/15 bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary sm:inline-flex">
                Publik
              </Badge>
            </div>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Transparansi struktur organisasi pemerintah kabupaten
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                pathname === item.href
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/15"
                  : "text-foreground hover:bg-primary/10 hover:text-primary"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="rounded-full border border-border/70 bg-background/80 px-3 py-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Data OPD aktif dan dapat diakses publik
            </span>
          </div>
          <Link href="/publik/login">
            <Button className="rounded-full px-5 shadow-lg shadow-primary/15">
              Masuk
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/40 bg-background/90 backdrop-blur-xl md:hidden animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "border border-transparent bg-background/80 text-foreground hover:border-primary/20 hover:bg-primary/5"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 rounded-2xl border border-border/70 bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Portal Publik
              </p>
              <p className="mt-2 text-sm text-foreground">
                Ringkasan data kelembagaan, SAKIP, dan analisis jabatan.
              </p>
            </div>
            <div className="pt-1">
              <Link href="/publik/login" onClick={() => setMobileOpen(false)}>
                <Button className="w-full rounded-2xl">
                  Masuk
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
