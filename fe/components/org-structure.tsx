"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface OrgNode {
  name: string;
  position: string;
  children?: OrgNode[];
}

const orgData: OrgNode = {
  name: "Bupati",
  position: "Kepala Daerah",
  children: [
    {
      name: "Sekretaris Daerah",
      position: "Sekda",
      children: [
        {
          name: "Asisten Pemerintahan",
          position: "Asisten I",
        },
        {
          name: "Asisten Perekonomian",
          position: "Asisten II",
        },
        {
          name: "Asisten Administrasi",
          position: "Asisten III",
        },
      ],
    },
    {
      name: "Inspektorat",
      position: "Inspektur",
    },
    {
      name: "Dinas Pendidikan",
      position: "Kepala Dinas",
    },
    {
      name: "Dinas Kesehatan",
      position: "Kepala Dinas",
    },
  ],
};

function OrgNodeCard({
  node,
  level = 0,
}: {
  node: OrgNode;
  level?: number;
}) {
  return (
    <div className="flex flex-col">
      <div
        className={`rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md ${
          level === 0
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border"
        }`}
      >
        <p
          className={`text-sm font-semibold ${
            level === 0 ? "text-primary-foreground" : "text-foreground"
          }`}
        >
          {node.name}
        </p>
        <p
          className={`text-xs ${
            level === 0
              ? "text-primary-foreground/70"
              : "text-muted-foreground"
          }`}
        >
          {node.position}
        </p>
      </div>
      {node.children && node.children.length > 0 && (
        <div className="ml-4 mt-2 space-y-2 border-l-2 border-border pl-4">
          {node.children.map((child, index) => (
            <div key={index} className="relative">
              <div className="absolute -left-[18px] top-3 h-px w-4 bg-border" />
              <OrgNodeCard node={child} level={level + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function OrgStructure() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Struktur Organisasi</CardTitle>
            <CardDescription>
              Hierarki organisasi pemerintah daerah
            </CardDescription>
          </div>
          <button className="flex items-center gap-1 text-sm text-primary hover:underline">
            Lihat Selengkapnya
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-4">
          <OrgNodeCard node={orgData} />
        </div>
      </CardContent>
    </Card>
  );
}
