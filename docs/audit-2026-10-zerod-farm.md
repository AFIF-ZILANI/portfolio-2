# Site audit and redesign: refocus on ZeroD Farm (2026-10-07)

What was wrong, what was changed, and what still needs to be done outside the code.
The live site could not be fetched from the build sandbox, so this audit is based on the
code plus a local production build backed by a database seeded with the old content.

---

## 1. Positioning (the biggest problem)

The site said one thing and you're doing another. The page title, H1 subtitle, tagline,
bio, stats, skills grid, projects grid, schema `jobTitle`, manifest and `llms.txt` all
described a **full-stack developer who is "open to work"**. You aren't looking for jobs
or freelance work. Every developer-focused signal was pulling the wrong people in (recruiters
and clients) and telling Google and AI assistants the wrong thing about you.

**Changed:** the whole site is now about one thing: Afif Zilani, Co-Founder & CEO of
ZeroD Farm, a poultry farm in Naogaon. The page is written for the three groups a farm
needs: buyers, suppliers and partners.

| Removed | Why |
|---|---|
| Projects section, admin editor, data, screenshots | You asked for it. It also showed client web work, which is freelancing. |
| Skills section (TypeScript, Rust, Docker…), admin editor, icon picker | A wall of programming logos says "hire me as a developer". |
| "Open to work — let's build something great." | It was literally an invitation to recruiters. |
| ZeroD Agencies / ZeroD Umb experience entries | The agency entry was client development work. Only ZeroD Farm stays. |
| Dev stats (40+ shipped, 1k+ contributions…) | Not relevant to the farm, and not checkable. |
| 14-link social dump in About | Now Facebook, LinkedIn, Instagram, X, Email. The developer profiles (GitHub, Stack Overflow, ORCID…) stay in the Person schema `sameAs`, so search engines still connect them to you. |

## 2. UI

| Issue | Fix |
|---|---|
| A terminal/hacker look (`afif@dev:~$`, Space Mono everywhere, matrix particles, scanlines, macOS window dots) | New identity: warm cream, forest green and a yolk-amber accent; Fraunces serif headings with Inter body text. It reads as agriculture and trust instead of code. |
| Monospace body text: hard to read in long paragraphs | Inter for body text; system monospace only for code blocks. |
| Dark mode was forced, with no system option | Follows the visitor's OS setting, and the toggle still works. Dark mode is a deep green, not grey. |
| Section labels like `~/about.md` and `~/contact --interactive` | Plain labels: About, ZeroD Farm, Writing, Events, Contact. |

## 3. UX

| Issue | Fix |
|---|---|
| **The contact form was a fake terminal**: one hidden input, one prompt at a time, a `[Y/n]` confirmation, and a pretend "encrypting payload" delay. Most buyers would have given up. No autofill, and the message was stashed on `window._contactMsg`. | A normal form: name, email, optional phone, a topic (buying / supplying / partnership / other) and a message. Inline errors and a clear "message sent" state. |
| No clear call to action for the business | The hero has "About ZeroD Farm" and "Get in touch". The farm section has a "Work with the farm" panel. The navbar has a Contact button. |
| Nav items were `<button>`s that ran JavaScript to scroll | Real links (`/#about`, …). They work without JS, can open in a new tab, and can be crawled. |
| `ScrollToHash` forced the page to the top on every load, which broke the back button and refresh | Removed. Native hash scrolling plus `scroll-padding-top` under the fixed header. |
| The About bio "typed itself out" line by line; stats only appeared on scroll | Static, readable paragraphs and stat cards. |
| The 404 page took about 6 s of fake `curl` output before showing any links, and linked to removed sections | An instant, server-rendered page with useful links. |
| No skip link; nav had no landmark label | A "Skip to content" link, `<header>`/`<nav aria-label>`, and every section has `aria-labelledby`. |

## 4. Code and performance

