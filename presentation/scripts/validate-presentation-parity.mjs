// Checks the presentation contract, then that the built site and the speaker notes carry every shared value.
// Adapted from the AIMTO Security for Vibecoders gate.
//   node scripts/validate-presentation-parity.mjs                  contract, site, and notes
//   node scripts/validate-presentation-parity.mjs --contract-only  contract only
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const contract = JSON.parse(readFileSync(resolve("src/content/presentation-contract.json"), "utf8"));
const contractOnly = process.argv.includes("--contract-only");
const failures = [];

function fail(message) {
  failures.push(message);
  console.error(`[FAIL] ${message}`);
}

function pass(message) {
  console.log(`[PASS] ${message}`);
}

function normalize(value) {
  return value
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&#39;|&apos;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]*>/g, " ")
    .replace(/\\n/g, " ")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
    .replace(/\s+/g, " ")
    .trim();
}

function parseTime(time) {
  const match = time.match(/^(\d):(\d{2}) - (\d):(\d{2})$/);
  if (!match) return null;
  const [, sh, sm, eh, em] = match.map(Number);
  return { start: sh * 60 + sm, end: eh * 60 + em };
}

const EXPECTED_IDS = ["ch1", "ch2", "ch3", "ch4", "break", "ch5", "ch6"];
const ids = contract.slides.map((slide) => slide.id);

if (contract.version !== 1) fail("Contract version must be 1");
if (ids.join("|") !== EXPECTED_IDS.join("|")) fail(`Slides must be ${EXPECTED_IDS.join(", ")} in order, found ${ids.join(", ")}`);
if (new Set(contract.slides.map((s) => s.nav)).size !== contract.slides.length) fail("Navigation labels must be unique");

const preWork = contract.slides.find((s) => s.id === "ch1");
if (preWork && (preWork.durationMinutes !== 0 || preWork.time !== "Before class")) fail("ch1 is pre-work: time \"Before class\", 0 minutes in session");

let expectedStart = 0;
for (const slide of contract.slides.filter((s) => s.id !== "ch1")) {
  const range = parseTime(slide.time);
  if (!range) {
    fail(`Invalid time range for ${slide.id}: ${slide.time}`);
    continue;
  }
  if (range.start !== expectedStart) fail(`Time range for ${slide.id} does not start where the previous slide ended`);
  if (range.end - range.start !== slide.durationMinutes) fail(`durationMinutes does not match the time range for ${slide.id}`);
  expectedStart = range.end;
}
const total = contract.slides.reduce((sum, s) => sum + s.durationMinutes, 0);
if (total !== contract.totalMinutes || total !== 180 || expectedStart !== 180) fail(`In-session time must total 180 minutes, found ${total}`);

for (const slide of contract.slides) {
  for (const field of ["title", "objective", "say", "check", "fallback", "cue"]) {
    if (!slide[field]) fail(`${slide.id} is missing ${field}`);
  }
}

if (failures.length === 0) pass("Contract: 7 slides in order, contiguous, 180 minutes in session plus pre-work");

if (!contractOnly) {
  const html = readFileSync(resolve("dist/index.html"), "utf8");
  const notes = readFileSync(resolve("speaker-notes/course-notes.zen"), "utf8");
  const normalizedHtml = normalize(html);
  const normalizedNotes = normalize(notes);
  const sectionIds = Array.from(html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g), (m) => m[1]);
  const pageIds = Array.from(notes.matchAll(/\bpage id="page\.([^"]+)"/g), (m) => m[1]);

  if (sectionIds.join("|") !== ids.join("|")) fail(`Site sections ${sectionIds.join(", ")} do not match the contract`);
  if (pageIds.join("|") !== ids.join("|")) fail(`Speaker-note pages ${pageIds.join(", ")} do not match the contract`);

  const before = failures.length;
  for (const slide of contract.slides) {
    const shared = [
      slide.title,
      slide.time,
      slide.cue,
      ...slide.points,
      ...slide.prompts.map((p) => p.text),
      ...slide.commands,
      ...slide.sources.map((s) => s.href),
    ];
    for (const value of shared) {
      const v = normalize(value);
      if (!normalizedHtml.includes(v)) fail(`Site is missing ${slide.id} value: ${v.slice(0, 80)}`);
      if (!normalizedNotes.includes(v)) fail(`Notes are missing ${slide.id} value: ${v.slice(0, 80)}`);
    }
  }
  if (failures.length === before) pass("Site and speaker notes carry every contract value");
}

if (failures.length > 0) process.exit(1);
