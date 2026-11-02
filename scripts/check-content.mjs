// Checks the course content contract. Reads repo files only.
//
//   node scripts/check-content.mjs                  run every check
//   node scripts/check-content.mjs chapters links   run selected checks
//
// Checks:
//   chapters   six chapter files, Tera form fields present, review values, 20 min pre-work, 180 min in session
//   cards      an attacker prompt, fixer prompt, and proof for every lab flag, plus the threat model card
//   files      every worksheet and template the chapters promise exists
//   links      every relative Markdown link in the course resolves to a file
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const selected = process.argv.slice(2);
const run = (name) => selected.length === 0 || selected.includes(name);
const errors = [];
const fail = (message) => errors.push(message);

const BREAK_MIN = 10;
const SESSION_MIN = 180;
const PREWORK_MIN = 20;
const FIELDS = ['chapter', 'title', 'summary', 'block', 'duration_min', 'deliverable', 'review'];
const FLAGS = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9'];
const REQUIRED_FILES = [
  'worksheets/hygiene-checklist.md',
  'worksheets/threat-model.md',
  'worksheets/pre-deploy-checklist.md',
  'worksheets/breach-runbook.md',
  'templates/SECURITY.md',
  'templates/github/workflows/security.yml',
  'templates/agent-kit/SECURITY-RULES.md',
  'templates/agent-kit/claude/settings.json',
];

function frontMatter(file) {
  const text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  return Object.fromEntries(
    match[1].split('\n').filter((line) => line.includes(':')).map((line) => {
      const i = line.indexOf(':');
      return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^"(.*)"$/, '$1')];
    }),
  );
}

function markdownFiles(dir) {
  const skip = new Set(['node_modules', '.next', '.git', '.data', 'dist', '.astro']);
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (skip.has(entry)) continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...markdownFiles(full));
    else if (entry.endsWith('.md')) out.push(full);
  }
  return out;
}

const rel = (file) => path.relative(root, file).replaceAll('\\', '/');

if (run('chapters')) {
  const dir = path.join(root, 'chapters');
  const files = readdirSync(dir).filter((f) => /^ch\d-.*\.md$/.test(f)).sort();
  if (files.length !== 6) fail(`chapters: expected 6 files named chN-*.md, found ${files.length}`);
  let inSession = BREAK_MIN;
  for (const file of files) {
    const fm = frontMatter(path.join(dir, file));
    if (!fm) {
      fail(`chapters/${file}: no front matter`);
      continue;
    }
    for (const field of FIELDS) if (!fm[field]) fail(`chapters/${file}: missing field "${field}"`);
    const n = Number(fm.chapter);
    const minutes = Number(fm.duration_min);
    const expectedReview = n === 6 ? 'approval' : 'self-check';
    if (fm.review !== expectedReview) fail(`chapters/${file}: review is "${fm.review}", expected "${expectedReview}"`);
    if (n === 1 && minutes !== PREWORK_MIN) fail(`chapters/${file}: pre-work is ${minutes} min, expected ${PREWORK_MIN}`);
    if (n > 1) inSession += minutes;
    const text = readFileSync(path.join(dir, file), 'utf8');
    const stepMinutes = [...text.matchAll(/^##+ .*\((\d+) min[^)]*\)\s*$/gm)].reduce((sum, m) => sum + Number(m[1]), 0);
    if (stepMinutes !== minutes) fail(`chapters/${file}: step headings add up to ${stepMinutes} min, duration_min is ${minutes}`);
    if (fm.summary && fm.summary.length > 200) fail(`chapters/${file}: summary is ${fm.summary.length} characters, keep it under 200`);
  }
  if (files.length === 6 && inSession !== SESSION_MIN) fail(`chapters: CH2-CH6 plus the ${BREAK_MIN}-min break total ${inSession} min, expected ${SESSION_MIN}`);
}

if (run('cards')) {
  const dir = path.join(root, 'cards');
  const files = existsSync(dir) ? readdirSync(dir) : [];
  for (const flag of FLAGS) {
    const file = files.find((f) => f.startsWith(`${flag}-`));
    if (!file) {
      fail(`cards: no card for ${flag}`);
      continue;
    }
    const text = readFileSync(path.join(dir, file), 'utf8');
    for (const heading of ['## Attacker prompt', '## Fixer prompt', '## Proof']) {
      if (!text.includes(heading)) fail(`cards/${file}: missing "${heading}"`);
    }
  }
  if (!files.includes('threat-model.md')) fail('cards: no threat-model.md card');
}

if (run('files')) {
  for (const file of REQUIRED_FILES) if (!existsSync(path.join(root, file))) fail(`files: missing ${file}`);
}

if (run('links')) {
  for (const file of markdownFiles(root)) {
    const text = readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, '');
    for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^(https?:|mailto:|#)/.test(target)) continue;
      const clean = decodeURIComponent(target.split('#')[0]);
      if (!clean) continue;
      if (!existsSync(path.resolve(path.dirname(file), clean))) fail(`links: ${rel(file)} -> ${target} does not exist`);
    }
  }
}

if (errors.length) {
  console.log(errors.map((e) => `FAIL  ${e}`).join('\n'));
  console.log(`\n${errors.length} content error(s).`);
  process.exit(1);
}
console.log(`PASS  content checks: ${selected.length ? selected.join(', ') : 'chapters, cards, files, links'}`);
