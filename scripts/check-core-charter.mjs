#!/usr/bin/env node
/**
 * The core charter check: `@asheeui/core` is the contract, not the engine.
 *
 * The shrink (C1–C4) moved 700+ names out of core and deleted ten nobody read. This guard is the
 * ratchet that keeps the next component from undoing it, and it asserts the four things
 * `CORE-MIGRATION-REPORT.md` §11 says the charter is:
 *
 * 1. **No class string.** A class string states a decision about pixels that only one renderer
 *    compiles, so it belongs to that renderer. Core may hold rules, tokens, values and prose; it may
 *    not hold a Tailwind utility, whole or in a map.
 * 2. **No dependency.** Core declares `dependencies: {}`. A styling engine (or anything else) reaching
 *    into core would make the contract unshareable.
 * 3. **No renderer, DOM or styling-engine import.** Core may not import `react-native`, `react-dom`,
 *    `clsx`, `tailwind-merge` or a sibling package, and it may import `react` only as `import type`
 *    (a type erased at build time is not a runtime dependency — the config files state `ReactNode`,
 *    which is the correct type for a slot and not a React runtime).
 * 4. **No unread export.** Every export core publishes is read by a renderer, the umbrella, Puck, the
 *    CLI, the docs, the showcase, a script, or a test — or it is the published vocabulary
 *    `CORE-MIGRATION-REPORT.md` §7.1 lists, which a consumer reads as documentation rather than as an
 *    import. An export nobody reads is either a leftover to delete or data to move to `./dev`.
 *
 * The `./dev` subpath is deliberately not a fifth assertion: what it holds (the compatibility matrix)
 * is read by two scripts, so it satisfies rule 4 where it lives, and where a name *lives* is a
 * packaging decision the two guards below do not make.
 *
 * Usage:
 *
 *   node scripts/check-core-charter.mjs            # verify, exit non-zero on a breach
 *   node scripts/check-core-charter.mjs --verbose # name what each assertion measured
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CORE = join(ROOT, "packages/core/src");
const CORE_MANIFEST = join(ROOT, "packages/core/package.json");

/**
 * Everything that may read a core export.
 *
 * The two renderers, the umbrella that routes between them, the packages built on all three, and the
 * two applications that ship a page. `scripts` is here because a guard that reads core's source as
 * data is a reader — the parity and umbrella guards read the matrix that way — and because a name
 * only a guard reads is exactly what `./dev` exists for.
 */
const READERS = {
  web: [join(ROOT, "packages/web/src")],
  native: [join(ROOT, "packages/native/src")],
  umbrella: [join(ROOT, "packages/ui/src")],
  puck: [join(ROOT, "packages/puck/src")],
  cli: [join(ROOT, "packages/cli/src"), join(ROOT, "packages/cli/tests")],
  showcase: [join(ROOT, "apps/showcase/src")],
  docs: [join(ROOT, "apps/docs/src"), join(ROOT, "apps/docs/content")],
  scripts: [join(ROOT, "scripts")],
};

/**
 * The vocabulary `CORE-MIGRATION-REPORT.md` §7.1 keeps as the framework's published surface: the
 * token scales, the config vocabulary and the rules a consumer reads as documentation.
 *
 * It is stated here rather than read from the report because a guard that parses the specification it
 * enforces can be satisfied by editing prose. Four §7.1 entries are absent on purpose, because the
 * shrink moved them out of core and an allow-list that names what core no longer publishes is a lie:
 * `colorChannels` (native, C1), `SPACE_BLOCK_CLASS` (both renderers' `portable.ts`, C2),
 * `establishesStackingContext` and `resolveFloatingZIndex` (web's `utils/stacking.ts`, C2). The
 * guard prints any allow-list entry core stops exporting, so this list cannot rot silently.
 */
