import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import PersonSchema from "@/components/PersonaSchema";

/**
 * Chrome for the public site. Lives here rather than the root layout so that
 * /admin and /signin don't inherit the portfolio navbar, footer, and Person schema.
 * Pages own their own <main>.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <PersonSchema />
            {children}
            <Footer />
        </>
    );
}
