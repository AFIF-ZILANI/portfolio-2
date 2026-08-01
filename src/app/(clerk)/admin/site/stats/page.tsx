import { getStoredSiteData } from "@/lib/site-content";
import { StatsEditor } from "@/components/admin/site/stats-editor";

export const dynamic = "force-dynamic";

export default async function StatsEditorPage() {
    return <StatsEditor data={await getStoredSiteData()} />;
}
