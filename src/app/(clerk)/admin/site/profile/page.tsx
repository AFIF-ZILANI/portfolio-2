import { getSiteData } from "@/lib/site-content";
import { ProfileEditor } from "@/components/admin/site/profile-editor";

export const dynamic = "force-dynamic";

export default async function ProfileEditorPage() {
    return <ProfileEditor data={await getSiteData()} />;
}
