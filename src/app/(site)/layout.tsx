import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import PersonSchema from "@/components/PersonaSchema";
import { getSiteData } from "@/lib/site-content";

/**
 * Chrome for the public site. Lives here rather than the root layout so that
 * /admin and /signin don't inherit the portfolio navbar, footer, and Person schema.
 * Pages own their own <main>.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
    const { name, socialLinks } = await getSiteData();

    return (
        // The root body is mono for the admin; the public site reads in the sans.
        // .site-root also switches globals.css to the navy & gold palette.
        <div className="site-root font-sans">
            <Navbar />
            <PersonSchema />
            {children}
            <Footer name={name} socialLinks={socialLinks} />
        </div>
    );
}