const PUBLISHED_VOCABULARY = new Set([
  "AnnouncementRole",
  "COLOR_ROLE",
  "ColorScheme",
  "ColumnSortDirection",
  "ComponentConfigRegistry",
  "ComponentSupport",
  "ComponentsConfig",
  "ConfigIssue",
  "ConfigIssueSeverity",
  "DeepPartial",
  "ELEVATION_LEVEL",
  "ExternalColorConfig",
  "FONT_SIZE_STEP",
  "FONT_WEIGHT_STEP",
  "KnownThemeName",
  "MIN_TOUCH_TARGET",
  "MessageVariant",
  "PLATFORM_SUPPORT_LABEL",
  "PaletteRole",
  "PaletteVariable",
  "PlatformSupport",
  "RADIUS_STEP",
  "RowCountLabelValues",
  "SIZE",
  "SPACING_STEP",
  "SectionBlockHeadingElement",
  "SectionBlockOptions",
  "ThemedContract",
  "VARIANT",
  "findComponentSupport",
  "validateConfig",
]);

/**
 * The families a class list is built from.
 *
 * A family counts only when it carries a value (`text-sm`, `p-2`, `hover:opacity-90`), because the
 * bare word is often a legitimate value: core publishes `"border"` as a palette role and `"grid"` as
 * a matrix module name, and a check that read those as classes would be a check nobody trusts.
 *
 * `row` and `col` are absent for the same reason: `row-list` is a matrix module name, and the two
 * grid-placement utilities that would need them are not a class family core is at risk of holding.
 */
const CLASS_FAMILIES = [
  "bg",
  "text",
  "border",
  "p",
  "px",
  "py",
  "pt",
  "pb",
  "pl",
  "pr",
  "ps",
  "pe",
  "m",
  "mx",
  "my",
  "mt",
  "mb",
  "ml",
  "mr",
  "ms",
  "me",
  "gap",
  "gap-x",
  "gap-y",
  "rounded",
  "size",
  "w",
  "h",
  "min-w",
  "min-h",
  "max-w",
  "max-h",
  "items",
  "justify",
  "content",
  "self",
  "font",
  "leading",
  "tracking",
  "overflow",
  "cursor",
  "ring",
  "shadow",
  "z",
  "inset",
  "top",
  "bottom",
  "left",
  "right",
  "space-x",
  "space-y",
  "divide",
  "object",
  "transition",
  "duration",
  "ease",
  "animate",
  "backdrop",
  "blur",
  "shrink",
  "grow",
  "basis",
  "translate",
  "rotate",
  "scale",
  "from",
  "via",
  "to",
  "fill",
  "stroke",
  "opacity",
  "order",
  "aspect",
  "snap",
  "outline",
  "decoration",
  "indent",
];

/** A family with a value after its hyphen, or any variant prefix before one: `hover:` `sm:`. */
const CLASS_FAMILY = new RegExp(
  `(?:^|\\s)(?:(?:[a-z-]+:)+)?(?:${CLASS_FAMILIES.join("|")})-[^\\s]`,
);

/** The utility words that are a class on their own and cannot be mistaken for a value. */
const BARE_UTILITIES = new Set([
  "antialiased",
  "capitalize",
  "italic",
  "line-through",
  "lowercase",
  "pointer-events-none",
  "select-none",
  "sr-only",
  "truncate",
  "underline",
  "uppercase",
]);

/**
 * A literal that is nothing but utility-shaped words: the shape a class list has and prose does not.
 *
 * Two or more words, every one lowercase and utility-shaped, and at least one carrying the hyphen or
 * the variant colon a utility carries. Prose is excluded by that last clause — `"not applicable"` is
 * two lowercase words and is not a class list.
 */
const UTILITY_SHAPE =
  /^[a-z][a-z0-9:.[\]%/!-]*(?:\s+[a-z][a-z0-9:.[\]%/!-]*)+$/;

