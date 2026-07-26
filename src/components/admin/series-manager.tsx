"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Pencil, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteSeries, upsertSeries } from "@/app/(clerk)/admin/actions";

export type SeriesRow = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    postCount: number;
};

export function SeriesManager({ rows }: { rows: SeriesRow[] }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [editing, setEditing] = useState<string | null>(null);
    const [draft, setDraft] = useState({ title: "", description: "" });
    const [creating, setCreating] = useState(false);

    function save(id?: string) {
        startTransition(async () => {
            const res = await upsertSeries({ id, ...draft });
            if (!res.ok) {
                toast.error(res.error);
                return;
            }
            toast.success(id ? "Series updated" : "Series created");
            setEditing(null);
            setCreating(false);
            setDraft({ title: "", description: "" });
            router.refresh();
        });
    }

    const form = (id?: string) => (
        <div className="space-y-2 flex-1">
            <Input
                autoFocus
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="Series title"
            />
            <Textarea
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                placeholder="Short description (optional)"
                rows={2}
                className="text-sm"
            />
            <div className="flex gap-2">
                <Button size="sm" disabled={pending} onClick={() => save(id)}>
                    <Check size={14} /> save
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                        setEditing(null);
                        setCreating(false);
                    }}
                >
                    <X size={14} /> cancel
                </Button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold font-mono">
                    <span className="text-primary">$</span> ls series
                    <span className="text-muted-foreground text-sm ml-3">({rows.length})</span>
                </h1>
                {!creating && (
                    <Button
                        className="font-mono"
                        onClick={() => {
                            setDraft({ title: "", description: "" });
                            setCreating(true);
                        }}
                    >
                        <Plus size={16} /> new series
                    </Button>
                )}
            </div>

            {creating && <div className="border border-border p-4">{form()}</div>}

            {rows.length === 0 && !creating ? (
                <p className="text-muted-foreground font-mono text-sm border border-dashed border-border p-12 text-center">
                    No series yet.
                </p>
            ) : (
                <div className="border border-border divide-y divide-border">
                    {rows.map((s) => (
                        <div key={s.id} className="p-4 flex items-start gap-4">
                            {editing === s.id ? (
                                form(s.id)
                            ) : (
                                <>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium">{s.title}</p>
                                        {s.description && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {s.description}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground font-mono mt-1">
                                            {s.slug} · {s.postCount}{" "}
                                            {s.postCount === 1 ? "post" : "posts"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            type="button"
                                            aria-label={`Edit ${s.title}`}
                                            onClick={() => {
                                                setDraft({
                                                    title: s.title,
                                                    description: s.description ?? "",
                                                });
                                                setEditing(s.id);
                                            }}
                                            className="text-muted-foreground hover:text-primary transition-colors p-1"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <DeleteButton
                                            name={s.title}
                                            note={`Its ${s.postCount} post(s) will be kept, just detached from the series.`}
                                            onDelete={async () => {
                                                await deleteSeries(s.id);
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
