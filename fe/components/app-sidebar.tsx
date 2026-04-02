"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Award,
    BarChart3,
    Building2,
    ChevronDown,
    ChevronRight,
    FileText,
    HelpCircle,
    Home,
    LogOut,
    Menu,
    Settings,
    ShieldCheck,
    Sparkles,
    Users,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
  pathname: string;
  onItemClick?: () => void;
}

function isPathActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavItem({ icon: Icon, label, href, children, pathname, onItemClick }: NavItemProps) {
  const childIsActive = children?.some((child) => isPathActive(pathname, child.href)) ?? false;
  const itemIsActive = href ? isPathActive(pathname, href) : childIsActive;
  const [isOpen, setIsOpen] = useState(childIsActive);

  useEffect(() => {
    if (childIsActive) {
      setIsOpen(true);
    }
  }, [childIsActive]);

  if (children) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-2xl border border-transparent px-3 py-3 text-sm font-medium transition-all duration-300",
            "hover:border-sidebar-border hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
            itemIsActive && "border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground shadow-lg shadow-black/10"
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        <div
          className={cn(
            "grid overflow-hidden transition-all duration-300 ease-out",
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="ml-4 mt-2 space-y-1 border-l border-sidebar-border pl-4">
            {children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={onItemClick}
                className={cn(
                  "block rounded-xl px-3 py-2 text-sm transition-all",
                  isPathActive(pathname, child.href)
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                {child.label}
              </Link>
            ))}
          </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href || "#"}
      onClick={onItemClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-sm font-medium transition-all duration-300",
        "hover:border-sidebar-border hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
        itemIsActive && "border-sidebar-primary/20 bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-black/10"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 rounded-2xl border-border/70 bg-background/85 shadow-lg backdrop-blur lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Tutup sidebar" : "Buka sidebar"}
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-sidebar-border/70 bg-[linear-gradient(180deg,rgba(31,54,109,0.98),rgba(26,41,85,0.98))] text-sidebar-foreground transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="border-b border-sidebar-border/70 px-6 pb-5 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-black/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">SIKELEMBAGAAN</h1>
              <p className="text-xs text-sidebar-foreground/60">Panel administrator</p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-sidebar-foreground/50">
                  Status Sistem
                </p>
                <p className="mt-2 text-sm font-medium text-white">Data kelembagaan aktif</p>
              </div>
              <Badge className="rounded-full border border-emerald-300/20 bg-emerald-400/10 text-emerald-200">
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                Online
              </Badge>
            </div>
            <p className="mt-3 text-xs leading-5 text-sidebar-foreground/60">
              Navigasi admin untuk OPD, Anjab, ABK, laporan, dan SAKIP.
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <NavItem icon={Home} label="Dashboard" href="/" pathname={pathname} onItemClick={closeMobile} />

          <div className="pb-2 pt-6">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              Data Kelembagaan
            </p>
          </div>

          <NavItem
            icon={Building2}
            label="Data OPD"
            pathname={pathname}
            onItemClick={closeMobile}
            children={[
              { label: "Daftar OPD", href: "/opd/daftar" },
              { label: "Struktur Organisasi", href: "/opd/struktur" },
              { label: "Data Pejabat", href: "/opd/pejabat" },
            ]}
          />

          <NavItem
            icon={Users}
            label="Analisis Jabatan"
            pathname={pathname}
            onItemClick={closeMobile}
            children={[
              { label: "Input Data Jabatan", href: "/anjab/input-jabatan" },
              { label: "Uraian Jabatan", href: "/anjab/uraian" },
              { label: "Spesifikasi Jabatan", href: "/anjab/spesifikasi" },
              { label: "Dokumen Anjab", href: "/anjab/dokumen" },
            ]}
          />

          <NavItem
            icon={BarChart3}
            label="Analisis Beban Kerja"
            pathname={pathname}
            onItemClick={closeMobile}
            children={[
              { label: "Input Aktivitas", href: "/abk/aktivitas" },
              { label: "Perhitungan ABK", href: "/abk/perhitungan" },
              { label: "Laporan ABK", href: "/abk/laporan" },
            ]}
          />

          <NavItem icon={Award} label="Capaian SAKIP" href="/sakip" pathname={pathname} onItemClick={closeMobile} />

          <NavItem icon={FileText} label="Laporan" href="/laporan" pathname={pathname} onItemClick={closeMobile} />

          <div className="pb-2 pt-6">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              Sistem
            </p>
          </div>

          <NavItem
            icon={Settings}
            label="Pengaturan"
            pathname={pathname}
            onItemClick={closeMobile}
            children={[
              { label: "Pengaturan User", href: "/pengaturan/user" },
              { label: "Role Admin", href: "/pengaturan/role-admin" },
            ]}
          />
          <NavItem icon={HelpCircle} label="Bantuan" href="#bantuan" pathname={pathname} onItemClick={closeMobile} />
        </nav>

        <div className="border-t border-sidebar-border/70 p-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-sidebar-foreground/70">
              <Sparkles className="h-3.5 w-3.5 text-sidebar-primary" />
              Admin aktif
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sidebar-accent text-sidebar-accent-foreground">
                <span className="text-sm font-semibold">AD</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Admin Daerah</p>
                <p className="text-xs text-sidebar-foreground/60">admin@pemkab.go.id</p>
              </div>
              <Button variant="ghost" size="icon" className="text-sidebar-foreground/60 hover:bg-white/10 hover:text-white">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
