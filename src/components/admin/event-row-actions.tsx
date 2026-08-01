"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { deleteEvent, toggleEventStatus } from "@/app/(clerk)/admin/event-actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { runAction } from "@/components/admin/run-action";

/**
 * The event list is a server component, so it can't hand closures to these without
 * creating an inline Server Action per row. Same indirection the post list uses.
 */
export function DeleteEventButton({ id, title }: { id: string; title: string }) {
    return <DeleteButton name={title} onDelete={() => deleteEvent(id)} />;
}

/** One-click publish / unpublish. The gallery rule is re-checked server-side. */
export function EventStatusToggle({
    id,
    title,
    status,
}: {
    id: string;
    title: string;
    status: "DRAFT" | "PUBLISHED";
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const isDraft = status === "DRAFT";

    function toggle() {
        startTransition(async () => {
            const res = await runAction(() => toggleEventStatus(id));
            if (!res.ok) {
                toast.error(res.error);
                return;
            }
            toast.success(isDraft ? `Published “${title}”` : `Unpublished “${title}”`);
            router.refresh();
        });
    }

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={pending}
            title={isDraft ? "Publish now" : "Move back to draft"}
            className={`flex items-center gap-1.5 px-2 py-1 border font-mono text-xs transition-colors disabled:opacity-50 ${
                isDraft
                    ? "border-border text-muted-foreground hover:border-primary hover:text-primary"
                    : "border-primary/40 text-primary hover:border-primary"
            }`}
        >
            {isDraft ? <Eye size={13} /> : <EyeOff size={13} />}
            {pending ? "…" : isDraft ? "publish" : "unpublish"}
        </button>
    );
}
