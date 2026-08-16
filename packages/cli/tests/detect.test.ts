import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { detectFramework } from "../src/lib/detect.js";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "ashee-detect-"));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

async function writePkg(
  deps: Record<string, string>,
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

describe("detectFramework", () => {
  it("detects Next.js App Router with high confidence", async () => {
    await writePkg({ next: "^15.0.0" });
    await mkdir(join(dir, "app"));
    await writeFile(
      join(dir, "app", "layout.tsx"),
      "export default function RootLayout() {}",
    );

    const result = await detectFramework({ cwd: dir });

    expect(result.framework).toBe("next");
    expect(result.confidence).toBe("high");
    expect(result.evidence).toContain("found app/ directory");
  });

  it("detects Next.js Pages Router with high confidence", async () => {
    await writePkg({ next: "^15.0.0" });
    await mkdir(join(dir, "pages"));
    await writeFile(
      join(dir, "pages", "_app.tsx"),
      "export default function App() {}",
    );

    const result = await detectFramework({ cwd: dir });

    expect(result.framework).toBe("next");
    expect(result.confidence).toBe("high");
  });

  it("detects Next.js via config file when no app/pages dir", async () => {
    await writePkg({ next: "^15.0.0" });
    await writeFile(join(dir, "next.config.mjs"), "export default {};");

    const result = await detectFramework({ cwd: dir });

    expect(result.framework).toBe("next");
    expect(result.confidence).toBe("high");
    expect(result.evidence).toContain("found next config file");
  });

  it("detects Next.js with medium confidence when only dependency exists", async () => {
    await writePkg({ next: "^15.0.0" });

    const result = await detectFramework({ cwd: dir });

    expect(result.framework).toBe("next");
    expect(result.confidence).toBe("medium");
  });

  it("detects Vite + React with high confidence when vite.config exists", async () => {
    await writePkg({ react: "^18.0.0" }, { vite: "^6.0.0" });
    await writeFile(join(dir, "vite.config.ts"), "export default {};");

    const result = await detectFramework({ cwd: dir });

    expect(result.framework).toBe("vite-react");
    expect(result.confidence).toBe("high");
  });

  it("detects Vite + React with medium confidence via entry file", async () => {
    await writePkg(
      { react: "^18.0.0", "react-dom": "^18.0.0" },
      { vite: "^6.0.0" },
    );
    await mkdir(join(dir, "src"));
    await writeFile(
      join(dir, "src", "main.tsx"),
      `import { createRoot } from "react-dom/client";`,
    );

    const result = await detectFramework({ cwd: dir });

    expect(result.framework).toBe("vite-react");
    expect(result.confidence).toBe("medium");
  });

  it("detects Vite + React with low confidence when only deps exist", async () => {
    await writePkg({ react: "^18.0.0" }, { vite: "^6.0.0" });

    const result = await detectFramework({ cwd: dir });

    expect(result.framework).toBe("vite-react");
    expect(result.confidence).toBe("low");
  });

  it("detects TanStack Start with high confidence when config exists", async () => {
    await writePkg({ "@tanstack/react-start": "^1.0.0" });
    await writeFile(join(dir, "app.config.ts"), "export default {};");

    const result = await detectFramework({ cwd: dir });

    expect(result.framework).toBe("tanstack-start");
    expect(result.confidence).toBe("high");
  });

  it("detects TanStack Start with medium confidence from dependency only", async () => {
    await writePkg({ "@tanstack/react-start": "^1.0.0" });

    const result = await detectFramework({ cwd: dir });

    expect(result.framework).toBe("tanstack-start");
    expect(result.confidence).toBe("medium");
  });

  it("returns unknown when no framework dependencies found", async () => {
    await writePkg({ lodash: "^4.17.0" });

    const result = await detectFramework({ cwd: dir });

    expect(result.framework).toBe("unknown");
    expect(result.confidence).toBe("low");
  });

  it("handles missing package.json", async () => {
    const result = await detectFramework({ cwd: dir });
    expect(result.framework).toBe("unknown");
  });

  it("checks devDependencies as well", async () => {
    await writePkg({}, { next: "^15.0.0", "@types/node": "^22.0.0" });
    await mkdir(join(dir, "app"));
    await writeFile(
      join(dir, "app", "layout.tsx"),
      "export default function RootLayout() {}",
    );

    const result = await detectFramework({ cwd: dir });
    expect(result.framework).toBe("next");
  });
});
