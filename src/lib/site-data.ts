export type Event = {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  location: string;
  coverImage: string;
  gallery: string[];
  tags: string[];
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
};

export type SocialLink = {
  id: string;
  label: string;
  href: string;
  icon: "github" | "linkedin" | "twitter" | "email" | "discord" | "bluesky" | "instagram" | "threads" | "orcid" | "stack-overflow" | "reddit" | "facebook" | "hashnode" | "website" | "huggingface";
};

export type SiteStats = {
  key: string;
  value: string;
  label: string;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  icon: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  coverImage: string;
  featured: boolean;
};

export type SiteData = {
  name: string;
  title: string;
  tagline: string;
  bio: string[];
  heroImage: string;
  aboutImage: string;
  socialLinks: SocialLink[];
  experiences: Experience[];
  events: Event[];
  stats: SiteStats[];
  skills: Skill[];
  projects: Project[];
};

export const DEFAULT_SITE_DATA: SiteData = {
  name: "AFIF ZILANI",
  title: "Full-Stack Developer.",
  tagline: "I engineer high-performance systems and build precise, scalable digital experiences. Obsessed with clean code, elegant architecture, and shipping products that work flawlessly.",
  bio: [
    "Passionate engineer who thrives at the intersection of",
    "backend logic and polished UIs. Started with automation",
    "scripts, evolved into architecting scalable systems.",
    "Building accessible, human-centered products and",
    "exploring distributed systems + modern web architecture.",
    "Open to work — let's build something great."
  ],
  heroImage: "/afifzilani-profile.webp",
  aboutImage: "/afifzilani-about.webp",
  socialLinks: [
    {
      id: "1",
      label: "github/",
      href: "https://github.com/AFIF-ZILANI",
      icon: "github"
    },
    {
      id: "2",
      label: "linkedin/",
      href: "https://www.linkedin.com/in/afifzilani",
      icon: "linkedin"
    },
    {
      id: "3",
      label: "stack-overflow/",
      href: "https://stackoverflow.com/users/22881891/afif-zilani",
      icon: "stack-overflow"
    },
    {
      id: "4",
      label: "orcid/",
      href: "https://orcid.org/0009-0005-0673-3154",
      icon: "orcid"
    },
    {
      id: "5",
      label: "hashnode/",
      href: "https://hashnode.com/@afifzilani",
      icon: "hashnode"
    },
    {
      id: "6",
      label: "x/",
      href: "https://x.com/afif_zilani",
      icon: "twitter"
    },
    {
      id: "7",
      label: "bluesky/",
      href: "https://bsky.app/profile/afif-zilani.bsky.social",
      icon: "bluesky"
    },
    {
      id: "8",
      label: "reddit/",
      href: "https://www.reddit.com/user/afifzilani",
      icon: "reddit"
    },
    {
      id: "9",
      label: "email/",
      href: "mailto:afifzilani4566@gmail.com",
      icon: "email"
    },
    {
      id: "10",
      label: "huggingface/",
      href: "https://huggingface.co/afifzilani",
      icon: "huggingface"
    },
    {
      id: "11",
      label: "afifzilani.link/",
      href: "https://afifzilani.link",
      icon: "website"
    },
    {
      id: "12",
      label: "instagram/",
      href: "https://instagram.com/afif.zilani",
      icon: "instagram"
    },
    {
      id: "13",
      label: "facebook/",
      href: "https://facebook.com/AFIF.ZILANI00",
      icon: "facebook"
    },
    {
      id: "14",
      label: "threads/",
      href: "https://threads.com/afif.zilani",
      icon: "threads"
    }
  ],
  experiences: [
    {
      id: "1",
      company: "ZeroD Farms",
      role: "Co-Founder & CEO",
      period: "2022 — Present",
      description:
        "Co-founded and managing ZeroD Farms with a focus on sustainable poultry farming, operational management, and long-term business growth. Overseeing daily farm operations, workforce coordination, supply management, and business expansion strategies."
    },
    {
      id: "2",
      company: "ZeroD Umb",
      role: "Co-Founder",
      period: "Mar 4, 2023 — Present",
      description:
        "Building the foundation and long-term vision of the ZeroD ecosystem. Working on business planning, branding, digital infrastructure, and future technology-driven initiatives across multiple sectors including software, AI, and social impact projects."
    },
    {
      id: "3",
      company: "ZeroD Agencies",
      role: "Co-Founder & Full-Stack Developer",
      period: "Mar 28, 2026 — Present",
      description:
        "Developing scalable websites and web applications for clients using React, Next.js, Golang, PostgreSQL, Tailwind CSS, and Redis. Handling frontend architecture, backend APIs, authentication systems, database design, deployment pipelines, and overall product engineering."
    }
  ],
  events: [
    {
      id: "e1",
      title: "Global AI Summit 2024",
      slug: "global-ai-summit-2024",
      date: "2024-05-15",
      location: "San Francisco, CA",
      description: "Attended the premier AI conference of the year. Deep dived into Large Language Models and their practical applications in enterprise software.\n\nKey takeaways:\n- RAG architectures are becoming standard for production AI\n- Ethical AI considerations are no longer optional\n- Edge computing for AI is rapidly maturing\n\nConnected with several industry leaders and explored the future of autonomous agents.",
      coverImage: "https://picsum.photos/seed/ai2024/800/500",
      gallery: [
        "https://picsum.photos/seed/ai1/800/500",
        "https://picsum.photos/seed/ai2/800/500",
        "https://picsum.photos/seed/ai3/800/500"
      ],
      tags: ["AI", "Machine Learning", "Conference"]
    },
    {
      id: "e2",
      title: "Node.js Interactive",
      slug: "nodejs-interactive-2023",
      date: "2023-11-10",
      location: "Vancouver, BC",
      description: "A deep dive into the latest Node.js features and the evolution of the JavaScript ecosystem.\n\nHighlights:\n- Discussion on Node.js test runner\n- Performance optimizations in V8\n- The rise of WinterCG and cross-runtime standards\n\nMet with core contributors and discussed the roadmap for future LTS releases.",
      coverImage: "https://picsum.photos/seed/node/800/500",
      gallery: [
        "https://picsum.photos/seed/node1/800/500",
        "https://picsum.photos/seed/node2/800/500",
        "https://picsum.photos/seed/node3/800/500"
      ],
      tags: ["JavaScript", "Node.js", "Backend"]
    },
    {
      id: "e3",
      title: "Web3 Hackathon",
      slug: "web3-hackathon-2023",
      date: "2023-08-22",
      location: "Berlin, Germany",
      description: "Participated in a 48-hour hackathon focused on decentralized identity and privacy-preserving technologies.\n\nProject details:\n- Built a ZK-proof based voting system\n- Integrated with IPFS for decentralized storage\n- Implemented smart contracts in Solidity\n\nWon the 'Most Innovative Architecture' award and learned a ton about the current state of Web3 tooling.",
      coverImage: "https://picsum.photos/seed/web3/800/500",
      gallery: [
        "https://picsum.photos/seed/web3-1/800/500",
        "https://picsum.photos/seed/web3-2/800/500",
        "https://picsum.photos/seed/web3-3/800/500"
      ],
      tags: ["Web3", "Blockchain", "Hackathon"]
    }
  ],
  stats: [
    { key: "experience", value: "5+", label: "years" },
    { key: "projects", value: "40+", label: "shipped" },
    { key: "stack", value: "15+", label: "technologies" },
    { key: "commits", value: "1k+", label: "contributions" }
  ],
  skills: [
    { id: "s1", name: "React", category: "Frontend", icon: "SiReact" },
    { id: "s2", name: "TypeScript", category: "Frontend", icon: "SiTypescript" },
    { id: "s3", name: "Next.js", category: "Frontend", icon: "SiNextdotjs" },
    { id: "s4", name: "Tailwind CSS", category: "Frontend", icon: "SiTailwindcss" },
    { id: "s5", name: "Node.js", category: "Backend", icon: "SiNodedotjs" },
    { id: "s6", name: "Python", category: "Backend", icon: "SiPython" },
    { id: "s7", name: "PostgreSQL", category: "Backend", icon: "SiPostgresql" },
    { id: "s8", name: "GraphQL", category: "Backend", icon: "SiGraphql" },
    { id: "s9", name: "Docker", category: "Tools & DevOps", icon: "SiDocker" },
    { id: "s10", name: "Git", category: "Tools & DevOps", icon: "SiGit" },
    { id: "s11", name: "Kubernetes", category: "Tools & DevOps", icon: "SiKubernetes" },
    { id: "s12", name: "Linux", category: "Tools & DevOps", icon: "SiLinux" }
  ],
  projects: [
    {
      id: "p1",
      title: "Takify",
      description:
        "A web application focused on streamlined workflows with a clean UI, fast navigation, and responsive design principles.",
      tech: ["React", "Next.js", "Tailwind CSS"],
      github: "",
      live: "https://takify.lovable.app/",
      coverImage:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      featured: true
    },
    {
      id: "p2",
      title: "Zvert",
      description:
        "A modular frontend platform emphasizing reusable UI components, performance optimization, and scalable interface structure.",
      tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      github: "",
      live: "https://zvert.lovable.app/",
      coverImage:
        "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80",
      featured: true
    },
    {
      id: "p3",
      title: "ZeroD Foundation",
      description:
        "A multi-sector initiative platform supporting education, healthcare, agriculture, disaster response, and community development under the ZeroD ecosystem.",
      tech: ["Next.js", "React", "Tailwind CSS"],
      github: "",
      live: "https://zerod-foundation.lovable.app/#",
      coverImage:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
      featured: true
    },
    {
      id: "p4",
      title: "ZeroD Portfolio",
      description:
        "A central portfolio and operations dashboard for ZeroD projects, providing a unified overview of systems, initiatives, and infrastructure.",
      tech: ["React", "Next.js", "TypeScript", "Dashboard UI", "Tailwind CSS"],
      github: "",
      live: "https://zerod.vercel.app",
      coverImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      featured: true
    }
  ]
};

const STORAGE_KEY = "afif-portfolio-v1";

export function loadSiteData(): SiteData {
  if (typeof window === "undefined") return DEFAULT_SITE_DATA;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_SITE_DATA;
  try {
    const parsed = JSON.parse(stored) as Partial<SiteData>;
    return {
      ...DEFAULT_SITE_DATA,
      ...parsed,
      skills: Array.isArray(parsed.skills) && parsed.skills.length ? parsed.skills : DEFAULT_SITE_DATA.skills,
      projects: Array.isArray(parsed.projects) && parsed.projects.length ? parsed.projects : DEFAULT_SITE_DATA.projects,
      stats: Array.isArray(parsed.stats) && parsed.stats.length ? parsed.stats : DEFAULT_SITE_DATA.stats,
    };
  } catch {
    return DEFAULT_SITE_DATA;
  }
}

export function saveSiteData(data: SiteData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
