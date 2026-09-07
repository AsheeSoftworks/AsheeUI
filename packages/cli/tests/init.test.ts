import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { runInit } from "../src/lib/init/init";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "ashee-init-"));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

async function write(name: string, content: string) {
  const file = join(dir, name);
  await mkdir(join(file, ".."), { recursive: true });
  await writeFile(file, content, "utf8");
}

async function read(name: string): Promise<string> {
  return readFile(join(dir, name), "utf8");
}

function countOccurrences(content: string, needle: string): number {
  return content.split(needle).length - 1;
}

async function scaffoldViteProject() {
  await write(
    "package.json",
    JSON.stringify(
      {
        name: "vite-fixture",
        private: true,
        type: "module",
        dependencies: {
          asheeui: "^0.4.0",
          react: "^19.0.0",
          "react-dom": "^19.0.0",
        },
        devDependencies: {
          "@vitejs/plugin-react": "^4.0.0",
          tailwindcss: "^4.0.0",
          vite: "^6.0.0",
        },
      },
      null,
      2,
    ),
  );
  await write("tsconfig.json", "{}");
  await write(
    "vite.config.ts",
    `import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
});
`,
  );
  await write(
    "src/main.tsx",
    `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`,
  );
  await write("src/index.css", `@import "tailwindcss";\n`);
}

describe("runInit idempotency", () => {
  it("scaffolds a Vite project on the first run", async () => {
    await scaffoldViteProject();

    const result = await runInit({ template: "default", yes: true }, dir);

    expect(result.framework).toBe("vite-react");
    expect(result.filesCreated).toContain("asheeui.config.ts");
    expect(result.dependenciesInstalled).toEqual([]);

    // Config file
    const config = await read("asheeui.config.ts");
    expect(config).toContain('from "asheeui/config"');
    expect(config).toContain('defaultTheme: "light"');

    // CSS import added exactly once
    const css = await read("src/index.css");
    expect(countOccurrences(css, '@import "asheeui/styles"')).toBe(1);

    // The bundler config is left untouched: no plugin is needed anymore.
    const viteConfig = await read("vite.config.ts");
    expect(countOccurrences(viteConfig, "@asheeui/vite")).toBe(0);
    expect(countOccurrences(viteConfig, "asheeui()")).toBe(0);

    // Provider + runtime config import added exactly once in main.tsx
    const main = await read("src/main.tsx");
    expect(countOccurrences(main, "AsheeProvider")).toBe(3);
    expect(main).toContain('import config from "../asheeui.config"');
    expect(main).toContain("<AsheeProvider config={config}>");
    expect(main).toContain("</AsheeProvider>");
  });

  it("does not duplicate configs, imports or file contents when run twice", async () => {
    await scaffoldViteProject();

    const first = await runInit({ template: "default", yes: true }, dir);
    const firstSnapshots = new Map<string, string>([
      ["asheeui.config.ts", await read("asheeui.config.ts")],
      ["src/index.css", await read("src/index.css")],
      ["vite.config.ts", await read("vite.config.ts")],
      ["src/main.tsx", await read("src/main.tsx")],
    ]);

    expect(first.filesCreated.length).toBeGreaterThan(0);
    expect(first.filesModified.length).toBeGreaterThan(0);

    const second = await runInit({ template: "default", yes: true }, dir);

    // Second run should not create or modify anything.
    expect(second.filesCreated).toEqual([]);
    expect(second.filesModified).toEqual([]);
    expect(second.dependenciesInstalled).toEqual([]);

    for (const [name, before] of firstSnapshots) {
      expect(await read(name)).toBe(before);
    }

    const css = await read("src/index.css");
    const viteConfig = await read("vite.config.ts");
    const main = await read("src/main.tsx");
    const config = await read("asheeui.config.ts");

    expect(countOccurrences(css, '@import "asheeui/styles"')).toBe(1);
    expect(countOccurrences(viteConfig, "@asheeui/vite")).toBe(0);
    expect(countOccurrences(viteConfig, "asheeui()")).toBe(0);
    expect(countOccurrences(main, "AsheeProvider")).toBe(3);
    expect(countOccurrences(main, 'from "asheeui"')).toBe(1);
    expect(countOccurrences(config, "defineConfig")).toBe(2);
  });

  it("keeps an existing user config intact", async () => {
    await scaffoldViteProject();
    await write(
      "asheeui.config.ts",
      `import { defineConfig, type ExternalConfig } from "asheeui/config";

const config: ExternalConfig = {
  defaultTheme: "company-red",
  defaultVariant: "solid",
  defaultColor: "success",
};

export default defineConfig(config);
`,
    );

    const result = await runInit({ template: "default", yes: true }, dir);

    // Config was not created again nor overwritten.
    expect(result.filesCreated).not.toContain("asheeui.config.ts");
    const config = await read("asheeui.config.ts");
    expect(config).toContain("company-red");
    expect(config).not.toContain('defaultTheme: "light"');
  });
});
