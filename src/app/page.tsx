import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
// import { Events } from "@/components/sections/events";
import { Contact } from "@/components/sections/contact";

export default function Home() {
    return (
        <main className="flex flex-col">
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            {/* <Events /> */}
            <Contact />
        </main>
    );
}
