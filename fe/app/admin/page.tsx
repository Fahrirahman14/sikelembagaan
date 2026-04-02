import { AppSidebar } from "@/components/app-sidebar";
import { TrendingUp } from "lucide-react";
import { DashboardClient } from "./dashboard-client";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(39,81,191,0.1),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(232,183,35,0.16),transparent_20%)] lg:pl-72">
        <div className="absolute left-0 top-10 -z-10 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <header className="sticky top-0 z-30 border-b border-white/50 bg-background/70 backdrop-blur-xl supports-backdrop-filter:bg-background/55">
          <div className="flex h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Ringkasan utama pengelolaan kelembagaan daerah
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 sm:flex">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Tahun 2026
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <DashboardClient />
        </div>
      </main>
    </div>
  );
}
