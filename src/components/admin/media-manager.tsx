"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { cleanupUnusedImages } from "@/app/(clerk)/admin/actions";
import { runAction } from "@/components/admin/run-action";

export type MediaItem = {
    id: string;
    url: string;
    publicId: string | null;
    bytes: number;
    createdAt: Date;
    alt: string;
    inUse: boolean;
    managed: boolean;
    protectedByGrace: boolean;
};

const kb = (b: number) => (b > 0 ? `${Math.round(b / 1024)} KB` : "—");

export function MediaManager({ items, graceHours }: { items: MediaItem[]; graceHours: number }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const deletable = items.filter((i) => !i.inUse && !i.protectedByGrace);
    const waiting = items.filter((i) => !i.inUse && i.protectedByGrace);
    const wastedKb = deletable.reduce((sum, i) => sum + i.bytes, 0);

    function cleanup() {
        startTransition(async () => {
            const res = await runAction(() => cleanupUnusedImages());
            if (!res.ok) {
                toast.error(res.error);
                return;
            }
            toast.success(
                res.deleted === 0
                    ? "Nothing to clean up"
                    : `Deleted ${res.deleted} unused image${res.deleted === 1 ? "" : "s"}`
            );
            router.refresh();
        });
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold font-mono">
                        <span className="text-primary">$</span> ls media
                        <span className="text-muted-foreground text-sm ml-3">({items.length})</span>
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Images uploaded through the admin panel. “In use” is worked out by
                        scanning posts, drafts, post bodies, and site content — not a stored flag,
                        so it can’t go stale.
                    </p>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="outline"
                            disabled={pending || deletable.length === 0}
                            className="font-mono"
                        >
                            <Trash2 size={15} />
                            {pending ? "cleaning…" : `delete ${deletable.length} unused`}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="font-mono">
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete {deletable.length} unused image
                                {deletable.length === 1 ? "" : "s"}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Removes them from Cloudinary permanently, freeing about{" "}
                                {Math.round(wastedKb / 1024)} MB. Anything referenced by a post
                                (including drafts) or by your site content is left alone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={cleanup}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="border border-border p-3">
                    <p className="text-lg text-primary">{items.filter((i) => i.inUse).length}</p>
                    <p className="text-muted-foreground">in use</p>
                </div>
                <div className="border border-border p-3">
                    <p className="text-lg">{deletable.length}</p>
                    <p className="text-muted-foreground">unused, deletable</p>
                </div>
                <div className="border border-border p-3">
                    <p className="text-lg">{waiting.length}</p>
                    <p className="text-muted-foreground">unused, &lt; {graceHours}h old</p>
                </div>
            </div>

            {items.length === 0 ? (
                <p className="text-muted-foreground font-mono text-sm border border-dashed border-border p-12 text-center">
                    No uploads yet.
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item) => (
                        <figure key={item.id} className="border border-border">
                            <div className="relative aspect-video bg-muted">
                                <Image
                                    src={item.url}
                                    alt=""
                                    fill
                                    sizes="240px"
                                    className="object-cover"
                                />
                            </div>
                            <figcaption className="p-2 font-mono text-xs space-y-1">
                                <span
                                    className={
                                        item.inUse
                                            ? "text-primary"
                                            : item.protectedByGrace
                                              ? "text-muted-foreground"
                                              : "text-destructive"
                                    }
                                >
                                    {item.inUse
                                        ? "in use"
                                        : item.protectedByGrace
                                          ? "new, kept"
                                          : "unused"}
                                </span>
                                <p className="text-muted-foreground truncate" title={item.publicId ?? "not managed by Cloudinary"}>
                                    {item.publicId ?? "static / external"}
                                </p>
                                <p className="text-muted-foreground">{kb(item.bytes)}</p>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            )}
        </div>
    );
}
