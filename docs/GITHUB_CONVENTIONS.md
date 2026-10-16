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


## Pushing to Remote
- **Git Safety**: **NEVER** push directly to `main`, or `master`. Always create feature branches that follow our Recommended Branch Naming Convention
