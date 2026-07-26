import { getSiteData } from "@/lib/site-content";
import { ContactEditor } from "@/components/admin/site/contact-editor";

export const dynamic = "force-dynamic";

export default async function ContactEditorPage() {
    return (
        <ContactEditor
            data={await getSiteData()}
            // Read on the server so the placeholder can show the current fallback.
            envEmail={process.env.CONTACT_EMAIL ?? null}
        />
    );
}
