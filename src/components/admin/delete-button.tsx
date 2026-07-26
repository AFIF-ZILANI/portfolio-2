"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/** Confirm-then-delete, shared by the post list and the series list. */
export function DeleteButton({
    onDelete,
    name,
    note,
}: {
    onDelete: () => Promise<void>;
    name: string;
    note?: string;
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button
                    type="button"
                    aria-label={`Delete ${name}`}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                >
                    <Trash2 size={16} />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="font-mono">
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete “{name}”?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {note ?? "This cannot be undone."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={pending}
                        onClick={() =>
                            startTransition(async () => {
                                try {
                                    await onDelete();
                                    toast.success(`Deleted “${name}”`);
                                    router.refresh();
                                } catch {
                                    toast.error("Delete failed.");
                                }
                            })
                        }
                    >
                        {pending ? "deleting…" : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
