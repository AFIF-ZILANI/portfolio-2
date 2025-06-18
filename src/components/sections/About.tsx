"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import SplitText from "../blocks/TextAnimations/SplitText/SplitText";

export default function About() {
  const blob1 = useRef(null);
  const blob2 = useRef(null);
  const blob3 = useRef(null);

  useEffect(() => {
    // Blob 1: vertical float and subtle scale
    gsap
      .timeline({ repeat: -1, yoyo: true })
      .to(blob1.current, {
        y: 20,
        scale: 1.1,
        duration: 4,
        ease: "power1.inOut",
      })
      .to(blob1.current, {
        y: -10,
        scale: 0.9,
        duration: 4,
        ease: "power1.inOut",
      });

    // Blob 2: horizontal float and rotation
    gsap
      .timeline({ repeat: -1, yoyo: true })
      .to(blob2.current, {
        x: -30,
        rotate: 15,
        duration: 5,
        ease: "power1.inOut",
      })
      .to(blob2.current, {
        x: 30,
        rotate: -15,
        duration: 5,
        ease: "power1.inOut",
      });

    // Blob 3: diagonal float with opacity change
    gsap
      .timeline({ repeat: -1, yoyo: true })
      .to(blob3.current, {
        x: 15,
        y: -15,
        opacity: 0.8,
        duration: 3,
        ease: "power1.inOut",
      })
      .to(blob3.current, {
        x: -15,
        y: 15,
        opacity: 0.4,
        duration: 3,
        ease: "power1.inOut",
      });
  }, []);

  return (
    <section
      id="about"
      className="relative h-screen flex items-center justify-center px-6 sm:px-12 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white overflow-hidden"
    >
      {/* Animated Background Blobs */}
      <div
        ref={blob1}
        className="absolute top-8 left-16 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
      />
      <div
        ref={blob2}
        className="absolute bottom-16 right-12 w-56 h-56 bg-blue-500/20 rounded-full blur-2xl"
      />
      <div
        ref={blob3}
        className="absolute top-1/3 right-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-xl"
      />

      {/* Content Card */}
      <div className="relative max-w-3xl w-full mx-auto backdrop-blur-md bg-white/5 p-8 rounded-2xl border border-white/10 shadow-md">
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
            I am 18 years old and passionate about building digital experiences
            that are both intuitive and impactful. I focus on clarity in design
            and purpose in functionality, ensuring each interaction feels
            seamless.
          </p>
          <p>
            In today’s AI-driven world, I leverage smart technologies to enhance
            user journeys—only where they add real value, never complexity. My
            aim is to create interfaces that learn and evolve with users’ needs.
          </p>
          <p>
            I tackle challenges by breaking down complex problems into clear,
            actionable steps. This approach helps me deliver solutions that are
            robust, maintainable, and user-friendly.
          </p>
          <p>
            Ultimately, I strive to craft digital products that anticipate
            needs, foster engagement, and endure through clean, scalable code.
          </p>
        </div>
      </div>
    </section>
  );
}
