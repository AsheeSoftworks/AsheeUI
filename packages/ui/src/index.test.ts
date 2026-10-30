/**
 * The umbrella package's contract.
 *
 * The package exists to route one import to two renderers, so two things are worth
 * testing: the routing (each branch exports the renderer it names, the manifest sends a
 * resolver to a file that exists, and neither branch carries the other platform's
 * renderer) and the surface (both branches publish exactly `PORTABLE_API`).
 *
 * The surface is not re-derived here. `evaluateUmbrella` from
 * `scripts/lib/umbrella-check.mjs` is the same function `pnpm check:umbrella` runs, so the
 * suite and the command cannot disagree about what the package offers; a second copy of
 * the six assertions is how the two would start to drift.
 *
 * The web branch is imported for real, because a re-export that silently drops a name is
 * exactly the failure a consumer would meet. The native branch is read rather than
 * imported, because it imports React Native, which only the platform's own test runner can
 * transform — its behaviour is covered by the native package's own suite, and the
 * evaluator reads its source.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PORTABLE_API } from "@asheeui/core";
import * as Web from "@asheeui/web";
import { cn } from "@asheeui/web";
import { describe, expect, it } from "vitest";
import { evaluateUmbrella } from "../../../scripts/lib/umbrella-check.mjs";
import * as Umbrella from "./index";

/** The package directory, which holds the manifest and the entries. */
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** The repository, which the guard reads the packages and the list from. */
const repositoryRoot = resolve(packageRoot, "../..");

/** The guard's evaluation of this working tree. */
const evaluation = evaluateUmbrella({ root: repositoryRoot });

/** The fields of the manifest a resolver reads, at the root and under `publishConfig`. */
interface EntryFields {
  main: string;
  module: string;
  types: string;
  "react-native": string;
}

/** One condition of the exports map, which may nest conditions of its own. */
type ExportConditions = Record<string, string | Record<string, string>>;

/** The manifest's routing, as a resolver reads it. */
interface Manifest extends EntryFields {
  files: string[];
  exports: { ".": ExportConditions };
  // A publish rewrites only the fields a package manager knows, so the published set is
  // partial rather than a second copy of the manifest.
  publishConfig: Partial<EntryFields> & { exports: { ".": ExportConditions } };
}

/**
 * One assertion by number.
 *
 * @param id - The assertion's number, 1–6.
 * @returns The outcome.
 */
function assertion(id: number) {
  const found = evaluation.assertions.find((entry) => entry.id === id);
  if (!found) throw new Error(`the guard did not report assertion ${id}`);
  return found;
}

/**
 * Read the package manifest.
 *
 * @returns The parsed manifest, limited to what the routing test reads.
 */
function manifest(): Manifest {
  return JSON.parse(
    readFileSync(resolve(packageRoot, "package.json"), "utf8"),
  ) as Manifest;
}

/**
 * Read one of the package's entry points.
 *
 * @param name - The entry's file name, relative to `src`.
 * @returns The source text.
 */
function source(name: string): string {
  return readFileSync(resolve(packageRoot, "src", name), "utf8");
}

/**
 * Read an entry point with its comments removed.
 *
 * The branches name both renderers in their documentation — that is how a reader learns
 * which one applies — so a check about what a branch *imports* has to look at the code
 * rather than at the prose.
 *
 * @param name - The entry's file name, relative to `src`.
 * @returns The source text, without block or line comments.
 */
