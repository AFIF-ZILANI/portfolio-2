import { SITE_URL } from "@/lib/site";

const FARM_ID = `${SITE_URL}/#zerod-farm`;

/**
 * ZeroD Farm as its own entity, so "ZeroD Farm" resolves to a thing with a
 * founder, a place and a start date rather than a string inside a job title.
 *
 * ponytail: Organization rather than LocalBusiness — LocalBusiness wants a street
 * address, phone and opening hours, and publishing half of those does more harm
 * than good. Upgrade it once those are public.
 */
const farm = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": FARM_ID,
    name: "ZeroD Farm",
    alternateName: ["ZeroD Farms"],
    description: "A poultry farm in Naogaon, Rajshahi Division, Bangladesh, founded in 2022.",
    url: `${SITE_URL}/#zerod-farm`,
    foundingDate: "2022",
    founder: { "@id": `${SITE_URL}/#person` },
    address: {
        "@type": "PostalAddress",
        addressLocality: "Naogaon",
        addressRegion: "Rajshahi Division",
        addressCountry: "BD",
    },
    areaServed: { "@type": "Country", name: "Bangladesh" },
    knowsAbout: ["Poultry Farming"],
    parentOrganization: {
        "@type": "Organization",
        "@id": "https://zerod.bd/#organization",
        name: "ZeroD",
        url: "https://zerod.bd",
    },
};

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
            url: `${SITE_URL}/afifzilani-profile.webp`,
            contentUrl: `${SITE_URL}/afifzilani-profile.webp`,
            caption: "Afif Zilani — Co-Founder and CEO of ZeroD Farm",
            description: "Portrait of Kazi Afif Zilani, co-founder of ZeroD Farm, Naogaon, Bangladesh",
            width: 1535,
            height: 1536,
        },
        jobTitle: "Co-Founder & CEO, ZeroD Farm",
        description:
            "Kazi Afif Zilani, known as Afif Zilani, is an entrepreneur from Naogaon, Bangladesh and the co-founder and CEO of ZeroD Farm, a poultry farm founded in 2022.",
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
        worksFor: { "@id": FARM_ID },
        knowsAbout: [
            "Poultry Farming",
            "Poultry Farm Management",
            "Livestock Biosecurity",
            "Agribusiness",
            "Farm Operations",
            "Entrepreneurship",
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
        description: "Personal website of Afif Zilani (Kazi Afif Zilani), co-founder and CEO of ZeroD Farm in Naogaon, Bangladesh.",
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(farm) }}
            />
        </>
    );
}

/**
 * ProfilePage describes the homepage specifically, so it is NOT part of
 * PersonSchema (which renders from the root layout). Otherwise every route —
 * including each blog post — would claim to be Afif's profile page, contradicting
 * the post's own BlogPosting schema. Rendered by src/app/(site)/page.tsx only.
 */
export function ProfilePageSchema() {
    const webpage = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: "Afif Zilani — Co-Founder & CEO of ZeroD Farm, Naogaon",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        // Google requires mainEntity (not about) for the ProfilePage rich result.
        mainEntity: { "@id": `${SITE_URL}/#person` },
        primaryImageOfPage: { "@id": `${SITE_URL}/#image` },
        description:
            "Profile of Kazi Afif Zilani (AFIF ZILANI), co-founder and CEO of ZeroD Farm, a poultry farm in Naogaon, Bangladesh.",
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
