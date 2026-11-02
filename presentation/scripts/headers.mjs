// Reads the global ("/*") header block from netlify.toml into { lowercased-name: value }.
export function parseGlobalHeaders(toml) {
  const block = toml.match(/\[\[headers\]\]\s*for = "\/\*"\s*\[headers\.values\]([\s\S]*?)(?=\n\[\[headers\]\]|$)/)?.[1];
  if (!block) return null;
  return Object.fromEntries(
    Array.from(block.matchAll(/^\s*([\w-]+)\s*=\s*"([^"]*)"\s*$/gm), ([, key, value]) => [key.toLowerCase(), value]),
  );
}
