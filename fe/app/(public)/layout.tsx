import { PublicNavbar } from "@/components/public-navbar";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Building2, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerLinks = [
    { label: "Dashboard Publik", href: "/" },
    { label: "Capaian SAKIP", href: "/sakip" },
    { label: "Analisis Jabatan", href: "/anjab" },
    { label: "Login", href: "/login" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <main>{children}</main>
      <footer className="relative overflow-hidden border-t border-white/50 bg-[radial-gradient(circle_at_top_left,rgba(39,81,191,0.08),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(245,247,250,0.95))]">
        <div className="absolute -left-10 top-6 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr_0.8fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/15">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">SIKELEMBAGAAN</p>
                  <p className="text-sm text-muted-foreground">
                    Sistem Informasi Kelembagaan Pemerintah Kabupaten
                  </p>
                </div>
              </div>

              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                Portal publik ini menyajikan informasi struktur kelembagaan, analisis jabatan, dan capaian kinerja agar lebih mudah diakses, dipahami, dan diawasi secara terbuka.
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-primary">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Transparansi data publik
                </Badge>
                <Badge className="rounded-full border border-border/80 bg-background/80 px-3 py-1 text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  Pemerintah Kabupaten
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Navigasi Publik
              </p>
              <div className="mt-4 grid gap-2">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center justify-between rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm text-foreground transition-all hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Catatan Portal
              </p>
              <div className="rounded-3xl border border-border/70 bg-background/85 p-5">
                <p className="text-sm font-medium text-foreground">Akses informasi</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Halaman publik difokuskan untuk penjelajahan data. Fitur pengelolaan dan pembaruan tersedia pada area login administrator.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Pemerintah Kabupaten. Hak cipta dilindungi.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
