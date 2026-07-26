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
        ],
    },
};

export default nextConfig;
