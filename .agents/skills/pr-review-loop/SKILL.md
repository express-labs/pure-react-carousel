---
name: pr-review-loop
description: >-
  Use this skill after finishing a `/goal` or implementation task, or when the user
  asks to open a Pull Request and run an automated code review loop. Verifies
  pre-PR quality and documentation gates in a subagent, asks the user once for
  permission to create the PR, and then autonomously drives an isolated,
  context-free Gemini subagent code review → triage → TDD fix → push → re-review
  cycle to keep the primary agent in the "Smart Zone" without biasing the reviewer.
---

# Post-Goal PR & Autonomous Isolated Gemini Review Loop (`pr-review-loop`)

Follow this workflow after completing a coding goal or feature to ship a Pull Request and iteratively resolve worthwhile code review feedback using an isolated, context-free Gemini subagent so the primary conversation context never biases the review.

---

## Step 1: Subagent Pre-PR Verification & Draft Preparation

Before asking the user to open a PR, spawn a `self` subagent via `invoke_subagent` (`TypeName: "self"`) to run the noisy verification checks in an isolated context:

1. **Consult Sandbox Lessons**: Check [`.agents/skills/sandbox-lessons/SKILL.md`](../sandbox-lessons/SKILL.md) (`lessons/INDEX.md`) before executing shell commands.
2. **Branch & Commit Safety ([`docs/GITHUB_CONVENTIONS.md`](../../../docs/GITHUB_CONVENTIONS.md))**:
   - Confirm the workspace is on a properly named branch (`<type>/<short-description>`) and **not** `master` or `main`.
   - Confirm all work is committed in atomic Conventional Commits (`<type>(<scope>): <summary>` with a technical rationale body).
3. **Documentation Audit ([`docs/DOCUMENTATION_CONVENTIONS.md`](../../../docs/DOCUMENTATION_CONVENTIONS.md))**:
   - Run `git diff --name-only origin/master...HEAD` and verify all affected documentation surfaces (`README.md`, `dev/README.md`, `docs/*.md`, `AGENTS.md`, `CLAUDE.md` symlink) are updated and committed.
