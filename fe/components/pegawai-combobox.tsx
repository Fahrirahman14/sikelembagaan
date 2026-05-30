"use client";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type Pejabat } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useMemo, useState } from "react";

interface PegawaiComboboxProps {
  items: Pejabat[];
  value?: string;
  placeholder?: string;
  onSelect: (p: Pejabat | null) => void;
  className?: string;
}

export function PegawaiCombobox({
  items,
  value,
  placeholder = "Pilih pegawai...",
  onSelect,
  className,
}: PegawaiComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = useMemo(() => items.find((p) => p.id === value), [items, value]);

  const filtered = useMemo(() => {
    if (!search) return items;
    const lc = search.toLowerCase();
    return items.filter(
      (p) =>
        p.nama.toLowerCase().includes(lc) ||
        p.nip.includes(lc) ||
        (p.jabatan ?? "").toLowerCase().includes(lc),
    );
  }, [items, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-sm transition-colors hover:bg-accent/30 focus:outline-none focus:ring-2 focus:ring-ring/50",
            className,
          )}
        >
          {selected ? (
            <span className="truncate text-left font-medium">{selected.nama}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari nama, NIP, atau jabatan..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Tidak ada pegawai ditemukan</CommandEmpty>
            <CommandGroup>
              {value && (
                <CommandItem
                  value="__clear__"
                  onSelect={() => {
                    onSelect(null);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <X className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Kosongkan pilihan</span>
                </CommandItem>
              )}
              {filtered.map((p) => (
                <CommandItem
                  key={p.id}
                  value={p.id}
                  onSelect={() => {
                    onSelect(p);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-3.5 w-3.5 shrink-0",
                      value === p.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className={cn("truncate text-sm", value === p.id && "font-medium")}>
                        {p.nama}
                      </p>
                      {p.jabatan && (
                        <p className="truncate text-xs text-muted-foreground">{p.jabatan}</p>
                      )}
                    </div>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {p.nip}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
