# Akshay Anvekar — Resume

LaTeX resume that builds to a PDF and publishes a small website, both automatically via GitHub Actions.

## Structure

| Path | Purpose |
|------|---------|
| `resume.tex` | Main document |
| `_header.tex` | Contact header |
| `TLCresume.sty` | Style / formatting |
| `sections/` | Content (objective, skills, experience, projects, education, activities, hobbies) |
| `site/index.html` | Landing page that embeds the compiled PDF |
| `.github/workflows/deploy.yml` | Builds the PDF and deploys the site to GitHub Pages |

## How it works

On every push to `main`, GitHub Actions:

1. Compiles `resume.tex` → `resume.pdf` (full TeX Live).
2. Uploads `resume.pdf` as a downloadable build **artifact**.
3. Publishes `site/index.html` + `resume.pdf` to **GitHub Pages**.

The website only ever shows the freshly compiled PDF, so it can't drift from the source.

## One-time setup after pushing to GitHub

1. Push this repo to GitHub (see below).
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push any commit to `main` (or run the workflow manually via the **Actions** tab).
4. The site goes live at `https://<username>.github.io/<repo>/`.

> GitHub Pages requires a **public** repo on the free plan (or GitHub Pro for private).

## Build locally

```sh
latexmk -pdf resume.tex   # or: pdflatex resume.tex
```

## Publish to GitHub

```sh
git remote add origin https://github.com/AkshayMAnvekar/<repo>.git
git push -u origin main
```
