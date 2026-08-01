import { getStoredSiteData } from "@/lib/site-content";
import { ExperienceEditor } from "@/components/admin/site/experience-editor";

export const dynamic = "force-dynamic";

export default async function ExperienceEditorPage() {
    return <ExperienceEditor data={await getStoredSiteData()} />;
}
