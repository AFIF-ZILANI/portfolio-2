"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionShell } from "@/components/admin/section-shell";
import { ListEditor } from "@/components/admin/list-editor";
import type { Experience, SiteData } from "@/lib/site-data";

const labelClass = "font-mono text-xs uppercase tracking-wider text-muted-foreground";

export function ExperienceEditor({ data }: { data: SiteData }) {
    const [experiences, setExperiences] = useState<Experience[]>(data.experiences);

    return (
        <SectionShell
            title="experience"
            description="The timeline, rendered top-to-bottom in this order."
            resetKeys={["experiences"]}
            buildPatch={() => ({ experiences })}
        >
            <ListEditor
                items={experiences}
                onChange={setExperiences}
                addLabel="add role"
                rowTitle={(e) => `${e.role}${e.company ? ` @ ${e.company}` : ""}`}
                makeEmpty={() => ({
                    id: crypto.randomUUID(),
                    company: "",
                    role: "",
                    period: "",
                    description: "",
                })}
                renderRow={(item, update) => (
                    <div className="space-y-3">
                        <div className="grid sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className={labelClass}>Role</Label>
                                <Input
                                    value={item.role}
                                    onChange={(e) => update({ role: e.target.value })}
                                    placeholder="Co-Founder & Full-Stack Developer"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className={labelClass}>Company</Label>
                                <Input
                                    value={item.company}
                                    onChange={(e) => update({ company: e.target.value })}
                                    placeholder="ZeroD Agencies"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className={labelClass}>Period</Label>
                            <Input
                                value={item.period}
                                onChange={(e) => update({ period: e.target.value })}
                                placeholder="2022 — Present"
                                className="font-mono text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className={labelClass}>Description</Label>
                            <Textarea
                                value={item.description}
                                onChange={(e) => update({ description: e.target.value })}
                                rows={4}
                            />
                        </div>
                    </div>
                )}
            />
        </SectionShell>
    );
}
