import { getSiteData } from "@/lib/site-content";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";
import { ProfilePageSchema } from "@/components/PersonaSchema";
import { ScrollToHash } from "@/components/layout/scroll-to-hash";

// A server component now: content comes from the database and is edited at
// /admin/site/*. Saving there calls revalidatePath("/"), so this window is only
// a backstop.
export const revalidate = 60;

export default async function Home() {
    const data = await getSiteData();

    return (
        <main className="flex flex-col">
            <ScrollToHash />
            <Hero data={data} />
            <About data={data} />
            <Skills skills={data.skills} />
            <Projects projects={data.projects} />
            <Experience experiences={data.experiences} />
            <Contact heading={data.contact.heading} />
            <ProfilePageSchema />
        </main>
    );
}
