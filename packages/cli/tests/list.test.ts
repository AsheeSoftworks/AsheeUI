import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  componentGroupFromSpecifier,
  componentNameFromSpecifier,
  discoverComponentGroups,
  discoverPublicComponents,
  parsePublicComponentNames,
  parsePublicComponents,
  renderComponentList,
  renderGroupedComponentList,
  resolveAsheeuiPackage,
} from "../src/lib/list/list";

/** Source of a public entry module whose components sit in category folders. */
const GROUPED_ENTRY_SOURCE = [
  'export * from "./components/forms/input";',
  'export { Chip } from "./components/data-display/chip";',
  // A category whose name is also the component's name.
  'export * from "./components/typography";',
  // Type-only exports do not create a public component.
  'export type { MenuOption } from "./components/forms/menu";',
].join("\n");

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

/** Source of a public entry module that re-exports a known component set. */
const ENTRY_SOURCE = [
  'export * from "./components/button";',
  'export { Chip } from "./components/chip";',
  'export * from "./components/card";',
  'export * from "./components/calendar";',
  'export * from "./components/modal";',
  // Type-only exports do not create a public component.
  'export type { MenuOption } from "./components/menu";',
  'export type { ExternalConfig } from "./config";',
  // Modules outside components/ are not components.
  'export * from "./libs/registry";',
  "",
].join("\n");

/** Source of a built entry module that bundles its component chunks. */
const BUNDLED_ENTRY_SOURCE = [
  'import { Button as a } from "./components/button/Button.js";',
  'import { Card as b } from "./components/card/Card.js";',
  'import { Chip as c } from "./components/chip/Chip.js";',
  'import { Calendar as d } from "./components/calendar/Calendar.js";',
  'import { Modal as e } from "./components/modal/Modal.js";',
  'import type { MenuOption } from "./components/menu/index.js";',
  'import { registerComponentDefaults } from "./libs/registry.js";',
  "export { a as Button, b as Card, c as Chip, d as Calendar, e as Modal };",
  "",
].join("\n");

/**
 * Scaffold a `@asheeui/web` package whose public entry module re-exports a known
 * component set. Directories that are never re-exported still exist on disk,
 * so the tests can prove they do not reach the inventory.
 */
async function scaffoldPackage(
  options: {
    entry?: string;
    entrySource?: string;
    packageJson?: Record<string, unknown>;
  } = {},
) {
  const entry = options.entry ?? "src/index.ts";
  await write(
    join("asheeui-pkg", "package.json"),
    JSON.stringify({
      name: "@asheeui/web",
      main: `./${entry}`,
      ...options.packageJson,
    }),
  );
  await write(join("asheeui-pkg", entry), options.entrySource ?? ENTRY_SOURCE);

  // Present on disk but never exported: internal helpers, config modules,
  // documentation-only folders, and nested folders.
  await write(
    join("asheeui-pkg", "src", "components", "field", "index.tsx"),
    "export {};",
  );
  await write(
    join("asheeui-pkg", "src", "components", "menu", "index.tsx"),
    "export {};",
  );
  await write(
    join("asheeui-pkg", "src", "components", "scrollbar", "index.ts"),
    "export {};",
  );
  await write(
    join("asheeui-pkg", "src", "components", "legacy", "README.md"),
    "docs only",
  );
  await write(
    join("asheeui-pkg", "src", "components", "button", "sub", "x.ts"),
    "export {};",
  );
}

