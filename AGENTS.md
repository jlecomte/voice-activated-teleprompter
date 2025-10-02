# Repository Guidelines

## Project Structure & Module Organization
Source code lives in `src/`. `main.tsx` bootstraps the React app and mounts `App.tsx`. Screen-specific logic and Redux slices live in `src/features/`. Reusable hooks, helpers, and speech utilities live in `src/lib/`. Global styles and Bulma overrides are defined in `src/index.scss`. Build artifacts land in `dist/`; static assets such as `icon.png` stay at the repo root. Keep new voice-control modules alongside related UI under `src/features/<feature-name>/`.

## Build, Test, and Development Commands
- `npm install` sets up dependencies; run after cloning or pulling.
- `npm run dev` starts Vite with hot reload at `http://localhost:5173`.
- `npm run build` runs TypeScript compilation and emits an optimized bundle in `dist/`.
- `npm run preview` serves the last build for acceptance checks.
- `npm run type-check` validates TypeScript without emitting files.
- `npm run lint` or `npm run lint:fix` enforces ESLint rules; `npm run format` applies Prettier.

## Coding Style & Naming Conventions
Target TypeScript + JSX with Prettier defaults (2-space indent, single quotes off, semicolons on). Prefer functional React components. Name components and hooks in PascalCase and camelCase respectively; Redux slices/files follow `teleprompter.slice.ts`. Co-locate feature styles and tests with the component. Import paths should stay relative within `src/` to keep Vite resolution simple.

## Testing Guidelines
`npm test` is currently a stub; wire new suites with Vitest + jsdom (already available). Place unit tests next to the file under `__tests__` or `<name>.test.tsx`. Cover speech recognition reducers and teleprompter timing logic before UI cosmetics. Capture voice command scenarios with mocked Web Speech API events.

## Commit & Pull Request Guidelines
Commits use imperative, sentence-case subjects (`Add configurable line position control`). Group related changes, keep body lines ≤72 chars, and reference tickets when applicable. Pull requests should summarize behavioral impact, list testing commands executed, attach screenshots or clips for UI updates, and link any speech command additions to documentation updates.

## Voice & Configuration Notes
Speech recognition depends on browser permissions; document any locale additions in README. Store API keys or service URLs in Vite env files (`.env.local`) and never commit them. Reuse Bulma tokens when styling new controls to retain theme consistency.
