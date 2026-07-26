import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Prisma Compute runs the standalone server.js artifact, not `next start`.
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
            },
            {
                // Blog cover and OG images uploaded from the admin panel.
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
    },
    experimental: {
        // Cover screenshots blow past the 1MB Server Action default.
        serverActions: { bodySizeLimit: "8mb" },
    },
};

export default nextConfig;
