import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Afif Zilani — Co-Founder & CEO of ZeroD Farm",
        short_name: "Afif Zilani",
        description:
            "Kazi Afif Zilani — co-founder and CEO of ZeroD Farm, a poultry farm in Naogaon, Bangladesh.",
        start_url: "/",
        display: "standalone",
        background_color: "#f9f6f0",
        theme_color: "#25603f",
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
