/**
 * The declared portable surface, checked against the facts it claims.
 *
 * `PORTABLE_API` is a promise in two directions: nothing the matrix calls platform-only may
 * appear on it, and everything the matrix calls shared must. The rest of the suite checks those
 * facts against two other files — the matrix and the plan — rather than against a second copy of
 * the list, so a name that moves in either direction fails here.
 *
 * It also enforces the charter at the manifest level: a class string is not a name a shared file
 * writes, so no entry may be one. The renderers' dictionaries are read as data, because core may
 * not import a renderer and this test runs in core.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  PORTABLE_API,
  type PortableExport,
  type PortableKind,
  type PortableSource,
} from "./portable";

/** The repository root, three levels above this file. */
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

/** One row of the compatibility matrix, as the guards read it. */
interface MatrixEntry {
  name: string;
  module: string;
  support: string;
  native?: string;
  subpath?: string;
}

/**
 * Read the compatibility matrix out of its source file.
 *
 * The matrix is data — a flat array of object literals — so it is parsed rather than imported: a
 * test that imported it would be checking a build, and this suite has to run against the sources
 * both scripts read.
 *
 * @returns The matrix entries, in source order.
 */
function matrix(): MatrixEntry[] {
  const source = readFileSync(
    join(ROOT, "packages/core/src/matrix.ts"),
    "utf8",
  );
  const array = source.match(
    /COMPONENT_SUPPORT[^=]*=\s*\[([\s\S]*?)\n\];/,
  )?.[1];
  if (!array) throw new Error("COMPONENT_SUPPORT could not be read");

  return [...array.matchAll(/\{([^{}]*)\}/g)]
    .map((match) => {
      const entry: Record<string, string> = {};
      for (const property of match[1].matchAll(/(\w+):\s*"([^"]*)"/g)) {
        entry[property[1]] = property[2];
      }
      return entry;
    })
    .filter((entry) => entry.name && entry.module && entry.support) as MatrixEntry[];
}

/**
 * The names a renderer's class dictionaries export.
 *
 * A class dictionary is a module under `src/styles` whose exported constants are the strings a
 * platform compiles. C1–C3 moved them out of core, so this is where a `*_CLASS` name lives now —
 * and where a portable entry must not point.
 *
 * @param renderer - The package directory under `packages/`.
 * @returns Every exported constant name, across the dictionaries.
 */
function dictionaryNames(renderer: "web" | "native"): Set<string> {
  const directory = join(ROOT, "packages", renderer, "src", "styles");
  const names = new Set<string>();

  if (!existsSync(directory)) return names;

  for (const file of readdirSync(directory)) {
    if (!file.endsWith(".ts")) continue;
    const source = readFileSync(join(directory, file), "utf8");
    for (const match of source.matchAll(
      /^export\s+const\s+([A-Za-z0-9_$]+)/gm,
    )) {
      names.add(match[1]);
    }
  }

  return names;
}

/**
 * The name a matrix component takes in the portable surface.
 *
 * The matrix states the web export's name; `native` names its counterpart when the platform
 * publishes it under a different one. `Toast` is the one case today: the module is `toast`, and
 * both branches export `ToastProvider`. A prose `native` value describes a platform rather than an
 * export, so only an identifier counts as an alias.
 *
 * @param entry - One matrix row.
 * @returns The names the row could be portable under.
 */
function portableNamesOf(entry: MatrixEntry): string[] {
  const alias =
    entry.native && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(entry.native)
      ? [entry.native]
      : [];
  return [entry.name, ...alias];
}

const KINDS: readonly PortableKind[] = [
  "component",
  "provider",
  "hook",
  "helper",
  "type",
  "constant",
];
const SOURCES: readonly PortableSource[] = ["core", "renderer"];