| Issue | Fix |
|---|---|
| **Clerk middleware ran on every public page.** The matcher comment said it didn't, but the stock Clerk catch-all was still there, so every visit paid for an auth check (and handshake redirects). | Catch-all removed. Clerk now runs only on `/admin`, `/signin` and `/api/admin`. Verified locally: `/` no longer returns `x-clerk-*` headers, and `/admin` is still protected. |
| The homepage was almost all client components with framer-motion (hero particles, spinning ring, typed terminal) | Hero, About and Farm are server components that ship no JS. Only the contact form is a client component. **Homepage first-load JS: 198 kB → 113 kB (−43%)**, measured with `next build` before and after. |
| **The contact email spoofed the visitor's address** (`from: name <visitor@…>`). That fails SPF/DMARC, so Gmail drops or spams it, which means you were probably losing messages. | Mail is sent **from `SMTP_USER`**, with the visitor in **Reply-To**. |
| Contact API: no length limits, no bot protection, header values not sanitised, crashed on bad JSON, subject said `afif.dev` | Length limits, a topic whitelist, a honeypot field, single-line header values, safe JSON parsing, and the subject `[ZeroD Farm] <topic> — <name>`. |
| Dead CSS (about 80 lines of Replit `hover-elevate` utilities), unused shadow tokens | Removed. |
| Projects and skills code left behind in data types, merge, image-cleanup and tests | Removed everywhere. Tests updated: 54/54 pass. |

## 5. SEO

| Issue | Fix |
|---|---|
| Title/description: "Full-Stack Developer…" | "Afif Zilani — Co-Founder & CEO of ZeroD Farm, Naogaon", plus a matching description. |
| og:image was a **square WebP** (cropped in large cards; WebP is poorly supported in some link previews) | Generated a 1200×630 PNG `opengraph-image`. |
| Schema: `jobTitle` was a developer title, `knowsAbout` listed programming languages, and ZeroD Farm wasn't an entity | Person → `worksFor` a new **ZeroD Farm `Organization`** (founder, foundingDate 2022, Naogaon address, areaServed BD). `knowsAbout` is now poultry and agribusiness topics. |
| `llms.txt` advertised projects and skills | It now states the role, the business and "not seeking employment or freelance work" explicitly, so AI assistants describe you correctly. |
| Manifest name and colours were for the developer brand | Updated. |
| Only one H1 per page | Already correct, and kept. |

---

## 6. What you must do (code can't do these)

1. **Run the migration in production:** `bunx prisma migrate deploy`.
   The homepage renders the database row, not the code defaults. Until this runs, the live
   site will show the new design with the **old developer text**. The migration rewrites
   the name (to "Afif Zilani"), title, tagline, bio, experience, stats and contact heading,
   and drops projects and skills. Images, social links and your contact email are kept.
2. **Check that `SMTP_USER` is set** in production. The form now sends from it. If it's
   missing, the form shows "isn't configured yet" instead of failing silently.
3. **Give the site real numbers.** Right now the stats are just facts that are true by
   definition (2022 / Naogaon / Poultry). Buyers trust specifics: birds per batch, batches
   per year, breed (broiler, layer, Sonali?), districts you deliver to. Add them in
   **/admin/site/stats**. Don't invent them.
4. **Add photos of the farm.** Both photos on the site are portraits (one in a restaurant).
   A farm site with no photos of the farm is the weakest part of the page now. Upload shed,
   flock and team photos.
5. **Add a phone/WhatsApp number** if you're willing to publish one. Most Bangladeshi
   buyers will message on WhatsApp before they fill in a form. Once a public phone number
   and address exist, upgrade the farm schema to `LocalBusiness` and create a
   **Google Business Profile** for ZeroD Farm. For local buyers, that matters more than
   anything on this site.
6. **Your blog is still developer content** (for example the JEPA/AI post). It now sits
   under a farm-focused site. Either write farm posts (costs, disease prevention, lessons
   from running a farm) or unpublish the dev posts. Mixed signals cancel out.
7. **Check `zerod.bd`.** The schema names it as ZeroD Farm's parent organisation. If that
   domain isn't live or isn't yours, remove `parentOrganization` in
   `src/components/PersonaSchema.tsx`.
8. **Review the copy in `src/components/sections/farm.tsx`.** I wrote the four principles
   ("Healthy flocks first", etc.) from your stated role. Change anything that isn't true
   of how you actually run the farm.
9. Items from the July audit (`docs/seo-audit.md`) still apply: the Cloudflare-managed
   robots.txt blocking AI crawlers, and the wrong `CLOUDINARY_API_SECRET`. I couldn't
   check either from here.
