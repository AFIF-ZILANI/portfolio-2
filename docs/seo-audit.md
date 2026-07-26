# SEO & AI-citation audit — 2026-07-26

Audited against production (`afifzilani.com` / `www.afifzilani.com`) and the local
build. Everything in **Part 1** is a dashboard/DNS change only you can make — the code
is already correct and waiting on it. **Part 2** is what I changed.

---

## Part 1 — Blockers you must fix outside the code

### 1. Cloudflare is blocking ChatGPT and Claude. This is the whole answer to "how do I get cited by AI."

Your live `robots.txt` is **not** the one in this repo. Cloudflare is serving its own
*managed* robots.txt, and it contains:

```
User-agent: ClaudeBot
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /
```

…plus `Amazonbot`, `Applebot-Extended`, `Bytespider`, `meta-externalagent`, and a
`Content-Signal: ai-train=no`.

**Effect:** ChatGPT, Claude, Gemini's grounding, and Common Crawl are *explicitly
forbidden* from reading your site. No amount of on-page work will get you cited while
this is live. It also silently overrides `src/app/robots.ts`, so the AI-crawler
allowances I added have no effect in production until this is turned off.

**Fix:** Cloudflare dashboard → your domain → **Security → Bots** → turn off
**"AI Scrapers and Crawlers"** (also called *Block AI bots*). Also check
**Settings → Manage robots.txt** and disable the managed file so Next's own
`robots.txt` is served. Then confirm:

```bash
curl -s https://afifzilani.com/robots.txt | grep -A2 ClaudeBot   # should say Allow: /
```

**Decide deliberately:** blocking `GPTBot`/`CCBot`/`Google-Extended` reduces use of your
writing as *training data*; it also removes you from *citations*. If you want the
referrals, they have to be allowed. `Content-Signal: search=yes, ai-train=no,
use=reference` is a reasonable middle ground — but the `Disallow: /` lines override it,
so they must go regardless.

### 2. Your canonical domain contradicts every URL in your metadata

- `https://afifzilani.com/` → **307 redirect** → `https://www.afifzilani.com/`
- But `metadataBase`, every `canonical`, all 15 JSON-LD `@id`s, the sitemap, and your
  `rel=me` links say `https://afifzilani.com` (no `www`).

So every canonical URL points at a redirect, and your Person/WebSite entity is declared
at a host that doesn't serve 200. That splits ranking signals across two hostnames —
bad for a name-based ranking strategy that depends on one strong entity.

**Fix — pick one:**

- **Preferred:** make the apex primary so it stops redirecting. Vercel → Project →
  Settings → Domains → set `afifzilani.com` as primary and make `www` redirect to it.
  This matches all your existing GSC verification, `rel=me` links, and schema. No code
  change needed.
- **Or:** keep `www` and set `NEXT_PUBLIC_SITE_URL=https://www.afifzilani.com`. One env
  var now updates all 23 places (see Part 2.1). You would then re-verify the `www`
  property in Search Console.

### 3. The blog isn't deployed

`https://www.afifzilani.com/blogs` → **404**. The production sitemap still contains only
the homepage. Everything built over this session is committed but not shipped, so none of
it can rank yet. Deploy, then in Search Console: **Sitemaps → submit `/sitemap.xml`**, and
**URL Inspection → Request indexing** for `/blogs` and the JEPA post.

### 4. `CLOUDINARY_API_SECRET` is wrong

It's a copy of `CLOUDINARY_API_KEY` (both 15 chars, both starting `237`). Uploads work
(unsigned preset); **deletions fail**. Replace it with the real secret from Cloudflare →
Cloudinary dashboard → Settings → API Keys. Then `/admin/media` cleanup works.

---

## Part 2 — What I changed

### 2.1 One canonical origin (`src/lib/site.ts`)

`https://afifzilani.com` was hardcoded in 23 places. Now a single `SITE_URL`, overridable
with `NEXT_PUBLIC_SITE_URL`, used by layout metadata, sitemap, robots, JSON-LD, the blog
pages, RSS, and llms.txt. Fixing issue #2 above is now a one-line change.

### 2.2 AI crawlers explicitly allowed (`src/app/robots.ts`)

Named `Allow: /` rules for `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`,
`Claude-User`, `Claude-SearchBot`, `PerplexityBot`, `Perplexity-User`,
`Google-Extended`, `Applebot-Extended`, `meta-externalagent`, `Bingbot`,
`DuckAssistBot`, `cohere-ai`, `YouBot`. `/admin`, `/signin`, `/api` stay disallowed.

