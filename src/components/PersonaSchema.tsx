export default function PersonSchema() {
    const person = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "https://afifzilani.com/#person",
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
        url: "https://afifzilani.com",
        email: "afifzilani4566@gmail.com",
        image: {
            "@type": "ImageObject",
            "@id": "https://afifzilani.com/#image",
            url: "https://afifzilani.com/afifzilani-profile.webp",
            contentUrl: "https://afifzilani.com/afifzilani-profile.webp",
            caption: "Afif Zilani — Full-Stack Developer and Co-Founder of ZeroD",
            description: "Portrait of Kazi Afif Zilani, full-stack developer and entrepreneur from Naogaon, Bangladesh",
            width: 1535,
            height: 1536,
        },
        jobTitle: "Full-Stack Developer & Co-Founder",
        description:
            "Kazi Afif Zilani, known as Afif Zilani, is a full-stack developer, entrepreneur, and co-founder of ZeroD. He builds high-performance web systems and tech for real-world impact from Naogaon, Bangladesh.",
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
        worksFor: {
            "@type": "Organization",
            "@id": "https://zerod.bd/#organization",
            name: "ZeroD",
            url: "https://zerod.bd",
            description: "ZeroD is a multi-sector technology and entrepreneurship ecosystem founded by Afif Zilani.",
        },
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
            "https://twitter.com/afif_zilani",
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
        "@id": "https://afifzilani.com/#website",
        name: "Afif Zilani",
        alternateName: ["AFIF ZILANI", "Kazi Afif Zilani Portfolio"],
        url: "https://afifzilani.com",
        description: "Official portfolio and personal website of Afif Zilani (Kazi Afif Zilani) — full-stack developer and co-founder of ZeroD, based in Naogaon, Bangladesh.",
        author: { "@id": "https://afifzilani.com/#person" },
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: "https://afifzilani.com/?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
        },
    };

    const webpage = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": "https://afifzilani.com/#webpage",
        url: "https://afifzilani.com",
        name: "Afif Zilani — Full-Stack Developer, Entrepreneur & Co-Founder of ZeroD",
        isPartOf: { "@id": "https://afifzilani.com/#website" },
        about: { "@id": "https://afifzilani.com/#person" },
        primaryImageOfPage: { "@id": "https://afifzilani.com/#image" },
        description:
            "Official portfolio page of Kazi Afif Zilani (AFIF ZILANI), full-stack developer and co-founder of ZeroD, from Naogaon, Bangladesh.",
        breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Afif Zilani",
                    item: "https://afifzilani.com",
                },
            ],
        },
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webpage) }}
            />
        </>
    );
}
