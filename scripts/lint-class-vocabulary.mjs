#!/usr/bin/env node
/**
 * The class-vocabulary lint.
 *
 * `NATIVE-IMPOSSIBLE-REPORT.md` §5.4 lists the class families a device compiles to nothing:
 * a hover state with no pointer, a media query with no viewport, a shadow with no box. A
 * shared component that writes one is not broken on the web and is silently unstyled on the
 * device, which is the defect no type system catches.
 *
 * Two checks, because the rule has two directions:
 *
 * 1. **Shared code** (`packages/ui`, and a shared folder of `apps/showcase` when one exists)
 *    must contain none of the families. This is the check the plan's exit criterion names,
 *    and it is what `pnpm lint:class-vocabulary` runs in CI from B21.
 * 2. **The moved dictionaries** are checked as a self-check: a *native* dictionary that
 *    contains a web-only variant is a C1/C2 mistake — a string that belongs to the web
 *    renderer was left behind. The reverse cannot be decided from text (an arbitrary value
 *    such as `min-h-[44px]` is valid on both), so it is stated rather than guessed.
 *
 * Only **string literals** are read, and only their class tokens: a dictionary's `sm:` is an
 * object key, not a breakpoint, and a test's `"md:"` is a string about the absence of one.
 * That distinction is why this script scans tokens rather than lines.
 *
 * Usage:
 *
 *   node scripts/lint-class-vocabulary.mjs
 *   node scripts/lint-class-vocabulary.mjs --verbose
 */

import { existsSync } from "node:fs";
import { promises as fs } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const VERBOSE = process.argv.includes("--verbose");

/** The files a shared component may live in, when the folder exists. */
const SHARED_ROOTS = [
  join(ROOT, "packages/ui/src"),
  join(ROOT, "apps/showcase/src/shared"),
].filter((path) => existsSync(path));

/** The platform dictionary the self-check reads. */
const NATIVE_STYLES = join(ROOT, "packages/native/src/styles");

/** The variant names a device does not have. */
const UNSUPPORTED_VARIANTS = new Set([
  "hover",
  "focus",
  "focus-visible",
  "focus-within",
  "group",
  "peer",
  "motion-safe",
  "motion-reduce",
  "dark",
  "print",
  "supports",
  "has",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
]);

/** A variant that names another variant, such as `group-hover`. */
const UNSUPPORTED_VARIANT_PREFIX = /^(?:group|peer)-/;

/** The bare utilities a device compiles to nothing. */
const UNSUPPORTED_UTILITY =
  /^(?:sr-only|not-sr-only)$|^(?:shadow|ring|outline|transition|duration|ease|animate|backdrop|blur|divide|space-x|space-y|select|cursor|touch|overscroll|scroll|aspect|grid-cols|grid-rows|col|row-span|float|order|z|inset|object|line-clamp)-/;

/** The extensions a class string is read from. */
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".css"]);

/**
 * Read every source file under a directory.
 *
 * @param directory - The directory to walk.
 * @returns The file paths, with test files left out of a dictionary scan by the caller.
 */
async function sourcesUnder(directory) {
  const found = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      found.push(...(await sourcesUnder(path)));
    } else if (SOURCE_EXTENSIONS.has(entry.name.slice(entry.name.lastIndexOf(".")))) {
      found.push(path);
    }
  }

  return found;
}

/**
 * Remove comments, keeping string literals intact.
 *
 * A prose apostrophe ("the platform's") is not the start of a string, and treating it as one
 * would swallow the declarations that follow it.
 *
 * @param source - The file's text.
 * @returns The text without comments.
 */
function withoutComments(source) {
  let result = "";
  let quote = null;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    if (quote) {
      result += character;
      if (character === "\\") {
        result += source[index + 1] ?? "";
        index += 1;
      } else if (character === quote) {
        quote = null;
      }
      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      result += character;
      continue;
    }

    if (character === "/" && source[index + 1] === "/") {
      while (index < source.length && source[index] !== "\n") index += 1;
      result += "\n";
      continue;
    }

    if (character === "/" && source[index + 1] === "*") {
      index += 2;
      while (
        index < source.length &&
        !(source[index] === "*" && source[index + 1] === "/")
      ) {
        index += 1;
      }
      index += 1;
      result += " ";
      continue;
    }

    result += character;
  }

  return result;
}

/**
 * The string literals in a source file.
 *
 * @param source - The file's text.
 * @returns The literals' contents.
 */
function stringsIn(source) {
  const strings = [];
  const text = withoutComments(source);
  let index = 0;

  while (index < text.length) {
    const character = text[index];

    if (character !== '"' && character !== "'" && character !== "`") {
      index += 1;
      continue;
    }

    const quote = character;
    let value = "";
    index += 1;

    while (index < text.length && text[index] !== quote) {
      const current = text[index];
      if (current === "\\") {
        value += text[index + 1] ?? "";
        index += 2;
        continue;
      }
      value += current;
      index += 1;
    }

    strings.push(value);
    index += 1;
  }

  return strings;
}

/**
 * The first offending token in a list of strings.
 *
 * @param strings - The literals to read.
 * @param variantsOnly - Whether to check only the variant families.
 * @returns The offending token, or `undefined`.
 */
function offendingToken(strings, variantsOnly) {
  for (const value of strings) {
    for (const token of value.split(/\s+/)) {
      if (!token) continue;

      const parts = token.split(":");
      const variants = parts.slice(0, -1);
      const utility = parts[parts.length - 1];

      for (const variant of variants) {
        if (
          UNSUPPORTED_VARIANTS.has(variant) ||
          UNSUPPORTED_VARIANT_PREFIX.test(variant)
        ) {
          return token;
        }
      }

      if (!variantsOnly && UNSUPPORTED_UTILITY.test(utility)) {
        return token;
      }
    }
  }

  return undefined;
}

/**
 * A file's first violation.
 *
 * @param file - The file to read.
 * @param variantsOnly - Whether to check only the variant families.
 * @returns The violation, or `undefined`.
 */
async function violationIn(file, variantsOnly) {
  const source = await fs.readFile(file, "utf8");
  const token = offendingToken(stringsIn(source), variantsOnly);

  return token === undefined
    ? undefined
    : { file: relative(ROOT, file), token };
}

const violations = [];
let sharedFiles = 0;

for (const root of SHARED_ROOTS) {
  for (const file of await sourcesUnder(root)) {
    sharedFiles += 1;
    const violation = await violationIn(file, false);
    if (violation) violations.push({ scope: "shared", ...violation });
  }
}

let dictionaries = 0;

if (existsSync(NATIVE_STYLES)) {
  for (const file of await sourcesUnder(NATIVE_STYLES)) {
    if (file.includes(".test.")) continue;
    dictionaries += 1;
    const violation = await violationIn(file, true);
    if (violation) violations.push({ scope: "dictionary", ...violation });
  }
}

if (violations.length > 0) {
  console.error(
    `Class vocabulary: ${violations.length} violation(s) — a class a device compiles to nothing.`,
  );
  for (const violation of violations) {
    console.error(`  ${violation.file}  ${violation.token}  (${violation.scope})`);
  }
  console.error(
    "\nReplace the family with the platform-neutral one, or move the string to the renderer that compiles it.",
  );
  process.exit(1);
}

if (VERBOSE) {
  console.log(
    `Class vocabulary: ${sharedFiles} shared file(s) and ${dictionaries} native dictionary file(s) scanned.`,
  );
}

console.log(
  `Class vocabulary: 0 violations in ${sharedFiles + dictionaries} file(s).`,
);
