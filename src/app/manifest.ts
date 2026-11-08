import type { MetadataRoute } from "next";
import { PORTRAIT_SQUARE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Afif Zilani — Entrepreneur & Co-Founder of ZeroD",
        short_name: "Afif Zilani",
        description:
            "Kazi Afif Zilani (AFIF ZILANI) — entrepreneur, General Manager of ZeroD Farms, programmer, and co-founder of ZeroD, based in Naogaon, Bangladesh.",
        start_url: "/",
        display: "standalone",
        background_color: "#09090b",
        theme_color: "#22c55e",
        icons: [
            {
                src: PORTRAIT_SQUARE,
                sizes: "512x512",
                type: "image/webp",
                purpose: "any",
            },
        ],
    };
}
