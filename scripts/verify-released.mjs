/**
 * Verify that every published package's version is on the registry.
 *
 * A release that reports success while publishing nothing is worse than a failure:
 * the run is green, the tag exists, and the version is nowhere. That happened — the
 * `@asheeui/cli` patch was versioned, tagged and reported as released while the
 * registry had no such version — so the release workflow asks this afterwards.
 *
 * It reads the workspace manifests rather than a list, skips what is private, and
 * reads the registry anonymously, because a public package needs no credentials to
 * be read. A version can take a minute or two to become readable after it is
 * published, so a missing version is retried before it is called missing.
 *
 * Run it from the repository root:
 *
 * ```sh
 * pnpm verify:released
 * pnpm verify:released --registry https://registry.npmjs.org/ --attempts 6
 * ```
 */

import { promises as fs } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** The repository, which is where the packages are. */
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Arguments, with the switches separated from the values. */
const args = process.argv.slice(2);

/**
 * The value of a `--name value` argument.
 *
 * @param name - The argument's name, including its dashes.
 * @param fallback - The value to use when the argument is absent.
 * @returns The value.
 */
function argumentValue(name, fallback) {
  const index = args.indexOf(name);

  return index === -1 ? fallback : args[index + 1];
}

const registry = argumentValue(
  "--registry",
  "https://registry.npmjs.org/",
).replace(/\/?$/, "/");
const attempts = Number(argumentValue("--attempts", "6"));
const delay = Number(argumentValue("--delay", "15000"));

/**
 * Read a JSON file.
 *
 * @param path - Absolute path of the file.
 * @returns The parsed contents.
 */
async function readJson(path) {
  return JSON.parse(await fs.readFile(path, "utf8"));
}

/**
 * The packages a consumer installs, with the version each states.
 *
 * @returns Name and version, for every package that is not private.
 */
async function publishedPackages() {
  const entries = await fs.readdir(join(repositoryRoot, "packages"));
  const published = [];

  for (const entry of entries) {
    const manifest = await readJson(
      join(repositoryRoot, "packages", entry, "package.json"),
    );

    if (manifest.private !== true) {
      published.push({ name: manifest.name, version: manifest.version });
    }
  }

  return published;
}

/**
 * Ask the registry whether one version exists.
 *
 * @param name - Package name, scoped or not.
 * @param version - The version to look for.
 * @returns True when the registry carries it; false when it does not, or when the
 * registry cannot be reached, which the caller retries.
 */
async function isReleased(name, version) {
  try {
    const response = await fetch(
      `${registry}${encodeURIComponent(name)}/${version}`,
      { headers: { "user-agent": "asheeui-verify-released" } },
    );

    return response.status === 200;
  } catch {
    return false;
  }
}

const packages = await publishedPackages();

if (packages.length === 0) {
  console.log("no published packages in this workspace");

  process.exit(0);
}

let pending = packages;

for (let attempt = 1; attempt <= attempts; attempt += 1) {
  const missing = [];

  for (const entry of pending) {
    if (!(await isReleased(entry.name, entry.version))) missing.push(entry);
  }

  if (missing.length === 0) {
    for (const entry of packages) {
      console.log(`on the registry  ${entry.name}@${entry.version}`);
    }

    console.log(`\nevery published package's version is on ${registry}`);

    process.exit(0);
  }

  const named = missing
    .map((entry) => `${entry.name}@${entry.version}`)
    .join(", ");

  if (attempt === attempts) {
    console.error(
      `\n${named} ${missing.length === 1 ? "is" : "are"} not on ${registry}`,
    );

    process.exit(1);
  }

  console.log(
    `${named} not readable yet (attempt ${attempt} of ${attempts}); the registry can take a minute, so waiting ${Math.round(delay / 1000)}s`,
  );

  await new Promise((done) => setTimeout(done, delay));
  pending = missing;
}
