#!/usr/bin/env node
/**
 * Audit C — which Tailwind feature families each renderer's class strings use.
 *
 * A class name is the same prop on both platforms and not the same language. This
 * counts, per package, how many files contain a class-like string literal that uses a
 * given feature family — `hover:`, `focus-visible:`, responsive prefixes, `animate-`,
 * `shadow-*` and so on — which is what makes the difference measurable instead of
 * anecdotal.
 *
 * "Counted once per file" is deliberate: the question is whether a family exists in a
 * package's vocabulary, not how often it is spelled.
 *
 * This is the measurement behind §F7 and Appendix B of `NATIVE-PARITY-REPORT.md`.
 *
 * Usage:
 *
 *   node scripts/audit/class-vocabulary.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SKIP = new Set(["node_modules", "dist", ".turbo"]);

/** A string literal that contains at least one Tailwind-ish utility. */
const CLASS_LIKE =
  /["'`]([^"'`\n]*?(?:^|\s)(?:[a-z-]+:)?(?:bg|text|border|flex|items|justify|gap|p|m|px|py|w|h|size|rounded|shadow|ring|grid|col|row|absolute|relative|overflow|opacity|font|leading|tracking|truncate|sr-only|animate|transition|hover|focus|active|disabled)\b[^"'`\n]*?)["'`]/g;

/** The feature families worth telling apart. */
const FAMILIES = {
  "hover:": /hover:/,
  "focus:": /(?<!-)\bfocus:/,
  "focus-visible:": /focus-visible:/,
  "focus-within:": /focus-within:/,
  "active:": /active:/,
  "group-*": /group-(?:hover|focus|active|aria|data)/,
  "peer-*": /peer-/,
  "responsive sm:/md:/lg:/xl:/2xl:": /(^|\s)(sm|md|lg|xl|2xl):/,
  "dark:": /(?<!-)\bdark:/,
  "motion-safe: / motion-reduce:": /motion-(safe|reduce):/,
  "print:": /print:/,
  "aria-*/data-* variants": /(aria|data)-\[\w/,
  "sr-only": /sr-only/,
  "shadow-*": /\bshadow(-|\b)/,
  "ring-*": /\bring-/,
  "transition-*": /\btransition(-|\b)/,
  "animate-*": /\banimate-/,
  "backdrop-*": /\bbackdrop-/,
  "blur-*": /\bblur(-|\b)/,
  "aspect-*": /\baspect-/,
  "space-x/y-*": /\bspace-[xy]-/,
  "divide-*": /\bdivide-/,
  "outline-*": /\boutline-/,
  "underline/decoration": /\b(underline|decoration-|underline-offset)/,
  "scroll-*": /\bscroll-(m|p|snap|smooth|behavior)/,
  "overscroll-*": /\boverscroll-/,
  "touch-*": /\btouch-/,
  "select-*": /\bselect-(none|text)/,
  "supports-*/has-*": /(supports|has)-\[/,
  "arbitrary values [..]": /\[[^\]]+\]/,
};

const PACKAGES = [
  ["web/src", join(ROOT, "packages/web/src")],
  ["core/src", join(ROOT, "packages/core/src")],
  ["native/src", join(ROOT, "packages/native/src")],
];

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

const results = [];

for (const [label, directory] of PACKAGES) {
  const files = walk(directory);
  const counts = Object.fromEntries(
    Object.keys(FAMILIES).map((name) => [name, 0]),
  );
  const sample = {};

  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const strings = [...text.matchAll(CLASS_LIKE)].map((match) => match[1]);

    for (const [name, pattern] of Object.entries(FAMILIES)) {
      const hit = strings.find((value) => pattern.test(value));
      if (!hit) continue;
      counts[name] += 1;
      sample[name] ??=
        `${file.replace(ROOT, "").replaceAll("\\", "/")}: ${hit.trim().slice(0, 80)}`;
    }
  }

  results.push({ label, files: files.length, counts, sample });
}

const width = Math.max(...Object.keys(FAMILIES).map((name) => name.length)) + 2;

console.log(
  "Feature family".padEnd(width) +
    results.map((result) => result.label.padStart(12)).join(""),
);
console.log("-".repeat(width + results.length * 12));

for (const name of Object.keys(FAMILIES)) {
  console.log(
    name.padEnd(width) +
      results
        .map((result) => String(result.counts[name]).padStart(12))
        .join(""),
  );
}

console.log(
  `\nFiles scanned: ${results.map((result) => `${result.label} ${result.files}`).join(", ")}`,
);
console.log(
  "\nA zero in the native column means the family does not exist in that renderer's\n" +
    "vocabulary at all — which is correct for a touch surface, and is exactly why a\n" +
    "consumer's `className` cannot be copied from one platform to the other.",
);

if (process.argv.includes("--samples")) {
  for (const result of results) {
    console.log(`\n${result.label}`);
    for (const [name, where] of Object.entries(result.sample)) {
      console.log(`  ${name.padEnd(width)} ${where}`);
    }
  }
}