function code(name: string): string {
  return source(name)
    .replaceAll(/\/\*[\s\S]*?\*\//g, "")
    .replaceAll(/(?:^|\s)\/\/.*$/gm, "");
}

describe("umbrella surface", () => {
  it("passes the five blocking assertions", () => {
    // 1 set equality, 2 declared source publishes the name, 3 no stale pending, 4 matrix
    // agreement, 5 no platform-only leak. Assertion 6 is B22's and is checked below.
    for (const id of [1, 2, 3, 4, 5]) {
      expect(assertion(id).status, `assertion ${id}`).toBe("pass");
    }
  });

  it("publishes exactly the portable value surface", () => {
    // Types are erased at runtime and `AsheeConfig` is the one platform-specific alias, so
    // the runtime namespace is every non-type entry. This is the consumer-facing half of
    // assertion 1, checked against the imported entry rather than against its source.
    const valueNames = PORTABLE_API.filter(
      (entry) => entry.kind !== "type",
    )
      .map((entry) => entry.name)
      .sort();

    expect(Object.keys(Umbrella).sort()).toEqual(valueNames);
  });

  it("defers only the three subpaths B22 owns", () => {
    const subpaths = assertion(6);

    expect(subpaths.status).toBe("pending");
    expect(subpaths.owner).toBe("B22");
    // A pending assertion is not a blanket exemption: if any problem other than the known
    // missing subpaths appeared, assertion 6 would fail rather than be pending.
    expect(subpaths.offending.length).toBe(3);
    for (const problem of subpaths.offending) {
      expect(problem).toContain("(B22)");
    }
  });

  it("answers both text names, as one component", () => {
    // The renderers publish the pair — `Typography` canonically, `Text` as the same
    // reference — so a shared component writes either name and the umbrella states no alias
    // of its own. The native branch cannot be imported here, because it pulls React Native;
    // its pair is asserted by the native package's own suite, and what this checks is that
    // the web branch carries both names and that they are one component.
    expect(Umbrella.Typography).toBe(Web.Typography);
    expect(Umbrella.Text).toBe(Web.Typography);
  });

  it("offers the platform-neutral helpers both branches document", () => {
    expect(Umbrella.cn).toBe(cn);
    expect(typeof Umbrella.resolveCascade).toBe("function");
    expect(typeof Umbrella.resolveClassKey).toBe("function");
    expect(typeof Umbrella.resolveAnimate).toBe("function");
  });
});

describe("umbrella entry point", () => {
  it("routes the web to its own entry and React Native to the native one", () => {
    const { main, "react-native": reactNative } = manifest();

    expect(main).toBe("./src/index.ts");
    expect(reactNative).toBe("./src/index.native.ts");
  });

  it("names a file that exists in every field a resolver reads", () => {
    const entry = manifest();

    for (const field of ["main", "module", "types", "react-native"] as const) {
      expect(existsSync(resolve(packageRoot, entry[field])), field).toBe(true);
    }
  });

  it("puts the react-native condition ahead of the web ones", () => {
    // A resolver walks the conditions in order, so `react-native` has to be reached
    // before `import` and `default`, or a native bundle would be handed the DOM
    // renderer. The nested `types` is what makes a React Native editor complete the
    // native branch's props rather than the web's.
    const { exports, publishConfig } = manifest();
    const source = exports["."];
    const published = publishConfig.exports["."];

    expect(Object.keys(source).indexOf("react-native")).toBeLessThan(
      Object.keys(source).indexOf("import"),
    );
    expect(source["react-native"]).toEqual({
      types: "./src/index.native.ts",
      default: "./src/index.native.ts",
    });
    expect(published["react-native"]).toEqual({
      types: "./dist/index.native.d.ts",
      default: "./dist/index.native.js",
    });
  });

  it("publishes the built entries, and leaves the native field where it is", () => {
    const { publishConfig } = manifest();

    expect(publishConfig.main).toBe("./dist/index.js");
    expect(publishConfig.types).toBe("./dist/index.d.ts");
    // A publish rewrites the fields a package manager knows. `react-native` is not one
    // of them, so the path Metro reads is the manifest's own field and cannot be
    // redirected — which is why the entry is shipped as source (see the test below).
    // This assertion is the reminder to revisit that decision if it ever changes.
    expect(publishConfig["react-native"]).toBeUndefined();
  });

  it("ships every file it points a resolver at", () => {
    // A published package that names a path outside its own file list resolves to
    // nothing, so the list has to cover every field — including the one that is not
    // rewritten on the way out. This is the check that catches it.
    const { files, publishConfig, ...entry } = manifest();
    const published = (field: keyof EntryFields) =>
      (publishConfig[field] ?? entry[field]).replace(/^\.\//, "");
    const shipped = (path: string) =>
      files.some((item) => path === item || path.startsWith(`${item}/`));

    for (const field of ["main", "module", "types", "react-native"] as const) {
      const path = published(field);

      expect(shipped(path), `${field}: ${path}`).toBe(true);
    }
  });

  it("keeps the branches apart, so neither bundle carries the other renderer", () => {
    expect(code("index.ts")).not.toContain("@asheeui/native");
    expect(code("index.native.ts")).toContain('from "@asheeui/native"');
    expect(code("index.native.ts")).not.toContain("@asheeui/web");
  });

  it("says that it is generated, and from what", () => {
    // The file is the generator's output; a direct edit is the drift the guard cannot see
    // until the next regeneration. The header is the first thing a reader meets.
    for (const entry of ["index.ts", "index.native.ts"]) {
      expect(source(entry)).toContain("GENERATED FILE — do not edit");
      expect(source(entry)).toContain("PORTABLE_API");
    }
  });
});
