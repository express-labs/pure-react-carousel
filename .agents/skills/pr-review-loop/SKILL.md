---
name: pr-review-loop
description: >-
  Use this skill after finishing a `/goal` or implementation task, or when the user
  asks to open a Pull Request and run an automated `@copilot` code review loop.
  Verifies pre-PR quality and documentation gates in a subagent, asks the user once
  for permission to create the PR, and then autonomously drives the `@copilot`
  review → triage → TDD fix → push → re-review cycle using subagents and timers to
  keep the primary agent in the "Smart Zone".
---

# Post-Goal PR & Autonomous `@copilot` Review Loop (`pr-review-loop`)

Follow this workflow after completing a coding goal or feature to ship a Pull Request and iteratively resolve worthwhile `@copilot` review feedback without polluting the primary context window.

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
2. **Ask the user for permission** to push the branch, open the Pull Request, and start the automated `@copilot` review loop (if a PR already exists for the branch, ask if it is okay to push and start the review loop on the existing PR).
3. Once the user approves:
   - Push the branch to `origin`:
     ```sh
     git push -u origin <type>/<branch-name>
     ```
   - Create the PR against `master` per [`docs/PULL_REQUEST_CONVENTIONS.md`](../../../docs/PULL_REQUEST_CONVENTIONS.md) (writing the template body to a scratch file first to avoid complex shell escaping):
     ```sh
     gh pr create --base master --title "<type>: <summary>" --body-file <scratch-pr-body.md>
     ```
   - Immediately request an initial `@copilot` code review via PR comment and note the current UTC timestamp (or latest review ID):
     ```sh
     gh pr comment <num> --body "@copilot can you do a code review?"
     ```

---

## Step 3: Non-Blocking Wait & Subagent Review Recon

Track the current **Round Number (`1` to `4` max)**. For each round:

1. **Wait via `schedule` Timer (Never Shell `sleep`)**:
   - Call the `schedule` tool with `DurationSeconds: 75` (and a prompt noting the PR number, trigger timestamp, and poll attempt `1..4`), then end your turn so the system wakes you when the timer fires.
2. **Subagent Poll & Recon**:
   - When the timer fires, invoke a `self` subagent (`TypeName: "self"`) to check for a new Copilot review or comment response (`user.login == "Copilot"` or `copilot-pull-request-reviewer[bot]`) submitted **after** the trigger comment timestamp (consulting [`sandbox-lessons`](../sandbox-lessons/SKILL.md) for `gh api`):
     - `gh api repos/express-labs/pure-react-carousel/issues/<num>/comments`
     - `gh api repos/express-labs/pure-react-carousel/pulls/<num>/reviews`
   - **If no new review has arrived yet**:
     - The subagent returns a 1-line `"PENDING"` status.
     - Schedule another `75s` timer (up to **4 poll attempts / ~5 minutes max** per round). If Copilot still hasn't responded after 4 attempts, stop and notify the user.
   - **Once the new Copilot review arrives**:
     - Within the **same subagent invocation**, fetch any inline review comments scoped strictly to the newly detected review (`gh api repos/express-labs/pure-react-carousel/pulls/<num>/reviews/<review_id>/comments`, or `gh api repos/express-labs/pure-react-carousel/pulls/<num>/comments` filtered by `pull_request_review_id == <review_id>` and `created_at > <trigger_timestamp>` so comments from earlier review rounds are never re-triaged), inspect the referenced files/lines, and classify each finding using the [`address-pr-review`](../address-pr-review/SKILL.md) rubric:
       1. **Worthwhile Fix**: Valid bug, reproducible edge case, missing test coverage, or low-cost clarity/safety improvement worth implementing.
       2. **Architectural Smell / Breaking Change**: Requires changing public API contracts (`src/types.ts`) in a breaking way or redesigning a core state machine with trade-offs that require user input.
       3. **Skip (Not Worth the Effort)**: Nitpick, false positive, already handled, out of scope, or contradicts project conventions (`docs/*.md`).
     - Have the subagent return a **Compact Recon Brief (<35 lines)** listing each finding, its classification, and the proposed fix or skip rationale.

---

## Step 4: Autonomous Triage, Delegated TDD Fixes, & Loop Repeat

Evaluate the subagent's **Compact Recon Brief** in the primary agent:

1. **Exit Condition A — Converged (0 Worthwhile Fixes & 0 Architectural Smells)**:
   - Stop the loop immediately.
   - Present a concise final report to the user summarizing:
     - The PR URL and total rounds completed.
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
   - **Check Round Cap (Max 4 Rounds)**:
     - If you just completed fixes for **Round 4**, push the commits (`git push`), stop the loop, and report the final status to the user rather than triggering a 5th review round.
   - **Push & Trigger Next `@copilot` Review**:
     - Push the new commit(s):
       ```sh
       git push
       ```
     - Post the re-review trigger comment on the PR. If any comments from the current round were classified as **Skip (Not Worth the Effort)**, briefly mention them in the comment so `@copilot` has context and does not re-flag them:
       ```sh
       gh pr comment <num> --body "@copilot can you do a code review? (Note: intentionally skipping <brief note on skipped nitpick/false-positive> because <concise reason>.)"
       ```
     - Increment the round counter and return to **Step 3**.
