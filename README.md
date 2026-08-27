This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Tech stack

- **Next.js 16 (App Router, Turbopack)** — the framework. `app/[slug]/page.tsx` and `app/page.tsx` fetch a Contentful `page` entry and render it; `generateStaticParams` pre-renders every known slug at build time (SSG), with `app/api/revalidate` handling on-demand ISR when Contentful content is published.
- **TypeScript** — every Contentful content type has an interface (`types/content-types.ts`, `lib/contentful.ts`), so the CMS's shape is enforced end to end instead of trusted at runtime.
- **Contentful SDK (`contentful`)** — `lib/contentful.ts` is the single data-fetching layer: it wraps `client.getEntries()`, resolves nested references (`include: 2`), and maps raw entries to typed props. Every component and route goes through this layer rather than calling Contentful directly.
- **`ComponentRenderer`** — the bridge between CMS and UI: a `Record<contentType, Component>` map (`components/ComponentRenderer/ComponentRenderer.tsx`) that dispatches each resolved page-component entry (`hero`, `promo`, ...) to its React component, so adding a new Contentful component type is a one-line registry addition.
- **Tailwind CSS v4** (`tw:` prefix, configured in `app/globals.css`) — utility classes for layout/spacing/responsive breakpoints, mobile-first throughout.
- **SCSS Modules** (`*.module.scss`, via the `sass` package) — for anything Tailwind doesn't cover cleanly (complex selectors, keyframe animations, one-off layout), applied alongside `tw:` classes on the same element. No SCSS config exists anywhere in the repo — Turbopack and Vite both support `.module.scss` out of the box once `sass` is installed, so the exact same component styles work identically in the app, Storybook, and tests.
- **Storybook** (`@storybook/nextjs-vite`) — one `.stories.tsx` per component, isolated from the CMS. `.storybook/preview.tsx` imports `app/globals.css` once, which is enough to make Tailwind and every component's SCSS module render correctly in stories with zero extra config.
- **Vitest + React Testing Library** — component unit tests (`*.test.tsx`) query by role/label/text and drive interactions with `@testing-library/user-event`, asserting on rendered output rather than implementation details. Runs on Vite (same engine as Storybook), enforced at 95% coverage under `components/`.
- **Zustand** — the one piece of client state that isn't CMS-driven: the reservation widget (check-in/out, rooms, guests, promo code) in `lib/store/reservationStore.ts`, shared between `Header` and `Calendar`. Wrapped in the `devtools` middleware for Redux DevTools inspection in development.
- **Netlify** — hosting/CI. Builds via `next build`, deploys through `@netlify/plugin-nextjs`. `netlify.toml` scopes secret scanning (`SECRETS_SCAN_OMIT_KEYS`/`SECRETS_SCAN_OMIT_PATHS`) so Turbopack's build cache and the public, non-sensitive `CONTENTFUL_SPACE_ID` don't false-positive the build, while `CONTENTFUL_ACCESS_TOKEN`/`CONTENTFUL_REVALIDATE_SECRET` stay actively scanned everywhere else.

How they relate, end to end: a content editor publishes an entry in **Contentful** → its webhook hits `app/api/revalidate` → **Next.js** re-renders the affected page(s) via `lib/contentful.ts` → `ComponentRenderer` maps each resolved entry to a component styled with **Tailwind**/**SCSS** → the same components are developed and visually verified in isolation via **Storybook**, and behaviorally verified via **Vitest**/RTL → **Zustand** covers the one piece of state Contentful doesn't own → the whole thing builds and deploys through **Netlify**.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Known gaps

**Revalidation webhook over-revalidates.** Publishing a component entry (`hero`, `promo`) has no `slug` to target, so `app/api/revalidate/route.ts` revalidates every page instead. A real product would resolve the owning page(s) via Contentful's `links_to_entry` reverse lookup, recursing until it hits a `page` entry. Skipped here since `page.components` is flat with no nesting, so the cost is negligible.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
