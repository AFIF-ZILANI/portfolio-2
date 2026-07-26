"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionShell } from "@/components/admin/section-shell";
import { ListEditor } from "@/components/admin/list-editor";
import { IconPicker } from "@/components/admin/icon-picker";
import { SkillIcon } from "@/lib/icons";
import type { SiteData, Skill } from "@/lib/site-data";

const labelClass = "font-mono text-xs uppercase tracking-wider text-muted-foreground";

export function SkillsEditor({ data }: { data: SiteData }) {
    const [skills, setSkills] = useState<Skill[]>(data.skills);

    // Categories become the column headings on the site, in first-seen order.
    const categories = [...new Set(skills.map((s) => s.category).filter(Boolean))];

    return (
        <SectionShell
            title="skills"
            description="Grouped into columns by category, in the order categories first appear."
            resetKeys={["skills"]}
            buildPatch={() => ({ skills })}
        >
            <div className="border border-border p-3 flex flex-wrap gap-2 font-mono text-xs">
                <span className="text-muted-foreground">columns:</span>
                {categories.length ? (
                    categories.map((c) => (
                        <span key={c} className="text-primary">
                            {c}
                        </span>
                    ))
                ) : (
                    <span className="text-muted-foreground">none yet</span>
                )}
            </div>

            <ListEditor
                items={skills}
                onChange={setSkills}
                addLabel="add skill"
                rowTitle={(s) => `${s.name}${s.category ? ` — ${s.category}` : ""}`}
                makeEmpty={() => ({
                    id: crypto.randomUUID(),
                    name: "",
                    category: categories[0] ?? "Languages",
                    icon: "SiTypescript",
                })}
                renderRow={(skill, update) => (
                    <div className="space-y-3">
                        <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                            <div className="space-y-1.5">
                                <Label className={labelClass}>Name</Label>
                                <Input
                                    value={skill.name}
                                    onChange={(e) => update({ name: e.target.value })}
                                    placeholder="TypeScript"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className={labelClass}>Category</Label>
                                <Input
                                    value={skill.category}
                                    onChange={(e) => update({ category: e.target.value })}
                                    placeholder="Languages"
                                    list="skill-categories"
                                />
                            </div>
                            <div className="border border-border size-10 grid place-items-center shrink-0">
                                <SkillIcon name={skill.icon} size={22} className="text-primary" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className={labelClass}>Icon</Label>
                            <IconPicker
                                value={skill.icon}
                                onChange={(icon) => update({ icon })}
                            />
                        </div>
                    </div>
                )}
            />

            {/* Native datalist so typing a category offers the ones already in use. */}
            <datalist id="skill-categories">
                {categories.map((c) => (
                    <option key={c} value={c} />
                ))}
            </datalist>
        </SectionShell>
    );
}
