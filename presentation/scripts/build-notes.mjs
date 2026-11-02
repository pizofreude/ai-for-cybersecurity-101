// Generates speaker-notes/course-notes.zen from the presentation contract, one A4 page per section.
// Run: npm run notes. Then: zenith validate speaker-notes/course-notes.zen
//      zenith render speaker-notes/course-notes.zen --format pdf
// The notes carry every shared contract value, so the parity gate holds by construction.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const contract = JSON.parse(readFileSync(resolve("src/content/presentation-contract.json"), "utf8"));
const DOC_ID = "01M6E8H5TQCZ9SZTV9Z9RPKR8R";
const W = 595;
const H = 842;
const X = 34;
const INNER = W - 2 * X;

const q = (value) => `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`;
const px = (n) => `(px)${n}`;

function text(id, y, h, body, { color = "color.ink", font = "font.display", size = "size.body", weight, x = X, w = INNER } = {}) {
  const attrs = [
    `id=${q(id)}`, `x=${px(x)}`, `y=${px(y)}`, `w=${px(w)}`, `h=${px(h)}`,
    `fill=(token)${q(color)}`, `font-family=(token)${q(font)}`, `font-size=(token)${q(size)}`,
    weight ? `font-weight=(token)${q(weight)}` : null,
  ].filter(Boolean).join(" ");
  return `      text ${attrs} {\n        span ${q(body)}\n      }`;
}

function rect(id, y, h, { fill = "color.panel", stroke = true, x = X, w = INNER } = {}) {
  const strokeAttrs = stroke ? ` stroke=(token)"color.line" stroke-width=(token)"size.stroke"` : "";
  return `      rect id=${q(id)} x=${px(x)} y=${px(y)} w=${px(w)} h=${px(h)} fill=(token)${q(fill)}${strokeAttrs}`;
}

function panel(id, y, h, label, body, options = {}) {
  return [
    rect(`${id}.bg`, y, h, { fill: options.fill ?? "color.panel" }),
    text(`${id}.label`, y + 10, 14, label, { color: "color.accent", font: "font.mono", size: "size.meta", weight: "weight.bold", x: X + 12, w: INNER - 24 }),
    text(`${id}.body`, y + 30, h - 38, body, { color: options.color ?? "color.ink", font: options.font ?? "font.display", size: options.size ?? "size.body", x: X + 12, w: INNER - 24 }),
  ].join("\n");
}

function page(slide) {
  const p = slide.id;
  const chapter = slide.id === "break" ? "BREAK" : `CH${slide.id.slice(2)}`;
  const minutes = slide.durationMinutes > 0 ? ` / ${slide.durationMinutes} MIN` : " / PRE-WORK";
  const blocks = [
    ...slide.prompts.map((prompt) => `PROMPT / ${prompt.label}:\n${prompt.text}`),
    ...slide.commands.map((command) => `$ ${command}`),
  ].join("\n\n") || "No prompt or command on this slide.";
  const sources = slide.sources.map((s) => `${s.label}: ${s.href}`).join("\n") || "No sources on this slide.";

  return [
    `    page id=${q(`page.${p}`)} name=${q(`${chapter} - ${slide.label}`)} w=${px(W)} h=${px(H)} background=(token)"color.bg" {`,
    rect(`${p}.accent`, 28, 5, { fill: "color.accent", stroke: false }),
    text(`${p}.meta`, 42, 16, `${chapter} / ${slide.time}${minutes}`, { color: "color.accent", font: "font.mono", size: "size.meta", weight: "weight.bold" }),
    text(`${p}.title`, 62, 34, slide.title, { size: "size.title", weight: "weight.bold" }),
    text(`${p}.objective`, 100, 40, slide.objective, { color: "color.muted" }),
    rect(`${p}.rule`, 146, 1, { fill: "color.line", stroke: false }),
    panel(`${p}.screen`, 158, 132, "ON SCREEN", slide.points.map((point) => `- ${point}`).join("\n")),
    panel(`${p}.say`, 300, 92, "SAY", slide.say, { fill: "color.panelStrong" }),
    panel(`${p}.blocks`, 402, 178, "PROMPTS AND COMMANDS", blocks, { font: "font.mono", size: "size.code" }),
    panel(`${p}.close`, 590, 150, "CHECK / FALLBACK / CUE", `CHECK: ${slide.check}\n\nFALLBACK: ${slide.fallback}\n\nCUE: ${slide.cue}`, { fill: "color.panelStrong" }),
    text(`${p}.sources.label`, 752, 14, "SOURCES", { color: "color.accent", font: "font.mono", size: "size.meta", weight: "weight.bold" }),
    text(`${p}.sources`, 768, 56, sources, { color: "color.muted", font: "font.mono", size: "size.small" }),
    "    }",
  ].join("\n");
}

const tokens = [
  ["color.bg", "color", '"#0d0f12"'],
  ["color.panel", "color", '"#15191e"'],
  ["color.panelStrong", "color", '"#1c2229"'],
  ["color.ink", "color", '"#f2f4f6"'],
  ["color.muted", "color", '"#bac2cb"'],
  ["color.accent", "color", '"#ffb547"'],
  ["color.line", "color", '"#2b333c"'],
  ["font.display", "fontFamily", '"Noto Sans"'],
  ["font.mono", "fontFamily", '"Noto Sans Mono"'],
  ["weight.bold", "fontWeight", "700"],
  ["size.meta", "dimension", "(px)8"],
  ["size.title", "dimension", "(px)22"],
  ["size.body", "dimension", "(px)10"],
  ["size.small", "dimension", "(px)7"],
  ["size.code", "dimension", "(px)8"],
  ["size.stroke", "dimension", "(px)1"],
].map(([id, type, value]) => `    token id=${q(id)} type=${q(type)} value=${value}`).join("\n");

const output = [
  `zenith version=1 doc-id=${q(DOC_ID)} {`,
  `  project id="proj.ai4cyber.notes" name="AI for Cybersecurity 101 Speaker Notes"`,
  "  assets {\n  }",
  `  tokens format="zenith-token-v1" {\n${tokens}\n  }`,
  "  styles {\n  }",
  `  document id="doc.ai4cyber.notes" title=${q(`${contract.course} - Speaker Notes`)} {`,
  contract.slides.map(page).join("\n"),
  "  }",
  "}",
  "",
].join("\n");

writeFileSync(resolve("speaker-notes/course-notes.zen"), output);
console.log(`Wrote speaker-notes/course-notes.zen with ${contract.slides.length} pages`);
