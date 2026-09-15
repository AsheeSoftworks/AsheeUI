/**
 * Require a changeset when a pull request changes a published package.
 *
 * `CONTRIBUTING.md` states the rule and nothing enforced it, so it was followed by
 * memory. `@asheeui/cli` was the proof: a new command merged while the package kept
 * its released version, which would have published nothing to the users the command
 * was written for. This reads what a branch changed, and fails when a change to a
 * published package carries no changeset.
 *
 * Run from the repository root:
 *
 * ```sh
 * node scripts/check-changesets.mjs
 * node scripts/check-changesets.mjs --base main
 * ALLOW_MISSING_CHANGESET=1 node scripts/check-changesets.mjs   # a deliberate exception
 * ```
 *
 * A versioning commit is not a change to a package's code: `changeset version`
 * consumes the changesets and writes the changelogs and the version fields, so
 * `CHANGELOG.md` and `package.json` are what this looks past.
 */

import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** The repository, which is where the packages and the changesets live. */
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Arguments, with the switches separated from the values. */
const args = process.argv.slice(2);
const baseIndex = args.indexOf("--base");
const base = baseIndex === -1 ? "origin/main" : args[baseIndex + 1];
const allowed = Boolean(process.env.ALLOW_MISSING_CHANGESET);

/**
 * Run a command and collect what it prints.
 *
 * @param parameters - The arguments to git.
 * @returns The standard output, trimmed.
 */
async function git(parameters) {
  return new Promise((finished, failed) => {
    const child = spawn("git", parameters, {
      cwd: repositoryRoot,
      stdio: ["ignore", "pipe", "inherit"],
    });
    let output = "";

    child.stdout.on("data", (chunk) => {
      output += chunk;
    });
    child.on("error", failed);
    child.on("close", (code) =>
      code === 0
        ? finished(output.trim())
        : failed(new Error(`git ${parameters.join(" ")} exited with ${code}`)),
    );
  });
}

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
 * The packages a consumer installs, and where their code lives.
 *
 * @returns The published packages, by directory relative to the repository.
 */
async function publishedPackages() {
  const entries = await fs.readdir(join(repositoryRoot, "packages"));
  const published = [];

  for (const entry of entries) {
    const manifest = await readJson(
      join(repositoryRoot, "packages", entry, "package.json"),
    );

    if (manifest.private !== true) {
      published.push({ name: manifest.name, directory: `packages/${entry}` });
    }
  }

  return published;
}

/**
 * The files a branch changed since it left the base.
 *
 * @param from - The commit the branch started at.
 * @param filter - A diff filter, for added or modified files only.
 * @returns Paths relative to the repository.
 */
async function changedFiles(from, filter = "") {
  const filterArguments = filter ? [`--diff-filter=${filter}`] : [];
  const output = await git(["diff", "--name-only", ...filterArguments, from]);

  return output.split("\n").filter(Boolean);
}

if (allowed) {
  console.log(
    "ALLOW_MISSING_CHANGESET is set: skipping the changeset check deliberately",
  );
  process.exit(0);
}

let from;

try {
  from = await git(["merge-base", base, "HEAD"]);
} catch {
  console.error(
    `could not find a common commit with ${base}; fetch it first (the CI job checks out with fetch-depth: 0)`,
  );
  process.exit(1);
}

const changed = await changedFiles(from);
const added = await changedFiles(from, "AM");
const changesets = added.filter((file) => file.startsWith(".changeset/"));
const packages = await publishedPackages();

/** What each published package would have to explain. */
const silent = packages.filter((entry) =>
  changed.some(
    (file) =>
      file.startsWith(`${entry.directory}/`) &&
      // A version and a changelog are what a versioning commit writes, and it has
      // no changeset to add because it has just consumed them.
      file !== `${entry.directory}/CHANGELOG.md` &&
      file !== `${entry.directory}/package.json`,
  ),
);

if (silent.length === 0) {
  console.log(
    `no published package changed without a changeset (${changesets.length} changeset(s) in this branch)`,
  );
  process.exit(0);
}

if (changesets.length > 0) {
  console.log(
    `a changeset is present (${changesets.join(", ")}), which is what this change needed`,
  );
  process.exit(0);
}

console.error(
  `${silent.map((entry) => entry.name).join(", ")} changed without a changeset.`,
);
console.error(
  "Run `pnpm changeset`, choose the packages and the bump, and commit the file it writes.",
);
console.error(
  "If this change deliberately ships nothing (a version bump, a release commit, tooling), set ALLOW_MISSING_CHANGESET=1.",
);
process.exit(1);
