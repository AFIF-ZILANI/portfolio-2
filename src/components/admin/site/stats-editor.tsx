"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionShell } from "@/components/admin/section-shell";
import { ListEditor } from "@/components/admin/list-editor";
import type { SiteData, SiteStats } from "@/lib/site-data";

const labelClass = "font-mono text-xs uppercase tracking-wider text-muted-foreground";

export function StatsEditor({ data }: { data: SiteData }) {
    const [stats, setStats] = useState<SiteStats[]>(data.stats);

    return (
        <SectionShell
            title="stats"
            description="The counter tiles in the About section."
            resetKeys={["stats"]}
            buildPatch={() => ({ stats })}
        >
            <div className="border border-border p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <div key={i} className="text-center">
                        <p className="text-2xl font-bold text-primary font-mono">
                            {s.value || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">{s.label}</p>
                    </div>
                ))}
            </div>

            <ListEditor
                items={stats}
                onChange={setStats}
                addLabel="add stat"
                rowTitle={(s) => `${s.value} ${s.label}`}
                makeEmpty={() => ({ key: crypto.randomUUID().slice(0, 8), value: "", label: "" })}
                renderRow={(stat, update) => (
                    <div className="grid sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className={labelClass}>Value</Label>
                            <Input
                                value={stat.value}
                                onChange={(e) => update({ value: e.target.value })}
                                placeholder="40+"
                                className="font-mono"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className={labelClass}>Label</Label>
                            <Input
                                value={stat.label}
                                onChange={(e) => update({ label: e.target.value })}
                                placeholder="shipped"
                                className="font-mono"
                            />
                        </div>
                    </div>
                )}
            />
        </SectionShell>
    );
}
