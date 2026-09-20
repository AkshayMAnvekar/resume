import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const dataPath = path.join(rootDir, 'resume.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const resume = JSON.parse(rawData);

/**
 * Escapes text for LaTeX output.
 */
function escapeTex(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/%/g, '\\%')
    .replace(/&/g, '\\&')
    .replace(/_/g, '\\_')
    .replace(/#/g, '\\#')
    .replace(/\$/g, '\\$')
    .replace(/—/g, '---')
    .replace(/OpenFOAM/g, 'OpenFOAM\\@.')
    .replace(/ISSRD/g, 'ISSRD\\@.');
}

// -----------------------------------------------------------------------------
// 1. Generate sections/objective.tex
// -----------------------------------------------------------------------------
function generateObjectiveTex() {
  const lines = ['%====================', '% Objective Statement', '%====================', '', '\\begin{zitemize}'];

  resume.objective.forEach((item, index) => {
    let formatted = escapeTex(item);
    if (index === 0) {
      formatted = formatted.replace('AI and full-stack engineer', '\\textbf{AI and full-stack engineer}');
    } else if (index === 1) {
      formatted = formatted.replace('first idea to production', '\\textbf{first idea to production}');
    } else if (index === 2) {
      formatted = formatted.replace(
        'LLMs, RAG, fine-tuning, embeddings, agent tooling, and edge inference',
        '\\textbf{LLMs, RAG, fine-tuning, embeddings, agent tooling, and edge inference}'
      );
    }
    lines.push(`\\item ${formatted}`);
  });

  lines.push('\\end{zitemize}', '');
  fs.writeFileSync(path.join(rootDir, 'sections', 'objective.tex'), lines.join('\n'));
}

// -----------------------------------------------------------------------------
// 2. Generate sections/skills.tex
// -----------------------------------------------------------------------------
function generateSkillsTex() {
  const lines = ['\\begin{tabularx}{\\textwidth}{@{}p{11em}p{1em}>{\\raggedright\\arraybackslash}X@{}}'];

  resume.skills.forEach((s) => {
    const category = escapeTex(s.category);
    const items = s.items.map(escapeTex).join(', ');
    lines.push(`\\skills{${category}} & & ${items} \\\\`);
  });

  lines.push('\\end{tabularx}', '');
  fs.writeFileSync(path.join(rootDir, 'sections', 'skills.tex'), lines.join('\n'));
}

// -----------------------------------------------------------------------------
// 3. Generate sections/experience.tex
// -----------------------------------------------------------------------------
function generateExperienceTex() {
  const lines = [];

  resume.experience.forEach((exp) => {
    const company = escapeTex(exp.company);
    const role = escapeTex(exp.role);
    const dates = escapeTex(exp.dates);
    const location = escapeTex(exp.location);

    lines.push(`%====================`);
    lines.push(`% ${exp.company.toUpperCase()}`);
    lines.push(`%====================`);

    // e.g. \subsection[Senior AI Engineer | Trantor Inc (Jan 2026 --- Present)]{Senior AI Engineer | Trantor Inc \texorpdfstring{\hfill}{ } Jan 2026 --- Present}
    lines.push(
      `\\subsection[${role} | ${company} (${dates})]{${role} | ${company} \\texorpdfstring{\\hfill}{ } ${dates}}`
    );

    if (exp.client) {
      const client = escapeTex(exp.client);
      lines.push(`\\subtext{\\textbf{${company}} --- Client: \\textbf{${client}} \\hfill ${location}}`);
    } else {
      lines.push(`\\subtext{\\textbf{${company}} \\hfill ${location}}`);
    }

    lines.push('\\begin{zitemize}');
    exp.bullets.forEach((b) => {
      let formatted = escapeTex(b);
      // Format special TeX inline tags if present
      formatted = formatted.replace('SequentialAgent', '\\texttt{SequentialAgent}');
      formatted = formatted.replace('Vertica to BigQuery', '\\textbf{Vertica to BigQuery}');
      lines.push(`    \\item ${formatted}`);
    });

    if (exp.tech && exp.tech.length > 0) {
      const techStr = exp.tech.map(escapeTex).join(', ');
      lines.push(`    \\item \\textbf{Tech:} ${techStr}.`);
    }

    lines.push('\\end{zitemize}', '');
  });

  fs.writeFileSync(path.join(rootDir, 'sections', 'experience.tex'), lines.join('\n'));
}

// -----------------------------------------------------------------------------
// 4. Generate sections/projects.tex
// -----------------------------------------------------------------------------
function generateProjectsTex() {
  const lines = ['%====================', '% PERSONAL PROJECT', '%====================', ''];

  resume.projects.forEach((proj) => {
    const title = escapeTex(proj.title);
    const dates = escapeTex(proj.dates);
    lines.push(`\\subsection{${title} \\texorpdfstring{\\hfill}{ } ${dates}}`);
    lines.push('\\begin{zitemize}');
    proj.bullets.forEach((b) => {
      let formatted = escapeTex(b);
      formatted = formatted.replace('llama.cpp and CUDA', '\\textbf{llama.cpp and CUDA}');
      lines.push(`\\item ${formatted}`);
    });
    lines.push('\\end{zitemize}', '');
  });

  fs.writeFileSync(path.join(rootDir, 'sections', 'projects.tex'), lines.join('\n'));
}

// -----------------------------------------------------------------------------
// 5. Generate sections/education.tex
// -----------------------------------------------------------------------------
function generateEducationTex() {
  const lines = [];

  resume.education.forEach((edu, index) => {
    const degree = escapeTex(edu.degree);
    const inst = escapeTex(edu.institution);
    const dates = escapeTex(edu.dates);
    const grade = escapeTex(edu.grade);
    const details = escapeTex(edu.details);

    lines.push(`\\skills{${degree}}, \\textit{${inst}} \\hfill ${dates}`);
    lines.push(`\\newline ${grade}. ${details}`);
    if (index < resume.education.length - 1) {
      lines.push('\\newline\\newline');
    }
  });

  lines.push('');
  fs.writeFileSync(path.join(rootDir, 'sections', 'education.tex'), lines.join('\n'));
}

// -----------------------------------------------------------------------------
// 6. Generate sections/activities.tex & hobbies.tex
// -----------------------------------------------------------------------------
function generateActivitiesAndHobbiesTex() {
  const actLines = ['\\begin{zitemize}'];
  resume.activities.forEach((act) => {
    let formatted = escapeTex(act);
    formatted = formatted.replace('Best Outgoing Student', '\\textbf{Best Outgoing Student}');
    formatted = formatted.replace('Best Engineering Project', '\\textbf{Best Engineering Project}');
    formatted = formatted.replace('ESIC 2014', '\\textbf{ESIC 2014}');
    formatted = formatted.replace('ICAMES-17', '\\textbf{ICAMES-17}');
    actLines.push(`\\item ${formatted}`);
  });
  actLines.push('\\end{zitemize}', '');
  fs.writeFileSync(path.join(rootDir, 'sections', 'activities.tex'), actLines.join('\n'));

  const hobText = escapeTex(resume.hobbies.join(', ')) + '.';
  fs.writeFileSync(path.join(rootDir, 'sections', 'hobbies.tex'), hobText + '\n');
}

// -----------------------------------------------------------------------------
// 7. Synchronize root index.html with site/index.html
// -----------------------------------------------------------------------------
function syncHtmlFiles() {
  const siteHtmlPath = path.join(rootDir, 'site', 'index.html');
  const rootHtmlPath = path.join(rootDir, 'index.html');
  if (fs.existsSync(siteHtmlPath)) {
    const content = fs.readFileSync(siteHtmlPath, 'utf-8');
    fs.writeFileSync(rootHtmlPath, content);
  }
}

// Execute all generators
console.log('Generating LaTeX sections from resume.json...');
generateObjectiveTex();
generateSkillsTex();
generateExperienceTex();
generateProjectsTex();
generateEducationTex();
generateActivitiesAndHobbiesTex();
syncHtmlFiles();
console.log('Successfully updated LaTeX section files & synced root index.html!');
