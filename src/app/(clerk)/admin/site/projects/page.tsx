import { getSiteData } from "@/lib/site-content";
import { ProjectsEditor } from "@/components/admin/site/projects-editor";

export const dynamic = "force-dynamic";

export default async function ProjectsEditorPage() {
    return <ProjectsEditor data={await getSiteData()} />;
}
