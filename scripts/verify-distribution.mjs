#!/usr/bin/env node
/**
 * Prove that a published manifest points at files that exist.
 *
 * What gets published is not `package.json` — it is `package.json` with `publishConfig`
 * merged over it, and the two disagree on purpose: the source manifest points at `src` so the
 * monorepo can import each other's TypeScript, while the published one points at `dist`.
 *
 * That disagreement is where published packages break. A `publishConfig` entry naming a file
 * the build does not emit — a `types` condition pointing at a `.d.ts` that lives somewhere
 * else, a `style` entry for a stylesheet the build no longer writes — installs cleanly and
 * fails for the consumer, which is the worst place to find it.
 *
 * This check resolves every path the *published* manifest promises and fails if any is
 * absent. It checks build output, so build first:
 *
 * ```bash
 * pnpm build
 * pnpm verify:distribution
 * ```
 *
 * A manifest can promise a file that exists and still ship a package a consumer cannot use
 * — a subpath the `exports` map does not expose, a stylesheet a bundler cannot resolve, a
 * dependency still written as `workspace:^`. So the second half of the check packs every
 * publishable package, installs the tarballs into a throwaway Vite application outside the
 * workspace, and builds it. `verify-consumer.mjs` owns that step and is called from here,
 * not behind a separate script: install-only failures are what this check exists for.
 *
 * Exit code 1 means a manifest promises a file that is not there, publishes no file list,
 * declares no files at all, or that a consumer build from the tarballs failed.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { verifyConsumer } from "./verify-consumer.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

/** Every publishable package directory: the umbrella at the root, plus `packages/*`. */
function packageDirectories() {
  const directories = [ROOT];
  const packages = join(ROOT, "packages");

  if (existsSync(packages)) {
    for (const entry of readdirSync(packages, { withFileTypes: true })) {
      if (entry.isDirectory()) directories.push(join(packages, entry.name));
    }
  }

  return directories;
}

/** Manifest fields that promise a file, either directly or as a name-to-path map. */
const PROMISING_FIELDS = ["main", "module", "types", "style", "bin"];

/**
 * Collect every file path a manifest promises.
 *
 * `exports` is nested by design — subpath, then condition, then path — so it is walked rather
 * than read. A promise about a file starts with `./`; anything else (`node`, `browser`) is a
 * condition name and is skipped by shape. A glob names a family of files, so it is left to the
 * build to prove rather than asserted here.
 */
function promisedPaths(manifest) {
  const paths = new Set();

  const collect = (value) => {
    if (typeof value === "string") paths.add(value);
    else if (value && typeof value === "object") {
      for (const nested of Object.values(value)) collect(nested);
    }
  };

  for (const field of PROMISING_FIELDS) collect(manifest[field]);
  collect(manifest.exports);

  return [...paths].filter(
    (path) => path.startsWith("./") && !path.includes("*"),
  );
}

const problems = [];
const checked = [];

for (const directory of packageDirectories()) {
  const manifestPath = join(directory, "package.json");
  if (!existsSync(manifestPath)) continue;

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (manifest.private === true) continue;

  // The published manifest is the source one with `publishConfig` merged over it.
  const { publishConfig = {}, ...published } = manifest;
  Object.assign(published, publishConfig);

  const name = manifest.name ?? directory;
  const promised = promisedPaths(published);

  // A meta-package that only aggregates dependencies has no entry points of its own, so it has
  // no promises to check. It is not the same thing as a package that forgot to declare them.
  const declaresEntryPoints = [...PROMISING_FIELDS, "exports", "files"].some(
    (field) => published[field] !== undefined,
  );
  if (!declaresEntryPoints) continue;

  if (promised.length === 0) {
    problems.push(`${name}: the published manifest promises no files at all`);
    continue;
  }

  for (const path of promised) {
    const resolved = join(directory, path.slice(2));
    if (!existsSync(resolved) || !statSync(resolved).isFile()) {
      problems.push(`${name}: promises ${path}, which the build did not emit`);
      continue;
    }
    checked.push(`${name} → ${path}`);
  }

  // A published package with no file list ships whatever happens to be in the directory.
  if (!Array.isArray(published.files) || published.files.length === 0) {
    problems.push(`${name}: publishes no \`files\` list`);
  }
}

if (problems.length > 0) {
  console.log(`Distribution: ${problems.length} problem(s)\n`);
  for (const problem of problems) console.log(`  ${problem}`);
  console.log(
    "\nBuild first: these promises are about dist, and dist is what `pnpm build` writes.",
  );
  process.exit(1);
}

console.log(`Distribution: ${checked.length} promised file(s) exist.`);

try {
  console.log(verifyConsumer());
} catch (error) {
  console.log(
    `\nDistribution: the packed tarballs do not build a consumer.\n\n${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
}
