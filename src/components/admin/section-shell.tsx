"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RotateCcw, Save } from "lucide-react";
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
import { resetSiteSection, saveSiteSection } from "@/app/(clerk)/admin/site-actions";
import type { SiteData } from "@/lib/site-data";
import { runAction } from "@/components/admin/run-action";

/**
 * Header + save/reset buttons shared by every site-content editor page.
 * `buildPatch` returns just this section's slice of SiteData.
 */
export function SectionShell({
    title,
    description,
    resetKeys,
    buildPatch,
    children,
}: {
    title: string;
    description?: string;
    resetKeys: (keyof SiteData)[];
    buildPatch: () => Partial<SiteData>;
    children: ReactNode;
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);

    function save() {
        startTransition(async () => {
            const res = await runAction(() => saveSiteSection(buildPatch()));
            if (!res.ok) {
                toast.error(res.error);
                return;
            }
            toast.success("Saved — live on the site");
            setSaved(true);
            router.refresh();
        });
    }

    function reset() {
        startTransition(async () => {
            const res = await runAction(() => resetSiteSection(resetKeys));
            if (!res.ok) {
                toast.error(res.error);
                return;
            }
            toast.success("Reset to defaults");
            router.refresh();
        });
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold font-mono">
                        <span className="text-primary">$</span> {title}
                    </h1>
                    {description && (
                        <p className="text-sm text-muted-foreground mt-1">{description}</p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="font-mono text-xs">
                                <RotateCcw size={14} /> reset
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="font-mono">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Reset this section?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Restores the built-in defaults for {title}. Your other sections
                                    are untouched.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={reset}>Reset</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button onClick={save} disabled={pending} className="font-mono">
                        <Save size={16} />
                        {pending ? "saving…" : saved ? "save again" : "save"}
                    </Button>
                </div>
            </div>

            {children}
        </div>
    );
}
