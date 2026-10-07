import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SITE_URL } from "@/lib/site";

// Self-hosted at build time: no fonts.googleapis.com round-trip on first paint,
// and a size-adjusted fallback so swapping in the real face doesn't shift layout.
const fraunces = Fraunces({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-fraunces",
});

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

const TITLE = "Afif Zilani — Co-Founder & CEO of ZeroD Farm, Naogaon";
const DESCRIPTION =
    "Kazi Afif Zilani is the co-founder and CEO of ZeroD Farm, a poultry farm in Naogaon, Bangladesh. Buyers, suppliers and partners can get in touch here.";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: TITLE,
        template: "%s | Afif Zilani",
    },
    description: DESCRIPTION,
    authors: [{ name: "Afif Zilani", url: SITE_URL }],
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
        types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
    },
    openGraph: {
        type: "profile",
        firstName: "Afif",
        lastName: "Zilani",
        username: "afifzilani",
        url: `${SITE_URL}/`,
        title: TITLE,
        description: DESCRIPTION,
        locale: "en_US",
        siteName: "Afif Zilani",
    },
    twitter: {
        card: "summary_large_image",
        site: "@afif_zilani",
        creator: "@afif_zilani",
        title: TITLE,
        description: DESCRIPTION,
    },
    verification: {
        google: "mf5qC5eIPTRicnBVnF9ENjPhDYSQOBsEeDrv4u6SFT8",
    },
    applicationName: "Afif Zilani",
    appleWebApp: {
        capable: true,
        title: "Afif Zilani",
        statusBarStyle: "black-translucent",
    },
    category: "agriculture",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${fraunces.variable} ${inter.variable}`}
            suppressHydrationWarning
        >
            <head>
                <link rel="me" href="https://github.com/AFIF-ZILANI" />
                <link rel="me" href="https://www.linkedin.com/in/afifzilani" />
                <link rel="me" href="https://x.com/afif_zilani" />
                <link rel="me" href="https://bsky.app/profile/afif-zilani.bsky.social" />
                <link rel="me" href="https://instagram.com/afif.zilani" />
                <link rel="me" href="https://facebook.com/AFIF.ZILANI00" />
                <link rel="me" href="mailto:afifzilani4566@gmail.com" />
            </head>
            <body className="antialiased overflow-x-hidden font-sans selection:bg-primary/20 min-h-screen bg-background text-foreground">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
