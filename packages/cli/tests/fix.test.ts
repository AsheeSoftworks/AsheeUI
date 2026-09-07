import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { runDoctorChecks } from "../src/lib/doctor/doctor";
import { runFix } from "../src/lib/fix/fix";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "ashee-fix-"));
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

/** A Vite + React project with missing config, CSS import and provider. */
async function scaffoldBrokenViteProject() {
  await write(
    "package.json",
    JSON.stringify(
      {
        name: "broken-vite-fixture",
        private: true,
        type: "module",
        dependencies: {
          asheeui: "^0.4.0",
          react: "^19.0.0",
          "react-dom": "^19.0.0",
        },
        devDependencies: {
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

async function snapshots() {
  return {
    config: await read("asheeui.config.ts"),
    css: await read("src/index.css"),
    main: await read("src/main.tsx"),
    vite: await read("vite.config.ts"),
  };
}

describe("runFix", () => {
  it("remediates config, CSS and provider issues without installs", async () => {
    await scaffoldBrokenViteProject();

    const before = await runDoctorChecks({ cwd: dir });
    expect(before.find((c) => c?.id === "config")?.status).toBe("fail");
    expect(before.find((c) => c?.id === "css")?.status).toBe("fail");
    expect(before.find((c) => c?.id === "provider")?.status).toBe("fail");
    expect(before.find((c) => c?.id === "peer-deps")?.status).toBe("pass");

    const result = await runFix({ cwd: dir, skipInstall: true });

    const byId = new Map(result.outcomes.map((o) => [o.id, o]));
    expect(byId.get("config")?.status).toBe("fixed");
    expect(byId.get("css")?.status).toBe("fixed");
    expect(byId.get("provider")?.status).toBe("fixed");
    expect(byId.get("peer-deps")?.status).toBe("already");
    expect(result.remaining).toEqual([]);

    // Verify exact, non-duplicated content.
    const css = await read("src/index.css");
    const vite = await read("vite.config.ts");
    const main = await read("src/main.tsx");
    const config = await read("asheeui.config.ts");

    expect(css).toContain('@import "asheeui/styles"');
    expect(countOccurrences(css, '@import "asheeui/styles"')).toBe(1);
    expect(countOccurrences(vite, "@asheeui/vite")).toBe(0);
    expect(countOccurrences(vite, "asheeui()")).toBe(0);
    expect(countOccurrences(main, "AsheeProvider")).toBe(3);
    expect(main).toContain('import config from "../asheeui.config"');
    expect(countOccurrences(config, "defineConfig")).toBe(2);

    // Doctor now passes every actionable check.
    const after = await runDoctorChecks({ cwd: dir });
    for (const check of after) {
      if (check?.id === "theme-augmentation") continue;
      expect(check?.status).toBe("pass");
    }
  });

  it("is idempotent: a second run changes nothing and never duplicates", async () => {
    await scaffoldBrokenViteProject();

    const first = await runFix({ cwd: dir, skipInstall: true });
    const afterFirst = await snapshots();

    const second = await runFix({ cwd: dir, skipInstall: true });
    const afterSecond = await snapshots();

    expect(afterSecond).toEqual(afterFirst);

    for (const outcome of second.outcomes) {
      if (outcome.status === "info") continue;
      expect(outcome.status).toBe("already");
    }
    expect(second.remaining).toEqual([]);

    const css = afterSecond.css;
    const vite = afterSecond.vite;
    const main = afterSecond.main;
    expect(countOccurrences(css, '@import "asheeui/styles"')).toBe(1);
    expect(countOccurrences(vite, "@asheeui/vite")).toBe(0);
    expect(countOccurrences(vite, "asheeui()")).toBe(0);
    expect(countOccurrences(main, "AsheeProvider")).toBe(3);
    expect(first.outcomes.length).toBeGreaterThan(0);
  });

  it("reports manual steps when there is nothing left to fix", async () => {
    await scaffoldBrokenViteProject();
    await runFix({ cwd: dir, skipInstall: true });

    const result = await runFix({ cwd: dir, skipInstall: true });
    expect(result.remaining).toEqual([]);
  });
});
