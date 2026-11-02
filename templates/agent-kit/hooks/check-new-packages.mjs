// Pre-commit check against slopsquatting and unreviewed dependencies.
// Blocks a commit that adds a dependency to package.json unless:
//   1. the package is listed in .vetted-packages.txt by a person who checked it, and
//   2. a lockfile is committed alongside package.json.
// When the npm registry is reachable, it shows each new package's age and repository to help the check.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const git = (...args) => {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
};

const staged = (git("diff", "--cached", "--name-only") ?? "").split("\n").filter(Boolean);
const manifests = staged.filter((f) => f === "package.json" || f.endsWith("/package.json"));
if (manifests.length === 0) process.exit(0);

const SECTIONS = ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"];
const LOCKFILES = ["package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb"];
const depNames = (json) => new Set(SECTIONS.flatMap((s) => Object.keys(json?.[s] ?? {})));
const parse = (text) => {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
};

const vetted = new Set(
  (existsSync(".vetted-packages.txt") ? readFileSync(".vetted-packages.txt", "utf8") : "")
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*/, "").trim())
    .filter(Boolean),
);

const problems = [];
for (const manifest of manifests) {
  const dir = manifest.includes("/") ? manifest.slice(0, manifest.lastIndexOf("/") + 1) : "";
  const before = depNames(parse(git("show", `HEAD:${manifest}`)));
  const after = depNames(parse(git("show", `:${manifest}`)));
  const added = [...after].filter((name) => !before.has(name));
  if (added.length === 0) continue;

  const hasLockfile = LOCKFILES.some((lock) => staged.includes(`${dir}${lock}`) || existsSync(`${dir}${lock}`));
  if (!hasLockfile) problems.push(`${manifest}: dependencies changed but no lockfile is committed. Run npm install and stage package-lock.json.`);

  for (const name of added.filter((n) => !vetted.has(n))) {
    let info = "registry not checked";
    try {
      const raw = execFileSync("npm", ["view", name, "time.created", "repository.url", "--json"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 15000,
        shell: process.platform === "win32",
      });
      const data = JSON.parse(raw || "{}");
      const created = data["time.created"] ?? data.time?.created;
      const days = created ? Math.floor((Date.now() - Date.parse(created)) / 86400000) : null;
      const repo = data["repository.url"] ?? data.repository?.url ?? "no repository listed";
      info = `${days === null ? "age unknown" : `${days} days old`}${days !== null && days < 90 ? " (NEW: be careful)" : ""}, ${repo}`;
    } catch (error) {
      const output = `${error.stdout ?? ""}${error.stderr ?? ""}`;
      if (output.includes("E404")) info = "DOES NOT EXIST on npm. Possible hallucinated package name";
    }
    problems.push(`${manifest}: new package "${name}" is not in .vetted-packages.txt (${info})`);
  }
}

if (problems.length === 0) process.exit(0);

console.error("pre-commit: new dependencies need a human check.\n");
for (const problem of problems) console.error(`  - ${problem}`);
console.error(`
For each new package, open https://www.npmjs.com/package/<name> and check:
  the name is exactly the one you meant, it has a real repository, real weekly downloads,
  and a history longer than a few weeks.
Then add one line per package to .vetted-packages.txt, for example:
  zod  # schema validation, checked 2026-11-02
and stage that file. Commit blocked.`);
process.exit(1);
