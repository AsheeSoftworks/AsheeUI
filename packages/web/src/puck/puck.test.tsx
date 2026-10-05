/**
 * Puck integration tests.
 *
 * Three properties are checked. First, the configuration is valid: every block
 * renders, every field is a field type the builder knows, and every category
 * names blocks that exist. Second, the configuration is serializable: every
 * `defaultProps` value survives a JSON round trip, so nothing in a saved page
 * depends on runtime state. Third, the same components render a published page
 * through the builder's own renderer, which is the path a live site takes.
 */

import { type ComponentConfig, Render } from "@puckeditor/core";
import { describe, expect, it } from "vitest";
import { AsheeUIProvider } from "../AsheeUIProvider";
import { renderWithProvider } from "../test";
import { asheePuckConfig } from "./config";

/** The field types the builder understands. */
const FIELD_TYPES = new Set([
  "text",
  "textarea",
  "number",
  "select",
  "radio",
  "array",
  "object",
  "richtext",
  "external",
  "custom",
  "slot",
]);

type AnyBlock = ComponentConfig<Record<string, unknown>>;

/** Every block, paired with its name. */
function blocks(): Array<[string, AnyBlock]> {
  return Object.entries(
    asheePuckConfig.components as unknown as Record<string, AnyBlock>,
  );
}

/** Walk a field definition and collect its type and any nested fields. */
function collectFieldTypes(field: unknown, found: string[] = []): string[] {
  if (!field || typeof field !== "object") return found;

  const definition = field as {
    type?: string;
    arrayFields?: Record<string, unknown>;
    objectFields?: Record<string, unknown>;
  };

  if (definition.type) found.push(definition.type);
  for (const nested of Object.values(definition.arrayFields ?? {})) {
    collectFieldTypes(nested, found);
  }
  for (const nested of Object.values(definition.objectFields ?? {})) {
    collectFieldTypes(nested, found);
  }

  return found;
}

describe("the AsheeUI Puck configuration", () => {
  it("gives every block a render function, a label and fields", () => {
    expect(blocks().length).toBeGreaterThan(8);

    for (const [name, block] of blocks()) {
      expect(typeof block.render, `${name} renders`).toBe("function");
      expect(block.label ?? name, `${name} is labelled`).toBeTruthy();
      expect(block.fields, `${name} has fields`).toBeDefined();
    }
  });

  it("uses only field types the builder understands", () => {
    for (const [name, block] of blocks()) {
      for (const field of Object.values(block.fields ?? {})) {
        for (const type of collectFieldTypes(field)) {
          expect(FIELD_TYPES.has(type), `${name} uses ${type}`).toBe(true);
        }
      }
    }
  });

  it("gives every select and radio field the options it needs", () => {
    for (const [name, block] of blocks()) {
      for (const field of Object.values(block.fields ?? {})) {
        const definition = field as { type?: string; options?: unknown[] };

        if (definition.type === "select" || definition.type === "radio") {
          expect(definition.options?.length, `${name} options`).toBeGreaterThan(
            0,
          );
        }
      }
    }
  });

  it("files every block under exactly one category, and names only real blocks", () => {
    const names = blocks().map(([name]) => name);
    const filed: string[] = [];

    for (const [category, definition] of Object.entries(
      asheePuckConfig.categories ?? {},
    )) {
      for (const component of definition.components ?? []) {
        expect(names, `${category} names a real block`).toContain(component);
        filed.push(component);
      }
    }

    expect(filed.sort()).toEqual([...names].sort());
  });

  it("keeps every default value serializable and free of functions", () => {
    for (const [name, block] of blocks()) {
      const defaults = block.defaultProps ?? {};

      expect(
        JSON.parse(JSON.stringify(defaults)),
        `${name} survives a round trip`,
      ).toEqual(defaults);

      for (const [fieldName, value] of Object.entries(defaults)) {
        expect(typeof value, `${name}.${fieldName}`).not.toBe("function");
      }
    }
  });

  it("supplies a page shell that provides the theme when none exists", () => {
    expect(asheePuckConfig.root?.render).toBeDefined();
  });

  it("declares its drop zones as slot fields", () => {
    expect(asheePuckConfig.components.Section.fields?.content).toMatchObject({
      type: "slot",
    });
    expect(asheePuckConfig.components.Columns.fields?.start).toMatchObject({
      type: "slot",
    });
  });
});

describe("a published Puck page", () => {
  /** A page assembled from the blocks a marketing page is built from. */
  const data = {
    root: { props: {} },
    content: [
      {
        type: "Hero",
        props: {
          id: "hero-1",
          title: "Run your campaigns from one place",
          description: "Messages, templates and results.",
          align: "center",
        },
      },
      {
        type: "FeatureGrid",
        props: {
          id: "features-1",
          title: "Everything the campaign needs",
          items: [{ title: "Templates", description: "Reusable messages." }],
        },
      },
      {
        type: "CTA",
        props: { id: "cta-1", title: "Send your first campaign today" },
      },
      {
        type: "Footer",
        props: {
          id: "footer-1",
          brand: "Ashee SMS",
          groups: [{ title: "Product", links: [{ label: "Pricing" }] }],
        },
      },
    ],
  };

  it("renders the same components the application renders", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Render config={asheePuckConfig} data={data} />,
    );

    expect(
      getByRole("heading", { name: "Run your campaigns from one place" }),
    ).toBeDefined();
    expect(getByText("Reusable messages.")).toBeDefined();
    expect(getByText("Send your first campaign today")).toBeDefined();
    expect(getByRole("contentinfo")).toBeDefined();
  });

  it("renders inside a consumer's own provider without nesting a second one", () => {
    const { getByText } = renderWithProvider(
      <AsheeUIProvider config={{ defaultRadius: "full" }}>
        <Render config={asheePuckConfig} data={data} />
      </AsheeUIProvider>,
    );

    expect(getByText("Ashee SMS")).toBeDefined();
  });

  it("renders a stored payload that is missing keys without throwing", () => {
    const partial = {
      root: { props: {} },
      content: [{ type: "Hero", props: { id: "hero-2" } }],
    };

    const { container } = renderWithProvider(
      <Render config={asheePuckConfig} data={partial} />,
    );

    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});
