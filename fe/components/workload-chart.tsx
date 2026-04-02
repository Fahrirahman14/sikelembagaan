"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  {
    name: "Dinas Pendidikan",
    kebutuhan: 280,
    existing: 245,
  },
  {
    name: "Dinas Kesehatan",
    kebutuhan: 350,
    existing: 312,
  },
  {
    name: "BKD",
    kebutuhan: 85,
    existing: 78,
  },
  {
    name: "Dinas PU",
    kebutuhan: 200,
    existing: 189,
  },
  {
    name: "Setda",
    kebutuhan: 170,
    existing: 156,
  },
];

export function WorkloadChart() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Analisis Beban Kerja per OPD</CardTitle>
        <CardDescription>
          Perbandingan kebutuhan pegawai vs pegawai existing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="kebutuhan"
                name="Kebutuhan"
                fill="#ebd938"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="existing"
                name="Existing"
                fill="#374151"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
