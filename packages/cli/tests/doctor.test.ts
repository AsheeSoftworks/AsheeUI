import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  formatInstallCommand,
  lowerBoundOf,
  satisfiesRange,
} from "../src/lib/doctor/check-deps";
import { runDoctorChecks } from "../src/lib/doctor/doctor";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "ashee-doctor-"));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

async function writePkg(
  deps: Record<string, string> = {},
  devDeps: Record<string, string> = {},
) {
  const pkg = {
    name: "fixture",
    private: true,
    dependencies: deps,
    devDependencies: devDeps,
  };
  await writeFile(join(dir, "package.json"), JSON.stringify(pkg, null, 2));
}

async function write(name: string, content: string) {
  const file = join(dir, name);
  await mkdir(join(file, ".."), { recursive: true });
  await writeFile(file, content);
}

async function resultOf(id: string) {
  const results = await runDoctorChecks({ cwd: dir });
  const found = results.find((result) => result?.id === id);
  expect(found).toBeDefined();
  return found;
}

describe("runDoctorChecks", () => {
  it("passes all checks for a properly configured project", async () => {
    await writePkg(
      {
        react: "^19.0.0",
        "react-dom": "^19.0.0",
      },
      { tailwindcss: "^4.0.0" },
    );
    await write("asheeui.config.ts", "export default {};");
    await write(
      "src/index.css",
      `@import "asheeui/styles";
@tailwind base;`,
    );
    await write(
      "src/main.tsx",
      `import { AsheeUIProvider } from "asheeui";
import { createRoot } from "react-dom/client";`,
    );

    const results = await runDoctorChecks({ cwd: dir });

    // Theme augmentation is informational; all other checks must pass.
    for (const result of results) {
      if (result?.id === "theme-augmentation") continue;
      expect(result?.status).toBe("pass");
    }
  });

  describe("configuration file check", () => {
    it("passes when asheeui.config.ts is in the project root", async () => {
      await write("asheeui.config.ts", "export default {};");
      const result = await resultOf("config");
      expect(result?.status).toBe("pass");
    });

    it("passes when asheeui.config.js is in src/", async () => {
      await write("src/asheeui.config.js", "export default {};");
      const result = await resultOf("config");
      expect(result?.status).toBe("pass");
    });

    it("fails when no config file exists and suggests init", async () => {
      const result = await resultOf("config");
      expect(result?.status).toBe("fail");
      expect(result?.fix).toContain("asheeui init");
    });
  });

  describe("CSS styles import check", () => {
    it('passes when @import "asheeui/styles" exists', async () => {
      await write("src/index.css", `@import "asheeui/styles";`);
      const result = await resultOf("css");
      expect(result?.status).toBe("pass");
    });

    it("passes with single quotes and .css suffix", async () => {
      await write("src/globals.css", `@import 'asheeui/styles.css';`);
      const result = await resultOf("css");
      expect(result?.status).toBe("pass");
    });

    it("passes when found in app/globals.css", async () => {
      await write("app/globals.css", `@import "asheeui/styles";`);
      const result = await resultOf("css");
      expect(result?.status).toBe("pass");
    });

    it("fails when a CSS file exists without the import", async () => {
      await write("src/index.css", `@tailwind base;`);
      const result = await resultOf("css");
      expect(result?.status).toBe("fail");
      expect(result?.fix).toContain('@import "asheeui/styles"');
    });

    it("fails with a useful message when no CSS file exists", async () => {
      const result = await resultOf("css");
      expect(result?.status).toBe("fail");
      expect(result?.message).toContain("No common CSS entry file found");
    });
  });

  describe("peer dependency check", () => {
    it("passes when all required dependencies are installed", async () => {
      await writePkg(
        {
          react: "^19.1.0",
          "react-dom": "^19.1.0",
        },
        { tailwindcss: "^4.0.0" },
      );
      const result = await resultOf("peer-deps");
      expect(result?.status).toBe("pass");
    });

    it("passes with React 18 and Tailwind 3", async () => {
      await writePkg(
        {
          react: "^18.3.1",
          "react-dom": "^18.3.1",
        },
        { tailwindcss: "^3.4.0" },
      );
      const result = await resultOf("peer-deps");
      expect(result?.status).toBe("pass");
    });

    it("fails when react and react-dom are missing", async () => {
      await writePkg({}, { tailwindcss: "^4.0.0" });
      const result = await resultOf("peer-deps");
      expect(result?.status).toBe("fail");
      expect(result?.fix).toMatch(
        /(npm install|pnpm add|yarn add|bun add) react react-dom/,
      );
    });

    it("fails when tailwindcss is missing", async () => {
      await writePkg({ react: "^19.0.0", "react-dom": "^19.0.0" });
      const result = await resultOf("peer-deps");
      expect(result?.status).toBe("fail");
      expect(result?.fix).toMatch(/tailwindcss/);
    });

    it("passes (no warnings) when optional/animation packages are absent", async () => {
      await writePkg(
        { react: "^19.0.0", "react-dom": "^19.0.0" },
        { tailwindcss: "^4.0.0" },
      );
      const result = await resultOf("peer-deps");
      expect(result?.status).toBe("pass");
      expect(result?.message).not.toMatch(/framer-motion/);
      expect(result?.message).not.toMatch(/optional/);
    });

    it("fails with unsupported version", async () => {
      await writePkg(
        { react: "^17.0.2", "react-dom": "^17.0.2" },
        { tailwindcss: "^4.0.0" },
      );
      const result = await resultOf("peer-deps");
      expect(result?.status).toBe("fail");
      expect(result?.message).toContain("unsupported versions");
    });

    it("handles missing package.json gracefully", async () => {
      const result = await resultOf("peer-deps");
      expect(result?.status).toBe("fail");
      expect(result?.message).toContain("Could not find package.json");
    });
  });

  describe("root provider check", () => {
    it("passes when AsheeUIProvider is in src/main.tsx", async () => {
      await write("src/main.tsx", `import { AsheeUIProvider } from "asheeui";`);
      const result = await resultOf("provider");
      expect(result?.status).toBe("pass");
    });

    it("passes when asheeui is imported in app/layout.tsx", async () => {
      await write(
        "app/layout.tsx",
        `import { AsheeUIProvider } from "asheeui";`,
      );
      const result = await resultOf("provider");
      expect(result?.status).toBe("pass");
    });

    it("passes when provider is rendered in src/App.tsx", async () => {
      await write(
        "src/App.tsx",
        `export function App() { return <AsheeUIProvider>...</AsheeUIProvider>; }`,
      );
      const result = await resultOf("provider");
      expect(result?.status).toBe("pass");
    });

    it("fails when entrypoint exists without the provider", async () => {
      await write(
        "src/main.tsx",
        `import { createRoot } from "react-dom/client";`,
      );
      const result = await resultOf("provider");
      expect(result?.status).toBe("fail");
      expect(result?.fix).toContain("AsheeUIProvider");
    });

    it("fails when no entrypoint exists", async () => {
      const result = await resultOf("provider");
      expect(result?.status).toBe("fail");
    });
  });

  describe("theme augmentation check", () => {
    it("detects declare module 'asheeui' in a .d.ts file", async () => {
      await write(
        "ashee-theme.d.ts",
        `declare module 'asheeui' { export interface AsheeThemeNameRegistry { custom: string; } }`,
      );
      const result = await resultOf("theme-augmentation");
      expect(result?.status).toBe("info");
      expect(result?.message).toContain("Custom theme registry detected");
    });

    it("detects AsheeThemeNameRegistry in src", async () => {
      await write(
        "src/ashee-theme.d.ts",
        `interface AsheeThemeNameRegistry { custom: string }`,
      );
      const result = await resultOf("theme-augmentation");
      expect(result?.status).toBe("info");
      expect(result?.message).toContain("Custom theme registry detected");
    });

    it("reports informational message when no augmentation found", async () => {
      const result = await resultOf("theme-augmentation");
      expect(result?.status).toBe("info");
      expect(result?.message).toContain("optional");
    });
  });
});

