import About from "@/components/sections/About";
import ContactForm from "@/components/sections/ContactMe";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import SplitText from "@/components/blocks/TextAnimations/SplitText/SplitText";

export default function Home() {
    return (
        <div>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <section id="contact" className="flex flex-col sm:w-xl items-center mb-32 mx-auto">
                <SplitText
                    text="Contact Me"
                    className="text-4xl font-semibold text-center text-primary mb-12"
                    delay={100}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                />
                <ContactForm />
            </section>
        </div>
    );
}
