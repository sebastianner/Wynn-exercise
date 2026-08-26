<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Component authoring rules

Every component lives under `/components`, one folder per component, folder and files named in **PascalCase** after the component:

```
components/
  PromoBlock/
    PromoBlock.tsx          # the component
    PromoBlock.module.scss  # component-scoped styles (paired with Tailwind's `tw:` utilities)
    PromoBlock.test.tsx     # React Testing Library unit tests
    PromoBlock.stories.tsx  # Storybook stories
```

Do not add extra files to a component folder beyond these four unless there's a concrete reason (e.g. a colocated sub-component that isn't reused elsewhere).

## Styling

- Tailwind utilities use the `tw:` prefix (configured in `app/globals.css`, e.g. `tw:flex tw:items-center`).
- Anything Tailwind doesn't cover cleanly (complex selectors, animations, one-off layout) goes in the component's `.module.scss` file, imported as `styles` and applied alongside `tw:` classes.
- **Build mobile-first.** Write the default (unprefixed) styles for the smallest screen, then layer on media queries (Tailwind's `sm:`/`md:`/`lg:`/etc. breakpoint variants, or `min-width` queries in the `.module.scss` file) to adapt for larger screens. Never start from a desktop layout and scale down.

## Storybook

- Storybook is configured in `.storybook/` and picks up stories via `components/**/*.stories.tsx` — no per-story config needed.
- `.storybook/preview.tsx` imports `app/globals.css`, so Tailwind and SCSS modules render correctly in stories automatically.
- Run with `pnpm storybook`.

## Testing (React Testing Library + Vitest)

- Run unit tests with `pnpm test` (or `pnpm test:watch` while developing, `pnpm test:coverage` for a coverage report).
- **Test what a user does, not implementation details.** Query by role/label/text (`getByRole`, `getByLabelText`), drive interactions with `@testing-library/user-event`, and assert on what renders — not on internal state, class names, or function calls, unless that's the only observable effect (e.g. an `onClick` callback prop).
- Prefer a small number of meaningful interaction tests over many shallow ones. A static variant of a component often needs no test beyond what a shared "renders correctly" case already proves.
- **Coverage target: 95%** (lines/functions/branches/statements) for everything under `components/`, enforced via `vitest.config.mts`. If a branch is genuinely untestable through user-facing behavior, it's a sign the component is doing too much — split it rather than writing a test that pokes at internals just to hit the number.