/** The specifiers core may not reach, in a value import or a type import. */
const FORBIDDEN_SPECIFIERS = [
  "react-native",
  "react-dom",
  "clsx",
  "tailwind-merge",
  "@asheeui/web",
  "@asheeui/native",
  "@asheeui/puck",
  "@asheeui/cli",
];

/** The one specifier core may reach as a type: the config slots are `ReactNode`. */
const TYPE_ONLY_SPECIFIER = "react";

const EXCLUDE = new Set(["node_modules", "dist", ".turbo", "build"]);

/**
 * Every source file below a directory, as absolute paths.
 *
 * A directory that is not there is not an error: `apps/docs` is a separate repository, excluded from
 * this workspace (`.gitignore`), so a fresh CI checkout has no such path — and a reader that does not
 * exist simply reads nothing.
 */
function walk(directory, extensions = [".ts", ".tsx"]) {
  const files = [];

  let entries;
  try {
    entries = readdirSync(directory);
  } catch {
    return files;
  }

  for (const entry of entries) {
    if (EXCLUDE.has(entry)) continue;
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) files.push(...walk(full, extensions));
    else if (extensions.some((extension) => entry.endsWith(extension)))
      files.push(full);
  }

  return files;
}

/**
 * Remove comments, keeping strings and template literals intact.
 *
 * Every check below reads code, and core's documentation is full of class strings in `@example`
 * blocks — `resolveClassKey`'s example states `{ sm: 'text-sm' }`. A check that scanned comments
 * would report core's own prose as a breach, so the scanner has to know where code begins.
 */
function code(source) {
  let out = "";
  let quote = null;

  for (let i = 0; i < source.length; i += 1) {
    const character = source[i];

    if (quote) {
      out += character;
      if (character === "\\") {
        out += source[i + 1] ?? "";
        i += 1;
      } else if (character === quote) quote = null;
      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      out += character;
      continue;
    }

    if (character === "/" && source[i + 1] === "*") {
      const end = source.indexOf("*/", i + 2);
      i = end === -1 ? source.length : end + 1;
      continue;
    }

    if (character === "/" && source[i + 1] === "/") {
      const end = source.indexOf("\n", i);
      i = end === -1 ? source.length : end;
      out += "\n";
      continue;
    }

    out += character;
  }

  return out;
}

/** The line a character offset falls on, 1-based, for a finding a reader can open. */
function lineOf(source, offset) {
  let line = 1;
  for (let i = 0; i < offset && i < source.length; i += 1)
    if (source[i] === "\n") line += 1;
  return line;
}

/**
 * One exported constant: its name, where it starts, and the text of its initializer.
 *
 * The initializer is read with a depth counter rather than by looking for `;`, because a map's
 * initializer ends at the brace that closes it and a nested object would otherwise cut the scan
 * short — the mistake that deleted the rest of a file twice during this migration.
 */
function exportedConstants(source) {
  const constants = [];
  const declaration = /^export\s+const\s+([A-Za-z0-9_$]+)\s*(?::[^=]+)?=/gm;

  for (const match of source.matchAll(declaration)) {
    const start = match.index + match[0].length;
    let depth = 0;
    let quote = null;
    let end = start;

    for (let i = start; i < source.length; i += 1) {
      const character = source[i];

      if (quote) {
        if (character === "\\") i += 1;
        else if (character === quote) quote = null;
        continue;
      }

      if (character === '"' || character === "'" || character === "`") {
        quote = character;
        continue;
      }

      if ("([{".includes(character)) depth += 1;
      else if (")]}".includes(character)) depth -= 1;
      else if (character === ";" && depth === 0) {
        end = i;
        break;
      }
      end = i + 1;
    }

    constants.push({
      name: match[1],
      start: match.index,
      initializer: source.slice(start, end),
    });
  }

  return constants;
}

