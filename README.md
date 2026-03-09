# <a href="https://github.com/OstinUA" target="_blank" rel="noopener"><img src="https://raw.githubusercontent.com/OstinUA/Image-storage/main/Factorio/Gear-silhouette-of-the-Factorio-logo.png" width="32" valign="middle" alt="telegram:FCTostin"></a> FCT Text Formatter <a href="https://github.com/OstinUA"><img align="right" src="https://img.shields.io/badge/OstinUA-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>

![Factorio: 2.0+](https://img.shields.io/badge/Factorio-2.0%2B%20%2F%20Space%20Age-orange?style=for-the-badge)

![Platform: Web](https://img.shields.io/badge/Platform-Web_App-0ea5e9?style=for-the-badge)
[![Frontend: Vanilla JS](https://img.shields.io/badge/Frontend-Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111111)](script.js)
[![Styles: CSS3](https://img.shields.io/badge/Styles-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](style.css)
[![Markup: HTML5](https://img.shields.io/badge/Markup-HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](index.html)
![Status: Active](https://img.shields.io/badge/Status-Active-22c55e?style=for-the-badge)
![Coverage: Manual](https://img.shields.io/badge/Coverage-Manual%20Validation-lightgrey?style=for-the-badge)
[![i18n](https://img.shields.io/badge/i18n-multi--language-2ea44f?style=for-the-badge)](#features)

A specialized browser-based formatter that normalizes noisy strings and emits deterministic line chunks for strict character-limited contexts (for example Steam Guide tables and Factorio blueprint-related text operations). The app runs fully client-side, persists user preferences in `localStorage`, and supports multiple UI locales out of the box.

> [!IMPORTANT]
> This tool is intentionally lightweight and has no server/API dependency. Your input never leaves the browser runtime unless you explicitly copy/share it.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Technical Notes](#technical-notes)
  - [Project Structure](#project-structure)
  - [Key Design Decisions](#key-design-decisions)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Usage](#usage)
- [Configuration](#configuration)
- [License](#license)
- [Community and Support](#community-and-support)
- [Support the Development](#support-the-development)

## Features

- Dual formatting engine:
  - `normal` mode splits the full cleaned payload into fixed-size chunks.
  - `tail` mode splits using a controlled head/body/tail strategy for encoded string patterns.
- Automatic whitespace normalization (`\s+` collapse/removal behavior) for stable output.
- Real-time telemetry in UI:
  - source character count,
  - output line count,
  - effective chunk length.
- Language-aware interface powered by locale profiles under `profiles/*.js`.
- Persistent UX state using `localStorage`:
  - last mode,
  - per-mode chunk size,
  - tail split parts,
  - last input text.
- Clipboard-first workflow for fast copy/paste into Steam or other editors.
- Pure static architecture: open in any modern browser, no build step required.

> [!TIP]
> If you work with repetitive blueprint edits, keep the tool pinned in a browser tab and reuse persisted settings for near-instant formatting passes.

## Technology Stack

- `HTML5` for semantic page layout.
- `CSS3` for Factorio-themed UI styling.
- `Vanilla JavaScript (ES6+)` for formatting logic and i18n orchestration.
- `localStorage` for client-only persistence.
- `GitHub Pages` compatible static hosting model.

## Technical Notes

### Project Structure

```text
.
├── index.html              # Main UI markup and script imports
├── style.css               # Theme and layout styles
├── script.js               # Core formatter logic, i18n wiring, UI events
├── profiles/               # Locale dictionaries (ru, en, uk, kk, cs, nl, sv, de, pl, fr, zh, ja)
├── README.md               # Project documentation
├── CONTRIBUTING.md         # Contribution workflow and quality gates
├── CODE_OF_CONDUCT.md      # Community behavior expectations
└── LICENSE                 # GPL-3.0 license text
```

### Key Design Decisions

1. **Client-only execution model**
   - Keeps privacy guarantees straightforward.
   - Eliminates infra/runtime overhead.
2. **No framework dependency**
   - Minimal bootstrap cost.
   - Easy to audit and extend.
3. **Deterministic formatting functions**
   - `formatNormal`, `formatTail`, and `formatTailSplit` are predictable and composable.
4. **Locale profiles as plain JS objects**
   - Fast to add new languages without tooling.
   - Keeps translation updates low-friction for contributors.

> [!NOTE]
> Current tail mode uses a fixed `firstHead` strategy in `script.js`, optimized for the project’s target string patterns.

## Getting Started

### Prerequisites

You only need:

- A modern browser (`Chrome`, `Firefox`, `Edge`, `Safari`).
- Optional for development:
  - `Git` (to clone and contribute),
  - any static file server (for local hosting parity),
  - optional Node.js tooling if you want to add custom lint/test scripts.

### Installation

```bash
# 1) Clone repository
git clone https://github.com/fctostin-team/blueprint-text_formatter.git

# 2) Enter project directory
cd blueprint-text_formatter

# 3) Run directly (quick start)
# Open index.html in browser

# 4) Optional: serve over local HTTP to mimic production hosting
python3 -m http.server 8080
# then open http://localhost:8080
```

> [!WARNING]
> Opening via `file://` works for core behavior, but local HTTP is recommended when validating browser quirks and path resolution.

## Testing

At the moment, the repository has no formal automated test suite configured. Recommended manual verification matrix:

```bash
# Optional static serving for test pass
python3 -m http.server 8080
```

Manual checks:

1. Validate `normal` mode chunking with different sizes (`10`, `50`, `98`, `200`).
2. Validate `tail` mode with multiple part counts and edge cases (very short input).
3. Confirm `copy` action writes expected output to clipboard.
4. Reload page and verify persisted settings restored from `localStorage`.
5. Switch locales and ensure all labels/buttons update correctly.

> [!CAUTION]
> If you add logic around text parsing/chunking, test with very long strings to avoid regressions in line split math.

## Deployment

Current deployment model is static-site friendly and works great with GitHub Pages.

### Production Build Strategy

There is no transpile/build phase. Production artifact is the repository itself.

### Typical GitHub Pages Flow

1. Push changes to default branch.
2. Ensure Pages is configured to serve from repository root (or selected branch/folder).
3. Validate published URL and smoke-test core formatting paths.

### CI/CD Recommendation (Optional)

If you want stricter quality gates, wire a GitHub Actions workflow that:

- checks markdown linting,
- runs optional JS linting,
- validates links in docs,
- deploys static content only after checks pass.

## Usage

```text
# Basic operator flow
1) Paste raw text/blueprint payload into the input textarea.
2) Choose formatting mode:
   - normal: fixed-size chunking for full payload
   - tail: custom split strategy for tail-sensitive payloads
3) Set chunk size (and tail parts when in tail mode).
4) Copy generated output from the result panel.
5) Paste into Steam guide table or target editor.
```

```bash
# Optional local serve + open
python3 -m http.server 8080
# Open browser -> http://localhost:8080
```

## Configuration

The app has no `.env` requirements and no backend config.

Runtime preferences are stored in browser `localStorage` keys:

- `pr98_mode` — selected formatter mode.
- `pr98_chunks` — per-mode chunk size map.
- `pr98_tail_split` — tail mode parts setting.
- `pr98_text` — latest raw input payload.
- `pr98_lang` — selected UI locale.

> [!NOTE]
> Clearing browser storage resets the tool to default UX state.

## License

Distributed under the `GPL-3.0` license. See [`LICENSE`](LICENSE) for full legal text.

## Community and Support

Project created with the support of the FCTostin community.

[![YouTube](https://img.shields.io/badge/YouTube-Channel-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@FCT-Ostin)
[![Telegram](https://img.shields.io/badge/Telegram-Join_Chat-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/FCTostin)
[![Steam](https://img.shields.io/badge/Steam-Join_Group-1b2838?style=for-the-badge&logo=steam&logoColor=white)](https://steamcommunity.com/groups/FCTgroup)

## Support the Development

[![Patreon](https://img.shields.io/badge/Patreon-Support-F96854?style=for-the-badge&logo=patreon&logoColor=white)](https://www.patreon.com/c/OstinFCT)
[![Boosty](https://img.shields.io/badge/Boosty-Donate-F15F2C?style=for-the-badge&logo=boosty&logoColor=white)](https://boosty.to/ostinfct)

## Contacts

- GitHub: [OstinUA](https://github.com/OstinUA)
- Team page: [FCTostin-team](https://github.com/FCTostin-team)
- Contribution process: see [`CONTRIBUTING.md`](CONTRIBUTING.md).
