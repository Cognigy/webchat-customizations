# CLAUDE.md

Guidance for [Claude Code](https://claude.com/claude-code) when working in this
repository. This file is read automatically at the start of every session — keep
it current, and keep it short.

## What this repository is

<!-- One or two sentences. What does this code do, and why does it exist? -->
TODO: describe the project.

## How to work in this repo

- **Conventional Commits are load-bearing.** Releases are cut automatically by
  `semantic-release` based on commit messages. Use `feat:` (minor bump), `fix:`
  (patch), `feat!:` / `BREAKING CHANGE:` (major), and `docs:` / `chore:` /
  `test:` / `ci:` / `refactor:` for no-bump changes. Never squash a release PR
  with a non-conventional title.
- **Do not hand-edit `CHANGELOG.md` or bump `package.json#version`** — both are
  owned by `semantic-release` and will be overwritten. Fix problems by adjusting
  commit messages / `.releaserc.json` instead.
- **PRs** must fill out `.github/PULL_REQUEST_TEMPLATE.md`. The Changelog and
  Security sections are required and are enforced by
  `Cognigy/github-actions/changelog-validation` + `work-item-validation` (see
  `.github/workflows/pr-validation.yaml`). Every PR needs a linked Azure DevOps
  work item (e.g. `AB#133712`).
- **Dependabot** auto-merges patch updates (see
  `.github/DEPENDABOT_AUTO_MERGE.md` and `.github/workflows/dependabot-automation.yml`).
  Minor / major stay manual.
- **Code ownership** is in `.github/CODEOWNERS`; respect the owning team when
  assigning reviewers.
- **Secrets** never get committed. `.env*` is gitignored on purpose.

## Commands worth knowing

```bash
npm ci              # install from lockfile (CI-style)
npm install         # install dependencies
# TODO: add project-specific scripts (test, build, lint) once they exist
```

## Project structure

<!-- Describe the important directories once they exist. -->
TODO: describe the layout.

## Conventions and gotchas

<!--
  Put things here a new contributor (or Claude) would otherwise get wrong:
  non-obvious invariants, workarounds, required env vars, "do not touch this
  file without updating X", etc. Keep it factual and short.
-->
TODO.

## Resources

- Internal repo requirements: https://cognigy.atlassian.net/wiki/spaces/Engineering/pages/edit-v2/1728905227
- Semantic-release: https://semantic-release.gitbook.io/
- Conventional Commits: https://www.conventionalcommits.org/
- Claude Code docs: https://docs.claude.com/claude-code
