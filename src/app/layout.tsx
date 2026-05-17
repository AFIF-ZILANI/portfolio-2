import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import PersonSchema from "@/components/PersonaSchema";

export const metadata: Metadata = {
    metadataBase: new URL("https://afifzilani.com"),
    title: "AFIF ZILANI — Entrepreneur, Programmer & Co-Founder of ZeroD",
    description:
        "Afif Zilani — Entrepreneur, programmer, and co-founder of ZeroD. Building tech for real-world impact in Bangladesh.",
    robots: { index: true, follow: true },
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        url: "https://afifzilani.com/",
        title: "AFIF ZILANI — Entrepreneur, Programmer & Co-Founder of ZeroD",
        description:
            "Afif Zilani — Entrepreneur, programmer, and co-founder of ZeroD. Building tech for real-world impact in Bangladesh.",
        images: [
            {
                url: "/afifzilani-profile.webp",
                width: 1535,
                height: 1536,
            },
            {
                url: "/afifzilani-about.webp",
                width: 1254,
                height: 1254,
            },
        ],
        locale: "en_US",
        siteName: "AFIF ZILANI",
    },
    twitter: {
        card: "summary_large_image",
        title: "AFIF ZILANI — Entrepreneur, Programmer & Co-Founder of ZeroD",
        description:
            "Afif Zilani — Entrepreneur, programmer, and co-founder of ZeroD. Building tech for real-world impact in Bangladesh.",
        images: ["/profile.jpg"],
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
