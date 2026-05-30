# Java Learn

A personal, browser-based Java learning app that structures the [Baeldung "Get Started with Java" series](https://www.baeldung.com/get-started-with-java-series) into a navigable, interactive experience. Read lesson content, study embedded code examples, practice in an integrated VS Code-style editor, and execute real Java code — all without leaving the browser.

![React](https://img.shields.io/badge/React-18-blue?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite) ![Monaco](https://img.shields.io/badge/Monaco-Editor-blue?logo=visualstudiocode) ![License](https://img.shields.io/badge/license-MIT-green)

---

## Features

- **86 articles across 9 topic sections** — fully authored content based on the Baeldung Java series
- **Monaco Editor** — the same editor powering VS Code, with Java syntax highlighting in every article
- **Free live code execution** — runs Java via the [Wandbox](https://wandbox.org) API, no API key or account required
- **Progress tracking** — mark articles as done with a single click; progress persists across sessions via `localStorage`
- **Resizable editor and output panels** — drag the handle between the editor and output to give each more space
- **Dark / light mode** — toggle with the switch in the top nav; all colors swap via CSS variables
- **Neobrutalist design** — thick borders, solid offset shadows, and high-contrast accent colors
- **Zero backend** — pure client-side SPA; no login, no database, no server

---

## Preview

```
┌──────────────────────────────────────────────────────────────────┐
│ JAVA_LEARN  [BASICS✓] [OOP▶] [STRINGS] …  ☀/☾  2/86 DONE        │
├──────────────┬───────────────────────────────────────────────────┤
│ JAVA OOP     │  OOP → CONSTRUCTORS                               │
│ ──           │  A GUIDE TO CONSTRUCTORS IN JAVA   [✓ MARK DONE] │
│ ✓ Classes    │                                                    │
│ ▶ Constructo │  A constructor is a special method used to...     │
│ ○ Abstract   │                                                    │
│ ○ Interfaces │  ┌─ EXAMPLE ──────────────────────── JAVA ──┐     │
│ ○ Inheritance│  │  public class Car { ... }                 │     │
│              │  └───────────────────────────────────────────┘     │
│ ─────────    ├───────────────────────────────────────────────────┤
│ 3%  ██░░░░   │  PRACTICE EDITOR  [JAVA]  [▶ RUN]  [↺ RESET]     │
└──────────────┴───────────────────────────────────────────────────┘
                  OUTPUT  Hello from Car: Tesla
```

---

## Content

| # | Section | Articles |
|---|---------|----------|
| 1 | Java Language Basics | 13 |
| 2 | Java OOP | 32 |
| 3 | Java Strings | 5 |
| 4 | Java Exceptions | 6 |
| 5 | Java Arrays | 3 |
| 6 | Java Collections | 10 |
| 7 | Java Streams | 5 |
| 8 | Java IO | 9 |
| 9 | Java Development Environment | 3 |
| **Total** | | **86 articles** |

Each article includes:
- A **lesson body** rendered as Markdown (tables, inline code, code fences, bold/italic)
- One or two **read-only example blocks** showing the concept in action
- A **starter code** template pre-loaded in the Monaco editor for hands-on practice

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Code editor | Monaco Editor (`@monaco-editor/react`) |
| Java execution | [Wandbox API](https://wandbox.org) — free, no key needed |
| Progress storage | `localStorage` |
| Content | Static JSON files bundled with the app |
| Styling | Plain CSS with custom properties (no CSS framework) |
| Typography | Inter (UI) + JetBrains Mono (code) via Google Fonts |
| Testing | Vitest + @testing-library/react |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install and run

```bash
# 1. Clone the repo
git clone https://github.com/parthshroff1007/java-learn.git
cd java-learn

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

No API key needed — Java code execution uses the free [Wandbox](https://wandbox.org) public API with OpenJDK 22.

---

## Project Structure

```
java-learn/
├── src/
│   ├── App.jsx                       # Root state: currentSection, currentArticle, theme
│   ├── App.css                       # CSS variables, global styles, all component styles
│   ├── components/
│   │   ├── TopNav.jsx                # 9 section tabs, theme toggle, overall progress chip
│   │   ├── SubSidebar.jsx            # Article list, checkmarks, per-section progress bar
│   │   ├── ArticleView.jsx           # Lesson body, example blocks, Mark Done button
│   │   ├── ExampleBlock.jsx          # Read-only syntax-highlighted code snippet
│   │   ├── CodeEditor.jsx            # Monaco editor with Run/Reset, resizable output
│   │   └── OutputPanel.jsx           # stdout (green) / stderr (red) / loading spinner
│   ├── hooks/
│   │   ├── useProgress.js            # localStorage-backed progress tracking
│   │   └── usePiston.js              # Wandbox API integration for Java execution
│   └── content/
│       ├── index.js                  # Exports all 9 sections as a structured array
│       ├── 01-language-basics.json   # 13 articles
│       ├── 02-oop.json               # 32 articles
│       ├── 03-strings.json           # 5 articles
│       ├── 04-exceptions.json        # 6 articles
│       ├── 05-arrays.json            # 3 articles
│       ├── 06-collections.json       # 10 articles
│       ├── 07-streams.json           # 5 articles
│       ├── 08-io.json                # 9 articles
│       └── 09-dev-environment.json   # 3 articles
├── index.html
├── vite.config.js
└── package.json
```

---

## How Code Execution Works

1. User writes Java in the Monaco editor and clicks **▶ RUN**
2. The `usePiston` hook renames the public class to `prog` (required because Wandbox compiles to `prog.java`)
3. A `POST` request is sent to `https://wandbox.org/api/compile.json` with `compiler: "openjdk-jdk-22+36"`
4. The response is mapped:
   - `compiler_message` → shown in red (compile error)
   - `program_output` → shown in green (stdout)
   - `program_error` → shown in red (runtime error)
5. The output panel displays the result instantly — no polling, no token

No API key, no account, no server. Completely free.

---

## Progress Tracking

Progress is stored in `localStorage` under the key `java-learn-progress` as a flat object:

```json
{
  "basics/syntax": true,
  "basics/primitives": true,
  "oop/constructors": false
}
```

- Each article has a **Mark Done / Mark Undone** toggle
- Marking done auto-advances to the next article in the section
- The sidebar shows a ✓ checkmark and strikethrough for completed articles
- The top nav shows a completion indicator per section and an overall `X/86 DONE` chip
- Progress survives page refreshes and browser restarts

---

## Running Tests

```bash
npm test              # watch mode
npx vitest run        # single run
```

51 tests across 7 files:

| File | Tests |
|---|---|
| `useProgress.test.js` | 6 |
| `usePiston.test.js` | 8 |
| `TopNav.test.jsx` | 6 |
| `SubSidebar.test.jsx` | 7 |
| `ExampleBlock.test.jsx` | 4 |
| `ArticleView.test.jsx` | 7 |
| `OutputPanel.test.jsx` | 5 |

---

## Design System

All colors are CSS custom properties toggled via `body.light`:

| Token | Value | Used for |
|---|---|---|
| `--accent-orange` | `#FF6B35` | Active tab, Run button, Mark Done |
| `--accent-yellow` | `#FFE500` | JAVA badge, progress chip |
| `--accent-green` | `#4ade80` | Completed articles, stdout output |
| `--accent-red` | `#f87171` | Errors and stderr |

All interactive buttons follow a **neobrutalist** style:
- `2px solid` border
- `3px 3px 0` solid offset shadow
- On hover: shadow collapses to `1px 1px`, element nudges `translate(2px, 2px)`
- On active: shadow `0 0`, `translate(3px, 3px)`

---

## License

MIT
