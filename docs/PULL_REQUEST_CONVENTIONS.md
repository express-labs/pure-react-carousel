# Pull Request Conventions

This guide instructs agents and contributors on how to prepare, format, and open Pull Requests in `pure-react-carousel`.

---

## 1. Pre-PR Verification Checklist

Before generating a PR description or opening a pull request, ensure:

1. **All Quality Gates Pass**:
   Run `npm run prepublishOnly` (or run each check individually):
   - `npm run format:check`
   - `npm run typecheck` (emits declarations to `dist/types` and checks `src` + `typings/index.test-d.tsx`)
   - `npm run lint`
   - `npm test`
   - `npm run build`
2. **Branch Safety**:
   - Confirm you are on a properly named feature branch (`<type>/<short-description>`) per [`docs/GITHUB_CONVENTIONS.md`](./GITHUB_CONVENTIONS.md).
   - **NEVER** push directly to `master` or `main`.
3. **Documentation Validated**:
   - Audit and update all documentation surfaces affected by the branch's changes prior to pushing, per [`docs/DOCUMENTATION_CONVENTIONS.md`](./DOCUMENTATION_CONVENTIONS.md).

---

## 2. Pull Request Title Format

Pull Request titles **must** follow the [Conventional Commits](https://www.conventionalcommits.org/) format because **Release Please** (`.github/workflows/publish.yml`) uses PR and commit titles to calculate semantic version bumps and generate `CHANGELOG.md`:

```text
<type>(<optional-scope>): <concise imperative summary>
```

- **Allowed Types**:
  - `feat`: New feature (**Minor** version bump, appears in `CHANGELOG.md`)
  - `fix`: Bug fix (**Patch** version bump, appears in `CHANGELOG.md`)
  - `perf`: Performance improvement (**Patch** version bump, appears in `CHANGELOG.md`)
  - `feat!` / `fix!`: Breaking change (**Major** version bump, appears in `CHANGELOG.md`)
  - `refactor`, `test`, `docs`, `build`, `ci`, `chore`: Non-release changes (no version bump by default)

---

## 3. Canonical PR Template (`.github/PULL_REQUEST_TEMPLATE.md`)

Always use the repository's canonical template at [`.github/PULL_REQUEST_TEMPLATE.md`](../.github/PULL_REQUEST_TEMPLATE.md) when formatting the PR body:

```markdown
**What**:

<!-- Concise summary of what changes are being made (features, fixes, refactors, or build updates). -->

**Why**:

<!-- Clear explanation of why these changes are necessary (problem statement, SSR safety, consumer compatibility, etc.). -->

**How**:

<!-- Technical breakdown of how the changes were implemented, key files modified, and verification steps executed. -->

**Checklist**:

- [x] Documentation added/updated
- [x] Typescript definitions updated
- [x] Tests added and passing
- [x] Ready to be merged
```

### Checklist Guidelines
- Mark completed items with `- [x]`.
- If an item does not apply to the PR (for example, a CSS-only or internal refactor that does not alter public props or documentation), leave it unchecked or checked as appropriate and append `(N/A)` to the end of the line:
  ```markdown
  - [ ] Documentation added/updated (N/A)
  ```
- For **Typescript definitions updated**:
  - Since `.d.ts` files (`dist/types/index.d.ts`) are generated automatically from `src/types.ts`, check this item when `src/types.ts` or `typings/index.test-d.tsx` was updated, or append `(N/A)` if public types were unchanged.

---

## 4. Agent Delivery Workflows

### Workflow A: Generating a PR Description Artifact
When asked to draft or prepare a PR description for review or manual copy-pasting:
1. Inspect all commits on the branch relative to `master`:
   ```bash
   git log origin/master..HEAD --oneline
   git diff --stat origin/master...HEAD
   ```
2. Write the formatted PR title and `.github/PULL_REQUEST_TEMPLATE.md` body to a `pr_description.md` artifact and link it in your response.

### Workflow B: Opening a Pull Request via GitHub CLI (`gh`)
When explicitly asked to push the branch and open a pull request on GitHub:
1. Push the feature branch to `origin`:
   ```bash
   git push -u origin <type>/<branch-name>
   ```
2. Open the pull request against `master` using `gh pr create` with the populated template body:
   ```bash
   gh pr create --base master --title "<type>: <summary>" --body-file <path-to-pr-body.md>
   ```
