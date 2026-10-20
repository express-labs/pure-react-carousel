# Pure React Carousel - Agent Rules

## Core Workflow & Critical Guardrails

- **Environment**: Node `v24.18.0` (pinned by `.nvmrc` and `package.json`). All commands must run in this environment.
- **Commits & Git Safety**: Conventional & Atomic Commits (`<type>(<scope>): <subject>` or `<type>: <subject>`) with a mandatory title and body explaining the technical rationale. Group related changes into focused, buildable commits (make multiple commits when needed). **NEVER** push directly to `master` or `main`. See `docs/GITHUB_CONVENTIONS.md`.
- **Single Source of Truth for Types**: `src/types.ts` is the single source of truth for all public (`*Props`) and unconnected view (`*ViewProps`) component types, re-exported via `src/index.ts`. Declaration files (`dist/types/index.d.ts`) are generated automatically during `npm run build` (`npm run build:types` via `tsconfig.build.json`). When modifying public component props or exports, update `src/types.ts` (and `src/index.ts` if adding new types) and cover new contracts in `typings/index.test-d.tsx`.
- **Component & Styling Contract**:
  - Published library source lives in `src/`, while the interactive demo SPA lives in `dev/` (excluded from the library bundle).
  - Each component folder separates the unconnected component (`Component.tsx`) from the context-connected export (`index.ts` using `WithStore`).
  - Preserve existing global `.carousel__*` class names alongside scoped CSS Module classes (`s.*`).
- **SSR & Next.js Compatibility**:
  - Never reference browser globals (`window`, `document`, `HTMLElement`, `SVGElement`) during module evaluation or render; keep DOM access inside `useEffect`, event handlers, or guarded with `typeof ... !== "undefined"`.
  - Preserve the `"use client";` banner in `vite.config.ts` (`pack.banner`).

## On-Demand Documentation

> Consult only when actively modifying the relevant subsystem; do not pre-read.
- **Typescript:** `docs/TYPESCRIPT_STANDARDS.md`
- **Git & Branching Protocols**: `docs/GITHUB_CONVENTIONS.md`
  - Conventional & atomic commit requirements, branch prefixes for Release Please, and push restrictions (`main`/`master` protection).
- **Pull Request Conventions**: `docs/PULL_REQUEST_CONVENTIONS.md`
  - PR title rules for Release Please, required `.github/PULL_REQUEST_TEMPLATE.md` sections (`What`, `Why`, `How`, `Checklist`), and `gh pr create` / artifact workflows.
- **Documentation & Pre-Push Validation**: `docs/DOCUMENTATION_CONVENTIONS.md`
  - Mandatory documentation audit and surface map required before pushing to remote or opening a PR.
- **CSS & SCSS Styling Standards**: `docs/CSS_CONVENTIONS.md`
  - Strict flat selectors (no nested class selectors), no HTML tag selectors, and modular styling.
- **Workspace Agent Skills**: `.agents/skills/<name>/SKILL.md`
  - On-demand runbooks for `address-pr-review`, `sandbox-lessons`, `tdd`, and `triage-issue` using subagent context isolation and progressive disclosure.

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
5. **Documentation Validation**:
   - Audit and update affected documentation before pushing to remote (see `docs/DOCUMENTATION_CONVENTIONS.md`).
