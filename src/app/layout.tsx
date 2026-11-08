import type { Metadata } from "next";
import { Geist, Instrument_Serif, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PORTRAIT, SITE_URL } from "@/lib/site";

// Self-hosted at build time: no fonts.googleapis.com round-trip on first paint,
// and a size-adjusted fallback so swapping in the real face doesn't shift layout.
const spaceMono = Space_Mono({
    subsets: ["latin"],
    weight: ["400", "700"],
    style: ["normal", "italic"],
    display: "swap",
    variable: "--font-space-mono",
});

// The public site reads in Geist with Instrument Serif for display; Space Mono stays
// for labels and for the admin, which keeps its terminal look.
const geist = Geist({ subsets: ["latin"], display: "swap", variable: "--font-geist" });
const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    style: ["normal", "italic"],
    display: "swap",
    variable: "--font-instrument-serif",
});

const TITLE = "Afif Zilani — Entrepreneur, General Manager of ZeroD Farms & Programmer";
const DESCRIPTION =
    "Kazi Afif Zilani (AFIF ZILANI) — business owner from Naogaon, Bangladesh. General Manager of ZeroD Farms, Co-Founder of ZeroD Umb and ZeroD Agency, and a programmer.";

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
        images: [
            {
                url: PORTRAIT.url,
                width: PORTRAIT.width,
                height: PORTRAIT.height,
                alt: "Afif Zilani — Entrepreneur and Co-Founder of ZeroD",
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
                url: PORTRAIT.url,
                alt: "Afif Zilani — Entrepreneur and Co-Founder of ZeroD",
            },
        ],
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
    category: "technology",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${spaceMono.variable} ${geist.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
            <head>
                <link rel="me" href="https://github.com/AFIF-ZILANI" />
                <link rel="me" href="https://www.linkedin.com/in/afifzilani" />
                <link rel="me" href="https://x.com/afif_zilani" />
                <link rel="me" href="https://bsky.app/profile/afif-zilani.bsky.social" />
                <link rel="me" href="https://instagram.com/afif.zilani" />
                <link rel="me" href="https://facebook.com/AFIF.ZILANI00" />
                <link rel="me" href="mailto:afifzilani4566@gmail.com" />
            </head>
            <body
                className={`antialiased overflow-x-hidden font-mono selection:bg-primary/30 min-h-screen bg-background text-foreground`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
