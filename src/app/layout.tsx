import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "AFIF ZILANI | Full-Stack Developer Portfolio",
    description:
        "Welcome to the portfolio of AFIF ZILANI, showcasing modern web applications built with Next.js, React, MongoDB, Tailwind CSS, and more.",
    keywords: [
        "AFIF ZILANI",
        "Full Stack Developer",
        "Next.js",
        "React",
        "Portfolio",
        "Web Development",
    ],
    authors: [{ name: "AFIF ZILANI", url: "https://afifzilani.com" }],
    openGraph: {
        title: "AFIF ZILANI | Full-Stack Developer Portfolio",
        description:
            "Explore my web development projects and case studies built with modern technologies.",
        url: "https://afifzilani.com",
        siteName: "AFIF ZILANI Portfolio",
        images: [
            {
                url: "https://afifzilani.com/og-image.png",
                width: 1200,
                height: 630,
                alt: "AFIF ZILANI Portfolio Open Graph Image",
            },
        ],
        locale: "en_US",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Navbar />
                    <main>{children}</main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
