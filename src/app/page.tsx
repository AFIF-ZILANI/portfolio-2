"use client";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
// import { Events } from "@/components/sections/events";
import { Contact } from "@/components/sections/contact";
import { useEffect } from "react";

export default function Home() {
    useEffect(() => {
        window.history.scrollRestoration = "manual";
        window.scrollTo(0, 0);

        const hash = window.location.hash.slice(1);
        if (!hash) return;
        setTimeout(() => {
            document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        }, 300);
    }, []);
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
