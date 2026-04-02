import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Users, Building2, BarChart3 } from "lucide-react";

const activities = [
  {
    id: 1,
    icon: FileText,
    title: "Dokumen Anjab Selesai",
    description: "Dinas Pendidikan telah menyelesaikan dokumen Anjab",
    time: "2 jam yang lalu",
    color: "bg-green-100 text-green-600",
  },
  {
    id: 2,
    icon: Users,
    title: "Data Jabatan Diperbarui",
    description: "BKD memperbarui data 12 jabatan struktural",
    time: "4 jam yang lalu",
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 3,
    icon: BarChart3,
    title: "Perhitungan ABK",
    description: "Dinas Kesehatan memulai perhitungan ABK",
    time: "6 jam yang lalu",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    id: 4,
    icon: Building2,
    title: "OPD Baru Ditambahkan",
    description: "Dinas Pariwisata telah ditambahkan ke sistem",
    time: "1 hari yang lalu",
    color: "bg-purple-100 text-purple-600",
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
        <CardDescription>
          Update terkini dari seluruh OPD
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${activity.color}`}
              >
                <activity.icon className="h-5 w-5" />
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
