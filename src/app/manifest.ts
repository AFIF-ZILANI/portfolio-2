import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Afif Zilani — Full-Stack Developer & Co-Founder of ZeroD",
        short_name: "Afif Zilani",
        description:
            "Kazi Afif Zilani (AFIF ZILANI) — Full-stack developer, entrepreneur, and co-founder of ZeroD, based in Naogaon, Bangladesh.",
        start_url: "/",
        display: "standalone",
        background_color: "#09090b",
        theme_color: "#22c55e",
        icons: [
            {
                src: "/afifzilani-profile.webp",
                sizes: "any",
                type: "image/webp",
                purpose: "any",
            },
        ],
    };
}
