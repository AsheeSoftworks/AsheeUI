/**
 * The package's routing and its branch boundaries.
 *
 * The package exists to route one import to two renderers, so what is worth testing
 * here is the routing and the boundary between the halves: that the manifest sends a
 * resolver to a file that exists, that `react-native` is reached before the web
 * conditions, and — the property the whole split exists for — that a device bundle can
 * reach this package without loading React DOM, Tailwind or the editor.
 *
 * The two entry files and the two renderer trees are read as text rather than imported,
 * because importing either half needs the platform the other cannot provide: the web
 * files need a DOM, and the native files need React Native, which only the platform's
 * own runner can transform. Their behaviour is covered by the suites beside them.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

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
    readFileSync(join(packageRoot, "package.json"), "utf8"),
  ) as Manifest;
}

/**
 * Read one of the package's entry points.
 *
 * @param name - The entry's file name, relative to `src`.
 * @returns The source text.
 */
function source(name: string): string {
  return readFileSync(join(packageRoot, "src", name), "utf8");
}

/**
 * Read a file with its comments removed.
 *
 * The trees name the other platform in their documentation — that is how a reader
 * learns which one applies — so a check about what a file *imports* has to look at the
 * code rather than at the prose.
 *
 * @param text - The source text.
 * @returns The source, without block or line comments.
 */
function code(text: string): string {
  return text
    .replaceAll(/\/\*[\s\S]*?\*\//g, "")
    .replaceAll(/(?:^|\s)\/\/.*$/gm, "");
}

/**
 * Read every module in a directory of the package, tests excluded.
 *
 * @param directory - A directory relative to `src`.
 * @returns Every module's path and code, tests left out.
 */
function modules(directory: string): Array<{ path: string; code: string }> {
  const root = join(packageRoot, "src", directory);

  return readdirSync(root, { recursive: true, withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        /\.tsx?$/.test(entry.name) &&
        !entry.name.includes(".test."),
    )
    .map((entry) => {
      const path = join(entry.parentPath ?? root, entry.name);

      return {
        path: relative(packageRoot, path).replaceAll("\\", "/"),
        code: code(readFileSync(path, "utf8")),
      };
    });
}

describe("the Puck package's routing", () => {
  it("routes the web to its own entry and React Native to the native one", () => {
    const { main, "react-native": reactNative } = manifest();

    expect(main).toBe("./src/index.ts");
    expect(reactNative).toBe("./src/index.native.ts");
  });

  it("names a file that exists in every field a resolver reads", () => {
    const entry = manifest();

    for (const field of ["main", "module", "types", "react-native"] as const) {
      expect(
        existsSync(resolve(packageRoot, entry[field])),
        `${field}: ${entry[field]}`,
      ).toBe(true);
    }
  });

  it("puts the react-native condition ahead of the web ones", () => {
    // A resolver walks the conditions in order, so `react-native` has to be reached
    // before `import` and `default`, or a native bundle would be handed the DOM
    // renderer.
    const { exports, publishConfig } = manifest();
    const conditions = Object.keys(exports["."]);

    expect(conditions.indexOf("react-native")).toBeLessThan(
      conditions.indexOf("import"),
    );
    expect(publishConfig.exports["."]["react-native"]).toEqual({
      types: "./dist/index.native.d.ts",
      default: "./dist/index.native.js",
    });
  });

  it("publishes the built entries and leaves the native field where it is", () => {
    const { publishConfig } = manifest();

    expect(publishConfig.main).toBe("./dist/index.js");
    expect(publishConfig.types).toBe("./dist/index.d.ts");
    // A publish rewrites the fields a package manager knows. `react-native` is not one
    // of them, so the path Metro reads is the manifest's own field and cannot be
    // redirected — which is why the native entry, and the modules it reaches, are
    // shipped as source.
    expect(publishConfig["react-native"]).toBeUndefined();
  });

  it("ships every file it points a resolver at", () => {
    // A published package that names a path outside its own file list resolves to
    // nothing, so the list has to cover every field — including the one that is not
    // rewritten on the way out, and the modules that field reaches.
    const { files, publishConfig, ...entry } = manifest();
    const published = (field: keyof EntryFields) =>
      (publishConfig[field] ?? entry[field]).replace(/^\.\//, "");
    const shipped = (path: string) =>
      files.some((item) => path === item || path.startsWith(`${item}/`));

    for (const field of ["main", "module", "types", "react-native"] as const) {
      expect(shipped(published(field)), `${field}: ${published(field)}`).toBe(
        true,
      );
    }

    // The native entry is published as source, so everything it imports has to be
    // published with it or the field would name a file a resolver cannot compile.
    expect(shipped("src/native/render.tsx")).toBe(true);
    expect(shipped("src/shared/types.ts")).toBe(true);
  });
});

describe("the boundary between the two halves", () => {
  it("keeps the branches apart, so neither bundle carries the other renderer", () => {
    expect(code(source("index.ts"))).not.toContain("@asheeui/native");
    expect(code(source("index.native.ts"))).toContain('from "./native"');
  });

  it("lets a device reach the package without the editor or the DOM renderer", () => {
    // This is the property the split exists for: a device resolves the native tree, so
    // if it reached the editor a device would have to install a DOM visual editor to
    // draw a page, and if it reached the DOM renderer it would carry Tailwind and
    // React DOM. Its own renderer is the one thing it is supposed to reach.
    for (const module of modules("native")) {
      expect(module.code, `${module.path} imports the editor`).not.toContain(
        "@puckeditor/core",
      );
      expect(
        module.code,
        `${module.path} imports the DOM renderer`,
      ).not.toContain("@asheeui/web");
    }
  });

  it("keeps the shared layer free of every renderer", () => {
    // One set of specs describes both platforms only if it is written against neither
    // of them: a shared module that named a renderer would make the registry a web
    // module again, which is the coupling the package was created to remove.
    for (const module of modules("shared")) {
      expect(module.code, `${module.path} imports the editor`).not.toContain(
        "@puckeditor/core",
      );
      expect(module.code, `${module.path} imports a renderer`).not.toMatch(
        /@asheeui\/(web|native)/,
      );
    }
  });

  it("keeps the native renderer out of the web tree", () => {
    for (const module of modules("web")) {
      expect(module.code, `${module.path} imports React Native`).not.toContain(
        "@asheeui/native",
      );
    }
  });

  it("describes both platforms with one set of block specs", () => {
    // Each half registers the shared specs rather than restating the fields, which is
    // what keeps the editor and a device from offering two different blocks for one
    // component.
    const registries = [...modules("web"), ...modules("native")].filter(
      (module) => module.path.endsWith("config.tsx"),
    );

    expect(registries.length).toBe(2);

    for (const registry of registries) {
      expect(registry.code, `${registry.path} reads the specs`).toContain(
        "PUCK_CATEGORIES",
      );
    }
  });
});
