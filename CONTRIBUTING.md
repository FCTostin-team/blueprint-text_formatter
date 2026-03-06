# Contributing to FCT Text Formatter

First off, thanks for investing your time in this project. Contributions of any size are welcome: bug fixes, refactors, translations, docs, UX polish, and feature proposals.

This document defines the default contributor workflow so maintainers can review and merge changes quickly without back-and-forth noise.

## Introduction

By contributing, you help keep the formatter stable for real-world Steam/Factorio workflows where deterministic output matters. Please optimize for clarity, reproducibility, and minimal diff surface.

> [!TIP]
> Small focused pull requests are merged faster than broad “kitchen sink” changes.

## I Have a Question

Please **do not** open GitHub Issues for general usage/support questions.

Use community channels instead:

- Telegram chat: https://t.me/FCTostin
- Steam group: https://steamcommunity.com/groups/FCTgroup
- YouTube channel (project context/updates): https://www.youtube.com/@FCT-Ostin

Use GitHub Issues for actionable engineering items only: bugs, regressions, and scoped feature requests.

## Reporting Bugs

Before opening a bug report:

1. Search existing Issues to avoid duplicates.
2. Reproduce on the latest repository state.
3. Verify whether the issue is locale-specific or global.

When filing, include:

- **Environment**
  - OS + version (`Windows 11`, `Ubuntu 24.04`, etc.)
  - Browser + version (`Chrome 127`, `Firefox 129`, etc.)
  - Project version/commit SHA
- **Steps to Reproduce**
  - Exact input payload (or sanitized sample)
  - Selected mode and chunk settings
  - Sequence of clicks/actions
- **Expected Behavior**
  - What output you expected and why
- **Actual Behavior**
  - What happened instead (include screenshot/gif if UI-related)
- **Impact**
  - Does it block usage, degrade formatting quality, or affect a specific locale?

> [!IMPORTANT]
> Reports without reproducible steps are difficult to triage and may be closed until more detail is provided.

## Suggesting Enhancements

If you want to propose a feature:

1. Describe the pain point (what currently breaks or slows your workflow).
2. Explain the proposed behavior and API/UI surface.
3. Provide concrete use cases (preferably with before/after examples).
4. Clarify tradeoffs (complexity, backward compatibility, UX friction).

Good enhancement requests are problem-driven, not implementation-driven.

## Local Development / Setup

### 1) Fork and Clone

```bash
# Fork repository on GitHub first, then:
git clone https://github.com/<your-username>/blueprint-text_formatter.git
cd blueprint-text_formatter
```

### 2) Add Upstream Remote

```bash
git remote add upstream https://github.com/fctostin-team/blueprint-text_formatter.git
git fetch upstream
```

### 3) Run Locally

```bash
# Option A: open directly
# double-click index.html

# Option B (recommended): run local static server
python3 -m http.server 8080
# Open http://localhost:8080
```

### 4) Optional Environment Config

This project currently does not require `.env` configuration.
If future tooling adds environment variables, keep secrets out of git and document new keys in `README.md`.

## Pull Request Process

### Branch Naming Strategy

Use explicit branch prefixes:

- `feature/<short-description>`
- `bugfix/<issue-or-short-description>`
- `docs/<short-description>`
- `chore/<short-description>`

Examples:

- `feature/add-it-locale`
- `bugfix/fix-tail-split-empty-input`
- `docs/rewrite-readme-setup`

### Commit Message Convention

Use **Conventional Commits**:

- `feat: add new locale loader`
- `fix: prevent tail split on empty input`
- `docs: expand setup instructions`
- `refactor: simplify mode update flow`

### Keep Branch Updated

Before opening PR:

```bash
git fetch upstream
git rebase upstream/main
```

(or merge upstream/main if your team workflow prefers merge commits)

### PR Description Requirements

Your PR body should include:

- concise summary of what changed,
- rationale (why this change is needed),
- test/validation notes,
- linked issue(s) (`Closes #123`),
- screenshots for any perceptible UI update.

> [!WARNING]
> PRs with unrelated changes bundled together may be asked to split into smaller reviewable units.

## Styleguides

Keep code quality high and style consistent.

- Prefer readable, minimal vanilla JS.
- Avoid introducing heavy dependencies without strong justification.
- Keep functions deterministic where possible (especially formatter functions).
- Preserve existing naming and file organization patterns.
- Keep localization keys synchronized across `profiles/*.js`.

Recommended tooling (if/when configured):

- `ESLint` for JavaScript linting
- `Prettier` for formatting
- markdown linting for docs consistency

If these tools are not yet configured in repo scripts, align with current style and keep diffs clean.

## Testing

All non-trivial changes should be validated before PR.

Suggested local checks:

```bash
# Serve locally for manual verification
python3 -m http.server 8080
```

Manual test checklist:

- `normal` mode output chunking is correct.
- `tail` mode split behavior is correct for short and long strings.
- copy-to-clipboard behavior works.
- locale switching updates UI strings.
- persisted settings restore correctly after page reload.

If you introduce automated tests later, include instructions in `README.md` and wire them into CI.

## Code Review Process

- Maintainers review PRs for correctness, UX impact, and long-term maintainability.
- At least one maintainer approval is typically required before merge.
- Address review comments with follow-up commits (or amend/squash when requested).
- If feedback is unclear, ask directly in PR comments and propose concrete alternatives.

Goal: merge safe, minimal, and high-signal contributions quickly.
