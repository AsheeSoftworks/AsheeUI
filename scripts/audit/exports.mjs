#!/usr/bin/env node
/**
 * Audit A — the published export surface of each renderer, and their intersection.
 *
 * Follows every `export *` from a package entry and reports the names each renderer
 * publishes, so a difference is a measured fact rather than a guess about file names.
 * This is the measurement behind Appendix C of `NATIVE-PARITY-REPORT.md`, and it goes
 * further than `scripts/check-native-parity.mjs`: that guard asks whether the matrix's
 * promises are published, this asks what is published at all.
 *
 * Usage:
 *
 *   node scripts/audit/exports.mjs            # summary + the differences that matter
 *   node scripts/audit/exports.mjs --all      # every name, tagged by package
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

const DECLARATION =
  /^export\s+(?:declare\s+)?(?:async\s+)?(?:function|const|let|var|class|interface|type|enum)\s+([A-Za-z0-9_$]+)/gm;
const NAMED_EXPORT = /^export\s+(?:type\s+)?\{([^}]*)\}/gm;
const STAR_EXPORT = /^export\s+\*\s+from\s+"([^"]+)"/gm;
const STAR_AS_EXPORT = /^export\s+\*\s+as\s+([A-Za-z0-9_$]+)\s+from\s+/gm;

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
    ...EXTENSIONS.map((extension) => base + extension),
    ...EXTENSIONS.map((extension) => join(base, `index${extension}`)),
  ];

  return candidates.find((candidate) => existsSync(candidate));
}

/**
 * Collect everything a module publishes, following its re-exports.
 *
 * @param file - The file to read.
 * @param names - `name -> file` for everything found so far.
 * @param visited - The files already read, so that a cycle cannot loop.
 */
function collect(file, names, visited) {
  if (visited.has(file)) return;
  visited.add(file);

  const source = readFileSync(file, "utf8");
  const add = (name) =>
    names.set(name, file.replace(ROOT, "").replaceAll("\\", "/"));

  for (const match of source.matchAll(DECLARATION)) add(match[1]);

  for (const match of source.matchAll(NAMED_EXPORT)) {
    for (const piece of match[1].split(",")) {
      const [local, exported] = piece.trim().split(/\s+as\s+/);
      const name = (exported ?? local)?.trim();
      if (name) add(name);
    }
  }

  for (const match of source.matchAll(STAR_AS_EXPORT)) add(match[1]);

  for (const match of source.matchAll(STAR_EXPORT)) {
    const target = resolveModule(file, match[1]);
    if (target) collect(target, names, visited);
  }
}

/** The renderers this audit compares, by package directory and entry point. */
const PACKAGES = [
  ["web", join(ROOT, "packages/web/src/index.ts")],
  ["native", join(ROOT, "packages/native/src/index.ts")],
];

const surfaces = {};
for (const [name, entry] of PACKAGES) {
  const names = new Map();
  collect(entry, names, new Set());
  surfaces[name] = names;
}

const web = [...surfaces.web.keys()].sort();
const native = [...surfaces.native.keys()].sort();
const onlyWeb = web.filter((name) => !surfaces.native.has(name));
const onlyNative = native.filter((name) => !surfaces.web.has(name));
const shared = web.filter((name) => surfaces.native.has(name));

/** Names worth reading: components, hooks and constants, without the per-component internals. */
const isInteresting = (name) =>
  !/Config$/.test(name) &&
  !/Props$/.test(name) &&
  !/^FALLBACK_/.test(name) &&
  !/^default[A-Z]/.test(name);

console.log(
  `web ${web.length} exports, native ${native.length}, shared ${shared.length}`,
);

if (process.argv.includes("--all")) {
  console.log(`\nONLY IN WEB (${onlyWeb.length})`);
  for (const name of onlyWeb) console.log(`  ${name}`);
  console.log(`\nONLY IN NATIVE (${onlyNative.length})`);
  for (const name of onlyNative) console.log(`  ${name}`);
} else {
  const webOnly = onlyWeb.filter(isInteresting);
  const nativeOnly = onlyNative.filter(isInteresting);

  console.log(
    `\nONLY IN WEB, beyond per-component internals (${webOnly.length})`,
  );
  for (const name of webOnly)
    console.log(`  ${name.padEnd(34)} ${surfaces.web.get(name)}`);

  console.log(
    `\nONLY IN NATIVE, beyond per-component internals (${nativeOnly.length})`,
  );
  for (const name of nativeOnly)
    console.log(`  ${name.padEnd(34)} ${surfaces.native.get(name)}`);
}