4. **Full Quality Gates ([`docs/PULL_REQUEST_CONVENTIONS.md`](../../../docs/PULL_REQUEST_CONVENTIONS.md))**:
   - Run `npm run prepublishOnly` (or `npm run format:check`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`).
5. **Return a Compact Pre-PR Brief (<30 lines)** containing:
   - Branch name, commit list (`git log origin/master..HEAD --oneline`), and quality gate pass status.
   - Proposed Conventional Commit PR title (`<type>(<optional-scope>): <summary>`).
   - Populated PR body following [`.github/PULL_REQUEST_TEMPLATE.md`](../../../.github/PULL_REQUEST_TEMPLATE.md) (`What`, `Why`, `How`, `Checklist`).

---

## Step 2: Single User Approval Checkpoint & PR Creation

1. Present the **Pre-PR Brief** (branch, commits, proposed PR title, and summary) to the user.
2. **Ask the user for permission** to push the branch, open the Pull Request, and start the automated Gemini code review loop (if a PR already exists for the branch, ask if it is okay to push and start the review loop on the existing PR).
3. Once the user approves:
   - Push the branch to `origin`:
     ```sh
     git push -u origin <type>/<branch-name>
     ```
   - Create the PR against `master` per [`docs/PULL_REQUEST_CONVENTIONS.md`](../../../docs/PULL_REQUEST_CONVENTIONS.md) (writing the template body to a scratch file first to avoid complex shell escaping):
     ```sh
     gh pr create --base master --title "<type>: <summary>" --body-file <scratch-pr-body.md>
     ```

---

## Step 3: Isolated, Context-Free Gemini Subagent Code Review

Track the current **Round Number (`1` to `4` max)**. To ensure the current conversation context does **not** influence or bias the code review:

1. **Define the Dedicated Reviewer Subagent (Once per Conversation)**:
   - Call `define_subagent` with `Name: "gemini-code-reviewer"`, `EnableWriteTools: true` (for read-only `git diff` / `git log` / `git show` commands), `EnableSubagentTools: false`, and `EnableMCPTools: false`.
   - Give `gemini-code-reviewer` a strict, independent system prompt instructing it to:
     - Never modify any files or run mutating git commands.
     - Inspect only `git diff origin/master...HEAD`, `git log origin/master..HEAD`, surrounding source files, and repository conventions (`AGENTS.md`, `docs/*.md`).
     - Critically evaluate the changes across four core dimensions:
       1. **Security Concerns**: CI/CD workflow permissions, secret/token exposure, OIDC/supply-chain risks, untrusted inputs, XSS/injection vulnerabilities, or unsafe runtime/DOM access.
       2. **Over-Complicated / Hard-to-Maintain Code**: Unnecessary abstraction, convoluted conditionals, brittle heuristics, or poor readability.
       3. **Code Smells**: Dead code, inconsistent conventions, duplicated logic, or leaky responsibilities.
       4. **Logic Errors & Edge Cases**: Flawed conditions, unintended trigger paths, race conditions, SSR/hydration hazards, failure-mode regressions, or broken invariants.
2. **Invoke a Fresh `gemini-code-reviewer` Subagent for Each Round**:
   - Always spawn a **new** `gemini-code-reviewer` subagent invocation (`invoke_subagent` with `TypeName: "gemini-code-reviewer"` and `Model: "inherit"`) for each review round so prior implementation discussions do not bias the reviewer.
   - Keep the task prompt neutral and context-free: pass only the branch diff command (`git diff origin/master...HEAD` and `git log origin/master..HEAD`) and, on Round `2+`, a brief list of any findings from earlier rounds that were intentionally classified as **Skip (Not Worth the Effort)** so they are not re-flagged.
   - Have the subagent classify each finding using the [`address-pr-review`](../address-pr-review/SKILL.md) rubric:
     1. **Worthwhile Fix**: Valid bug, security issue, reproducible edge case, missing test coverage, or concrete maintainability/safety improvement worth implementing.
     2. **Architectural Smell / Breaking Change**: Requires changing public API contracts (`src/types.ts`) in a breaking way or redesigning a core state machine with trade-offs that require user input.
     3. **Skip (Not Worth the Effort)**: Nitpick, false positive, already handled, out of scope, or contradicts project conventions (`docs/*.md`).
   - Have the subagent return a **Compact Recon Brief (<35 lines)** listing each finding with exact file paths, line numbers, review dimension, classification, and technical rationale.

---

## Step 4: Autonomous Triage, Delegated TDD Fixes, & Loop Repeat

Evaluate the subagent's **Compact Recon Brief** in the primary agent:

1. **Exit Condition A — Converged (0 Worthwhile Fixes & 0 Architectural Smells)**:
   - Stop the loop immediately.
   - Present a concise final report to the user summarizing:
     - The PR URL and total review rounds completed.
     - Commits pushed during the review loop.
     - Any non-worthwhile comments that were intentionally skipped (with brief rationale).
   - Recommend `/compact` to clear the review loop history and keep the session in the Smart Zone.

2. **Pause Condition — Architectural Smell or Breaking Change**:
   - Only interrupt the autonomous loop if a finding requires a breaking change or major architectural trade-off. Use `ask_question` to align with the user before implementing that item.

3. **Autonomous Fix & Re-Review Cycle (1+ Worthwhile Fixes)**:
   - Delegate the approved Worthwhile Fixes to a `self` subagent (`TypeName: "self"`) following the [`tdd`](../tdd/SKILL.md) skill:
     - **Red**: Add/update unit or SSR regression tests in `__tests__/*.test.tsx` (and `typings/index.test-d.tsx` if types are touched) and verify the targeted test fails (`npm run test -- <path-to-test>`).
     - **Green & Refactor**: Implement the minimal fix in `src/` while respecting SSR safety and `.carousel__*` class contracts.
     - **Quality & Docs Gates**: Run `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test`, `npm run build`, and audit [`docs/DOCUMENTATION_CONVENTIONS.md`](../../../docs/DOCUMENTATION_CONVENTIONS.md) inside the subagent.
     - **Atomic Commit**: Commit the fixes (and any accompanying doc updates) atomically following [`docs/GITHUB_CONVENTIONS.md`](../../../docs/GITHUB_CONVENTIONS.md).
   - **Push Changes**:
     - Push the new commit(s) to the PR branch:
       ```sh
       git push
       ```
   - **Check Round Cap (Max 4 Rounds)**:
     - If you just completed fixes for **Round 4**, stop the loop after pushing and report the final status to the user rather than starting a 5th review round.
   - **Trigger Next Isolated Review Round**:
     - Increment the round counter and return to **Step 3** (spawning a fresh `gemini-code-reviewer` subagent to review the updated `origin/master...HEAD` diff).
