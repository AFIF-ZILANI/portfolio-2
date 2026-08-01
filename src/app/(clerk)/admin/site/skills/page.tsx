import { getStoredSiteData } from "@/lib/site-content";
import { SkillsEditor } from "@/components/admin/site/skills-editor";

export const dynamic = "force-dynamic";

export default async function SkillsEditorPage() {
    return <SkillsEditor data={await getStoredSiteData()} />;
}
