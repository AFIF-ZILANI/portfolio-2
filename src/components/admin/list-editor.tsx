"use client";

import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Add / remove / reorder rows of an array, with each row's fields rendered by the
 * caller. Used by social links, skills, projects, experience, and stats.
 *
 * ponytail: one small component reused five times rather than five bespoke list UIs.
 * Reordering is two buttons, not drag-and-drop — no dnd dependency for a list only
 * one person ever touches.
 */
export function ListEditor<T>({
    items,
    onChange,
    makeEmpty,
    renderRow,
    rowTitle,
    addLabel = "add item",
}: {
    items: T[];
    onChange: (next: T[]) => void;
    makeEmpty: () => T;
    renderRow: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
    rowTitle: (item: T, index: number) => string;
    addLabel?: string;
}) {
    function update(index: number, patch: Partial<T>) {
        onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
    }

    function remove(index: number) {
        onChange(items.filter((_, i) => i !== index));
    }

    function move(index: number, delta: number) {
        const target = index + delta;
        if (target < 0 || target >= items.length) return;
        const next = [...items];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
    }

    return (
        <div className="space-y-3">
            {items.length === 0 && (
                <p className="text-sm text-muted-foreground font-mono border border-dashed border-border p-8 text-center">
                    Nothing here yet.
                </p>
            )}

            {items.map((item, i) => (
                <div key={i} className="border border-border">
                    <div className="flex items-center gap-2 px-3 py-2 bg-card border-b border-border">
                        <span className="font-mono text-xs text-muted-foreground shrink-0">
                            {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-mono text-sm truncate flex-1">
                            {rowTitle(item, i) || "(untitled)"}
                        </span>
                        <button
                            type="button"
                            onClick={() => move(i, -1)}
                            disabled={i === 0}
                            aria-label="Move up"
                            className="p-1 text-muted-foreground hover:text-primary disabled:opacity-30 disabled:hover:text-muted-foreground"
                        >
                            <ChevronUp size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => move(i, 1)}
                            disabled={i === items.length - 1}
                            aria-label="Move down"
                            className="p-1 text-muted-foreground hover:text-primary disabled:opacity-30 disabled:hover:text-muted-foreground"
                        >
                            <ChevronDown size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => remove(i)}
                            aria-label={`Remove ${rowTitle(item, i)}`}
                            className="p-1 text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                    <div className="p-4 space-y-3">
                        {renderRow(item, (patch) => update(i, patch), i)}
                    </div>
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onChange([...items, makeEmpty()])}
                className="font-mono text-xs"
            >
                <Plus size={14} /> {addLabel}
            </Button>
        </div>
    );
}
