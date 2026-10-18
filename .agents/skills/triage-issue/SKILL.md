---
name: triage-issue
description: >-
  Use this skill when starting work on a GitHub issue, bug report, or feature request.
  Isolates issue fetching and codebase exploration inside a subagent, runs a
  design alignment checkpoint for ambiguous requirements, and produces an atomic
  commit and test plan without cluttering the primary context window.
---

# Triage Issue & Plan Skill

Use this skill to investigate a bug report, GitHub issue, or feature request while keeping exploratory file reads and search logs out of the primary agent's context window.

## Step 1: Subagent Recon

Do **not** perform broad `grep_search` or multi-file `view_file` sweeps in the main conversation. Spawn a `self` subagent (or a `research` subagent for local-only recon) via `invoke_subagent` (or use your environment's subagent/task tool, or targeted inline reads if subagents are unavailable) with instructions to:

1. **Fetch the issue** (if a GitHub issue number/URL is provided) by preferring `read_url_content` (when available) on `https://api.github.com/repos/express-labs/pure-react-carousel/issues/<num>` and `https://api.github.com/repos/express-labs/pure-react-carousel/issues/<num>/comments` so fetches stay sandboxed, falling back to `gh issue view <num> --comments` when needed.
2. **Locate affected surfaces**:
   - Component implementation (`src/<Component>/<Component>.tsx` and `src/<Component>/index.ts`).
   - Store / state wiring (`src/Store/Store.ts`, `src/CarouselProvider/CarouselProvider.tsx`, `src/helpers/component-config.ts`).
   - Public types (`src/types.ts`, `src/index.ts`, `typings/index.test-d.tsx`).
   - Existing unit & SSR tests (`src/<Component>/__tests__/<Component>.test.tsx`, `src/__tests__/ssr.node.test.tsx`, `src/__tests__/ssr.hydration.test.tsx`).
   - Documentation surfaces per [`docs/DOCUMENTATION_CONVENTIONS.md`](../../../docs/DOCUMENTATION_CONVENTIONS.md).
3. **Return a structured Triage Brief** (under 40 lines) containing:
   - **Root Cause / Gap**: Exact file paths, line ranges, and why the current behavior occurs.
   - **Design Options**: 1–2 concrete approaches with trade-offs (e.g., API surface impact, SSR safety, state complexity).
   - **Proposed Atomic Commit Plan**: Ordered list of focused commits (`fix(...)`, `feat(...)`, `docs(...)`) and the specific test cases each commit will add.

## Step 2: Interactive Alignment (`/grill-me` Checkpoint)

1. Share the concise **Triage Brief** with the user.
2. If there are any design trade-offs, prop naming questions, or edge-case ambiguities, use `ask_question` (or ask the user directly if `ask_question` is unavailable) to resolve them with the user before creating a branch or editing files.

## Step 3: Hand Off to Branching & [`tdd`](../tdd/SKILL.md)

Once the plan is approved:

1. Create a properly prefixed feature/fix branch per [`docs/GITHUB_CONVENTIONS.md`](../../../docs/GITHUB_CONVENTIONS.md) (`feat/<name>` or `fix/<name>`).
2. Execute each planned commit using the [`tdd`](../tdd/SKILL.md) skill (Red → Green → Refactor → Quality Gates).
