// Writes tera/chN-*.md: each chapter's body in the Tera chapter editor's lesson format, ready to paste into LESSON.
//   node scripts/tera-lesson.mjs           rewrite tera/
//   node scripts/tera-lesson.mjs --check   fail if tera/ is out of date
//
// Tera lesson format (read from the editor's Step syntax table, plan task P0-T10):
//   ## Steps        starts the step walk. Every ### heading under it, up to the next ## heading, is one step.
//   Cap: N min      a quiet countdown on the step. It never blocks.
//   ## Checkpoint   the hand-in at the end of the chapter, shown with its form.
//
// Mapping from the chapter files:
//   "## ... (N min)" sections      become ### steps in order, with "Cap: N min" when the time is exact.
//   A timed step titled "Submit"   moves into the Checkpoint, since the Checkpoint is the hand-in.
//   Deliverable, Self-check, Approval criteria   become the Checkpoint.
//   Other sections                 stay as ## sections, before or after the steps.
//   Relative links                 become github.com links, because Tera cannot resolve repository paths.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = 'https://github.com/pizofreude/ai-for-cybersecurity-101';
const root = fileURLToPath(new URL('..', import.meta.url));
const source = path.join(root, 'chapters');
const target = path.join(root, 'tera');
const CHECKPOINT = ['Deliverable', 'Self-check', 'Approval criteria'];
const errors = [];

// Splits a chapter into its preamble and ## sections, ignoring headings inside code fences.
function sections(body) {
  const out = { preamble: [], list: [] };
  let current = null;
  let fenced = false;
  for (const line of body.split('\n')) {
    if (/^\s*```/.test(line)) fenced = !fenced;
    if (!fenced && /^# /.test(line)) continue;
    if (!fenced && /^## /.test(line)) {
      current = { heading: line.slice(3).trim(), lines: [] };
      out.list.push(current);
      continue;
    }
    if (!fenced && /^### /.test(line)) errors.push(`a ### heading would become a Tera step outside the step walk: ${line}`);
    (current ? current.lines : out.preamble).push(line);
  }
  return out;
}

function absoluteLinks(text, file) {
  return text.replace(/\]\((?!https?:|mailto:|#)([^)\s]+)\)/g, (_, link) => {
    const [file_, hash] = link.split('#');
    const resolved = path.resolve(path.dirname(file), decodeURIComponent(file_));
    const repoPath = path.relative(root, resolved).replaceAll('\\', '/');
    const kind = existsSync(resolved) && statSync(resolved).isDirectory() ? 'tree' : 'blob';
    return `](${REPO}/${kind}/main/${repoPath}${hash ? `#${hash}` : ''})`;
  });
}

const trim = (lines) => lines.join('\n').replace(/^\n+|\n+$/g, '');

function lesson(file) {
  const text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const body = text.replace(/^---\n[\s\S]*?\n---\n/, '');
  const { preamble, list } = sections(absoluteLinks(body, file));
  const before = [];
  const steps = [];
  const after = [];
  const checkpoint = [];
  for (const s of list) {
    const timed = s.heading.match(/^(.*?)\s*\((\d+) min([^)]*)\)$/);
    if (timed) {
      const title = timed[1].replace(/^Step \d+:\s*/, '');
      if (/^Submit\b/.test(title)) {
        checkpoint.unshift(trim(s.lines));
        continue;
      }
      if (after.length) errors.push(`${path.basename(file)}: untimed section "${after[0].heading}" sits between steps`);
      const cap = timed[3].trim() ? '' : `\n\nCap: ${timed[2]} min`;
      steps.push(`### ${title}\n\n${trim(s.lines)}${cap}`);
    } else if (CHECKPOINT.includes(s.heading)) {
      checkpoint.push(s.heading === 'Deliverable' ? trim(s.lines) : `**${s.heading}**\n\n${trim(s.lines)}`);
    } else {
      (steps.length ? after : before).push(s);
    }
  }
  if (steps.length === 0) errors.push(`${path.basename(file)}: no timed step sections`);
  if (checkpoint.length === 0) errors.push(`${path.basename(file)}: no Deliverable, Self-check, or Approval criteria for the Checkpoint`);
  const block = (s) => `## ${s.heading}\n\n${trim(s.lines)}`;
  const parts = [trim(preamble), ...before.map(block), `## Steps\n\n${steps.join('\n\n')}`, ...after.map(block), `## Checkpoint\n\n${checkpoint.join('\n\n')}`];
  const output = `${parts.filter(Boolean).join('\n\n')}\n`;
  if (/\]\((?!https?:|mailto:|#)/.test(output)) errors.push(`${path.basename(file)}: a relative link survived`);
  return output;
}

const files = readdirSync(source).filter((f) => /^ch\d-.*\.md$/.test(f)).sort();
const outputs = files.map((f) => [f, lesson(path.join(source, f))]);
if (errors.length) {
  console.log(errors.map((e) => `FAIL  ${e}`).join('\n'));
  process.exit(1);
}

if (process.argv.includes('--check')) {
  const stale = outputs.filter(([f, out]) => {
    const file = path.join(target, f);
    return !existsSync(file) || readFileSync(file, 'utf8').replace(/\r\n/g, '\n') !== out;
  });
  if (stale.length) {
    console.log(`FAIL  tera/ is out of date for ${stale.map(([f]) => f).join(', ')}. Run: node scripts/tera-lesson.mjs`);
    process.exit(1);
  }
  console.log(`PASS  tera/ matches the ${files.length} chapters`);
} else {
  mkdirSync(target, { recursive: true });
  for (const [f, out] of outputs) writeFileSync(path.join(target, f), out);
  console.log(`Wrote tera/ lessons for ${files.length} chapters`);
}
