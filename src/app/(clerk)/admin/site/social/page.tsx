import { getSiteData } from "@/lib/site-content";
import { SocialEditor } from "@/components/admin/site/social-editor";

export const dynamic = "force-dynamic";

export default async function SocialEditorPage() {
    return <SocialEditor data={await getSiteData()} />;
}
