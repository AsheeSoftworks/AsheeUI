/**
 * The umbrella package's contract.
 *
 * The package exists to route one import to two renderers, so what is worth testing is
 * the routing: that each branch exports the renderer it names, that the manifest sends a
 * resolver to a file that exists, and that neither branch carries the other platform's
 * renderer into a bundle. The web branch is imported for real, because a re-export that
 * silently drops a name is exactly the failure a consumer would meet. The native branch
 * is read rather than imported, because it imports React Native, which only the
 * platform's own test runner can transform — its behaviour is covered by the native
 * package's own suite.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cn } from "@asheeui/core";
import * as Web from "@asheeui/web";
import { describe, expect, it } from "vitest";
import * as Umbrella from "./index";

/** The package directory, which holds the manifest and the entries. */
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

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

describe("umbrella entry point", () => {
  it("exports everything the web renderer exports", () => {
    const missing = Object.keys(Web).filter((name) => !(name in Umbrella));

    expect(missing).toEqual([]);
  });

  it("offers the platform-neutral helpers both branches document", () => {
    expect(Umbrella.cn).toBe(cn);
    expect(typeof Umbrella.resolveCascade).toBe("function");
    expect(typeof Umbrella.resolveClassKey).toBe("function");
  });

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
});
