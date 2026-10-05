#!/usr/bin/env node
/**
 * Native parity check.
 *
 * The compatibility matrix states, for every public component, what each platform
 * does with it. This script turns that statement into a guard: every component the
 * matrix promises for native must be exported by the native package, and the only
 * components allowed to be absent are the ones queued in `scripts/native-parity.json`.
 *
 * The queue is a ratchet. A component that is added to the matrix and not
 * implemented here fails the check, so a component cannot be shipped for one
 * platform alone by accident. And a component that *has* been implemented while
 * still queued also fails the check, so the queue is forced to shrink and cannot
 * quietly become a list of what nobody got round to.
 *
 * Two things are read rather than restated: the matrix is read from its source, so
 * a new entry is seen the moment it is written, and the native surface is read by
 * following the package's own entry point through its `export *` statements, so the
 * check asks what the package publishes rather than what its file names suggest.
 *
 * Usage:
 *
 *   node scripts/check-native-parity.mjs          # verify, exit non-zero on drift
 *   node scripts/check-native-parity.mjs --list   # print the whole expectation table
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MATRIX_FILE = join(ROOT, "packages/core/src/matrix.ts");
const NATIVE_ENTRY = join(ROOT, "packages/native/src/index.ts");
const QUEUE_FILE = join(ROOT, "scripts/native-parity.json");

/** The classifications that promise a native implementation. */
const NATIVE_CLASSIFICATIONS = new Set(["shared", "shared-api"]);

/** Where the matrix's array literal begins in its source file. */
const MATRIX_ARRAY = /COMPONENT_SUPPORT[^=]*=\s*\[([\s\S]*?)\n\];/;

/**
 * Read the matrix out of its source file.
 *
 * The file is data: an array of flat objects whose values are string literals. It
 * is read as data, by taking the array literal apart and reading the three keys
 * this check needs, rather than by importing the module, so the check does not
 * depend on the package having been built first and cannot silently verify a stale
 * build.
 *
 * @returns The matrix entries, in source order.
 */
function readMatrix() {
  const source = readFileSync(MATRIX_FILE, "utf8");
  const array = source.match(MATRIX_ARRAY)?.[1];

  if (!array) return [];

  return [...array.matchAll(/\{([^{}]*)\}/g)]
    .map((match) => {
      const entry = {};
      for (const property of match[1].matchAll(/(\w+):\s*"([^"]*)"/g)) {
        entry[property[1]] = property[2];
      }
      return entry;
    })
    .filter((entry) => entry.name && entry.module && entry.support);
}

/** The file extensions a relative import can resolve to. */
const FILE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

/**
 * Resolve a relative re-export to the file it names.
 *
 * @param fromFile - The file the statement was read from.
 * @param specifier - The module specifier, which must be relative to be followed.
 * @returns The file's path, or undefined when it is outside this package.
 */
function resolveModule(fromFile, specifier) {
  if (!specifier.startsWith(".")) return undefined;

  const base = resolve(dirname(fromFile), specifier);
  const candidates = [
    ...FILE_EXTENSIONS.map((extension) => base + extension),
    ...FILE_EXTENSIONS.map((extension) => join(base, `index${extension}`)),
  ];

  return candidates.find((candidate) => existsSync(candidate));
}

/** A declaration that publishes one name. */
const DECLARATION =
  /^export\s+(?:declare\s+)?(?:async\s+)?(?:function|const|let|var|class|interface|type|enum)\s+([A-Za-z0-9_$]+)/gm;

/** A named export list. */
const NAMED_EXPORT = /^export\s+(?:type\s+)?\{([^}]*)\}/gm;

/** A star re-export, which is followed into the module it names. */
const STAR_EXPORT = /^export\s+\*\s+from\s+"([^"]+)"/gm;

/** A namespace re-export, which publishes one name. */
const STAR_AS_EXPORT = /^export\s+\*\s+as\s+([A-Za-z0-9_$]+)\s+from\s+/gm;

