"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SectionShell } from "@/components/admin/section-shell";
import { ListEditor } from "@/components/admin/list-editor";
import { SOCIAL_ICON_KEYS, SocialIconGlyph } from "@/lib/icons";
import type { SiteData, SocialIcon, SocialLink } from "@/lib/site-data";

const labelClass = "font-mono text-xs uppercase tracking-wider text-muted-foreground";

export function SocialEditor({ data }: { data: SiteData }) {
    const [links, setLinks] = useState<SocialLink[]>(data.socialLinks);

    return (
        <SectionShell
            title="social_links"
            description="Shown in the About panel and the footer. Order here is the order there."
            resetKeys={["socialLinks"]}
            buildPatch={() => ({ socialLinks: links })}
        >
            <ListEditor
                items={links}
                onChange={setLinks}
                addLabel="add link"
                rowTitle={(l) => l.label || l.href}
                makeEmpty={(): SocialLink => ({
                    id: crypto.randomUUID(),
                    label: "",
                    href: "",
                    icon: "website",
                })}
                renderRow={(link, update) => (
                    <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-start">
                        <div className="space-y-1.5">
                            <Label className={labelClass}>Label</Label>
                            <Input
                                value={link.label}
                                onChange={(e) => update({ label: e.target.value })}
                                placeholder="github/"
                                className="font-mono text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className={labelClass}>URL</Label>
                            <Input
                                value={link.href}
                                onChange={(e) => update({ href: e.target.value })}
                                placeholder="https://… or mailto:…"
                                className="font-mono text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className={labelClass}>Icon</Label>
                            <Select
                                value={link.icon}
                                onValueChange={(v) => update({ icon: v as SocialIcon })}
                            >
                                <SelectTrigger className="font-mono text-sm w-[150px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SOCIAL_ICON_KEYS.map((key) => (
                                        <SelectItem key={key} value={key}>
                                            <span className="flex items-center gap-2">
                                                <SocialIconGlyph name={key} size={14} />
                                                {key}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
            />
        </SectionShell>
    );
}
