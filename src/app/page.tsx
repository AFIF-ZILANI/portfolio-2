import About from "@/components/sections/About";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";

export default function Home() {
    return (
        <div className="space-y-4">
            <Hero />
            <About />
            <Skills />
        </div>
    );
}
