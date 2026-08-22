import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

export interface RegistryEntry {
  /** Component identifier, e.g. "button" */
  name: string;
  /** Registry item type */
  type: "components:ui";
  /** Relative paths from package root */
  files: string[];
}

const PACKAGE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const COMPONENTS_DIR = path.join(PACKAGE_ROOT, "src", "components");
const COMPONENT_FILE_EXTENSIONS = [".ts", ".tsx"];

function isComponentFile(fileName: string): boolean {
  return COMPONENT_FILE_EXTENSIONS.some((ext) => fileName.endsWith(ext));
}

function collectComponentFiles(componentDir: string): string[] {
  const files: string[] = [];

  const scan = (dir: string) => {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) {
        continue;
      }

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (isComponentFile(entry.name)) {
        files.push(
          path.relative(PACKAGE_ROOT, fullPath).split(path.sep).join("/"),
        );
      }
    }
  };

  scan(componentDir);
  return files.sort();
}

function buildRegistry(): RegistryEntry[] {
  const componentDirs = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  return componentDirs.map((name) => {
    const componentDir = path.join(COMPONENTS_DIR, name);
    const files = collectComponentFiles(componentDir);

    if (files.length === 0) {
      console.warn(`[build-registry] No files found for component "${name}"`);
    }

    return {
      name,
      type: "components:ui",
      files,
    };
  });
}

function updatePackageJsonExports(registry: RegistryEntry[]): void {
  const pkgPath = path.join(PACKAGE_ROOT, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

  // 1. Ensure required publishing metadata is set
  pkg.main = "./src/index.ts";
  pkg.module = "./src/index.ts";
  pkg.types = "./src/index.ts";
  pkg.style = "./src/index.css";
  pkg.files = ["dist"];

  // 2. Base local development exports (points to ./src)
  const exportsMap: Record<string, unknown> = {
    ".": {
      types: "./src/index.ts",
      import: "./src/index.ts",
      default: "./src/index.ts",
    },
    "./styles": {
      style: "./src/index.css",
      default: "./src/index.css",
    },
    "./config": {
      types: "./src/config/index.ts",
      import: "./src/config/index.ts",
      default: "./src/config/index.ts",
    },
    "./libs": {
      types: "./src/libs/index.ts",
      import: "./src/libs/index.ts",
      default: "./src/libs/index.ts",
    },
  };

  // 3. Base publishConfig exports (points to compiled ./dist).
  //    Vite lib mode with preserveModules emits per-module chunks rooted at
  //    src/, so runtime JS + declarations mirror the source layout.
  const JSBUNDLE = "./dist/index.js";
  const publishExportsMap: Record<string, unknown> = {
    ".": {
      types: "./dist/index.d.ts",
      import: JSBUNDLE,
      default: JSBUNDLE,
    },
    "./styles": {
      style: "./dist/index.css",
      default: "./dist/index.css",
    },
    "./config": {
      types: "./dist/config/index.d.ts",
      import: JSBUNDLE,
      default: JSBUNDLE,
    },
    "./libs": {
      types: "./dist/libs/index.d.ts",
      import: JSBUNDLE,
      default: JSBUNDLE,
    },
  };

  // 4. Map each component directory
  for (const entry of registry) {
    const mainFile =
      entry.files.find((f) => f.match(/\/index\.(?:ts|tsx)$/)) ??
      entry.files.find((f) => f.match(/\/(?:[A-Z]\w*)\.tsx$/)) ??
      entry.files[0];

    if (mainFile) {
      // Local development entry point
      exportsMap[`./${entry.name}`] = {
        types: `./${mainFile}`,
        import: `./${mainFile}`,
        default: `./${mainFile}`,
      };

      // Dist entry targets (convert src/*.tsx -> dist/*.js and dist/*.d.ts)
      const distJsFile = mainFile
        .replace(/^src\//, "dist/")
        .replace(/\.(?:ts|tsx)$/, ".js");
      const distDtsFile = mainFile
        .replace(/^src\//, "dist/")
        .replace(/\.(?:ts|tsx)$/, ".d.ts");

      publishExportsMap[`./${entry.name}`] = {
        types: `./${distDtsFile}`,
        import: `./${distJsFile}`,
        default: `./${distJsFile}`,
      };
    }
  }

  // 5. Special fallback mappings
  exportsMap["./styles.css"] = "./src/index.css";
  exportsMap["./src/*"] = "./src/*";

  publishExportsMap["./styles.css"] = "./dist/index.css";

  // 6. Write exports and publishConfig back to package.json
  pkg.exports = exportsMap;
  pkg.publishConfig = {
    ...pkg.publishConfig,
    main: "./dist/index.js",
    module: "./dist/index.js",
    types: "./dist/index.d.ts",
    style: "./dist/index.css",
    exports: publishExportsMap,
  };

  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
}

function main(): void {
  const registry = buildRegistry();
  updatePackageJsonExports(registry);

  const totalFiles = registry.reduce(
    (sum, entry) => sum + entry.files.length,
    0,
  );

  console.log(
    `[build-registry] Indexed ${registry.length} components (${totalFiles} files). package.json exports & publishConfig updated successfully.`,
  );
}

main();