Being *allowed* is necessary but not sufficient — the citation-worthiness comes from
2.3–2.5.

### 2.3 `/llms.txt`

A generated plain-markdown digest ([llmstxt.org](https://llmstxt.org) convention) an
assistant can read in one request. States the entity facts explicitly: full name, every
spelling variant (`Afif Zilani` / `AFIF ZILANI` / `Kazi Afif Zilani`), role, location,
canonical URL, projects, experience, skills, all articles with excerpts, and a citation
line. Generated from the live database, so it can't drift.

This matters because models need unambiguous, structured facts to attribute a claim
confidently. Prose scattered across an animated page is much weaker.

### 2.4 `/feed.xml`

RSS 2.0 of published posts. How aggregators, newsletters, and several AI crawlers detect
new writing without re-crawling. Linked from `<head>` via `alternates.types`.

### 2.5 Richer post schema

- **`BreadcrumbList`** on every post — search results show `Home › Blog › Post` instead
  of a bare URL.
- **`image` as a described `ImageObject`** (url + caption) rather than a bare string —
  a bare URL isn't eligible for image results.
- `inLanguage: "en"`.
- `author`/`publisher` already point at the existing `#person` `@id`, so posts reinforce
  your name entity rather than creating a second author.

### 2.6 Image SEO

- **Cover images had `alt=""`** on both the post page and the listing grid. An empty alt
  marks an image *decorative* — telling search engines to ignore it. Now falls back to
  the post title when no alt is set.
- Added the missing `sizes` on the two `fill` images flagged by the console.

**I checked and did NOT "optimise" your project screenshots.** `public/images/takify-home-screen.png`
is 1.86 MB, but `next/image` already transcodes it — measured **8.9 KB** WebP at 640w and
**20 KB** at 1200w. User-facing weight is fine. The 2.7 MB only bloats your repo and
deploy; convert with `cwebp` (already installed) if you care, but it is not a performance
problem.

### 2.7 Editor guardrail

The excerpt doubles as your meta description, and yours is **246 characters** — Google
truncates around 160. Added a live `n/160` counter that turns red past the limit when no
explicit `seoDescription` is set.

---

## Part 3 — Your JEPA post, specifically

Content is genuinely good for ranking: **1,623 words, 10 headings**. Fix these in
`/admin/blogs`:

| Field | Now | Change to |
|---|---|---|
| `tags` | `llsms`, `jepa` | **`llsms` is a typo** → `llms`. Add `ai`, `machine-learning`, `deep-learning` |
| `coverAlt` | `llms vs jepa` | Describe the image properly, e.g. "Diagram comparing LLM next-token prediction with JEPA joint-embedding architecture" |
| `excerpt` | 246 chars | Either trim to ≤160, or set an explicit `seoDescription` under 160 |
| `seoTitle` | unset (uses 58-char title) | Fine as-is |

I deliberately did not edit your published prose or write your meta description — that's
authoring, not a fix.

---

## Part 4 — What actually earns rankings and citations

On-page work is now done. These are the remaining levers, in order of impact:

1. **Unblock the AI crawlers** (Part 1.1). Nothing else counts until this happens.
2. **Fix the domain split** (Part 1.2), then deploy (Part 1.3).
3. **Publish consistently.** One 1,600-word post won't move a name query. Both search
   ranking and AI citation weight depend on topical depth — a handful of substantial,
   genuinely useful posts on one or two themes beats scattered one-offs. Your series
   feature is the right tool.
4. **Earn real links and mentions.** For AI citation specifically, being referenced on
   sites models already trust matters more than anything on your own domain: GitHub
   profile README linking here, Stack Overflow profile, Hashnode/dev.to cross-posts with
   a canonical link back, ORCID, LinkedIn articles. You already have the `sameAs` graph —
   make sure each of those profiles links *back*, which is what makes `rel=me`
   bidirectional and verifiable.
5. **Answer real questions.** Assistants cite pages that answer a specific question
   directly. Clear `##` headings phrased as questions, with the answer in the first
   sentence beneath, get quoted far more than narrative essays.
6. **Watch Search Console** for the `Afif Zilani` query set — impressions before
   position. Ranking a personal name usually takes weeks of consistent signals, not days.

An honest expectation: AI assistants have training cutoffs and cache aggressively, so
even after you unblock the crawlers, appearing in ChatGPT or Claude answers is a matter
of weeks-to-months, and via live-search tools (`OAI-SearchBot`, `Claude-SearchBot`)
sooner than via training data.
