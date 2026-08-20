import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  resolveGlobalCss,
  resolveRouterOrEntryPoint,
  resolveViteOrAppConfig,
} from "../src/lib/integration/resolvers.js";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "ashee-resolvers-"));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("resolveGlobalCss", () => {
  it("returns null when no global stylesheet exists", async () => {
    await expect(resolveGlobalCss(dir)).resolves.toBeNull();
  });

  it("finds src/styles.css first", async () => {
    await mkdir(join(dir, "src"));
    await writeFile(join(dir, "src", "styles.css"), "body {}");
    await writeFile(join(dir, "src", "index.css"), "body {}");

    await expect(resolveGlobalCss(dir)).resolves.toBe(
      join(dir, "src", "styles.css"),
    );
  });

  it("falls back to src/index.css when earlier candidates are missing", async () => {
    await mkdir(join(dir, "src"));
    await writeFile(join(dir, "src", "index.css"), "body {}");

    await expect(resolveGlobalCss(dir)).resolves.toBe(
      join(dir, "src", "index.css"),
    );
  });

  it("finds app/globals.css for Next.js layouts", async () => {
    await mkdir(join(dir, "app"));
    await writeFile(join(dir, "app", "globals.css"), "@tailwind base;");

    await expect(resolveGlobalCss(dir)).resolves.toBe(
      join(dir, "app", "globals.css"),
    );
  });
});

describe("resolveViteOrAppConfig", () => {
  it("returns null when no config file exists", async () => {
    await expect(resolveViteOrAppConfig(dir)).resolves.toBeNull();
  });

  it("finds vite.config.ts", async () => {
    await writeFile(join(dir, "vite.config.ts"), "export default {};");

    await expect(resolveViteOrAppConfig(dir)).resolves.toBe(
      join(dir, "vite.config.ts"),
    );
  });

  it("finds app.config.ts before next.config.ts", async () => {
    await writeFile(join(dir, "app.config.ts"), "export default {};");
    await writeFile(join(dir, "next.config.ts"), "export default {};");

    await expect(resolveViteOrAppConfig(dir)).resolves.toBe(
      join(dir, "app.config.ts"),
    );
  });

  it("finds next.config.mjs when only that exists", async () => {
    await writeFile(join(dir, "next.config.mjs"), "export default {};");

    await expect(resolveViteOrAppConfig(dir)).resolves.toBe(
      join(dir, "next.config.mjs"),
    );
  });

  it("finds next.config.js as a fallback", async () => {
    await writeFile(join(dir, "next.config.js"), "module.exports = {};");

    await expect(resolveViteOrAppConfig(dir)).resolves.toBe(
      join(dir, "next.config.js"),
    );
  });
});

describe("resolveRouterOrEntryPoint", () => {
  it("returns null for an empty project", async () => {
    await expect(
      resolveRouterOrEntryPoint(dir, "vite-react"),
    ).resolves.toBeNull();
  });

  it("finds TanStack Start __root.tsx before router.tsx", async () => {
    await mkdir(join(dir, "src", "routes"), { recursive: true });
    await writeFile(join(dir, "src", "routes", "__root.tsx"), "export {}");
    await writeFile(join(dir, "src", "router.tsx"), "export {}");

    await expect(
      resolveRouterOrEntryPoint(dir, "tanstack-start"),
    ).resolves.toBe(join(dir, "src", "routes", "__root.tsx"));
  });

  it("finds app/routes/__root.tsx for TanStack Start", async () => {
    await mkdir(join(dir, "app", "routes"), { recursive: true });
    await writeFile(join(dir, "app", "routes", "__root.tsx"), "export {}");

    await expect(
      resolveRouterOrEntryPoint(dir, "tanstack-start"),
    ).resolves.toBe(join(dir, "app", "routes", "__root.tsx"));
  });

  it("finds Next.js app/layout.tsx", async () => {
    await mkdir(join(dir, "app"));
    await writeFile(
      join(dir, "app", "layout.tsx"),
      "export default () => null",
    );

    await expect(resolveRouterOrEntryPoint(dir, "next")).resolves.toBe(
      join(dir, "app", "layout.tsx"),
    );
  });

  it("finds Next.js pages/_app.tsx", async () => {
    await mkdir(join(dir, "pages"));
    await writeFile(
      join(dir, "pages", "_app.tsx"),
      "export default () => null",
    );

    await expect(resolveRouterOrEntryPoint(dir, "next")).resolves.toBe(
      join(dir, "pages", "_app.tsx"),
    );
  });

  it("finds Vite src/main.tsx", async () => {
    await mkdir(join(dir, "src"));
    await writeFile(
      join(dir, "src", "main.tsx"),
      'import { createRoot } from "react-dom/client";',
    );

    await expect(resolveRouterOrEntryPoint(dir, "vite-react")).resolves.toBe(
      join(dir, "src", "main.tsx"),
    );
  });

  it("finds Vite src/main.js when only JS exists", async () => {
    await mkdir(join(dir, "src"));
    await writeFile(join(dir, "src", "main.js"), "console.log('hi');");

    await expect(resolveRouterOrEntryPoint(dir, "vite-react")).resolves.toBe(
      join(dir, "src", "main.js"),
    );
  });
});
