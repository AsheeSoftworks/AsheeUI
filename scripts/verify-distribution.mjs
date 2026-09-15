/**
 * Prove that a copied playground installs, verifies itself and builds.
 *
 * The repository verifies the templates' contents, but only an installation proves
 * the distribution works: the copied project has to install the framework, run its
 * own tests and build both of its entries, outside this repository and without any
 * of its packages. Two defects reached `main` that no content check could see — a
 * copied project whose TypeScript configuration reached into the repository, and a
 * template that carried a build artifact — and both were found by installing one.
 * This is that installation, for every target, as a command.
 *
 * Run from the repository root after `pnpm build`:
 *
 * ```sh
 * pnpm verify:distribution
 * pnpm verify:distribution --targets vite
 * pnpm verify:distribution --published      # the version on the registry, not a tarball
 * ```
 *
 * The framework is installed from the tarball `pnpm pack` produces, which is the
 * manifest and file set the registry serves because `publishConfig` is applied to
 * it. `--published` leaves the template's released range in place instead, which is
 * what a run after a release should check.
 */

import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** The repository, which holds the packages and the playgrounds. */
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Arguments, with the switches separated from the values. */
const args = process.argv.slice(2);
const keep = args.includes("--keep");
const published = args.includes("--published");

/**
 * The value of a `--name value` argument.
 *
 * @param name - The argument's name, including its dashes.
 * @returns The value, or undefined when the argument is absent.
 */
function argumentValue(name) {
  const index = args.indexOf(name);

  return index === -1 ? undefined : args[index + 1];
}

/** The targets to verify. */
const targets = (argumentValue("--targets") ?? "next,vite,tanstack")
  .split(",")
  .map((target) => target.trim())
  .filter(Boolean);

/** Where the copied projects are made. */
const workspace = resolve(
  argumentValue("--workspace") ??
    join(tmpdir(), `asheeui-distribution-${Date.now()}`),
);

/**
 * Run a command and wait for it.
 *
 * @param command - The executable.
 * @param parameters - Its arguments.
 * @param cwd - The directory to run it in.
 * @param quiet - Whether to discard what the command prints, for a step whose
 * output is a file rather than a report.
 * @returns Nothing, once the command has exited successfully.
 */
async function run(command, parameters, cwd, quiet = false) {
  await new Promise((finished, failed) => {
    const child = spawn(command, parameters, {
      cwd,
      stdio: quiet ? ["ignore", "ignore", "inherit"] : "inherit",
    });

    child.on("error", failed);
    child.on("close", (code) =>
      code === 0
        ? finished()
        : failed(
            new Error(`${command} ${parameters.join(" ")} exited with ${code}`),
          ),
    );
  });
}

/**
 * Require that a path exists, and say what to run when it does not.
 *
 * @param path - The path that has to exist.
 * @param guidance - What to tell the caller to do about it.
 */
async function requireFile(path, guidance) {
  const exists = await fs
    .access(path)
    .then(() => true)
    .catch(() => false);

  if (!exists) throw new Error(`${path} is missing; ${guidance}`);
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
 * Pack the library the way the registry serves it.
 *
 * @returns The path of the tarball.
 */
async function packLibrary() {
  const packDirectory = join(workspace, "pack");

  await fs.rm(packDirectory, { recursive: true, force: true });
  await fs.mkdir(packDirectory, { recursive: true });

  await requireFile(
    join(repositoryRoot, "packages/ui/dist/index.js"),
    "run `pnpm build` first",
  );

  await run(
    "pnpm",
    ["pack", "--pack-destination", packDirectory],
    join(repositoryRoot, "packages/ui"),
    true,
  );

  const packed = (await fs.readdir(packDirectory)).find((file) =>
    file.endsWith(".tgz"),
  );

  if (!packed) throw new Error("pnpm pack produced no tarball");

  return join(packDirectory, packed);
}

/**
 * Copy one playground into the workspace.
 *
 * @param target - The playground to copy.
 * @returns The directory the project was copied into.
 */
async function copyPlayground(target) {
  const directory = join(workspace, target);
  const cli = join(repositoryRoot, "packages/cli/dist/index.mjs");

  await fs.rm(directory, { recursive: true, force: true });
  await requireFile(cli, "run `pnpm build` first");

  await run(
    process.execPath,
    [cli, "playground", target, directory, "--force"],
    repositoryRoot,
  );

  return directory;
}

/**
 * Point a copied project at the packed framework, unless a published run asked for
 * the released range.
 *
 * @param directory - The copied project.
 * @param tarball - The packed framework, when there is one.
 */
async function installFrom(directory, tarball) {
  if (!tarball) return;

  const path = join(directory, "package.json");
  const manifest = await readJson(path);

  manifest.dependencies.asheeui = `file:${tarball}`;

  await fs.writeFile(path, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

/**
 * Verify one target: install it, run its tests, build it.
 *
 * @param target - The playground to verify.
 * @param tarball - The packed framework, when there is one.
 * @returns The stage that failed, or undefined when everything passed.
 */
async function verify(target, tarball) {
  let stage = "copy";

  try {
    const directory = await copyPlayground(target);

    await installFrom(directory, tarball);

    stage = "install";
    await run("pnpm", ["install", "--no-frozen-lockfile"], directory);

    stage = "test";
    await run("pnpm", ["test"], directory);

    stage = "build";
    await run("pnpm", ["build"], directory);

    return undefined;
  } catch (error) {
    console.error(`\n${target}: ${stage} failed — ${error.message}\n`);

    return stage;
  }
}

if (targets.length === 0) {
  console.error("no targets to verify");
  process.exit(1);
}

await fs.mkdir(workspace, { recursive: true });

console.log(
  `verifying ${targets.join(", ")} in ${workspace}${published ? " against the published range" : " against a packed tarball"}\n`,
);

const tarball = published ? undefined : await packLibrary();
const results = new Map();

for (const target of targets) {
  console.log(`\n=== ${target} ===\n`);
  results.set(target, await verify(target, tarball));
}

console.log(`\n${"-".repeat(60)}`);

for (const [target, failure] of results) {
  console.log(
    `${target.padEnd(12)} ${failure ? `${failure} failed` : "installs, verifies itself and builds"}`,
  );
}

const failed = [...results.values()].filter(Boolean);

if (failed.length > 0) {
  console.error(
    `\n${failed.length} of ${results.size} targets failed; the projects are under ${workspace}`,
  );
  process.exit(1);
}

if (!keep) await fs.rm(workspace, { recursive: true, force: true });

console.log(
  `\nall ${results.size} targets install, verify themselves and build${keep ? ` (kept in ${workspace})` : ""}`,
);
