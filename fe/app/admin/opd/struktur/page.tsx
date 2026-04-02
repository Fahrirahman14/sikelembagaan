"use client";

import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminPageShell } from "@/components/admin-page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { api, type OPD, type StrukturOrganisasi } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    Building2,
    ChevronDown,
    ChevronRight,
    Download,
    GitBranchPlus,
    Printer,
    UserCheck,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface OrgNodeProps {
  node: StrukturOrganisasi;
  allNodes: StrukturOrganisasi[];
  expandedNodes: Set<string>;
  onToggle: (id: string) => void;
}

function OrgNode({ node, allNodes, expandedNodes, onToggle }: OrgNodeProps) {
  const childNodes = allNodes.filter((n) => n.parent_id === node.id);
  const hasChildren = childNodes.length > 0;
  const isExpanded = expandedNodes.has(node.id);

  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-center gap-3 rounded-3xl border border-white/60 bg-card/85 p-4 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_80px_-36px_rgba(15,23,42,0.55)]",
          node.level === 1 && "border-primary/25 bg-primary/10",
          node.level === 2 && "border-accent/35 bg-accent/10",
          node.level >= 3 && "border-border/70"
        )}
      >
        {hasChildren && (
          <button
            onClick={() => onToggle(node.id)}
            className="rounded p-1 hover:bg-muted"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-6" />}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">{node.jabatan}</p>
          {node.nama ? (
            <div>
              <p className="text-sm text-muted-foreground">{node.nama}</p>
              <p className="text-xs text-muted-foreground">NIP: {node.nip}</p>
            </div>
          ) : (
            <p className="text-sm italic text-muted-foreground">Belum terisi</p>
          )}
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-8 mt-2 space-y-2 border-l-2 border-dashed border-muted pl-4">
          {childNodes.map((child) => (
            <OrgNode
              key={child.id}
              node={child}
              allNodes={allNodes}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function StrukturOrganisasiPage() {
  const [selectedOpd, setSelectedOpd] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [opdList, setOpdList] = useState<OPD[]>([]);
  const [filteredStruktur, setFilteredStruktur] = useState<StrukturOrganisasi[]>([]);

  useEffect(() => {
    api.opd.list().then((list) => {
      setOpdList(list);
      if (list.length > 0) setSelectedOpd(list[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedOpd) {
      api.struktur.listByOpd(selectedOpd).then(setFilteredStruktur);
    }
  }, [selectedOpd]);

  const rootNodes = filteredStruktur.filter((s) => !s.parent_id);
  const selectedOpdData = opdList.find((o) => o.id === selectedOpd);
  const filledPositions = filteredStruktur.filter((item) => Boolean(item.nama)).length;
  const emptyPositions = filteredStruktur.length - filledPositions;

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedNodes(new Set(filteredStruktur.map((s) => s.id)));
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        icon={GitBranchPlus}
        eyebrow="Peta struktur OPD"
        title="Pantau struktur organisasi tiap perangkat daerah dalam tampilan yang lebih informatif."
        description="Visualisasi struktur kini memakai shell admin baru dengan ringkasan posisi terisi, kontrol expand yang lebih konsisten, dan kartu bagan yang terasa lebih modern."
        actions={
          <>
            <Button variant="outline" className="gap-2 rounded-xl border-border/70 bg-background/80">
              <Printer className="h-4 w-4" />
              Cetak
            </Button>
            <Button variant="outline" className="gap-2 rounded-xl border-border/70 bg-background/80">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </>
        }
        aside={
          <>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Posisi terdata
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{filteredStruktur.length}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Posisi terisi
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{filledPositions}</p>
            </div>
          </>
        }
      />

          {/* Filter */}
          <Card className="mb-6 border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <label className="text-sm font-medium text-foreground">Pilih OPD:</label>
                  <Select value={selectedOpd} onValueChange={setSelectedOpd}>
                    <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background/80 sm:w-80">
                      <SelectValue placeholder="Pilih OPD" />
                    </SelectTrigger>
                    <SelectContent>
                      {opdList.map((opd) => (
                        <SelectItem key={opd.id} value={opd.id}>
                          {opd.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl border-border/70 bg-background/80" onClick={expandAll}>
                    Expand All
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl border-border/70 bg-background/80" onClick={collapseAll}>
                    Collapse All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* OPD Info */}
          {selectedOpdData && (
            <Card className="mb-6 border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedOpdData.nama}</h2>
                    <p className="text-sm text-muted-foreground">
                      Total {filteredStruktur.length} posisi jabatan, {emptyPositions} di antaranya belum terisi
                    </p>
                  </div>
                  <div className="ml-auto hidden rounded-2xl border border-border/70 bg-background/80 px-4 py-3 sm:block">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UserCheck className="h-4 w-4 text-primary" />
                      Tingkat keterisian {filteredStruktur.length > 0 ? Math.round((filledPositions / filteredStruktur.length) * 100) : 0}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Org Chart */}
          <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Bagan Struktur
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rootNodes.length > 0 ? (
                <div className="space-y-4">
                  {rootNodes.map((node) => (
                    <OrgNode
                      key={node.id}
                      node={node}
                      allNodes={filteredStruktur}
                      expandedNodes={expandedNodes}
                      onToggle={toggleNode}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Building2 className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground">
                    Belum ada data struktur organisasi untuk OPD ini
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="mt-6 border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardContent className="pt-6">
              <p className="mb-3 text-sm font-medium text-foreground">Keterangan:</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border-2 border-primary bg-primary/5"></div>
                  <span className="text-sm text-muted-foreground">Pimpinan (Eselon II)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border-2 border-accent bg-accent/10"></div>
                  <span className="text-sm text-muted-foreground">Eselon III</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border-2 border-border bg-card"></div>
                  <span className="text-sm text-muted-foreground">Eselon IV / Staff</span>
                </div>
              </div>
            </CardContent>
          </Card>
    </AdminPageShell>
  );
}
