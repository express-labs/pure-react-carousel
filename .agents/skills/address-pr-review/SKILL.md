---
name: address-pr-review
description: >-
  Use this skill when the user asks to read, triage, or address pull request review
  comments (including automated reviews from @copilot or human reviewers). Keeps the
  primary agent in the "Smart Zone" by offloading GitHub API fetches and codebase
  recon to a subagent, running a design grill checkpoint when heuristics
  accumulate, and delegating fixes via a strict TDD loop.
---

# Address PR Review Skill

Follow this workflow to read and resolve pull request review comments without polluting the primary conversation's context window.

## Step 1: Isolate PR & Codebase Recon in a Subagent

Do **not** dump raw `gh pr view --comments` JSON or large source files into the primary context window. Invoke a `self` subagent (or a `research` subagent for local-only recon) via `invoke_subagent` (or use your environment's subagent/task tool, or targeted inline reads if subagents are unavailable) to:

1. Fetch the target PR's metadata and review comments. Prefer `read_url_content` (when available) on public GitHub REST API endpoints so fetches run sandboxed without `gh` CLI network prompts, falling back to `gh` CLI (`gh pr list --state open`, `gh pr view <num> --comments --json number,title,headRefName,comments,reviews,latestReviews`, `gh api repos/:owner/:repo/pulls/<num>/comments`) when needed:
   - `https://api.github.com/repos/express-labs/pure-react-carousel/pulls/<num>`
   - `https://api.github.com/repos/express-labs/pure-react-carousel/pulls/<num>/comments`
   - `https://api.github.com/repos/express-labs/pure-react-carousel/pulls/<num>/reviews`
   - `https://api.github.com/repos/express-labs/pure-react-carousel/issues/<num>/comments`
2. Read the **latest** review comments and inspect the exact file paths and line numbers on the PR's head branch (`view_file` or `git show <branch>:<path>`).
3. Classify each finding into one of three buckets:
   - **Valid Bug / Edge Case**: Reproducible gap in logic or missing test coverage.
   - **Architectural Smell (Heuristic Whack-a-Mole)**: The 2nd+ round of edge-case patches on the same state machine or heuristic where simplifying the model is better than adding another condition.
   - **False Positive / Out of Scope**: Already handled, intentional, or contradicts project guardrails.
4. Return a **compact recon brief** (under 35 lines) to the primary agent containing:
   - PR number, branch name, and comment author/URL.
   - Numbered findings with exact file/line references and classification.
   - Recommended minimal fix or state-machine simplification for each finding.

## Step 2: Triage & `/grill-me` Design Checkpoint

Before writing or editing any code:

1. Present the distilled findings from Step 1 to the user.
2. If any finding is classified as an **Architectural Smell** (or has multiple valid implementation paths), interview the user using `ask_question` (or ask the user directly if `ask_question` is unavailable) to lock in the design (e.g., simplifying the state machine vs. patching individual edge cases).
3. Confirm whether to switch to the PR branch if the workspace is currently on a different branch.

## Step 3: Delegated Red-Green-Refactor Loop (`tdd`)

Once the approach is approved:

1. For each approved finding, either invoke a `self` subagent (`invoke_subagent` with `TypeName: "self"`, or your environment's subagent/task tool) or follow the [`tdd`](../tdd/SKILL.md) skill directly to execute:
   - **Red**: Add a regression test in `__tests__/*.test.tsx` reproducing the exact sequence described in the PR comment. Run `npm run test -- <path-to-test>` and confirm it fails for the expected reason.
   - **Green**: Implement the minimal fix or state-machine simplification in `src/` (and `src/types.ts` / `typings/index.test-d.tsx` if types change). Re-run the targeted test until green.
   - **Refactor & Gates**: Run `npm run typecheck`, `npm run lint`, `npm run format:check`, and `npm test` inside the subagent (or inline if subagents are unavailable) so verbose test/coverage logs stay out of the main thread.
2. Commit the changes atomically following [`docs/GITHUB_CONVENTIONS.md`](../../../docs/GITHUB_CONVENTIONS.md) (`<type>(<scope>): <subject>` with a technical rationale body).

## Step 4: Pre-Push Approval & Re-Review Handshake

1. Run the documentation audit from [`docs/DOCUMENTATION_CONVENTIONS.md`](../../../docs/DOCUMENTATION_CONVENTIONS.md) (`git diff --name-only origin/master...HEAD`).
2. **Always ask the user before pushing or commenting on the PR**:
   - Present the commit summary and passing quality gates.
   - Ask if they want you to push the branch (`git push`) and post a re-review comment (e.g., `gh pr comment <num> --body "@copilot can you do a code review?"`).
3. Suggest `/compact` (or starting a fresh context session if `/compact` is unavailable) after the round completes to evict resolved PR review context and keep the agent in the Smart Zone.