/**
 * Collect everything a module publishes, following its re-exports.
 *
 * @param file - The file to read.
 * @param names - The set the published names are collected into.
 * @param visited - The files already read, so that a cycle cannot loop.
 */
function collectExports(file, names, visited) {
  if (visited.has(file)) return;
  visited.add(file);

  const source = readFileSync(file, "utf8");

  for (const match of source.matchAll(DECLARATION)) {
    names.add(match[1]);
  }

  for (const match of source.matchAll(NAMED_EXPORT)) {
    for (const piece of match[1].split(",")) {
      const [local, exported] = piece.trim().split(/\s+as\s+/);
      const name = (exported ?? local)?.trim();
      if (name) names.add(name);
    }
  }

  for (const match of source.matchAll(STAR_AS_EXPORT)) {
    names.add(match[1]);
  }

  for (const match of source.matchAll(STAR_EXPORT)) {
    const target = resolveModule(file, match[1]);
    if (target) collectExports(target, names, visited);
  }
}

const entries = readMatrix();

if (entries.length === 0) {
  console.error(
    "Native parity: the compatibility matrix could not be read from packages/core/src/matrix.ts.",
  );
  process.exit(1);
}

const queue = existsSync(QUEUE_FILE)
  ? JSON.parse(readFileSync(QUEUE_FILE, "utf8"))
  : { overrides: {}, pending: [] };
const overrides = queue.overrides ?? {};
const pending = new Set(queue.pending ?? []);

/**
 * Every component the matrix promises for native, with the name it must publish
 * under. The name is the one an application imports, which is the matrix's own
 * `name` unless the entry states that native names its counterpart differently.
 */
const promised = entries
  .filter((entry) => NATIVE_CLASSIFICATIONS.has(entry.support))
  .map((entry) => ({
    module: entry.module,
    name: overrides[entry.module] ?? entry.name,
  }));

const promisedModules = new Set(promised.map((entry) => entry.module));
const published = new Set();
collectExports(NATIVE_ENTRY, published, new Set());

const queuedForNothing = [...pending].filter(
  (module) => !promisedModules.has(module),
);
const missing = promised.filter(
  (entry) => !published.has(entry.name) && !pending.has(entry.module),
);
const stale = promised.filter(
  (entry) => published.has(entry.name) && pending.has(entry.module),
);

if (process.argv.includes("--list")) {
  console.log(`Promised for native: ${promised.length}\n`);
  for (const entry of promised) {
    const state = published.has(entry.name)
      ? "shipped"
      : pending.has(entry.module)
        ? "queued "
        : "MISSING";
    console.log(`  ${state}  ${entry.module} -> ${entry.name}`);
  }
  process.exit(0);
}

const shipped = promised.length - pending.size;

if (queuedForNothing.length > 0) {
  console.error(
    "Native parity: scripts/native-parity.json queues modules the matrix does not promise for native:",
  );
  for (const module of queuedForNothing) console.error(`  - ${module}`);
  console.error(
    "\nA queued module must be one the matrix classifies as shared or shared-api. Correct the matrix entry or remove the queue entry.",
  );
  process.exit(1);
}

if (stale.length > 0) {
  console.error(
    "Native parity: the native package implements components that are still queued:",
  );
  for (const entry of stale) {
    console.error(`  - ${entry.module} (${entry.name})`);
  }
  console.error(
    "\nRemove them from the queue. The queue states what is left to do, so it may only shrink.",
  );
  process.exit(1);
}

if (missing.length > 0) {
  console.error(
    `Native parity: ${missing.length} of the ${promised.length} components the matrix promises for native are neither implemented nor queued:`,
  );
  for (const entry of missing) {
    console.error(`  - ${entry.module} -> ${entry.name}`);
  }
  console.error(
    "\nImplement them in packages/native/src/components/<module>, or state in scripts/native-parity.json that they are queued. A component that exists on one platform only is the defect this check exists to catch.",
  );
  process.exit(1);
}

console.log(
  `Native parity: ${shipped} of ${promised.length} promised components are implemented, ${pending.size} queued.`,
);