describe("PORTABLE_API", () => {
  it("lists every component the matrix classifies shared", () => {
    const names = new Set(PORTABLE_API.map((entry) => entry.name));
    const missing = matrix()
      .filter(
        (entry) => entry.support === "shared" || entry.support === "shared-api",
      )
      // A component published on a subpath is not on the umbrella's root surface: the
      // section kit is `asheeui/section-kit`, and the umbrella's own suite asserts its
      // exact contents. The matrix records the subpath so this test can tell the two
      // apart instead of demanding that `ActionGroup` appear at the root.
      .filter((entry) => entry.subpath === undefined)
      .filter(
        (entry) =>
          !portableNamesOf(entry).some((candidate) => names.has(candidate)),
      )
      .map((entry) => entry.name);

    expect(missing).toEqual([]);
  });

  it("lists no component the matrix calls platform-only", () => {
    const platformOnly = new Set(
      matrix()
        .filter(
          (entry) =>
            entry.support === "web-only" ||
            entry.support === "native-only" ||
            entry.support === "not-applicable",
        )
        .map((entry) => entry.name),
    );
    const leaked = PORTABLE_API.filter((entry) =>
      platformOnly.has(entry.name),
    ).map((entry) => entry.name);

    expect(leaked).toEqual([]);
  });

  it("names a real batch in every pending work package", () => {
    // The ratchet points at the plan, so an id has to be a batch the plan actually
    // defines. Reading the plan is allowed here and in the guard; core itself only
    // publishes the names.
    const plan = readFileSync(join(ROOT, "IMPLEMENTATION-PLAN.md"), "utf8");
    const batches = new Set(
      [...plan.matchAll(/^#### (B\d+)\b/gm)].map((match) => match[1]),
    );
    const unknown = PORTABLE_API.flatMap((entry) =>
      (entry.pending ?? [])
        .filter((id) => !batches.has(id))
        .map((id) => `${entry.name}: ${id}`),
    );

    expect(unknown).toEqual([]);
  });

  it("names no class string", () => {
    // The charter, enforced at the manifest level: a class string decides pixels for one
    // platform, so it cannot be a name a shared file writes. The suffix rule catches the
    // convention, and the dictionaries catch a name that keeps a different one.
    const dictionaries = new Set([
      ...dictionaryNames("web"),
      ...dictionaryNames("native"),
    ]);
    const offenders = PORTABLE_API.filter(
      (entry) =>
        /_(CLASS|STYLE|GLYPH)$/.test(entry.name) ||
        dictionaries.has(entry.name),
    ).map((entry) => entry.name);

    expect(offenders).toEqual([]);
  });

  it("stays in the size band the plan sets, with a short pending list", () => {
    // `IMPLEMENTATION-PLAN.md` §B19 estimates ~160–170 names. The list lands above that
    // estimate because Appendix A marks the component prop types both renderers already
    // publish portable, and the estimate predates those being counted; the band allows for
    // the estimate rather than making it a cap.
    expect(PORTABLE_API.length).toBeGreaterThanOrEqual(160);
    expect(PORTABLE_API.length).toBeLessThanOrEqual(185);

    const pending = PORTABLE_API.filter(
      (entry) => (entry.pending?.length ?? 0) > 0,
    );
    expect(pending.length).toBeLessThanOrEqual(5);
  });

  it("states one unique name per entry, with a known kind and source", () => {
    const names = PORTABLE_API.map((entry) => entry.name);
    expect(new Set(names).size).toBe(names.length);

    const invalid = PORTABLE_API.filter(
      (entry) =>
        !KINDS.includes(entry.kind) ||
        !SOURCES.includes(entry.source) ||
        (entry.support !== "shared" && entry.support !== "shared-api"),
    ).map((entry) => entry.name);

    expect(invalid).toEqual([]);
  });

  it("keeps the entries flat, so the two guards can read them", () => {
    // `check-umbrella` and `generate-umbrella` parse the array literal with
    // `/\{([^{}]*)\}/g`; a nested object would make an entry disappear from what they
    // see. Stating the shape here is what turns that convention into a rule.
    const source = readFileSync(join(ROOT, "packages/core/src/portable.ts"), "utf8");
    const array = source.match(/PORTABLE_API[^=]*=\s*\[([\s\S]*?)\n\];/)?.[1];
    expect(array).toBeDefined();
    const objects = [...(array ?? "").matchAll(/\{([^{}]*)\}/g)];
    const shaped = objects.filter((match) =>
      /name:\s*"[^"]+"/.test(match[1]),
    );

    expect(shaped.length).toBe(PORTABLE_API.length);
    for (const entry of shaped) {
      expect(entry[1]).not.toContain("{");
      expect(entry[1]).not.toContain("}");
    }
  });
});

/**
 * The exports the file declares are the ones the interface documents.
 *
 * This exists so the types are read by the suite as well as by the compiler: the core
 * charter counts a name only a test reads as read, and a shape that is never asserted is a
 * shape nobody decided.
 */
describe("PortableExport", () => {
  it("describes an entry the way the manifest writes it", () => {
    const entry: PortableExport = {
      name: "Example",
      kind: "type",
      support: "shared",
      source: "core",
    };

    expect(entry.pending).toBeUndefined();
    expect(KINDS).toContain(entry.kind);
    expect(SOURCES).toContain(entry.source);
  });
});
