"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionShell } from "@/components/admin/section-shell";
import { ImageField } from "@/components/admin/image-field";
import type { SiteData } from "@/lib/site-data";

const labelClass = "font-mono text-xs uppercase tracking-wider text-muted-foreground";

export function ProfileEditor({ data }: { data: SiteData }) {
    const [name, setName] = useState(data.name);
    const [title, setTitle] = useState(data.title);
    const [tagline, setTagline] = useState(data.tagline);
    // The bio renders as separate lines in the About terminal, so it's edited as
    // one textarea and split on newlines.
    const [bio, setBio] = useState(data.bio.join("\n"));
    const [heroImage, setHeroImage] = useState<string | null>(data.heroImage);
    const [aboutImage, setAboutImage] = useState<string | null>(data.aboutImage);

    return (
        <SectionShell
            title="profile"
            description="Name, headline, bio, and the two portrait images."
            resetKeys={["name", "title", "tagline", "bio", "heroImage", "aboutImage"]}
            buildPatch={() => ({
                name,
                title,
                tagline,
                bio: bio
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean),
                heroImage: heroImage ?? data.heroImage,
                aboutImage: aboutImage ?? data.aboutImage,
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
                        Shown under your name in the hero, e.g. “Full-Stack Developer.”
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
                <Label className={labelClass}>Bio — one line per row</Label>
                <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                    Each line prints as its own line in the About terminal animation.
                    Blank lines are dropped.
                </p>
            </section>

            <section className="border border-border p-4 grid sm:grid-cols-2 gap-6">
                <ImageField label="Hero image" value={heroImage} onChange={setHeroImage} />
                <ImageField label="About image" value={aboutImage} onChange={setAboutImage} />
            </section>
        </SectionShell>
    );
}
