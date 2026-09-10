import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  discoverComponentFolders,
  renderComponentList,
  resolveAsheeuiPackage,
} from "../src/lib/list/list";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "ashee-list-"));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

async function write(name: string, content = "") {
  const file = join(dir, name);
  await mkdir(join(file, ".."), { recursive: true });
  await writeFile(file, content, "utf8");
}

async function scaffoldPackage(componentsDir: string) {
  await write(
    join("asheeui-pkg", "package.json"),
    JSON.stringify({ name: "asheeui" }),
  );
  const base = join("asheeui-pkg", componentsDir);
  await write(join(base, "button", "index.tsx"), "export {};");
  await write(join(base, "modal", "modal.tsx"), "export {};");
  await write(join(base, "date-picker", "index.ts"), "export {};");
  // No source files → should be excluded.
  await write(join(base, "legacy", "README.md"), "docs only");
  // Listed in IGNORED_COMPONENTS → should be excluded.
  await write(join(base, "select-menu", "index.tsx"), "export {};");
  await write(join(base, "field", "index.tsx"), "export {};");
  // Nested folder is not a top-level component.
  await write(join(base, "button", "sub", "x.ts"), "export {};");
}

describe("discoverComponentFolders", () => {
  it("discovers components from src/components", async () => {
    await scaffoldPackage("src/components");

    const components = await discoverComponentFolders(join(dir, "asheeui-pkg"));

    expect(components).toEqual(["button", "date-picker", "modal"]);
  });

  it("omits components listed in IGNORED_COMPONENTS", async () => {
    await scaffoldPackage("src/components");

    const components = await discoverComponentFolders(join(dir, "asheeui-pkg"));

    expect(components).not.toContain("select-menu");
    expect(components).not.toContain("field");
    expect(components).toEqual(["button", "date-picker", "modal"]);
  });

  it("discovers components from dist/components", async () => {
    await scaffoldPackage("dist/components");

    const components = await discoverComponentFolders(join(dir, "asheeui-pkg"));

    expect(components).toEqual(["button", "date-picker", "modal"]);
  });

  it("accepts a components directory directly", async () => {
    await scaffoldPackage("src/components");

    const components = await discoverComponentFolders(
      join(dir, "asheeui-pkg", "src", "components"),
    );

    expect(components).toContain("button");
    expect(components).toContain("modal");
    expect(components).not.toContain("legacy");
  });

  it("returns an empty list when no components directory exists", async () => {
    await write(
      "asheeui-pkg/package.json",
      JSON.stringify({ name: "asheeui" }),
    );
    const components = await discoverComponentFolders(join(dir, "asheeui-pkg"));
    expect(components).toEqual([]);
  });
});

describe("resolveAsheeuiPackage", () => {
  it("uses an explicit path", async () => {
    await scaffoldPackage("src/components");
    const resolved = await resolveAsheeuiPackage({
      cwd: dir,
      explicitPath: join(dir, "asheeui-pkg"),
    });
    expect(resolved).toBe(join(dir, "asheeui-pkg"));
  });

  it("finds an installed asheeui package from a nested project directory", async () => {
    await write(
      join("node_modules", "asheeui", "package.json"),
      JSON.stringify({ name: "asheeui" }),
    );
    await write(
      join(
        "node_modules",
        "asheeui",
        "src",
        "components",
        "button",
        "index.tsx",
      ),
      "export {};",
    );

    const project = join(dir, "apps", "my-app");
    const resolved = await resolveAsheeuiPackage({ cwd: project });
    expect(resolved).toBe(join(dir, "node_modules", "asheeui"));
  });

  it("falls back to the monorepo asheeui source package", async () => {
    // When running inside the asheeui monorepo (this repo), resolution walks
    // up from the CLI's own module and finds packages/ui.
    const resolved = await resolveAsheeuiPackage({ cwd: dir });
    expect(resolved).not.toBeNull();
    if (resolved) {
      const { existsSync } = await import("node:fs");
      expect(existsSync(join(resolved, "src", "components"))).toBe(true);
    }
  });
});

describe("renderComponentList", () => {
  it("renders every component name", () => {
    const output = renderComponentList(["accordion", "button", "modal"]);
    expect(output).toContain("accordion");
    expect(output).toContain("button");
    expect(output).toContain("modal");
  });

  it("handles an empty list", () => {
    expect(renderComponentList([])).toBe("No components found.");
  });
});
