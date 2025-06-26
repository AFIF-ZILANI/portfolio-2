import PixelCard from "../blocks/Components/PixelCard/PixelCard";
import SplitText from "../blocks/TextAnimations/SplitText/SplitText";

const skillsData = [
    {
        title: "Languages",
        items: ["JavaScript", "TypeScript", "Python", "Rust"],
    },
    {
        title: "Libraries & Styling",
        items: ["React", "TailwindCSS", "shadcn/ui", "SCSS"],
    },
    {
        title: "Frameworks",
        items: ["Next.js", "Django", "Flask"],
    },
    {
        title: "Databases",
        items: ["MongoDB", "MySQL", "PostgreSQL"],
    },
    {
        title: "DevOps & Tools",
        items: ["Docker", "Kubernetes", "Git", "Linux"],
    },
    {
        title: "Auth & Payments",
        items: ["Auth.js", "Clerk", "Razorpay", "MFS Integrations"],
    },
];

export default function Skills() {
    return (
        <section id="skills" className="relative py-20 px-6 sm:px-12 space-y-4">
            <div className="relative max-w-5xl mx-auto">
                <SplitText
                    text="My Skills"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skillsData.map(({ title, items }, index) => (
                        <div className="mx-auto" key={index}>
                            <PixelCard variant="green">
                                <div className="absolute">
                                    <h3 className="text-2xl font-semibold mb-4 text-pretty">
                                        {title}
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        {items.map((item, index) => (
                                            <span
                                                key={index}
                                                className="bg-primary-foreground text-muted-foreground px-4 py-2 rounded-lg hover:bg-primary hover:text-primary-foreground"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </PixelCard>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
