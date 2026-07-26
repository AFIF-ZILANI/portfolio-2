"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { togglePostStatus } from "@/app/(clerk)/admin/actions";
import { runAction } from "@/components/admin/run-action";

/** One-click publish / unpublish from the post list. */
export function StatusToggle({
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
            const res = await runAction(() => togglePostStatus(id));
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
