# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Local docs are the source of truth

This project uses Next.js 16.2.10, which has breaking changes relative to what you may know from training data. Before writing routing, caching, data-fetching, or config code, consult the bundled docs at `node_modules/next/dist/docs/` (App Router docs under `01-app/`). Notably, this version supports the Cache Components model (`cacheComponents: true` in `next.config.ts`, the `use cache` directive, `cacheLife`) rather than the older fetch-cache/revalidate model — see `01-app/01-getting-started/08-caching.md`.

## Commands

- `npm run dev` — start dev server at http://localhost:3000
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`, extends `eslint-config-next`)

There is no test framework set up.

## Architecture

- Next.js App Router project; routes live in `app/` (`app/layout.tsx` is the root layout, `app/page.tsx` the home page).
- Styling is Tailwind CSS v4 via the `@tailwindcss/postcss` PostCSS plugin (`postcss.config.mjs`); global styles and Tailwind setup live in `app/globals.css` — there is no `tailwind.config` file.
- TypeScript strict mode; `@/*` path alias maps to the repo root.
