import { getSiteData } from "@/lib/site-content";
import { getPublishedPosts } from "@/lib/blog";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Farm } from "@/components/sections/farm";
import { Contact } from "@/components/sections/contact";
import { ProfilePageSchema } from "@/components/PersonaSchema";
import { LatestPosts } from "@/components/sections/latest-posts";
import { LatestEvents } from "@/components/sections/latest-events";
import { getPublishedEvents } from "@/lib/events";

// A server component: content comes from the database and is edited at
// /admin/site/*. Saving there calls revalidatePath("/"), so this window is only
// a backstop.
export const revalidate = 60;

export default async function Home() {
    const [data, posts, events] = await Promise.all([
        getSiteData(),
        getPublishedPosts(),
        getPublishedEvents(3),
    ]);

    const publicEmail =
        data.socialLinks.find((l) => l.icon === "email")?.href.replace(/^mailto:/, "") || null;

    return (
        <main id="main" className="flex flex-col">
            <Hero data={data} />
            <About data={data} />
            <Farm experiences={data.experiences} />
            <LatestPosts posts={posts.slice(0, 3)} />
            <LatestEvents events={events} />
            <Contact heading={data.contact.heading} email={publicEmail} />
            <ProfilePageSchema />
        </main>
    );
}
