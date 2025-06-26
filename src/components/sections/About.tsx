import React from "react";
import SplitText from "../blocks/TextAnimations/SplitText/SplitText";
import Waves from "../blocks/Backgrounds/Waves/Waves";

export default function About() {
    return (
        <section
            id="about"
            className="relative h-screen flex items-center justify-center mt-4 overflow-hidden"
        >
            <Waves
                lineColor="#fff"
                waveSpeedX={0.02}
                waveSpeedY={0.01}
                waveAmpX={40}
                waveAmpY={20}
                friction={0.9}
                tension={0.01}
                maxCursorMove={120}
                xGap={12}
                yGap={36}
            />
            <div className="relative w-full sm:max-w-3xl backdrop-blur-md bg-white/5 p-8 rounded-2xl border border-white/10 shadow-md">
                <div className="mb-6 text-center">
                    <SplitText
                        text="About Myself"
                        className="text-3xl md:text-5xl font-bold"
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
                    <div className="h-1 w-24 bg-primary mx-auto mt-4 rounded" />
                </div>

                <div className="space-y-4 text-sm md:text-base leading-relaxed">
                    <p>
                        I am 18 years old and passionate about building digital experiences that are
                        both intuitive and impactful. I focus on clarity in design and purpose in
                        functionality, ensuring each interaction feels seamless.
                    </p>
                    <p>
                        In today’s AI-driven world, I leverage smart technologies to enhance user
                        journeys—only where they add real value, never complexity. My aim is to
                        create interfaces that learn and evolve with users’ needs.
                    </p>
                    <p>
                        I tackle challenges by breaking down complex problems into clear, actionable
                        steps. This approach helps me deliver solutions that are robust,
                        maintainable, and user-friendly.
                    </p>
                    <p>
                        Ultimately, I strive to craft digital products that anticipate needs, foster
                        engagement, and endure through clean, scalable code.
                    </p>
                </div>
            </div>
        </section>
    );
}
