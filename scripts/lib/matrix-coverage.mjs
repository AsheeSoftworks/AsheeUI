/**
 * The matrix's coverage check, as a function.
 *
 * `scripts/check-native-parity.mjs` and `packages/core/src/matrix.test.ts` both call this,
 * so the guard CI runs and the suite cannot disagree about what "the matrix covers every
 * public component" means.
 *
 * The check is the one `NATIVE-PARITY-REPORT.md` §F13 describes: parse the web package's
 * entry points — `"."` and `"./section-kit"`, which is a subpath and is not re-exported
 * from `index.ts` — and fail when a public component export has no matrix entry. That is
 * what makes a new component's platform support a decision instead of an omission.
 *
 * ## What counts as a public component
 *
 * The matrix classifies *components*, not every export. A public component is a **value**
 * export (a function, constant or class) whose name:
 *
 * - starts with an uppercase letter — a helper (`cn`), a hook (`useTheme`) or a controller
 *   (`themeController`) is not a component;
 * - contains no underscore — a `*_CLASS`, `FALLBACK_*` or `THEME_STORAGE_KEY` is a string or
 *   a constant, not a component;
 * - does not end in `Context` — a React context object is the hook's plumbing.
 *
 * Some components are published under more than one name, or are parts of a bigger module:
 * `Text` is `Typography`, `HStack` is `Stack`, `PageHeader` is part of `Page`. Those are
 * not missing matrix entries; they are aliases. The alias map in
 * `scripts/matrix-coverage.json` states each one and where it points, and this check fails
 * when an alias points at a module the matrix does not have or names an export the package
 * no longer publishes. The map may only grow for a real alias, never to silence a new
 * component.
 *
 * A component published on a subpath (the section kit) is classified like any other: the
 * matrix's `module` is the inventory unit and its `name` is what a consumer imports.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const FILE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

/** Where the matrix's array literal begins in its source file. */
const MATRIX_ARRAY = /COMPONENT_SUPPORT[^=]*=\s*\[([\s\S]*?)\n\];/;

/** A declaration that publishes one name, with its kind. */
const DECLARATION =
  /^export\s+(?:declare\s+)?(?:async\s+)?(function|const|let|var|class|interface|type|enum)\s+([A-Za-z0-9_$]+)/gm;

/** A named export list, which may be type-only at the statement or per name. */
const NAMED_EXPORT = /^export\s+(type\s+)?\{([^}]*)\}/gm;

/** A star re-export, which is followed into the module it names. */
const STAR_EXPORT = /^export\s+\*\s+from\s+"([^"]+)"/gm;

/** The value declaration kinds; everything else declares a type. */
const VALUE_KINDS = new Set(["function", "const", "let", "var", "class"]);

/**
 * Whether a published name is a public component rather than a helper or a constant.
 *
 * @param name - The published name.
 * @returns True when the name is a component a consumer renders.
 */
function isPublicComponent(name) {
  return (
    /^[A-Z]/.test(name) && !name.includes("_") && !/Context$/.test(name)
  );
}

/**
 * Evaluate the matrix against the web package's entry points.
 *
 * @param options - The repository root; defaults to the working directory.
 * @returns The matrix names, the public components found, and the disagreements.
 * @throws When the matrix cannot be read, because an empty matrix would make the coverage
 * check vacuously true.
 */
export function evaluateMatrixCoverage({ root = process.cwd() } = {}) {
  const ROOT = resolve(root);
  const MATRIX_FILE = join(ROOT, "packages/core/src/matrix.ts");
  const ALIAS_FILE = join(ROOT, "scripts/matrix-coverage.json");

  /**
   * The web package's public entries.
   *
   * `./section-kit` is a subpath, so it is named explicitly: the components that live
   * there are public even though `index.ts` does not re-export them.
   */
  const WEB_ENTRIES = [
    join(ROOT, "packages/web/src/index.ts"),
    join(ROOT, "packages/web/src/components/layouts/section-kit/index.ts"),
  ];

  /**
   * Resolve a relative re-export to the file it names.
   *
   * @param fromFile - The file the statement was read from.
   * @param specifier - The module specifier.
   * @returns The file's path, or undefined when it resolves outside the package.
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

  /**
   * Collect the value exports of one module, following its re-exports.
   *
   * A brace list states a name's kind inline (`export { type Foo }`), so the modifier is
   * read before the alias: a `type` export is not a component however it is declared.
   *
   * @param file - The file to read.
   * @param values - The set the value exports are collected into.
   * @param visited - The files already read, so that a cycle cannot loop.
   */
  function collectValues(file, values, visited) {
    if (visited.has(file)) return;
    visited.add(file);

    const source = readFileSync(file, "utf8");

    for (const match of source.matchAll(DECLARATION)) {
      if (VALUE_KINDS.has(match[1])) values.add(match[2]);
    }

    for (const match of source.matchAll(NAMED_EXPORT)) {
      const statementIsType = Boolean(match[1]);
      for (const raw of match[2].split(",")) {
        let piece = raw.trim();
        if (!piece) continue;
        const pieceIsType = /^type\s/.test(piece);
        piece = piece.replace(/^type\s+/, "").replace(/^typeof\s+/, "");
        const [local, exported] = piece.split(/\s+as\s+/);
        const name = (exported ?? local)?.trim();
        if (name && !statementIsType && !pieceIsType) values.add(name);
      }
    }

    for (const match of source.matchAll(STAR_EXPORT)) {
      const target = resolveModule(file, match[1]);
      if (target) collectValues(target, values, visited);
    }
  }

  const matrixSource = readFileSync(MATRIX_FILE, "utf8");
  const array = matrixSource.match(MATRIX_ARRAY)?.[1];
  if (!array) {
    throw new Error(
      `the matrix could not be read from ${MATRIX_FILE.replace(ROOT, "").replaceAll("\\", "/")}`,
    );
  }

  const entries = [...array.matchAll(/\{([^{}]*)\}/g)]
    .map((match) => {
      const entry = {};
      for (const property of match[1].matchAll(/(\w+):\s*"([^"]*)"/g)) {
        entry[property[1]] = property[2];
      }
      return entry;
    })
    .filter((entry) => entry.name && entry.module && entry.support);

  const matrixNames = new Set(entries.map((entry) => entry.name));

  const aliases = existsSync(ALIAS_FILE)
    ? (JSON.parse(readFileSync(ALIAS_FILE, "utf8")).aliases ?? {})
    : {};

  const values = new Set();
  for (const entry of WEB_ENTRIES) {
    collectValues(entry, values, new Set());
  }

  const publicComponents = [...values]
    .filter((name) => isPublicComponent(name))
    .sort();

  /** A component is covered by its own matrix entry or by the entry its alias names. */
  const coveredBy = (name) => (aliases[name] ? aliases[name] : name);
  const uncovered = publicComponents.filter(
    (name) => !matrixNames.has(coveredBy(name)),
  );

  const unknownAliases = Object.entries(aliases)
    .filter(([, target]) => !matrixNames.has(target))
    .map(([name, target]) => `${name} -> ${target}`);

  const publicSet = new Set(publicComponents);
  const staleAliases = Object.keys(aliases)
    .filter((name) => !publicSet.has(name))
    .sort();

  return {
    entries,
    matrixNames: [...matrixNames].sort(),
    publicComponents,
    aliases,
    uncovered,
    unknownAliases,
    staleAliases,
  };
}
