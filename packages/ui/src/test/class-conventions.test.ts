// @vitest-environment node
/**
 * Repository-wide check for dynamically constructed Tailwind utility names
 * (`ROAD-009` work item 2, Hard Rule 5).
 *
 * The file runs in the Node environment because it only reads source text and
 * needs `import.meta.url` to be a `file:` URL so the source tree can be located.
 */

import { promises as fs } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { scanForDynamicUtilityClasses } from "./index";

const SOURCE_ROOT = fileURLToPath(new URL("..", import.meta.url));

/** Collect every source file under `directory`, skipping tests and the scanner. */
async function listSourceFiles(directory: string): Promise<string[]> {
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

  return files;
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
      scanForDynamicUtilityClasses(`className={\`\${sizeClass} \${toneClass}\`}`),
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

  it("finds no dynamically constructed utility names in the library source", async () => {
    const files = await listSourceFiles(SOURCE_ROOT);
    const offenders: string[] = [];

    expect(files.length).toBeGreaterThan(50);

    for (const file of files) {
      const source = await fs.readFile(file, "utf8");
      for (const finding of scanForDynamicUtilityClasses(source)) {
        offenders.push(`${relative(SOURCE_ROOT, file)}: ${finding}`);
      }
    }

    expect(offenders).toEqual([]);
  });
});
