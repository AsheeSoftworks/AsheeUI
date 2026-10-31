#!/usr/bin/env node
/**
 * Audit B — the configuration surface, per component, across the three packages.
 *
 * For every component module, reads the configuration interfaces each package declares
 * and resolves the two shapes the renderers use to inherit a contract instead of
 * restating it (`Pick<FieldConfig, "size" | …>` and `export type NativeXConfig =
 * XConfig`). The output answers one question per component: can a key be added to one
 * platform's section without a shared type noticing?
 *
 * This is the measurement behind Appendix A of `NATIVE-PARITY-REPORT.md`.
 *
 * Usage:
 *
 *   node scripts/audit/config-sections.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SKIP = new Set(["node_modules", "dist", ".turbo"]);

/**
 * Every source file below a directory, excluding tests and build output.
 *
 * @param directory - Absolute path to walk.
 * @param found - The files collected so far.
 * @returns Absolute paths of the files below it.
 */
function walk(directory, found = []) {
  for (const entry of readdirSync(directory)) {
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) {
      if (!SKIP.has(entry)) walk(full, found);
    } else if (/\.tsx?$/.test(entry) && !/\.test\./.test(entry)) {
      found.push(full);
    }
  }
  return found;
}

/**
 * The members declared at the top level of an interface body.
 *
 * @param body - The text between the interface's braces.
 * @returns The member names declared directly in it.
 */
function members(body) {
  const names = new Set();
  let depth = 0;
  let line = "";

  const flush = () => {
    const code = line
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "")
      .trim();
    const member = /^(?:readonly\s+)?([A-Za-z0-9_$]+)\??\s*:/.exec(code);
    if (member) names.add(member[1]);
    line = "";
  };

  for (const character of body) {
    if ("{([<".includes(character)) depth += 1;
    if ("})]>".includes(character)) depth -= 1;
    if (character === "\n" && depth === 0) flush();
    else line += character;
  }
  flush();

  return [...names];
}

/** The text of a braced block that starts at `start` (which must be the `{`). */
function block(source, start) {
  let depth = 0;
  for (let index = start; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    else if (source[index] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start + 1, index);
    }
  }
  return "";
}

const interfaces = new Map();
const aliases = new Map();
const picks = new Map();
const modules = { core: new Map(), web: new Map(), native: new Map() };

for (const pkg of ["core", "web", "native"]) {
  for (const file of walk(join(ROOT, "packages", pkg, "src"))) {
    const source = readFileSync(file, "utf8");

    for (const match of source.matchAll(
      /export\s+interface\s+([A-Za-z0-9_$]*Config[A-Za-z0-9_$]*)\s*(?:extends)?[^{]*\{/g,
    )) {
      const keys = members(block(source, match.index + match[0].length - 1));
      interfaces.set(match[1], keys);
      picks.set(match[1], picked(source));
    }

    for (const match of source.matchAll(
      /export\s+type\s+([A-Za-z0-9_$]*Config[A-Za-z0-9_$]*)\s*=\s*([^;]+);/g,
    )) {
      const right = match[2].replace(/\s+/g, " ").trim();
      aliases.set(match[1], right);
      picks.set(match[1], picked(right));
    }

    const parts = file.replaceAll("\\", "/").split("/");
    const index = parts.indexOf("components");
    if (index === -1) continue;

    const module = parts.slice(index + 1, -1).join("/");
    if (!module) continue;

    const entry = modules[pkg].get(module) ?? { names: [], keys: new Set() };
    for (const name of [
      ...source.matchAll(
        /export\s+interface\s+([A-Za-z0-9_$]*Config[A-Za-z0-9_$]*)/g,
      ),
      ...source.matchAll(
        /export\s+type\s+([A-Za-z0-9_$]*Config[A-Za-z0-9_$]*)/g,
      ),
    ]) {
      entry.names.push(name[1]);
      for (const key of resolveKeys(name[1])) entry.keys.add(key);
    }
    modules[pkg].set(module, entry);
  }
}

/** The quoted keys of a `Pick<X, "a" | "b">`. */
function picked(text) {
  const keys = new Set();
  for (const match of text.matchAll(
    /Pick<\s*[A-Za-z0-9_$.]*?\s*,\s*([^>]+)>/g,
  )) {
    for (const piece of match[1].split("|")) {
      const key = piece.trim().replace(/["'\s]/g, "");
      if (/^[A-Za-z0-9_$]+$/.test(key)) keys.add(key);
    }
  }
  return keys;
}

/**
 * The configuration keys a named type contributes.
 *
 * A `Pick` contributes only its picked keys; a bare reference contributes the whole
 * referenced contract; an inline object literal contributes its own members.
 *
 * @param name - The type name.
 * @param seen - The names already resolved, so a cycle cannot loop.
 * @returns The key names.
 */
function resolveKeys(name, seen = new Set()) {
  if (seen.has(name)) return [];
  seen.add(name);

  const keys = new Set(interfaces.get(name) ?? []);
  const right = aliases.get(name);
  const pick = picks.get(name) ?? new Set();

  if (right) {
    for (const key of pick) keys.add(key);

    const references = [
      ...right.matchAll(/[A-Za-z_$][A-Za-z0-9_$]*Config\b/g),
    ].map((match) => match[0]);

    if (pick.size === 0) {
      for (const reference of references) {
        for (const key of resolveKeys(reference, seen)) keys.add(key);
      }
    }

    const open = right.indexOf("{");
    const close = right.lastIndexOf("}");
    if (open !== -1 && close > open) {
      for (const key of members(right.slice(open + 1, close))) keys.add(key);
    }
  }

  return [...keys];
}

const names = [...modules.core.keys()].sort();

console.log(
  "For each component module: how many keys the shared contract states, how many only\n" +
    "the web renderer can set, how many only the native one adds, and whether the native\n" +
    "package declares a section at all. `native section: no` at this path does not always\n" +
    "mean absent — `table` and `data-table` are published by native's `row-list` module.\n",
);

console.log(
  "module".padEnd(30) +
    "core".padEnd(6) +
    "web-only".padEnd(10) +
    "native-only".padEnd(13) +
    "native section",
);
console.log("-".repeat(96));

const rows = [];
for (const name of names) {
  const core = new Set(modules.core.get(name)?.keys ?? []);
  const web = new Set([...core, ...(modules.web.get(name)?.keys ?? [])]);
  const device = modules.native.get(name);
  const native = new Set([...core, ...(device?.keys ?? [])]);

  const row = {
    name,
    core: [...core].sort(),
    webOnly: [...web].filter((key) => !native.has(key)).sort(),
    nativeOnly: [...native].filter((key) => !web.has(key)).sort(),
    hasSection: Boolean(device),
  };
  rows.push(row);

  console.log(
    name.padEnd(30) +
      String(row.core.length).padEnd(6) +
      String(row.webOnly.length).padEnd(10) +
      String(row.nativeOnly.length).padEnd(13) +
      (row.hasSection ? "yes" : "no (not at this path)"),
  );
}

console.log("\n\nDETAIL");
for (const row of rows) {
  console.log(`\n### ${row.name}`);
  console.log(
    `  core contract: ${row.core.join(", ") || "(none — not declared in core)"}`,
  );
  if (row.webOnly.length)
    console.log(`  WEB CAN SET, NATIVE CANNOT: ${row.webOnly.join(", ")}`);
  if (row.nativeOnly.length)
    console.log(`  native-only: ${row.nativeOnly.join(", ")}`);
}
