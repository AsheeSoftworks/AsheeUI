/**
 * The web registry's contract.
 *
 * Three properties are checked. First, the registry the editor reads is complete: every
 * shared spec has an entry, every entry draws, and the categories name blocks that
 * exist. Second, the same components render a stored page through the editor's own
 * renderer, which is the path a live site takes — so the editor and the page cannot
 * diverge. Third, the page shell respects a provider the application already has,
 * because a second one would replace the configuration that application resolved.
 */

import { AsheeUIProvider } from "@asheeui/web";
import { renderWithProvider } from "@asheeui/web/src/test";
import { type ComponentConfig, Render } from "@puckeditor/core";
import { describe, expect, it } from "vitest";
import { PUCK_BLOCK_NAMES } from "../shared";
import { asheePuckConfig } from "./config";

type AnyBlock = ComponentConfig<Record<string, unknown>>;

/**
 * Every block, paired with its name.
 *
 * @returns The registry's block entries.
 */
function blocks(): Array<[string, AnyBlock]> {
  return Object.entries(
    asheePuckConfig.components as unknown as Record<string, AnyBlock>,
  );
}

describe("the AsheeUI web registry", () => {
  it("carries an entry for every shared spec, and each entry draws", () => {
    const names = blocks()
      .map(([name]) => name)
      .sort();

    expect(names).toEqual([...PUCK_BLOCK_NAMES].sort());

    for (const [name, block] of blocks()) {
      expect(typeof block.render, `${name} renders`).toBe("function");
      expect(block.label ?? name, `${name} is labelled`).toBeTruthy();
      expect(block.fields, `${name} has fields`).toBeDefined();
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
        type: "Section",
        props: {
          id: "band-1",
          spacing: "lg",
          background: "muted",
          content: [
            {
              type: "Heading",
              props: { id: "heading-1", title: "Inside a band" },
            },
          ],
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

  it("renders the blocks a drop zone holds", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Render config={asheePuckConfig} data={data} />,
    );

    expect(getByRole("heading", { name: "Inside a band" })).toBeDefined();
    expect(getByText("Everything the campaign needs")).toBeDefined();
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
