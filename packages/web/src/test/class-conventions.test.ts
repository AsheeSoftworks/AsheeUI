// @vitest-environment node
/**
 * Repository-wide check for dynamically constructed Tailwind utility names
 * (`ROAD-009` work item 2, Hard Rule 5) and for raw palette colours.
 *
 * The file runs in the Node environment because it only reads source text and
 * needs `import.meta.url` to be a `file:` URL so the source tree can be located.
 *
 * The walk covers every package that carries utility classes, not only this
 * one: most of the class strings live in `@asheeui/core`'s `*-styles.ts` style
 * maps, and `@asheeui/native` has its own. A scanner rooted at `packages/web/src`
 * alone left those unchecked, so the rules held by discipline rather than by
 * test.
 */

import { promises as fs } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { scanForDynamicUtilityClasses, scanForRawPaletteColours } from "./";

const SOURCE_ROOT = fileURLToPath(new URL("..", import.meta.url));
const CORE_SOURCE_ROOT = fileURLToPath(
  new URL("../../../core/src", import.meta.url),
);
const NATIVE_SOURCE_ROOT = fileURLToPath(
  new URL("../../../native/src", import.meta.url),
);
/** The `packages/` directory, used to label a finding with its package. */
const PACKAGES_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const SOURCE_ROOTS = [SOURCE_ROOT, CORE_SOURCE_ROOT, NATIVE_SOURCE_ROOT];

/**
 * The tree and its contents, remembered between the two scanners.
 *
 * Both scanners walk the same ~650 files, and a scanner never changes the tree,
 * so reading it once keeps the file cheap rather than paying for the walk twice.
 */
const fileLists = new Map<string, string[]>();
const sources = new Map<string, string>();

/** Collect every source file under `directory`, skipping tests and the scanner. */
async function listSourceFiles(directory: string): Promise<string[]> {
  const remembered = fileLists.get(directory);
  if (remembered) return remembered;

  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listSourceFiles(full)));
      continue;
    }
    if (!/\.(?:ts|tsx)$/.test(entry.name)) continue;
    if (/\.test\.(?:ts|tsx)$/.test(entry.name)) continue;
    if (entry.name === "source-scan.ts") continue;
    files.push(full);
  }

  fileLists.set(directory, files);
  return files;
}

/** Read a source file, once per test run. */
async function readSource(file: string): Promise<string> {
  const remembered = sources.get(file);
  if (remembered !== undefined) return remembered;

  const source = await fs.readFile(file, "utf8");
  sources.set(file, source);
  return source;
}

/** Run a scanner over every library source file and report the findings. */
async function findOffenders(
  scan: (
    source: string,
    options?: { requireClassContext?: boolean },
  ) => string[],
): Promise<string[]> {
  // Read the three trees in parallel: the walk is hundreds of files, and the
  // suite should not pay for them one round trip at a time.
  const files = (await Promise.all(SOURCE_ROOTS.map(listSourceFiles))).flat();

  expect(files.length).toBeGreaterThan(50);

  const perFile = await Promise.all(
    files.map(async (file) => {
      const source = await readSource(file);
      // A style map holds class strings with no `className` on the line, so the
      // context check is turned off for it. Every other file keeps it.
      const options = file.endsWith("-styles.ts")
        ? { requireClassContext: false }
        : undefined;

      return scan(source, options).map(
        (finding) => `${relative(PACKAGES_ROOT, file)}: ${finding}`,
      );
    }),
  );

  return perFile.flat();
}

describe("dynamic utility class scanner", () => {
  it("flags an interpolated utility name in a class-name context", () => {
    expect(
      scanForDynamicUtilityClasses(`className={\`bg-\${color}-500\`}`),
    ).toHaveLength(1);
    expect(scanForDynamicUtilityClasses(`cn(\`text-\${size}\`)`)).toHaveLength(
      1,
    );
    expect(
      scanForDynamicUtilityClasses(`el.classList.add(\`border-\${tone}\`);`),
    ).toHaveLength(1);
  });

  it("flags a concatenated utility name", () => {
    expect(
      scanForDynamicUtilityClasses(`className={"rounded-" + radius}`),
    ).toHaveLength(1);
    expect(
      scanForDynamicUtilityClasses("const classes = 'shadow-' + level;"),
    ).toHaveLength(1);
  });

  it("accepts complete interpolations of pre-computed class strings", () => {
    expect(
      scanForDynamicUtilityClasses(
        `className={\`\${sizeClass} \${toneClass}\`}`,
      ),
    ).toEqual([]);
    expect(
      scanForDynamicUtilityClasses(
        'cn("flex", isOpen && "rotate-180", className)',
      ),
    ).toEqual([]);
  });

  it("accepts interpolations outside class-name contexts", () => {
    expect(
      scanForDynamicUtilityClasses(
        `id: \`\${currentLayout}-row-\${rIdx}\`,\n      keys: row.split(" "),`,
      ),
    ).toEqual([]);
  });

  it("ignores fragments that are not utility roots", () => {
    expect(
      scanForDynamicUtilityClasses(`className={\`foo-\${part}\`}`),
    ).toEqual([]);
  });

  it("flags a constructed utility inside a style map, where no class context is spelled", () => {
    const styleMap = `export const PADDING = { sm: "p-2", md: \`p-\${scale}\` };`;

    // Only a class-name context is scanned by default, so a style map needs the
    // relaxation that the repository walk applies to `*-styles.ts`.
    expect(scanForDynamicUtilityClasses(styleMap)).toEqual([]);
    expect(
      scanForDynamicUtilityClasses(styleMap, { requireClassContext: false }),
    ).toHaveLength(1);
  });

  it("finds no dynamically constructed utility names in the library source", async () => {
    expect(await findOffenders(scanForDynamicUtilityClasses)).toEqual([]);
  });
});

describe("raw palette colour scanner", () => {
  it("flags palette utilities with and without a shade", () => {
    expect(scanForRawPaletteColours('className="bg-red-500"')).toEqual([
      "bg-red-500",
    ]);
    expect(scanForRawPaletteColours('className="border-white/10"')).toEqual([
      "border-white",
    ]);
    expect(
      scanForRawPaletteColours(
        'className="hover:bg-black/20 dark:hover:bg-white/20"',
      ),
    ).toHaveLength(2);
  });

  it("flags palette utilities behind sub-property segments", () => {
    expect(scanForRawPaletteColours('className="ring-offset-white"')).toEqual([
      "ring-offset-white",
    ]);
    expect(scanForRawPaletteColours('className="border-x-slate-200"')).toEqual([
      "border-x-slate-200",
    ]);
  });

  it("accepts AsheeUI colour tokens", () => {
    expect(
      scanForRawPaletteColours(
        'className="bg-background/80 text-foreground/70 border-border bg-danger/10 text-primary"',
      ),
    ).toEqual([]);
  });

  it("finds no raw palette colours in the library source", async () => {
    expect(await findOffenders(scanForRawPaletteColours)).toEqual([]);
  });
});

describe("the source trees the scanners walk", () => {
  it("walks the core style maps and the native package, not only this package", async () => {
    const coreFiles = await listSourceFiles(CORE_SOURCE_ROOT);
    const nativeFiles = await listSourceFiles(NATIVE_SOURCE_ROOT);

    // The style maps are where most class strings live; they are the reason the
    // walk leaves `packages/web/src`.
    expect(
      coreFiles.filter((file) => file.endsWith("-styles.ts")).length,
    ).toBeGreaterThan(30);
    expect(nativeFiles.length).toBeGreaterThan(50);
  });
});
