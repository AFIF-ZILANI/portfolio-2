import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://afifzilani.com",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
            images: [
                "https://afifzilani.com/afifzilani-profile.webp",
                "https://afifzilani.com/afifzilani-about.webp",
            ],
        },
    ];
}
