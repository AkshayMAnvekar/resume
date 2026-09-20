# AGENTS.md — AI Agent Guidelines & Repository Architecture

Welcome to the **Akshay_Resume** codebase! This repository manages a dual-output personal resume: a high-quality PDF compiled from LaTeX source files and a modern single-page web portfolio published automatically via GitHub Actions to GitHub Pages.

---

## 1. Repository Overview & Mission

- **Single Source of Truth (`resume.json`):** All resume data (roles, dates, bullet points, skills, projects) is maintained in `resume.json`.
- **LaTeX & HTML Generator:** Running `node scripts/build-resume.js` (or `npm run build:resume`) generates `sections/*.tex` and updates `site/index.html` & `index.html`.
- **LaTeX Resume Engine:** Compiles `resume.tex` into `resume.pdf` using [Tectonic](https://tectonic-typesetting.github.io/) or standard `pdflatex`.
- **Web Portfolio:** Single-page dark-mode application located in `site/index.html` (and mirrored in `index.html` for local Vite dev).
- **Automated CI/CD:** GitHub Actions workflow (`.github/workflows/deploy.yml`) runs `node scripts/build-resume.js`, compiles LaTeX PDF, and publishes `_site` to GitHub Pages upon push to `main`.

---

## 2. Directory Structure & Key Files

```
Akshay_Resume/
├── resume.json                  # Primary Single Source of Truth for all resume content
├── scripts/
│   └── build-resume.js          # Generator script: compiles resume.json -> sections/*.tex & index.html
├── resume.tex                   # Main LaTeX document entry point
├── _header.tex                  # Contact information and fancyhdr header layout
├── TLCresume.sty                # Custom LaTeX resume styling package
├── sections/                    # Auto-generated LaTeX content sections
│   ├── objective.tex            # Profile summary / objective statement
│   ├── skills.tex               # Structured skills matrix (tabularx layout)
│   ├── experience.tex           # Technical work history & achievements
│   ├── projects.tex             # Key personal projects (e.g. NVIDIA Jetson Edge AI Agent)
│   ├── education.tex            # Academic degrees & thesis details
│   ├── activities.tex           # Awards, honors, & conference papers
│   └── hobbies.tex              # Personal interests
├── site/                        # Source directory for GitHub Pages deployment
│   └── index.html               # Interactive portfolio web page with embedded PDF viewer
├── index.html                   # Root index HTML (used by Vite dev server)
├── .github/workflows/
│   └── deploy.yml               # Automated LaTeX build & GitHub Pages deploy workflow
├── package.json                 # Node dependencies & Vite scripts
├── vite.config.js               # Vite server & build configuration
├── .gitignore                   # TeX build artifacts & output ignore rules
└── README.md                    # Project documentation & manual deployment guide
```

---

## 3. Core Development Rules for AI Agents

When modifying or analyzing this repository, follow these rules:

### A. LaTeX Content & Formatting Rules

1. **Maintain Modular Structure:**
   - Do not dump all text into `resume.tex`. Edit or add modular section files inside `sections/` and reference them using `\input{sections/<name>}` in `resume.tex`.
2. **List Spacing & Bullet Points:**
   - Always use the custom `zitemize` environment for lists instead of plain `itemize`:
     ```latex
     \begin{zitemize}
         \item Bullet item text...
     \end{zitemize}
     ```
3. **Heading Alignment & Hyperref Compatibility:**
   - When aligning dates or locations to the right in `\subsection`, use `\texorpdfstring{\hfill}{ }` to prevent `hyperref` PDF bookmark warnings:
     ```latex
     \subsection[Role Title | Company (Dates)]{Role Title | Company \texorpdfstring{\hfill}{ } Dates}
     ```
4. **TeX Punctuation & Escapes:**
   - For abbreviations containing uppercase letters at the end of sentences, append `\@.` to enforce correct spacing (e.g., `OpenFOAM\@.`, `ISSRD\@.`).
   - Properly escape special characters: `%`, `&`, `_`, `#`, `$`.
5. **Skills Section Layout:**
   - Keep the `tabularx` format intact in `sections/skills.tex`:
     ```latex
     \begin{tabularx}{\textwidth}{@{}p{11em}p{1em}>{\raggedright\arraybackslash}X@{}}
     \skills{Category Title} & & Skill items list... \\
     \end{tabularx}
     ```

### B. Web Portfolio Rules (`site/index.html` & `index.html`)

1. **Content Synchronization:**
   - Any change made to role titles, bullet points, skills, or projects in LaTeX **must** be reflected in `site/index.html` to prevent content drift between the PDF and web portfolio.
2. **Dual HTML Alignment:**
   - Maintain sync between `site/index.html` (used by GitHub Pages build step) and `index.html` (used by local Vite server).
3. **UI & Design Aesthetic:**
   - Preserve dark mode theme (`class="dark"`), Tailwind CDN configuration, interactive spotlight cursor script, and active navigation scroll-spy indicators.

### C. Build & Verification Rules

1. **Local LaTeX Verification:**
   - Before declaring a TeX edit complete, compile locally using `tectonic resume.tex` or `pdflatex resume.tex` to confirm there are no syntax errors or unescaped characters.
2. **Local Web Verification:**
   - Run `npm run dev` to verify that the Vite development server compiles and serves the portfolio UI cleanly.
3. **CI/CD Compatibility:**
   - Ensure any newly added TeX packages are standard packages supported by Tectonic / TeX Live without requiring custom external binary dependencies.

---

## 4. Common Commands Reference

| Action                     | Command               | Purpose                                              |
| :------------------------- | :-------------------- | :--------------------------------------------------- |
| **Compile TeX (Tectonic)** | `tectonic resume.tex` | Compiles LaTeX to `resume.pdf` locally (recommended) |
| **Compile TeX (pdfLaTeX)** | `pdflatex resume.tex` | Alternative local compilation                        |
| **Run Web Dev Server**     | `npm run dev`         | Launches Vite server at `http://localhost:3000`      |
| **Build Web Assets**       | `npm run build`       | Builds Vite assets into `dist/`                      |
| **Lint Codebase**          | `npm run lint`        | Runs HTMLHint HTML linting and Prettier checks       |
| **Format Codebase**        | `npm run format`      | Formats codebase using Prettier                      |
| **Check Git Status**       | `git status`          | Verifies clean working directory                     |

---

## 5. Editing Workflows

### Adding / Updating Work Experience

1. Open [`sections/experience.tex`](file:///Users/akshayanvekar/Documents/Scripts/Akshay_Resume/sections/experience.tex).
2. Format role titles using `\subsection` with `\texorpdfstring{\hfill}{ }` for dates and `\subtext` for company/location.
3. Use `zitemize` for accomplishments focusing on actionable impact, tech stacks, and quantifiable results.
4. Update corresponding experience items in [`site/index.html`](file:///Users/akshayanvekar/Documents/Scripts/Akshay_Resume/site/index.html).
5. Run `tectonic resume.tex` to verify PDF rendering.

### Adding a New Section

1. Create `sections/<section_name>.tex`.
2. Add section heading and content.
3. Insert `\section{<Section Name>}` and `\input{sections/<section_name>}` into [`resume.tex`](file:///Users/akshayanvekar/Documents/Scripts/Akshay_Resume/resume.tex).
4. Update [`site/index.html`](file:///Users/akshayanvekar/Documents/Scripts/Akshay_Resume/site/index.html) navigation bar and add the corresponding section card.
