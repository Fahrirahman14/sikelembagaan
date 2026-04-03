"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import {
  BarChart3,
  Building2,
  FileText,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

const iconMap: Record<string, LucideIcon> = {
  FileText,
  Users,
  Building2,
  BarChart3,
};

type Activity = {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  color: string;
};

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await api.aktivitas.list();
        const mapped: Activity[] = data.map((a) => {
          let icon = "FileText";
          let color = "bg-gray-100 text-gray-600";
          if (a.kategori === "utama") {
            icon = "FileText";
            color = "bg-green-100 text-green-600";
          } else if (a.kategori === "tambahan") {
            icon = "Users";
            color = "bg-blue-100 text-blue-600";
          } else if (a.kategori === "statistik") {
            icon = "BarChart3";
            color = "bg-yellow-100 text-yellow-600";
          } else if (a.kategori === "opd") {
            icon = "Building2";
            color = "bg-purple-100 text-purple-600";
          }

          return {
            id: a.id,
            icon,
            title: a.jabatan_nama || a.uraian_tugas,
            description: a.uraian_tugas,
            time: new Date(a.created_at).toLocaleString(),
            color,
          };
        });
        setActivities(mapped);
      } catch (err) {
        // Jika fetch gagal (mis. belum login), fallback ke dati mock agar UI tetap berfungsi
        // eslint-disable-next-line no-console
        console.error("Gagal mengambil aktivitas:", err);
      }
    };

    fetchActivities();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
        <CardDescription className="text-xs">
          Update terkini dari aktifitas pada aplikasi
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6">
            <FileText className="h-8 w-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Tidak ada aktivitas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const IconComponent = iconMap[activity.icon] || FileText;
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${activity.color}`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/70">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
