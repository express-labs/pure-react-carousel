# Documentation Conventions

This guide defines the mandatory documentation validation rules and workflow before pushing a branch to `origin` or opening a Pull Request.

---

## 1. Mandatory Pre-Push Documentation Gate

Documentation **must** be audited, updated, and validated before pushing any branch to the remote repository (`git push`) or opening a Pull Request. Code changes and their corresponding documentation updates must remain synchronized on the same branch.

---

## 2. Documentation Surface Map

When preparing to push a branch, inspect the files modified relative to `master` (`git diff --name-only origin/master...HEAD`) and verify the corresponding documentation surfaces:

| Area Modified | Documentation Files to Audit & Validate | What to Check |
| :--- | :--- | :--- |
| **Components, Props, Store State, or Public Types** (`src/**`, `typings/**`) | [`README.md`](../README.md) | Prop tables, default values, required flags, pseudo-HTML output snippets, and TypeScript usage examples. |
| **Build Toolchain, Scripts, Dependencies, or Node Version** (`package.json`, `vite.config.ts`, `.nvmrc`, `.node-version`) | [`README.md`](../README.md) (`## Dev Workflow`), [`AGENTS.md`](../AGENTS.md) | Prerequisite versions, contributor installation steps, `npm run` / `vp` command descriptions, and build output paths. |
| **Demo SPA or Directory Structure** (`dev/**`) | [`dev/README.md`](../dev/README.md), [`dev/App/README.md`](../dev/App/README.md), [`README.md`](../README.md) | Directory layout descriptions, entry points (`dev/index.html`, `dev/app.tsx`, `dev/compatibility.tsx`), and demo scripts. |
| **Git, PR, CSS, TypeScript, Accessibility, or Agent Workflows** (`.github/**`, `.agents/**`, `docs/**`, `AGENTS.md`) | [`docs/GITHUB_CONVENTIONS.md`](./GITHUB_CONVENTIONS.md), [`docs/PULL_REQUEST_CONVENTIONS.md`](./PULL_REQUEST_CONVENTIONS.md), [`docs/CSS_CONVENTIONS.md`](./CSS_CONVENTIONS.md), [`docs/TYPESCRIPT_STANDARDS.md`](./TYPESCRIPT_STANDARDS.md), [`docs/ACCESSIBILITY_STANDARDS.md`](./ACCESSIBILITY_STANDARDS.md), [`AGENTS.md`](../AGENTS.md) | Ensure workflow documentation matches CI/CD configs, workspace skills in `.agents/skills/` have valid frontmatter and relative links, and `CLAUDE.md` remains a symlink to `AGENTS.md`. |

---

## 3. Token-Efficiency & On-Demand Architecture

To minimize baseline token usage for AI coding agents:

1. **Keep `AGENTS.md` Lean**: `AGENTS.md` (and its `CLAUDE.md` symlink) is loaded into every agent session automatically. Keep it restricted to core guardrails, environment constraints, quality gate commands, and brief pointers to `docs/*.md`.
2. **Use `docs/*.md` and `.agents/skills/` for Detailed Protocols**: Place detailed checklists, examples, and subsystem conventions in `docs/` and multi-step agent workflows (`address-pr-review`, `sandbox-lessons`, `tdd`, `triage-issue`) in `.agents/skills/<name>/SKILL.md` so agents only load them on demand via progressive disclosure.

---

## 4. Pre-Push Verification Checklist

Before running `git push`:

1. Run `git diff --name-only origin/master...HEAD` and cross-reference all touched files against the **Documentation Surface Map** above.
2. Confirm no references to deprecated tools, deleted config files, outdated file paths, or stale npm scripts remain in any `.md` file.
3. Verify `CLAUDE.md` remains a valid relative symlink to `AGENTS.md` (`test -L CLAUDE.md`).
4. Commit documentation changes atomically (`docs: <summary>` or `docs(<scope>): <summary>`) following [`docs/GITHUB_CONVENTIONS.md`](./GITHUB_CONVENTIONS.md).
