# Github Conventions

## Recommended Branch Naming Convention
Mirror the Conventional Commit prefixes in your branch names using `<type>/<short-description>`:

| Branch Prefix | Commit / PR Title Prefix | Version Bump in Release Please | Appear in `CHANGELOG.md`? |
| :--- | :--- | :--- | :--- |
| `feat/touch-momentum` | `feat: add touch momentum` | **Minor** (`3.0.0` → `3.1.0`) | Yes (under *Features*) |
| `fix/slide-focus-ring` | `fix: resolve focus ring issue` | **Patch** (`3.0.0` → `3.0.1`) | Yes (under *Bug Fixes*) |
| `feat/new-api` *(breaking)* | `feat!: redesign provider props` | **Major** (`3.0.0` → `4.0.0`) | Yes (under *⚠ BREAKING CHANGES*) |
| `perf/memoize-slides` | `perf: memoize slide children` | **Patch** (`3.0.0` → `3.0.1`) | Yes (under *Performance*) |
| `docs/readme-examples` | `docs: update README examples` | None | No (by default) |
| `chore/bump-rollup` | `chore: update rollup to v4` | None | No (by default) |
| `refactor/...` / `test/...` / `ci/...` | `refactor:` / `test:` / `ci:` | None | No (by default) |

*(The only branch name you should **avoid** creating manually is `release-please--branches--master`, which Release Please creates and manages automatically for its Release PR.)*

---

## Conventional & Atomic Commits

All commits in this repository must follow the **[Conventional Commits](https://www.conventionalcommits.org/)** specification. Every commit must include a structured **title** and a detailed **message body** explaining the rationale and changes made.

### 1. Commit Message Structure

```gitcommit
<type>(<optional-scope>): <short imperative summary>

<detailed explanation of WHY the change was made, WHAT was changed, and any important design decisions or caveats>
```

- **Title Format**:
  - `<type>`: One of `feat`, `fix`, `perf`, `refactor`, `test`, `docs`, `build`, `ci`, `chore`, or `style` (append `!` before `:` for breaking changes, e.g., `feat!: ...`).
  - `(<optional-scope>)`: Optional area or subsystem touched (e.g., `types`, `slider`, `ssr`, `store`, `deps`).
  - `<short imperative summary>`: Imperative, present tense ("add", "fix", "update" — not "added" or "adds"), lowercase, no trailing period, maximum 72 characters.
- **Message Body Format**:
  - Separated from the title by a single blank line.
  - Explain the **why** and **what** behind the change rather than restating the diff.

### 2. Atomic Commits & Logical Grouping

Do **not** bundle unrelated changes into a single catch-all commit. Split work into multiple focused commits that each represent a single logical change:

- **Group Related Changes**: Stage only the files relevant to that specific concern (for example, separating type refactors from build configuration or documentation updates).
- **Multiple Commits Encouraged**: Create as many commits as needed to cleanly tell the story of the changes.
- **Self-Contained & Buildable**: Each individual commit should pass `npm run typecheck` and `npm test` so `git bisect` and rollbacks remain reliable.

---

## Pushing to Remote
- **Git Safety**: **NEVER** push directly to `main` or `master`. Always create feature branches that follow the Recommended Branch Naming Convention and publish explicitly via `git push -u origin <type>/<branch-name>`.
