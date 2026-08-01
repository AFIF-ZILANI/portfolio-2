"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SectionShell } from "@/components/admin/section-shell";
import { ListEditor } from "@/components/admin/list-editor";
import { ImageField } from "@/components/admin/image-field";
import type { ResolvedProject, ResolvedSiteData } from "@/lib/site-data";

const labelClass = "font-mono text-xs uppercase tracking-wider text-muted-foreground";

export function ProjectsEditor({ data }: { data: ResolvedSiteData }) {
    const [projects, setProjects] = useState<ResolvedProject[]>(data.projects);
    const featuredCount = projects.filter((p) => p.featured).length;

    return (
        <SectionShell
            title="projects"
            description="Only projects marked featured appear on the homepage."
            resetKeys={["projects"]}
            buildPatch={() => ({
                projects: projects.map(({ coverImage, ...p }) => ({
                    ...p,
                    coverImageId: coverImage?.id ?? "",
                })),
            })}
        >
            <p className="font-mono text-xs text-muted-foreground border border-border p-3">
                {featuredCount} of {projects.length} featured — shown on the homepage
            </p>

            <ListEditor
                items={projects}
                onChange={setProjects}
                addLabel="add project"
                rowTitle={(p) => `${p.title}${p.featured ? "" : "  (hidden)"}`}
                makeEmpty={() => ({
                    id: crypto.randomUUID(),
                    title: "",
                    description: "",
                    tech: [],
                    github: "",
                    live: "",
                    coverImage: null,
                    featured: true,
                })}
                renderRow={(project, update) => (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-4">
                            <div className="space-y-1.5 flex-1">
                                <Label className={labelClass}>Title</Label>
                                <Input
                                    value={project.title}
                                    onChange={(e) => update({ title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5 shrink-0">
                                <Label className={labelClass}>Featured</Label>
                                <div className="h-9 flex items-center">
                                    <Switch
                                        checked={project.featured}
                                        onCheckedChange={(featured) => update({ featured })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className={labelClass}>Description</Label>
                            <Textarea
                                value={project.description}
                                onChange={(e) => update({ description: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className={labelClass}>Tech — comma separated</Label>
                            <Input
                                value={project.tech.join(", ")}
                                onChange={(e) =>
                                    update({
                                        tech: e.target.value
                                            .split(",")
                                            .map((t) => t.trim())
                                            .filter(Boolean),
                                    })
                                }
                                placeholder="React, Next.js, Tailwind CSS"
                                className="font-mono text-xs"
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className={labelClass}>Live URL</Label>
                                <Input
                                    value={project.live}
                                    onChange={(e) => update({ live: e.target.value })}
                                    placeholder="https://…"
                                    className="font-mono text-xs"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className={labelClass}>GitHub URL</Label>
                                <Input
                                    value={project.github}
                                    onChange={(e) => update({ github: e.target.value })}
                                    placeholder="leave blank to hide the icon"
                                    className="font-mono text-xs"
                                />
                            </div>
                        </div>

                        <ImageField
                            label="Cover image"
                            value={project.coverImage}
                            onChange={(coverImage) => update({ coverImage })}
                        />
                    </div>
                )}
            />
        </SectionShell>
    );
}
