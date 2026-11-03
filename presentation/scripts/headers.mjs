// Reads the Azure Static Web Apps config, the single source of the visual aid's response headers.
// public/staticwebapp.config.json is the source. Astro copies it into dist/, which is what Azure serves.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export function readSwaConfig(file = "dist/staticwebapp.config.json") {
  try {
    return JSON.parse(readFileSync(resolve(file), "utf8"));
  } catch {
    return null;
  }
}

// Returns the global headers as { lowercased-name: value }.
export function globalHeaders(config) {
  return Object.fromEntries(Object.entries(config?.globalHeaders ?? {}).map(([key, value]) => [key.toLowerCase(), value]));
}
