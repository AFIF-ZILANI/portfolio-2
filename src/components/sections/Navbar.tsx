"use client";
import Link from "next/link";
import React, { useState } from "react";
import Aurora from "../blocks/Backgrounds/Aurora/Aurora";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { IoMenu } from "react-icons/io5";

const navigation = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    // { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [current, setCurrent] = useState(0);
    const [isSheetOpen, setSheetIsOpen] = useState(false);
    return (
        <header className="w-screen absolute">
            <Aurora
                colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                blend={0.5}
                amplitude={1.0}
                speed={0.5}
            />
            <nav className="fixed top-0 flex justify-center w-full z-50 py-2">
                <div className="rounded-full sm:flex gap-2 backdrop-blur-lg bg-primary/10 border-b border-white/20 shadow-sm hidden">
                    {navigation.map((item, index) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setCurrent(index)}
                            className={`text-muted-foreground hover:text-white transition-colors rounded-full py-1 px-4 duration-200 ${current === index && "bg-primary text-white"}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className="sm:hidden">
                    <Sheet open={isSheetOpen} onOpenChange={setSheetIsOpen}>
                        <SheetTrigger asChild>
                            <div className="flex justify-end w-screen overflow-hidden mr-8 mt-2">
                                <IoMenu className="text-3xl" />
                            </div>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Navigation Menu</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-2 px-3">
                                {navigation.map((item, index) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => {
                                            setCurrent(index);
                                            setSheetIsOpen(false);
                                        }}
                                        className={`text-muted-foreground hover:text-white transition-colors rounded-full py-1 px-4 duration-200 ${current === index && "bg-primary text-white"}`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}
