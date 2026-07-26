import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/admin/", "/signin"],
            },
        ],
        sitemap: "https://afifzilani.com/sitemap.xml",
        host: "https://afifzilani.com",
    };
}
