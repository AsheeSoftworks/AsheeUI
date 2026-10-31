/**
 * Audit D — what `@asheeui/core` exports, who uses each export, and where it belongs.
 *
 * The renderers reach into core in three ways that a plain import scan misses: a direct
 * import, a re-export (`export { X } from "@asheeui/core"`) and a second-hand import from
 * a local module that re-exported it. Counting identifier presence per package catches all
 * three, and counting it for every consumer (both renderers, the umbrella, puck, the CLI,
 * the showcase and the docs) separates "a renderer uses this" from "only tooling does".
 *
 * This is the measurement behind CORE-MIGRATION-REPORT.md.
 *
 * Usage: node scripts/audit/core-usage.mjs [--json]
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..", "..");
const CORE = join(ROOT, "packages/core/src");

/** Every package that could read core: two renderers, the umbrella, and the consumers. */
const CONSUMERS = {
  web: [join(ROOT, "packages/web/src")],
  native: [join(ROOT, "packages/native/src")],
  umbrella: [join(ROOT, "packages/ui/src")],
  puck: [join(ROOT, "packages/puck/src")],
  cli: [join(ROOT, "packages/cli/src"), join(ROOT, "packages/cli/tests")],
  showcase: [join(ROOT, "apps/showcase/src")],
  docs: [join(ROOT, "apps/docs/src")],
};

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (["node_modules", "dist", ".turbo"].includes(entry)) continue;
      walk(full, out);
    } else if (/\.(tsx?|mjs|cjs|jsx?|md)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

/** Every identifier that appears in a set of files, as a Set for O(1) membership. */
function identifiers(dirs) {
  const found = new Set();
  for (const dir of dirs) {
    let files;
    try {
      files = walk(dir);
    } catch {
      continue;
    }
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      for (const match of text.matchAll(/[A-Za-z_$][A-Za-z0-9_$]*/g))
        found.add(match[0]);
    }
  }
  return found;
}

const DECL =
  /^export\s+(?:declare\s+)?(?:async\s+)?(const|let|var|function|class|interface|type|enum)\s+([A-Za-z0-9_$]+)/gm;
