# Repository Guidelines

## Project Structure & Module Organization

This repository is a Vite + React + TypeScript site with a small Express server for production hosting. Keep UI code in `client/src`, grouped by purpose: pages in `client/src/pages`, shared UI primitives in `client/src/components/ui`, app-specific components in `client/src/components`, hooks in `client/src/hooks`, and content/helpers in `client/src/lib`. Static assets live in `client/public/images`. Server entry code is in `server/index.ts`, and cross-cutting values belong in `shared/`. Treat `.manus-logs/` as generated debug output, not source.

## Build, Test, and Development Commands

Use `pnpm` for all local work.

- `pnpm dev` starts the Vite dev server on port `3000` (or the next available port).
- `pnpm build` builds the client into `dist/public` and bundles the Express server into `dist/`.
- `pnpm start` runs the production server from `dist/index.js`.
- `pnpm preview` serves the built client locally for a quick smoke check.
- `pnpm check` runs TypeScript in `--noEmit` mode.
- `pnpm format` applies the shared Prettier rules across the repo.

## Coding Style & Naming Conventions

Follow the existing Prettier config: 2-space indentation, semicolons, double quotes, trailing commas where valid, and an 80-character print width. Prefer strict TypeScript and existing path aliases such as `@/components/...` and `@shared/...`. Use `PascalCase` for React components (`Home.tsx`), `camelCase` for utilities and hooks (`useMobile.tsx`), and keep route-level files under `client/src/pages`. Favor small, composable components over adding more logic to page files.

## Testing Guidelines

There is no committed `test` script yet, so every change should at minimum pass `pnpm check` and a manual browser smoke test via `pnpm dev` or `pnpm preview`. When adding tests, use Vitest (already installed) and name files `*.test.ts` or `*.test.tsx`, preferably close to the code they cover.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commit prefixes such as `feat:`. Keep commits short, imperative, and scoped, for example `feat: refine hero navigation` or `fix: handle missing section anchor`. Pull requests should include a concise summary, testing notes, linked issue or task context, and screenshots or short recordings for visible UI changes.

## Configuration Notes

The production server reads `PORT`; otherwise it defaults to `3000`. Do not commit large generated files or local logs unless they are intentional source artifacts.