/** Every string literal in a piece of code, with the offset it starts at. */
function stringLiterals(source, offset) {
  const literals = [];
  let quote = null;
  let start = 0;

  for (let i = 0; i < source.length; i += 1) {
    const character = source[i];

    if (quote) {
      if (character === "\\") i += 1;
      else if (character === quote) {
        literals.push({ value: source.slice(start, i), at: offset + start });
        quote = null;
      }
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      start = i + 1;
    }
  }

  return literals;
}

/** Every imported specifier in a file, with whether the import is type-only. */
function imports(source) {
  const found = [];
  const statement =
    /^\s*import\s+(type\s+)?(?:[^"';]*?\s+from\s+)?["']([^"']+)["']/gm;

  for (const match of source.matchAll(statement)) {
    found.push({
      typeOnly: Boolean(match[1]),
      specifier: match[2],
      line: lineOf(source, match.index),
    });
  }

  return found;
}

/** The two findings a class string can produce, or none. */
function classStringFinding(literal) {
  const value = literal.value.trim();
  if (value.length === 0) return undefined;

  const family = CLASS_FAMILY.exec(value);
  if (family) return `states the utility family \`${family[0].trim()}\``;

  if (BARE_UTILITIES.has(value))
    return "states a utility that is a class on its own";

  if (UTILITY_SHAPE.test(value) && /[-:]/.test(value))
    return "is nothing but utility-shaped words, which is a class list";

  return undefined;
}

const findings = [];
const notes = [];

/** 1. No class string. */
function checkClassStrings() {
  const files = walk(CORE).filter((file) => !/\.test\./.test(file));

  for (const file of files) {
    const source = code(readFileSync(file, "utf8"));

    for (const constant of exportedConstants(source)) {
      for (const literal of stringLiterals(
        constant.initializer,
        constant.start,
      )) {
        const why = classStringFinding(literal);
        if (why === undefined) continue;
        findings.push({
          assertion: 1,
          title: "a class string is published",
          detail: `${relative(ROOT, file)}:${lineOf(source, literal.at)} \`${constant.name}\` ${why}: "${literal.value}"`,
        });
      }
    }
  }

  notes.push(
    `assertion 1 read ${files.length} files and their exported constants`,
  );
}

/** 2. No dependency. */
function checkDependencies() {
  let manifest;

  try {
    manifest = JSON.parse(readFileSync(CORE_MANIFEST, "utf8"));
  } catch (error) {
    findings.push({
      assertion: 2,
      title: "core's manifest is unreadable, so the rule cannot be checked",
      detail: `packages/core/package.json: ${error instanceof Error ? error.message : String(error)}`,
    });
    return;
  }

  const dependencies = manifest.dependencies ?? {};
  const names = Object.keys(dependencies);

  if (names.length > 0)
    findings.push({
      assertion: 2,
      title: "core declares dependencies",
      detail: `packages/core/package.json dependencies: ${names.join(", ")}`,
    });

  notes.push(
    `assertion 2 read packages/core/package.json: dependencies is ${names.length === 0 ? "empty" : `${names.length} names`}`,
  );
}

/** 3. No renderer, DOM or styling-engine import. */
function checkImports() {
  const files = walk(CORE);

  for (const file of files) {
    const source = code(readFileSync(file, "utf8"));

    for (const statement of imports(source)) {
      const { specifier, typeOnly, line } = statement;

      if (
        FORBIDDEN_SPECIFIERS.includes(specifier) ||
        specifier.startsWith("@asheeui/")
      )
        findings.push({
          assertion: 3,
          title: "core imports a renderer or a styling engine",
          detail: `${relative(ROOT, file)}:${line} imports "${specifier}"${typeOnly ? " (as a type)" : ""}`,
        });
      else if (
        specifier === TYPE_ONLY_SPECIFIER ||
        specifier.startsWith(`${TYPE_ONLY_SPECIFIER}/`)
      ) {
        if (!typeOnly)
          findings.push({
            assertion: 3,
            title: "core imports the React runtime",
            detail: `${relative(ROOT, file)}:${line} imports "${specifier}" as a value; only \`import type\` is allowed, because a config slot is typed \`ReactNode\` and nothing here renders`,
          });
      }
    }
  }

  notes.push(
    `assertion 3 read ${files.length} files and their import statements`,
  );
}

/** 4. No unread export. */
function checkUnreadExports() {
  const coreFiles = walk(CORE);
  const declared = new Map();

  for (const file of coreFiles) {
    if (/\.test\./.test(file)) continue;
    const source = code(readFileSync(file, "utf8"));
    const declaration =
      /^export\s+(?:declare\s+)?(?:async\s+)?(?:const|let|var|function|class|interface|type|enum)\s+([A-Za-z0-9_$]+)/gm;

    for (const match of source.matchAll(declaration))
      declared.set(match[1], relative(ROOT, file));
  }

  const readers = new Map();

  for (const directories of Object.values(READERS)) {
    for (const directory of directories) {
      for (const file of walk(directory, [
        ".ts",
        ".tsx",
        ".mjs",
        ".cjs",
        ".md",
      ])) {
        const text = readFileSync(file, "utf8");
        const names = readers.get(file) ?? new Set();
        for (const match of text.matchAll(/[A-Za-z_$][A-Za-z0-9_$]*/g))
          names.add(match[0]);
        readers.set(file, names);
      }
    }
  }

  // A test is a reader: core's own suite asserts the values a consumer reads as documentation.
  const coreTests = new Map();
  for (const file of coreFiles) {
    if (!/\.test\./.test(file)) continue;
    const names = new Set();
    for (const match of code(readFileSync(file, "utf8")).matchAll(
      /[A-Za-z_$][A-Za-z0-9_$]*/g,
    ))
      names.add(match[0]);
    coreTests.set(file, names);
  }

  const unread = [];
  const allowed = [];

  for (const [name, file] of declared) {
    if (PUBLISHED_VOCABULARY.has(name)) {
      allowed.push(name);
      continue;
    }

    let read = false;
    for (const names of readers.values())
      if (names.has(name)) {
        read = true;
        break;
      }
    if (!read)
      for (const names of coreTests.values())
        if (names.has(name)) {
          read = true;
          break;
        }

    if (!read) unread.push({ name, file });
  }

  for (const { name, file } of unread)
    findings.push({
      assertion: 4,
      title: "an export nobody reads",
      detail: `${file} exports \`${name}\`, which no renderer, package, script or test reads; delete it or move it to @asheeui/core/dev`,
    });

  const vocabulary = [...PUBLISHED_VOCABULARY].filter((name) =>
    declared.has(name),
  );
  const stale = [...PUBLISHED_VOCABULARY].filter((name) => !declared.has(name));

  notes.push(
    `assertion 4 read ${declared.size} exports against ${readers.size} reader files and ${coreTests.size} test files; ${allowed.length} are the recorded vocabulary (${vocabulary.length} of them still published)`,
  );

  if (stale.length > 0)
    notes.push(
      `the allow-list names what core no longer exports — prune when convenient: ${stale.join(", ")}`,
    );
}

checkClassStrings();
checkDependencies();
checkImports();
checkUnreadExports();

const verbose = process.argv.includes("--verbose");
const ASSERTIONS = [
  "no class string is published",
  "core declares no dependency",
  "core imports no renderer, DOM or styling engine",
  "every export is read, or is the recorded vocabulary",
];

if (findings.length > 0) {
  for (const finding of findings)
    console.error(
      `\n  ✗ ${finding.assertion}. ${finding.title}\n    ${finding.detail}`,
    );

  console.error(
    `\nCore charter: ${findings.length} breach(es) of ${ASSERTIONS.length} assertions.`,
  );
  process.exit(1);
}

if (verbose) for (const note of notes) console.log(`  · ${note}`);

console.log(
  `Core charter: 4 of 4 assertions pass — no class string, no dependency, no renderer import, and every export has a reader.`,
);
