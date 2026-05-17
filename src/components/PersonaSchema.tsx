// components/PersonSchema.tsx
export default function PersonSchema() {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Person",
                    name: "AFIF ZILANI",
                    url: "https://afifzilani.com",
                    image: "https://afifzilani.com/afifzilani-profile.webp",
                    jobTitle: "Full Stack Developer & Co-Founder",
                    description:
                        "Entrepreneur, programmer, and co-founder of ZeroD. Building tech for real-world impact in Bangladesh.",
                    worksFor: {
                        "@type": "Organization",
                        name: "ZeroD",
                        url: "https://zerod.bd",
                    },
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
                }),
            }}
        />
    );
}
