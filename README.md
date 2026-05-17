# AFIF ZILANI — Portfolio

> Personal portfolio of Afif Zilani — Entrepreneur, Programmer & Co-Founder of ZeroD.  
> Built with Next.js 15, React 19, Tailwind CSS v4, GSAP, and Framer Motion.

[![Live](https://img.shields.io/badge/Live-afifzilani.com-blue?style=flat-square)](https://afifzilani.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animation | GSAP 3 + Framer Motion 12 |
| UI Primitives | Radix UI + shadcn/ui |
| Icons | Lucide React + React Icons |
| Email | Nodemailer |
| Theming | next-themes |
| Package Manager | Bun |
| Linting | ESLint 9 + Prettier |

---

## Project Structure

```
portfolio-2/
├── public/              # Static assets (images, favicon, og image)
├── src/
│   ├── app/             # Next.js App Router (layout, pages, not-found)
│   ├── components/      # Reusable UI components
│   └── lib/             # Utilities, data, constants
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0 (recommended) or Node.js >= 18

### Installation

```bash
# Clone the repo
git clone https://github.com/AFIF-ZILANI/portfolio-2.git
cd portfolio-2

# Install dependencies
bun install
```

### Development

```bash
bun dev
```

Opens at [http://localhost:3000](http://localhost:3000). Uses Turbopack for fast HMR.

### Build

```bash
bun run build
bun start
```

### Lint & Format

```bash
bun run lint
bunx prettier --write .
```

---

## Deployment

Deployed on [Vercel](https://vercel.com). Any push to `main` triggers an automatic production deployment.

To deploy your own fork:

1. Import the repo at [vercel.com/new](https://vercel.com/new)
2. Set the framework preset to **Next.js**
3. Add environment variables if needed (see below)
4. Deploy

---

## Environment Variables

Create a `.env.local` file in the root:

```env
# Required for the contact form (Nodemailer)
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-app-password
```

---

## License

MIT © [Afif Zilani](https://afifzilani.com)

---

## Connect

[![GitHub](https://img.shields.io/badge/GitHub-AFIF--ZILANI-181717?style=flat-square&logo=github)](https://github.com/AFIF-ZILANI)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-afifzilani-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/afifzilani)
[![X](https://img.shields.io/badge/X-afif__zilani-000000?style=flat-square&logo=x)](https://x.com/afif_zilani)
[![Stack Overflow](https://img.shields.io/badge/Stack%20Overflow-afif--zilani-F58025?style=flat-square&logo=stackoverflow)](https://stackoverflow.com/users/22881891/afif-zilani)