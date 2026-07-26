import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Assistants that read pages to answer questions and cite sources.
 *
 * These are listed explicitly and allowed because being quoted by ChatGPT,
 * Claude, Perplexity, and Google's AI surfaces requires their crawlers to be
 * permitted. A blanket `User-agent: *` allow is not enough in practice — many
 * operators block these by name, and some CDNs do it for you by default.
 *
 * NOTE: this file is only effective if nothing upstream serves its own
 * robots.txt. Cloudflare's managed robots.txt feature overrides it and blocks
 * every one of these agents — see docs/seo-audit.md.
 */
const AI_ASSISTANTS = [
    "GPTBot", // OpenAI — training/crawling
    "OAI-SearchBot", // OpenAI — ChatGPT search results
    "ChatGPT-User", // OpenAI — live fetch when a user asks about a URL
    "ClaudeBot", // Anthropic — crawling
    "Claude-User", // Anthropic — live fetch during a conversation
    "Claude-SearchBot", // Anthropic — search indexing
    "PerplexityBot", // Perplexity — indexing
    "Perplexity-User", // Perplexity — live fetch
    "Google-Extended", // Gemini / AI Overviews grounding
    "Applebot-Extended", // Apple Intelligence
    "meta-externalagent", // Meta AI
    "Bingbot", // Bing, which also feeds Copilot
    "DuckAssistBot", // DuckDuckGo AI
    "cohere-ai",
    "YouBot",
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/admin/", "/signin"],
            },
            // Explicitly welcome the assistants, so citation is possible at all.
            ...AI_ASSISTANTS.map((userAgent) => ({
                userAgent,
                allow: "/",
                disallow: ["/api/", "/admin/", "/signin"],
            })),
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