describe("discoverPublicComponents", () => {
  it("lists only the components re-exported by the public entry module", async () => {
    await scaffoldPackage();

    const components = await discoverPublicComponents(join(dir, "asheeui-pkg"));

    expect(components).toEqual(["button", "calendar", "card", "chip", "modal"]);
  });

  it("never lists internal helpers or unexported directories", async () => {
    await scaffoldPackage();

    const components = await discoverPublicComponents(join(dir, "asheeui-pkg"));

    expect(components).not.toContain("field");
    expect(components).not.toContain("menu");
    expect(components).not.toContain("scrollbar");
    expect(components).not.toContain("legacy");
  });

  it("ignores type-only exports and modules outside components/", async () => {
    await scaffoldPackage();

    const components = await discoverPublicComponents(join(dir, "asheeui-pkg"));

    expect(components).not.toContain("config");
    expect(components).not.toContain("registry");
  });

  it("reads the entry module declared by the package exports map", async () => {
    await scaffoldPackage({
      packageJson: {
        exports: {
          ".": {
            types: "./src/index.ts",
            import: "./src/index.ts",
            default: "./src/index.ts",
          },
          "./styles": "./src/index.css",
        },
      },
    });

    const components = await discoverPublicComponents(join(dir, "asheeui-pkg"));

    expect(components).toContain("button");
    expect(components).toContain("modal");
  });

  it("reads a built entry module whose components are bundled", async () => {
    await scaffoldPackage({
      entry: "dist/index.js",
      entrySource: BUNDLED_ENTRY_SOURCE,
    });

    const components = await discoverPublicComponents(join(dir, "asheeui-pkg"));

    expect(components).toEqual(["button", "calendar", "card", "chip", "modal"]);
    expect(components).not.toContain("menu");
    expect(components).not.toContain("registry");
  });

  it("returns an empty list when the package has no entry module", async () => {
    await write(
      join("asheeui-pkg", "package.json"),
      JSON.stringify({ name: "@asheeui/web" }),
    );

    const components = await discoverPublicComponents(join(dir, "asheeui-pkg"));

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

  it("finds an installed @asheeui/web package from a nested project directory", async () => {
    await write(
      join("node_modules", "@asheeui", "web", "package.json"),
      JSON.stringify({ name: "@asheeui/web" }),
    );
    await write(
      join(
        "node_modules",
        "@asheeui",
        "web",
        "src",
        "components",
        "button",
        "index.tsx",
      ),
      "export {};",
    );

    const project = join(dir, "apps", "my-app");
    const resolved = await resolveAsheeuiPackage({ cwd: project });
    expect(resolved).toBe(join(dir, "node_modules", "@asheeui", "web"));
  });

  it("falls back to the monorepo asheeui source package", async () => {
    // When running inside the asheeui monorepo (this repo), resolution walks
    // up from the CLI's own module and finds packages/web.
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

describe("parsePublicComponentNames", () => {
  it("extracts component names from runtime re-exports", () => {
    const names = parsePublicComponentNames(
      [
        'export * from "./components/accordion";',
        'export { Button } from "./components/button";',
        "",
      ].join("\n"),
    );

    expect(names).toEqual(["accordion", "button"]);
  });

  it("ignores type-only exports, non-component modules, and duplicates", () => {
    const names = parsePublicComponentNames(
      [
        'export type { MenuOption } from "./components/menu";',
        'export type { ExternalConfig } from "./config";',
        'export * from "./libs/registry";',
        'export { THEME_STORAGE_KEY } from "./theme/controller";',
        'export * from "./components/toast";',
        'export * from "./components/toast/index";',
        "",
      ].join("\n"),
    );

    expect(names).toEqual(["toast"]);
  });

  it("handles multi-line export lists", () => {
    const names = parsePublicComponentNames(
      [
        "export {",
        "  AsheeColorRegistry,",
        "  ColorConfig,",
        '} from "./theme/color";',
        'export * from "./components/modal";',
        "",
      ].join("\n"),
    );

    expect(names).toEqual(["modal"]);
  });

  it("derives the surface of a built entry module from its imports", () => {
    expect(parsePublicComponentNames(BUNDLED_ENTRY_SOURCE)).toEqual([
      "button",
      "calendar",
      "card",
      "chip",
      "modal",
    ]);
  });
});

describe("componentNameFromSpecifier", () => {
  it("maps a component module specifier to the component name", () => {
    expect(componentNameFromSpecifier("./components/calendar")).toBe(
      "calendar",
    );
    expect(componentNameFromSpecifier("./components/toast/index")).toBe(
      "toast",
    );
  });

  it("returns null for specifiers outside the components directory", () => {
    expect(componentNameFromSpecifier("./theme/controller")).toBeNull();
    expect(componentNameFromSpecifier("./components")).toBeNull();
  });
});

/**
 * The public inventory asserted here is the reconciled framework inventory:
 * 61 public components, of which 34 shipped at 1.0, 17 are the layout, pattern
 * and utility additions of 1.1, and 10 are the layout, composition and component
 * additions of 2.0. A change to the public export surface must update this list in
 * the same change, so the CLI cannot drift silently from the real inventory.
 */
const PUBLIC_COMPONENT_INVENTORY = [
  "accordion",
  "alert",
  "auth-layout",
  "autocomplete",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "carousel",
  "centered",
  "chip",
  "clipboard",
  "container",
  "cta",
  "data-table",
  "docs-layout",
  "drawer",
  "dropmenu",
  "empty-state",
  "error-state",
  "feature-grid",
  "file-upload",
  "footer",
  "form",
  "grid",
  "hero",
  "image",
  "input",
  "keyboard",
  "link",
  "loading-state",
  "marketing-layout",
  "marquee",
  "modal",
  "multi-select",
  "navbar",
  "page",
  "pagination",
  "pin-input",
  "pricing-card",
  "radio",
  "resizable-screen",
  "search-input",
  "section",
  "sidebar",
  "sidebar-layout",
  "skeleton",
  "spinner",
  "split",
  "stack",
  "stepper",
  "switch",
  "table",
  "tabs",
  "testimonials",
  "textarea",
  "toast",
  "tooltip",
  "typography",
] as const;

describe("public component inventory", () => {
  it("matches the reconciled inventory of @asheeui/web", async () => {
    const packageRoot = await resolveAsheeuiPackage({ cwd: dir });
    if (!packageRoot) {
      throw new Error("expected to resolve the renderer package");
    }

    const components = await discoverPublicComponents(packageRoot);

    expect(components).toEqual([...PUBLIC_COMPONENT_INVENTORY]);
  });

  it("never reports an internal helper or a non-component module", async () => {
    const packageRoot = await resolveAsheeuiPackage({ cwd: dir });
    if (!packageRoot) {
      throw new Error("expected to resolve the renderer package");
    }

    const components = await discoverPublicComponents(packageRoot);

    expect(components).not.toContain("field");
    expect(components).not.toContain("menu");
    expect(components).not.toContain("scrollbar");
    expect(components).not.toContain("section-kit");
    expect(components).not.toContain("puck");
  });

  it("reports the category each component lives in", async () => {
    const packageRoot = await resolveAsheeuiPackage({ cwd: dir });
    if (!packageRoot) {
      throw new Error("expected to resolve the renderer package");
    }

    const entries = await discoverComponentGroups(packageRoot);

    expect(entries).toHaveLength([...PUBLIC_COMPONENT_INVENTORY].length);
    expect(entries).toContainEqual({ name: "input", group: "forms" });
    expect(entries).toContainEqual({ name: "navbar", group: "navigation" });
    expect(entries).toContainEqual({ name: "stack", group: "layouts" });
    // A component that is its own category reports both with the same name.
    expect(entries).toContainEqual({ name: "typography", group: "typography" });
  });
});

describe("parsePublicComponents", () => {
  it("reads the category from the folder and the name from the component", () => {
    const entries = parsePublicComponents(GROUPED_ENTRY_SOURCE);

    expect(entries).toEqual([
      { name: "chip", group: "data-display" },
      { name: "input", group: "forms" },
      { name: "typography", group: "typography" },
    ]);
  });

  it("keeps the flat name list derived from the same surface", () => {
    expect(parsePublicComponentNames(GROUPED_ENTRY_SOURCE)).toEqual([
      "chip",
      "input",
      "typography",
    ]);
  });
});

describe("componentGroupFromSpecifier", () => {
  it("maps a grouped specifier to its category", () => {
    expect(componentGroupFromSpecifier("./components/forms/calendar")).toBe(
      "forms",
    );
    expect(
      componentGroupFromSpecifier("./components/data-display/table/index"),
    ).toBe("data-display");
  });

  it("treats a single-segment specifier as its own category", () => {
    expect(componentGroupFromSpecifier("./components/typography")).toBe(
      "typography",
    );
  });

  it("returns null outside the components directory", () => {
    expect(componentGroupFromSpecifier("./theme/controller")).toBeNull();
    expect(componentGroupFromSpecifier("./components")).toBeNull();
  });
});

describe("renderGroupedComponentList", () => {
  it("prints a heading per category with its count", () => {
    const rendered = renderGroupedComponentList([
      { name: "card", group: "data-display" },
      { name: "chip", group: "data-display" },
      { name: "input", group: "forms" },
    ]);

    expect(rendered).toContain("data-display (2)");
    expect(rendered).toContain("forms (1)");
    expect(rendered).toContain("card");
    expect(rendered).toContain("chip");
    expect(rendered).toContain("input");
  });

  it("handles an empty inventory", () => {
    expect(renderGroupedComponentList([])).toBe("No components found.");
  });
});
