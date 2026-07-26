import { listUploadsWithUsage, ORPHAN_GRACE_MS } from "@/lib/uploads";
import { MediaManager } from "@/components/admin/media-manager";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
    const items = await listUploadsWithUsage();
    return <MediaManager items={items} graceHours={ORPHAN_GRACE_MS / 3_600_000} />;
}
