/**
 * The application surface must not reach a testing library.
 *
 * The application and the verification surface are separate for a reason: an
 * application that reached the harness would carry a browser and a test renderer
 * into its own bundle. The same is true one level down, of the contract helpers a
 * section imports to say which interactions it expects — a built playground bundle
 * carried the testing library seven times because one of them imported it.
 *
 * A boundary that matters is asserted rather than assumed, so this walks the
 * module graph from the application entry point and fails when it reaches anything
 * that belongs to a test.
 */

import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/** The application entry point, which is what a framework shell imports. */
const entry = resolve(dirname(fileURLToPath(import.meta.url)), "index.ts");

/** Packages an application bundle must not carry. */
const FORBIDDEN = [
  "@testing-library/",
  "react-dom/client",
  "react-dom/server",
  "jsdom",
  "vitest",
];

/** The suffixes a relative specifier may resolve with. */
const SUFFIXES = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

/**
 * Whether a path exists.
 *
 * @param path - Absolute path to check.
 * @returns True when it is there.
 */
async function exists(path: string): Promise<boolean> {
  return access(path)
    .then(() => true)
    .catch(() => false);
}

/**
 * The specifiers one module imports.
 *
 * @param path - Absolute path of the module.
 * @returns Every specifier it names, from an import or a re-export.
 */
async function importsOf(path: string): Promise<string[]> {
  const content = await readFile(path, "utf8");
  const specifiers = new Set<string>();

  for (const match of content.matchAll(/\sfrom\s+"([^"]+)"/g)) {
    specifiers.add(match[1]);
  }

  for (const match of content.matchAll(/^import\s+"([^"]+)"/gm)) {
    specifiers.add(match[1]);
  }

  return [...specifiers];
}

/**
 * Resolve a relative specifier to a file.
 *
 * @param from - The module the specifier appears in.
 * @param specifier - The specifier.
 * @returns The absolute path, or undefined when nothing is there.
 */
async function resolveRelative(
  from: string,
  specifier: string,
): Promise<string | undefined> {
  for (const suffix of SUFFIXES) {
    const candidate = resolve(dirname(from), `${specifier}${suffix}`);

    if (await exists(candidate)) return candidate;
  }

  return undefined;
}

/**
 * Walk the module graph of the application surface.
 *
 * @returns Each package the graph reaches, and the module that reaches it.
 */
async function packagesReached(): Promise<Map<string, string>> {
  const reached = new Map<string, string>();
  const visited = new Set<string>();
  const queue = [entry];

  while (queue.length > 0) {
    const path = queue.shift();

    if (path === undefined || visited.has(path)) continue;

    visited.add(path);

    for (const specifier of await importsOf(path)) {
      if (!specifier.startsWith(".")) {
        if (!reached.has(specifier)) reached.set(specifier, path);
        continue;
      }

      const next = await resolveRelative(path, specifier);

      if (next !== undefined) queue.push(next);
    }
  }

  return reached;
}

describe("the application surface", () => {
  it("reaches no testing library, from any module in its graph", async () => {
    const reached = await packagesReached();

    // The graph is what it is: it contains the framework and React, so a pass here
    // cannot be an empty walk.
    expect([...reached.keys()]).toContain("asheeui");
    expect([...reached.keys()]).toContain("react");

    for (const [specifier, importer] of reached) {
      for (const forbidden of FORBIDDEN) {
        expect(
          specifier.startsWith(forbidden),
          `${importer.slice(importer.indexOf("src/"))} reaches ${specifier}, which belongs to a test`,
        ).toBe(false);
      }
    }
  });
});
