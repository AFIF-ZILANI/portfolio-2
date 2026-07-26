"use client";

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SKILL_ICON_NAMES, SkillIcon } from "@/lib/icons";

/** Grid of the curated skill icons with a name filter. */
export function IconPicker({
    value,
    onChange,
}: {
    value: string;
    onChange: (name: string) => void;
}) {
    const [query, setQuery] = useState("");

    const matches = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return SKILL_ICON_NAMES;
        return SKILL_ICON_NAMES.filter((n) => n.toLowerCase().includes(q));
    }, [query]);

    return (
        <div className="space-y-2">
            <div className="relative">
                <Search
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="filter icons…"
                    className="pl-8 font-mono text-xs h-8"
                />
            </div>

            <div className="grid grid-cols-8 gap-1 max-h-40 overflow-y-auto border border-border p-2">
                {matches.map((name) => {
                    const active = name === value;
                    return (
                        <button
                            key={name}
                            type="button"
                            title={name.replace(/^Si/, "")}
                            aria-label={name}
                            aria-pressed={active}
                            onClick={() => onChange(name)}
                            className={`relative grid place-items-center aspect-square border transition-colors ${
                                active
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                            }`}
                        >
                            <SkillIcon name={name} size={18} />
                            {active && (
                                <Check
                                    size={9}
                                    className="absolute top-0.5 right-0.5 text-primary"
                                />
                            )}
                        </button>
                    );
                })}
                {matches.length === 0 && (
                    <p className="col-span-8 text-xs text-muted-foreground font-mono py-3 text-center">
                        no icon matches “{query}”
                    </p>
                )}
            </div>
        </div>
    );
}
