// Security gate for the built visual aid. Adapted from the AIMTO Security for Vibecoders gate.
// Reads netlify.toml and dist/ only.
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseGlobalHeaders } from "./headers.mjs";

const config = readFileSync(resolve("netlify.toml"), "utf8");
const html = readFileSync(resolve("dist/index.html"), "utf8");
let failed = false;

function fail(message) {
  console.error(`[FAIL] ${message}`);
  failed = true;
}

function pass(message) {
  console.log(`[PASS] ${message}`);
}

const headers = parseGlobalHeaders(config);
if (!headers) {
  fail("Global Netlify header block is missing");
  process.exit(1);
}

const requiredHeaders = [
  "content-security-policy",
  "cross-origin-embedder-policy",
  "cross-origin-opener-policy",
  "cross-origin-resource-policy",
  "origin-agent-cluster",
  "permissions-policy",
  "referrer-policy",
  "strict-transport-security",
  "x-content-type-options",
  "x-frame-options",
];
const missing = requiredHeaders.filter((h) => !headers[h]);
missing.forEach((h) => fail(`Missing ${h}`));
if (missing.length === 0) pass(`All ${requiredHeaders.length} required headers are configured`);

const csp = headers["content-security-policy"] ?? "";
const requiredDirectives = [
  "default-src 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "script-src 'self'",
  "script-src-attr 'none'",
  "style-src 'self'",
  "style-src-attr 'none'",
  "form-action 'none'",
  "upgrade-insecure-requests",
];
const missingDirectives = requiredDirectives.filter((d) => !csp.includes(d));
missingDirectives.forEach((d) => fail(`CSP is missing: ${d}`));
for (const forbidden of ["'unsafe-inline'", "'unsafe-eval'", "strict-dynamic", "http:", "data:", "*"]) {
  if (csp.includes(forbidden)) fail(`CSP contains forbidden source: ${forbidden}`);
}
if (missingDirectives.length === 0) pass("CSP has the required static-site directives and no unsafe sources");

const scriptTags = Array.from(html.matchAll(/<script\b([^>]*)>/gi), (m) => m[1]);
if (scriptTags.length === 0) fail("Built page has no presentation script");
else if (scriptTags.some((attributes) => !/\bsrc="\/_astro\//.test(attributes))) fail("Built page has an inline or off-origin script");
else pass("Every script is an external same-origin file");

if (/<style\b/i.test(html) || /\sstyle=/i.test(html)) fail("Built page has inline CSS, which style-src-attr 'none' blocks");
else pass("No inline style tags or attributes");

const cssFiles = readdirSync(resolve("dist/_astro")).filter((f) => f.endsWith(".css"));
if (cssFiles.some((f) => /url\(\s*['"]?data:/i.test(readFileSync(resolve("dist/_astro", f), "utf8")))) fail("Built CSS inlines a data: URI");
else pass("Built CSS has no inlined data: URIs");

const offOrigin = Array.from(html.matchAll(/\s(?:src|href)="(https?:[^"]+)"/g), (m) => m[1])
  .filter((url) => !html.includes(`<a href="${url}"`) && !url.startsWith(process.env.PUBLIC_SITE_URL ?? "\u0000"));
if (offOrigin.length) fail(`Page loads off-origin resources: ${offOrigin.join(", ")}`);
else pass("Page loads no off-origin resources (external URLs are links only)");

const favicon = readFileSync(resolve("dist/favicon.svg"), "utf8");
if (/<script|<foreignObject|\son[a-z]+=|\s(?:xlink:)?href=|\sstyle=/i.test(favicon)) fail("Favicon SVG has an unsafe surface");
else pass("Favicon SVG has no script, handler, link, or style surface");

if (failed) process.exit(1);
