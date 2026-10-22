---
name: tdd
description: >-
  Use this skill when implementing bug fixes, addressing PR review findings, or
  building new component features. Enforces a strict Red-Green-Refactor loop using
  targeted Vitest runs and isolates noisy full-suite quality gates in a subagent to
  preserve the primary context window.
---

# Test-Driven Development (TDD) Loop Skill

Use this skill to implement changes through a verifiable Red-Green-Refactor loop while keeping test runner noise out of the primary context window.

## When to Delegate vs. Run Inline

- **Delegate to a subagent** (`invoke_subagent` with `TypeName: "self"`, or your environment's subagent/task tool) when implementing a well-defined fix or running the full verification gate (`npm test`, `npm run build`), so hundreds of lines of test/coverage output stay in the subagent's disposable context. If subagents are unavailable in your environment, run the steps inline and report a concise summary.
- **Run targeted tests inline** (`npm run test -- <path-to-test>`) only when iterating on a single test file and you need immediate feedback.

## The Red-Green-Refactor Loop

### 1. Red (Write a Failing Test First)

1. Identify the exact behavioral contract or edge-case sequence to verify.
2. Add or update a focused test case in `src/<Component>/__tests__/<Component>.test.tsx` (or `typings/index.test-d.tsx` for public type contracts).
3. Run **only** the targeted test file:
   ```sh
   npm run test -- src/<Component>/__tests__/<Component>.test.tsx
   ```
4. Verify that the new test **fails for the expected assertion** (not a syntax or import error). Never write production code before observing the Red state.

### 2. Green (Minimal Implementation)

1. Write the smallest, cleanest change in `src/<Component>/<Component>.tsx` (and `src/types.ts` if public props change) required to pass the failing test.
2. Respect repository guardrails:
   - Never access `window`, `document`, or DOM globals during render or module evaluation (SSR safety).
   - Preserve `.carousel__*` global class names alongside CSS Module classes.
   - Keep module exports tree-shakeable (preserve multi-entry `pack.entry` in `vite.config.ts` and `"sideEffects": ["*.css"]` in `package.json`, and avoid runtime side effects at module scope).
3. Re-run the targeted test file:
   ```sh
   npm run test -- src/<Component>/__tests__/<Component>.test.tsx
   ```
4. Repeat until the targeted test suite is 100% green.

### 3. Refactor (Simplify Without Breaking Contracts)

1. Inspect the modified code for duplicated state flags, nested conditionals, or brittle heuristics.
2. Simplify the implementation while keeping the targeted test green after every edit.

### 4. Subagent-Isolated Quality Gates

Before committing, run the full repository quality gates (ideally inside the `self` subagent executing the TDD loop, or inline if subagents are unavailable, returning only the concise pass/fail summary):

1. `npm run typecheck`
2. `npm run lint`
3. `npm run format:check`
4. `npm test` (full unit + SSR + coverage suite)
5. `npm run build` (when public exports, types, or styles are touched)