const LITERAL =
  /^export\s+const\s+([A-Za-z0-9_$]+)\s*(?::[^=]+)?=\s*(["'])([\s\S]*?)\2;?$/gm;

/** name -> { file, kind, literal } */
const exported = new Map();
for (const file of walk(CORE)) {
  if (/\.test\./.test(file)) continue;
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(DECL)) {
    exported.set(match[2], {
      file: relative(CORE, file).replaceAll("\\", "/"),
      kind: match[1],
      literal: undefined,
      bytes: source.length,
    });
  }
  for (const match of source.matchAll(LITERAL)) {
    const entry = exported.get(match[1]);
    if (entry) entry.literal = match[3];
  }
}

const found = {};
for (const [name, dirs] of Object.entries(CONSUMERS))
  found[name] = identifiers(dirs);

/** The families of class string that only one platform can compile. */
const WEB_ONLY =
  /(^|\s)(hover:|focus:|focus-visible:|focus-within:|group-|peer-|motion-|sr-only|not-sr-only|shadow|shadow-|ring-|outline-|transition|animate-|backdrop-|blur-|divide-|select-|cursor-|z-|sticky|w-screen|h-screen|md:|lg:|xl:|2xl:|sm:)/;
const NATIVE_ONLY = /(active:|min-h-\[|NATIVE_)/;

/** Which family an export belongs to. */
function familyOf(name, entry) {
  const text = entry.literal ?? "";
  if (/^NATIVE_/.test(name)) return "native-class";
  if (entry.kind === "const" && text) {
    if (NATIVE_ONLY.test(text)) return "native-class";
    if (WEB_ONLY.test(text)) return "web-class";
    if (/\s/.test(text.trim())) return "portable-class";
  }
  if (/_CLASS$/.test(name) || /_CLASS_/.test(name)) return "portable-class";
  if (/^FALLBACK_/.test(name)) return "fallback";
  if (/Config$/.test(name))
    return entry.kind === "interface" || entry.kind === "type"
      ? "config-type"
      : "config-value";
  if (entry.kind === "interface" || entry.kind === "type") return "type";
  if (entry.kind === "function") return "function";
  if (entry.kind === "enum") return "enum";
  return "constant";
}

const rows = [];
for (const [name, entry] of exported) {
  const usedBy = Object.entries(found)
    .filter(([, set]) => set.has(name))
    .map(([key]) => key);

  const web = usedBy.includes("web");
  const native = usedBy.includes("native");
  const tooling = usedBy.filter(
    (key) => !["web", "native", "umbrella"].includes(key),
  );

  let verdict;
  if (web && native) verdict = "shared";
  else if (web) verdict = "web-only";
  else if (native) verdict = "native-only";
  else if (tooling.length) verdict = "tooling-only";
  else verdict = "unused";

  rows.push({
    name,
    ...entry,
    family: familyOf(name, entry),
    verdict,
    web,
    native,
    tooling,
  });
}

// ─── report ──────────────────────────────────────────────────────────────────

/**
 * Count occurrences of each value in a list.
 *
 * @param list - The values to count.
 * @returns A map from each value to how many times it appears.
 */
function tally(list) {
  const counts = new Map();
  for (const value of list) counts.set(value, (counts.get(value) ?? 0) + 1);
  return Object.fromEntries(counts);
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(rows, null, 1));
  process.exit(0);
}

console.log(`core exports: ${rows.length}`);
console.log(`by verdict: ${JSON.stringify(tally(rows.map((r) => r.verdict)))}`);
console.log(`by family:  ${JSON.stringify(tally(rows.map((r) => r.family)))}`);

const byFile = new Map();
for (const row of rows) {
  const entry = byFile.get(row.file) ?? {
    file: row.file,
    bytes: row.bytes,
    names: [],
    counts: {},
  };
  entry.names.push(row);
  entry.counts[row.verdict] = (entry.counts[row.verdict] ?? 0) + 1;
  byFile.set(row.file, entry);
}

const files = [...byFile.values()].sort((a, b) => b.bytes - a.bytes);

const pick = (predicate) =>
  files
    .filter((entry) => predicate(entry.counts, entry.names))
    .map((entry) => entry.file);

console.log("\n### files used by exactly one renderer (move candidates)");
for (const file of pick(
  (counts) =>
    (counts["web-only"] ?? 0) > 0 &&
    !(counts["native-only"] ?? 0) &&
    !(counts.shared ?? 0),
)) {
  console.log(`  web   ${file}`);
}
for (const file of pick(
  (counts) =>
    (counts["native-only"] ?? 0) > 0 &&
    !(counts["web-only"] ?? 0) &&
    !(counts.shared ?? 0),
)) {
  console.log(`  nat   ${file}`);
}

console.log(
  "\n### files split across both renderers (mixed; needs a per-symbol split)",
);
for (const entry of files) {
  const { counts } = entry;
  if (
    (counts.shared ?? 0) > 0 &&
    ((counts["web-only"] ?? 0) > 0 || (counts["native-only"] ?? 0) > 0)
  ) {
    console.log(
      `  ${entry.file}  shared=${counts.shared} web=${counts["web-only"] ?? 0} native=${counts["native-only"] ?? 0}`,
    );
  }
}

console.log("\n### files everything reaches (stay in core)");
for (const entry of files) {
  const { counts } = entry;
  const total = entry.names.length;
  if ((counts.shared ?? 0) >= Math.ceil(total * 0.75))
    console.log(`  ${entry.file}  ${counts.shared}/${total}`);
}

console.log("\n### exports no consumer reads (delete candidates)");
for (const row of rows.filter((r) => r.verdict === "unused"))
  console.log(`  ${row.file} :: ${row.name}`);

console.log("\n### class constants each renderer uses alone");
for (const row of rows.filter(
  (r) => r.verdict === "web-only" && r.family.includes("class"),
))
  console.log(`  web  ${row.name}  (${row.file})`);
for (const row of rows.filter(
  (r) => r.verdict === "native-only" && r.family.includes("class"),
))
  console.log(`  nat  ${row.name}  (${row.file})`);

console.log("\n### class constants BOTH renderers use (portable vocabulary)");
for (const row of rows.filter(
  (r) => r.verdict === "shared" && r.family.includes("class"),
))
  console.log(`  ${row.name}  (${row.file})`);

console.log("\n### tooling-only exports (CLI, docs, puck, scripts)");
for (const row of rows.filter((r) => r.verdict === "tooling-only"))
  console.log(`  ${row.name}  (${row.file})  <- ${row.tooling.join(", ")}`);

console.log("\n### per-file table");
for (const entry of files) {
  const c = entry.counts;
  console.log(
    `${entry.file.padEnd(64)} bytes=${String(entry.bytes).padStart(6)} n=${String(entry.names.length).padStart(3)} shared=${String(c.shared ?? 0).padStart(3)} web=${String(c["web-only"] ?? 0).padStart(3)} native=${String(c["native-only"] ?? 0).padStart(3)} tool=${String(c["tooling-only"] ?? 0).padStart(2)} unused=${String(c.unused ?? 0).padStart(3)}`,
  );
}
