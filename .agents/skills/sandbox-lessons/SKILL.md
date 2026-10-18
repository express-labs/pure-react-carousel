---
name: sandbox-lessons
description: >-
  Machine-local sandbox and environment lessons learned for this workspace.
  MUST activate: (1) BEFORE running external CLI workflows (`gh`, remote `git`,
  Node/nvm/Vite+ `vp`/npm cache commands) or spawning subagents that run them,
  (2) WHEN a command fails in the sandbox (EPERM, EACCES, Operation not permitted,
  TLS/Keychain errors, PATH mismatches), and (3) IMMEDIATELY AFTER verifying a new
  workaround or discovering that an existing lesson is outdated or obsolete so you
  can create, update, or delete it.
---

# Local Sandbox & Environment Lessons Learned

Use this skill to consult and maintain a machine-local cache of verified sandbox and environment workarounds inside `.agents/skills/sandbox-lessons/lessons/` (which is gitignored via `.gitignore`).

## Critical Repository Safety Guardrails

1. **NEVER modify this `SKILL.md` file when recording, updating, or deleting lessons.** `SKILL.md` is tracked in Git and must remain 100% static and machine-agnostic so `git status` never becomes dirty from local lessons.
2. **NEVER stage, commit, or `git add -f` any file inside `.agents/skills/sandbox-lessons/lessons/`.**
3. **NEVER ask the user whether to commit their local lessons to the repository.** All mutable state (`lessons/INDEX.md` and `lessons/<domain>.md`) must stay strictly local and untracked.

## 1. Progressive Disclosure Lookup (`lessons/INDEX.md`)

To minimize token usage, **do not read all lesson files at once**:

1. Read `.agents/skills/sandbox-lessons/lessons/INDEX.md` first.
   - If `lessons/INDEX.md` does not exist yet (e.g., on a fresh clone), no local lessons are cached yet—proceed directly with standard sandbox execution (`BypassSandbox: false`).
2. From `lessons/INDEX.md`, read **only** the single `lessons/<domain>.md` file matching the command workflow you are about to run or the error you encountered.

## 2. Subagent Hand-Off Rule

When invoking a subagent (`invoke_subagent` with `TypeName: "self"`, or your environment's subagent/task tool) to run CLI workflows (PR/issue recon, test suites, git operations), instruct it in its prompt to:
1. Check `.agents/skills/sandbox-lessons/lessons/INDEX.md` (if present) and read only the matching `lessons/<domain>.md` file before running shell commands.
2. Apply or report back any **created**, **updated**, or **deleted (obsolete)** sandbox lessons discovered during execution.

## 3. Lesson Lifecycle: Create, Update, and Delete (in `lessons/` Only)

A developer's local machine, tool versions, `PATH`, and sandbox permissions evolve over time. Automatically keep `.agents/skills/sandbox-lessons/lessons/` accurate without waiting to be asked:

### Bootstrap (First Lesson on a Fresh Clone)
If `.agents/skills/sandbox-lessons/lessons/INDEX.md` does not exist yet when you need to save a lesson, create it with this structure:
```markdown
# Local Sandbox Lessons Index

Read **only** the domain file matching the command you are about to run or the error you encountered:

| Domain File | Covered Commands & Topics |
| :--- | :--- |
| [`git-gh.md`](./git-gh.md) | Remote & mutating `git`, `gh` CLI |
| [`vitest-node.md`](./vitest-node.md) | Node/`nvm` `PATH`, Vite+ (`vp`), `npm` cache |
| [`shell-sandbox.md`](./shell-sandbox.md) | Filesystem permissions, command shaping |
```

### Create (New Lesson)
- **Trigger**: You encounter an unrecorded sandbox or local environment failure and verify a working fix.
- **Action**: Append a compact entry (5–8 lines max) to the matching `lessons/<domain>.md` file and add any new tool keywords to `lessons/INDEX.md`:
  ```markdown
  - **<Short Title>**
    - **Command / Context**: <command or scenario>
    - **Sandbox Failure**: <exact error / symptom>
    - **Verified Workaround**: <exact command shape, flags, or sandbox mode>
  ```

### Update (Stale or Refined Lesson)
- **Trigger**: A recorded workaround fails (e.g., Node/tool version upgraded, binary path moved, sandbox behavior changed) or you discover a cleaner workaround (e.g., a sandboxed alternative that avoids `BypassSandbox: true`).
- **Action**: Update the existing bullet block **in-place** in `lessons/<domain>.md` (never append duplicate or conflicting entries for the same command) and update `lessons/INDEX.md` if covered topics changed.

### Delete / Prune (Obsolete Lesson)
- **Trigger**: A command that previously required a workaround now succeeds directly in the standard sandbox without it (e.g., the user updated their default `nvm` alias, fixed their shell `PATH`, or whitelisted the permission), or the user asks to remove a lesson.
- **Action**: Remove the obsolete bullet block from `lessons/<domain>.md` and prune its topic keywords from `lessons/INDEX.md`.

### User Notification
- Briefly mention in 1 sentence in your response whenever you **created**, **updated**, or **deleted** a local lesson in `sandbox-lessons`.
