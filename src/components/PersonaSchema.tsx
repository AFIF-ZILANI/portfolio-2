import { PORTRAIT, SITE_URL } from "@/lib/site";
export default function PersonSchema() {
    const person = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Afif Zilani",
        alternateName: [
            "AFIF ZILANI",
            "Kazi Afif Zilani",
            "afif zilani",
            "afifzilani",
            "Kazi Afif",
        ],
        givenName: "Afif",
        familyName: "Zilani",
        additionalName: "Kazi",
        url: SITE_URL,
        email: "afifzilani4566@gmail.com",
        image: {
            "@type": "ImageObject",
            "@id": `${SITE_URL}/#image`,
            url: PORTRAIT.url,
            contentUrl: PORTRAIT.url,
            caption: "Afif Zilani — Entrepreneur, General Manager of ZeroD Farms and Co-Founder of ZeroD",
            description: "Portrait of Kazi Afif Zilani, business owner and programmer from Naogaon, Bangladesh",
            width: PORTRAIT.width,
            height: PORTRAIT.height,
        },
        jobTitle: ["Entrepreneur", "General Manager, ZeroD Farms", "Co-Founder, ZeroD Umb", "Programmer"],
        description:
            "Kazi Afif Zilani, known as Afif Zilani, is a business owner from Naogaon, Bangladesh: General Manager of ZeroD Farms, Co-Founder of ZeroD Umb and ZeroD Agency, and a programmer who builds web systems for local businesses.",
        nationality: {
            "@type": "Country",
            name: "Bangladesh",
        },
        address: {
            "@type": "PostalAddress",
            addressLocality: "Naogaon",
            addressRegion: "Rajshahi Division",
            addressCountry: "BD",
        },
        worksFor: [
            {
                "@type": "Organization",
                "@id": "https://zerod.bd/#organization",
                name: "ZeroD Umb",
                url: "https://zerod.bd",
                description: "The ZeroD group: a multi-sector technology and entrepreneurship ecosystem co-founded by Afif Zilani.",
            },
            {
                "@type": "Organization",
                "@id": "https://farms.zerod.bd/#organization",
                name: "ZeroD Farms",
                url: "https://farms.zerod.bd",
                description: "A family-run poultry farm in Mahadebpur, Naogaon, Bangladesh, managed by Afif Zilani.",
                parentOrganization: { "@id": "https://zerod.bd/#organization" },
            },
            {
                "@type": "Organization",
                "@id": "https://agency.zerod.bd/#organization",
                name: "ZeroD Agency",
                url: "https://agency.zerod.bd",
                description: "A web design and development agency for Bangladeshi businesses, based in Naogaon.",
                parentOrganization: { "@id": "https://zerod.bd/#organization" },
            },
        ],
        knowsAbout: [
            "Full-Stack Web Development",
            "React",
            "Next.js",
            "TypeScript",
            "Node.js",
            "Golang",
            "PostgreSQL",
            "Redis",
            "Docker",
            "Kubernetes",
            "Software Architecture",
            "Entrepreneurship",
            "Sustainable Farming Technology",
            "Artificial Intelligence",
        ],
        sameAs: [
            "https://github.com/AFIF-ZILANI",
            "https://www.linkedin.com/in/afifzilani",
            "https://stackoverflow.com/users/22881891/afif-zilani",
            "https://orcid.org/0009-0005-0673-3154",
            "https://hashnode.com/@afifzilani",
            "https://x.com/afif_zilani",
            "https://bsky.app/profile/afif-zilani.bsky.social",
            "https://www.reddit.com/user/afifzilani",
            "https://instagram.com/afif.zilani",
            "https://facebook.com/AFIF.ZILANI00",
            "https://threads.com/afif.zilani",
            "https://huggingface.co/afifzilani",
            "https://afifzilani.link",
        ],
    };

    const website = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Afif Zilani",
        alternateName: ["AFIF ZILANI", "Kazi Afif Zilani Portfolio"],
        url: SITE_URL,
        description: "Official website of Afif Zilani (Kazi Afif Zilani) — entrepreneur, General Manager of ZeroD Farms, Co-Founder of ZeroD, and programmer, based in Naogaon, Bangladesh.",
        author: { "@id": `${SITE_URL}/#person` },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
            />
        </>
    );
}

/**
 * ProfilePage describes the homepage specifically, so it is NOT part of
 * PersonSchema (which renders from the root layout). Otherwise every route —
 * including each blog post — would claim to be Afif's profile page, contradicting
 * the post's own BlogPosting schema. Rendered by src/app/page.tsx only.
 */
export function ProfilePageSchema() {
    const webpage = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: "Afif Zilani — Entrepreneur, General Manager of ZeroD Farms & Programmer",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        // Google requires mainEntity (not about) for the ProfilePage rich result.
        mainEntity: { "@id": `${SITE_URL}/#person` },
        primaryImageOfPage: { "@id": `${SITE_URL}/#image` },
        description:
            "Official profile page of Kazi Afif Zilani (AFIF ZILANI): entrepreneur, General Manager of ZeroD Farms, Co-Founder of ZeroD Umb, and programmer, from Naogaon, Bangladesh.",
        breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Afif Zilani",
                    item: SITE_URL,
                },
            ],
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(webpage) }}
        />
    );
}
