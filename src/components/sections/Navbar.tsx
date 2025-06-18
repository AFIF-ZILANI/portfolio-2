import Link from "next/link";
import React from "react";
import Aurora from "../blocks/Backgrounds/Aurora/Aurora";

const navigation = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <header className="w-screen absolute">
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <nav className="fixed top-0 flex justify-center w-full z-50 py-2">
        <div className="py-2 px-4 rounded-full flex gap-6 backdrop-blur-lg bg-primary/10 border-b border-white/20 shadow-sm">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-muted-foreground hover:text-white transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
