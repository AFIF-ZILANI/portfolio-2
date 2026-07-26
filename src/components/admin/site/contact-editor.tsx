"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionShell } from "@/components/admin/section-shell";
import type { SiteData } from "@/lib/site-data";

const labelClass = "font-mono text-xs uppercase tracking-wider text-muted-foreground";

export function ContactEditor({ data, envEmail }: { data: SiteData; envEmail: string | null }) {
    const [heading, setHeading] = useState(data.contact.heading);
    const [email, setEmail] = useState(data.contact.email);

    return (
        <SectionShell
            title="contact"
            description="The section heading and where the form delivers."
            resetKeys={["contact"]}
            buildPatch={() => ({ contact: { heading, email } })}
        >
            <section className="border border-border p-4 space-y-4">
                <div className="space-y-2">
                    <Label className={labelClass}>Section heading</Label>
                    <Input value={heading} onChange={(e) => setHeading(e.target.value)} />
                    <p className="text-xs text-muted-foreground">
                        Rendered after the “05.” prefix.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label className={labelClass}>Delivery email</Label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={envEmail ?? "not set"}
                        className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                        Leave blank to keep using the{" "}
                        <code className="text-primary">CONTACT_EMAIL</code> environment variable
                        {envEmail ? ` (currently ${envEmail}).` : " (currently unset)."}
                    </p>
                </div>
            </section>
        </SectionShell>
    );
}
