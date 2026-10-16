# Pure React Carousel - Agent Rules

## Core Workflow & Critical Guardrails

- **Environment**: Node `v22.22.2` (pinned by `.nvmrc` and `package.json`). All commands must run in this environment.
- **Single Source of Truth for Types**: `src/types.ts` is the single source of truth for all public (`*Props`) and unconnected view (`*ViewProps`) component types, re-exported via `src/index.ts`. Declaration files (`dist/types/index.d.ts`) are generated automatically during `npm run build` (`npm run build:types` via `tsconfig.build.json`). When modifying public component props or exports, update `src/types.ts` (and `src/index.ts` if adding new types) and cover new contracts in `typings/index.test-d.tsx`.
- **Component & Styling Contract**:
  - Each component folder separates the unconnected component (`Component.tsx`) from the context-connected export (`index.ts` using `WithStore`).
  - Preserve existing global `.carousel__*` class names alongside scoped CSS Module classes (`s.*`).
- **SSR & Next.js Compatibility**:
  - Never reference browser globals (`window`, `document`, `HTMLElement`, `SVGElement`) during module evaluation or render; keep DOM access inside `useEffect`, event handlers, or guarded with `typeof ... !== "undefined"`.
  - Preserve the `"use client";` banner in `rollup.config.es.mjs` and `rollup.config.cjs.mjs`.

## On-Demand Documentation
> Consult only when actively modifying the relevant subsystem; do not pre-read.

- **Git & Branching Protocols**: `docs/GITHUB_CONVENTIONS.md`
  - Conventional Commit branch prefixes for Release Please and push restrictions (`main`/`master` protection).
- **CSS & SCSS Styling Standards**: `docs/CSS_CONVENTIONS.md`
  - Strict flat selectors (no nested class selectors), no HTML tag selectors, and modular styling.

---

## Definition of Done & Quality Gates

Before publishing a branch or opening a pull request, run the following verification checks (or `npm run prepublishOnly` to run all gates in sequence):

1. **Unit & SSR Testing**:
   - Targeted: `npm run test -- <path-to-test>` (Vitest)
   - Full suite (with coverage): `npm test`
2. **Typechecking**:
   - Full project & typings check: `npm run typecheck`
3. **Linting & Formatting**:
   - Lint: `npm run lint` (or `npm run lint:fix`)
   - Format: `npm run format:check` (or `npm run format`)
4. **Build Verification**:
   - Full bundle build (ESM + CJS): `npm run build`
