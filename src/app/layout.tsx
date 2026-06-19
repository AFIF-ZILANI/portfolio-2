import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import PersonSchema from "@/components/PersonaSchema";

const TITLE = "Afif Zilani — Full-Stack Developer, Entrepreneur & Co-Founder of ZeroD";
const DESCRIPTION =
    "Kazi Afif Zilani (AFIF ZILANI) — Full-stack developer, entrepreneur, and co-founder of ZeroD. Building high-performance web systems and tech for real-world impact from Naogaon, Bangladesh.";

export const metadata: Metadata = {
    metadataBase: new URL("https://afifzilani.com"),
    title: {
        default: TITLE,
        template: "%s | Afif Zilani",
    },
    description: DESCRIPTION,
    keywords: [
        "Afif Zilani",
        "AFIF ZILANI",
        "Kazi Afif Zilani",
        "afif zilani",
        "afifzilani",
        "Afif Zilani developer",
        "Afif Zilani Bangladesh",
        "Afif Zilani ZeroD",
        "Kazi Afif Zilani developer",
        "ZeroD co-founder",
        "ZeroD Farms",
        "Naogaon developer",
        "Bangladesh developer",
        "full-stack developer Bangladesh",
        "Next.js developer Bangladesh",
        "React developer Bangladesh",
    ],
    authors: [{ name: "Afif Zilani", url: "https://afifzilani.com" }],
    creator: "Afif Zilani",
    publisher: "Afif Zilani",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "profile",
        firstName: "Afif",
        lastName: "Zilani",
        username: "afifzilani",
        url: "https://afifzilani.com/",
        title: TITLE,
        description: DESCRIPTION,
        images: [
            {
                url: "/afifzilani-profile.webp",
                width: 1535,
                height: 1536,
                alt: "Afif Zilani — Full-Stack Developer and Co-Founder of ZeroD",
                type: "image/webp",
            },
            {
                url: "/afifzilani-about.webp",
                width: 1254,
                height: 1254,
                alt: "Kazi Afif Zilani — Entrepreneur and Programmer from Naogaon, Bangladesh",
                type: "image/webp",
            },
        ],
        locale: "en_US",
        siteName: "Afif Zilani",
    },
    twitter: {
        card: "summary_large_image",
        site: "@afif_zilani",
        creator: "@afif_zilani",
        title: TITLE,
        description: DESCRIPTION,
        images: [
            {
                url: "/afifzilani-profile.webp",
                alt: "Afif Zilani — Full-Stack Developer and Co-Founder of ZeroD",
            },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`antialiased overflow-x-hidden font-mono selection:bg-primary/30 min-h-screen bg-background text-foreground`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    <Navbar />
                    <PersonSchema />
                    <main>{children}</main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
