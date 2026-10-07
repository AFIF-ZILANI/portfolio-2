"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionShell } from "@/components/admin/section-shell";
import { ImageField } from "@/components/admin/image-field";
import type { ImageRef } from "@/lib/image-utils";
import type { ResolvedSiteData } from "@/lib/site-data";

const labelClass = "font-mono text-xs uppercase tracking-wider text-muted-foreground";

export function ProfileEditor({ data }: { data: ResolvedSiteData }) {
    const [name, setName] = useState(data.name);
    const [title, setTitle] = useState(data.title);
    const [tagline, setTagline] = useState(data.tagline);
    // Each line of the bio renders as its own paragraph in the About section, so
    // it's edited as one textarea and split on newlines.
    const [bio, setBio] = useState(data.bio.join("\n"));
    const [heroImage, setHeroImage] = useState<ImageRef | null>(data.heroImage);
    const [aboutImage, setAboutImage] = useState<ImageRef | null>(data.aboutImage);

    return (
        <SectionShell
            title="profile"
            description="Name, headline, bio, and the two portrait images."
            resetKeys={["name", "title", "tagline", "bio", "heroImageId", "aboutImageId"]}
            buildPatch={() => ({
                name,
                title,
                tagline,
                bio: bio
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean),
                heroImageId: heroImage?.id ?? "",
                aboutImageId: aboutImage?.id ?? "",
            })}
        >
            <section className="border border-border p-4 space-y-4">
                <div className="space-y-2">
                    <Label className={labelClass}>Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label className={labelClass}>Headline</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    <p className="text-xs text-muted-foreground">
                        Shown above your name in the hero, e.g. “Co-Founder & CEO, ZeroD Farm”.
                    </p>
                </div>
                <div className="space-y-2">
                    <Label className={labelClass}>Tagline</Label>
                    <Textarea
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        rows={3}
                    />
                </div>
            </section>

            <section className="border border-border p-4 space-y-2">
                <Label className={labelClass}>Bio — one paragraph per row</Label>
                <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                    Each row becomes its own paragraph in the About section. Blank rows
                    are dropped.
                </p>
            </section>

            <section className="border border-border p-4 grid sm:grid-cols-2 gap-6">
                <ImageField label="Hero image" value={heroImage} onChange={setHeroImage} />
                <ImageField label="About image" value={aboutImage} onChange={setAboutImage} />
            </section>
        </SectionShell>
    );
}
