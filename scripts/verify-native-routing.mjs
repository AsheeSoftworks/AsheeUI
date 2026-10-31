#!/usr/bin/env node
/**
 * Prove the umbrella routes both ways.
 *
 * `asheeui` has one entry for the browser and one for a device, and the manifest's
 * `exports` map is what sends a resolver to the right one. A unit test can read that map;
 * only a resolver can prove it. This builds the same three-name import twice — once with
 * Vite's default conditions, once with `react-native` — and asserts which renderer the
 * umbrella's own entry pulled in:
 *
 *   web     → the graph contains `@asheeui/web` and not `@asheeui/native`
 *   native  → the graph contains `@asheeui/native` and not `@asheeui/web`
 *
 * The renderers are external, so the build never has to compile React Native or the DOM.
 * What is under test is the umbrella's re-export graph, not a renderer's implementation:
 * the output's import list names the package the umbrella resolved to.
 *
 * The fixture is a temporary directory with a `node_modules/asheeui` link to the
 * workspace package — what an installer would create — so the resolver reads the real
 * manifest and its `exports` conditions rather than an alias that would bypass them. It is
 * removed even when a build fails, and it needs nothing outside the checked-in workspace.
 *
 * Usage:
 *
 *   node scripts/verify-native-routing.mjs
 *
 * Exit code 1 means one of the two graphs reached the other platform's renderer, or the
 * fixture could not be built at all.
 */

import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const UI_PACKAGE = join(ROOT, "packages/ui");

/** The three portable names the fixture imports. */
const NAMES = ["Button", "Card", "Typography"];

/**
 * Load Vite from the web renderer's dependencies.
 *
 * The script runs from the repository root, where Vite is not a dependency; `@asheeui/web`
 * is the workspace package that owns it, and it is always installed in a CI checkout.
 *
 * @returns Vite's `build` function.
 */
async function loadVite() {
  const webManifest = join(ROOT, "packages/web/package.json");
  const requireFromWeb = createRequire(webManifest);
  let entry;
  try {
    entry = requireFromWeb.resolve("vite");
  } catch {
    throw new Error(
      "Vite is not installed in @asheeui/web, so the routing proof cannot build. Run `pnpm install` first.",
    );
  }

  const vite = await import(pathToFileURL(entry).href);
  return vite.build;
}

/**
 * Bundle one fixture and collect the modules its output imports.
 *
 * @param build - Vite's build function.
 * @param fixture - The fixture directory.
 * @param native - Whether the resolver should see the `react-native` condition.
 * @returns The external module ids the output names.
 */
async function graphOf(build, fixture, native) {
  const result = await build({
    root: fixture,
    configFile: false,
    logLevel: "silent",
    // `conditions` is additional to Vite's defaults: adding `react-native` is exactly
    // what a React Native bundler does, and leaving it out is what a browser bundler does.
    ...(native ? { resolve: { conditions: ["react-native"] } } : {}),
    build: {
      write: false,
      minify: false,
      rollupOptions: {
        input: join(fixture, "entry.ts"),
        // The entry re-exports what it imported, and tree-shaking would remove the
        // re-export graph before it could be read. The graph is the evidence, so it stays.
        treeshake: false,
        preserveEntrySignatures: "strict",
        /**
         * Bundle the umbrella, externalise everything else.
         *
         * The raw id is seen before resolution, so `asheeui` is the one bare specifier
         * that stays in the graph. Every other bare specifier is external — including the
         * renderers, whose import statement is the evidence this check reads. The
         * resolved-id call exists for `asheeui` itself and must not externalise it.
         */
        external: (id, _importer, isResolved) => {
          if (isResolved) return false;
          return id !== "asheeui" && !id.startsWith(".") && !isAbsolute(id);
        },
        output: { format: "es" },
      },
    },
  });

  const outputs = Array.isArray(result) ? result : [result];
  const imports = new Set();
  for (const output of outputs) {
    for (const chunk of output.output ?? []) {
      if (chunk.type !== "chunk") continue;
      for (const imported of chunk.imports) imports.add(imported);
      // An external module that only appears as a re-export can be recorded in the code
      // rather than in `imports`; the statement is what a bundler would follow.
      for (const match of chunk.code.matchAll(
        /from\s+"(@asheeui\/[^"]+)"/g,
      )) {
        imports.add(match[1]);
      }
    }
  }
  return imports;
}

/**
 * Run both builds and compare the two graphs.
 *
 * @returns A one-line summary of the proof.
 * @throws When either graph reached the wrong renderer.
 */
async function verify() {
  const build = await loadVite();
  const fixture = mkdtempSync(join(tmpdir(), "asheeui-routing-"));

  try {
    // A package manager would link the workspace package here. The link is what makes the
    // fixture resolve the real `asheeui` manifest — and therefore its `exports` conditions
    // — instead of an alias that would bypass the thing under test.
    const modules = join(fixture, "node_modules");
    mkdirSync(modules, { recursive: true });
    symlinkSync(UI_PACKAGE, join(modules, "asheeui"), "junction");

    writeFileSync(
      join(fixture, "entry.ts"),
      [
        `import { ${NAMES.join(", ")} } from "asheeui";`,
        `export const portable = [${NAMES.join(", ")}];`,
        "",
      ].join("\n"),
      "utf8",
    );

    const web = await graphOf(build, fixture, false);
    const native = await graphOf(build, fixture, true);

    const problems = [];
    if (!web.has("@asheeui/web")) {
      problems.push(
        `the default build did not reach @asheeui/web (imported: ${[...web].join(", ") || "nothing"})`,
      );
    }
    if (web.has("@asheeui/native")) {
      problems.push("the default build reached @asheeui/native");
    }
    if (!native.has("@asheeui/native")) {
      problems.push(
        `the react-native build did not reach @asheeui/native (imported: ${[...native].join(", ") || "nothing"})`,
      );
    }
    if (native.has("@asheeui/web")) {
      problems.push("the react-native build reached @asheeui/web");
    }

    if (problems.length > 0) {
      throw new Error(problems.join("; "));
    }

    return `Native routing: ${NAMES.join(", ")} through \`asheeui\` reached @asheeui/web by default and @asheeui/native with the react-native condition, and neither build reached the other.`;
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

try {
  console.log(await verify());
} catch (error) {
  console.error(
    `Native routing: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
}