describe("satisfiesRange", () => {
  it("accepts React 18", () => {
    expect(satisfiesRange("^18.3.1", "^18.0.0 || ^19.0.0")).toBe(true);
  });

  it("accepts React 19", () => {
    expect(satisfiesRange("^19.0.0", "^18.0.0 || ^19.0.0")).toBe(true);
  });

  it("rejects React 17", () => {
    expect(satisfiesRange("^17.0.2", "^18.0.0 || ^19.0.0")).toBe(false);
  });

  it("accepts a workspace: protocol spec as present", () => {
    expect(satisfiesRange("workspace:*", "^18.0.0 || ^19.0.0")).toBe(true);
  });

  it("accepts * as present", () => {
    expect(satisfiesRange("*", "^18.0.0 || ^19.0.0")).toBe(true);
  });

  it("accepts tailwind 4 with >= range", () => {
    expect(satisfiesRange("^4.0.0", ">=4.0.0 || ^3.0.0")).toBe(true);
  });

  it("accepts tailwind 3", () => {
    expect(satisfiesRange("^3.4.0", ">=4.0.0 || ^3.0.0")).toBe(true);
  });

  it("rejects tailwind 2", () => {
    expect(satisfiesRange("^2.2.0", ">=4.0.0 || ^3.0.0")).toBe(false);
  });
});

describe("lowerBoundOf", () => {
  it("parses caret ranges", () => {
    expect(lowerBoundOf("^18.2.0")).toEqual({
      major: 18,
      minor: 2,
      patch: 0,
    });
  });

  it("returns null for wildcard", () => {
    expect(lowerBoundOf("*")).toBeNull();
  });

  it("returns null for workspace protocol", () => {
    expect(lowerBoundOf("workspace:*")).toBeNull();
  });
});

describe("formatInstallCommand", () => {
  it("formats pnpm add", () => {
    expect(formatInstallCommand("pnpm", ["react", "react-dom"])).toBe(
      "pnpm add react react-dom",
    );
  });

  it("formats npm install", () => {
    expect(formatInstallCommand("npm", ["react", "react-dom"])).toBe(
      "npm install react react-dom",
    );
  });

  it("formats with dev flag", () => {
    expect(formatInstallCommand("npm", ["tailwindcss"], true)).toBe(
      "npm install -D tailwindcss",
    );
  });

  it("formats pnpm with dev flag", () => {
    expect(formatInstallCommand("pnpm", ["tailwindcss"], true)).toBe(
      "pnpm add -D tailwindcss",
    );
  });
});
