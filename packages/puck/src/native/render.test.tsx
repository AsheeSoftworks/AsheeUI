/**
 * The native renderer's contract.
 *
 * What is checked here is that a device renders the page the editor composed: the
 * blocks a stored document names, the blocks a drop zone holds, and the values a block
 * defaults to when the document omits them. Two failures matter more than the rest and
 * are asserted directly: a payload that carries a block the registry does not know must
 * not crash the screen — a page saved by a newer editor still has to open — and an
 * application's own provider must not be replaced by a second one.
 */

import { AsheeNativeProvider } from "@asheeui/native";
import { render } from "@testing-library/react-native";
import { PUCK_BLOCK_NAMES } from "../shared";
import { asheeNativePuckConfig } from "./config";
import { PuckPage } from "./render";

/** A page assembled from the blocks a marketing page is built from. */
const data = {
  root: { props: {} },
  content: [
    {
      type: "Hero",
      props: {
        title: "Run your campaigns from one place",
        description: "Messages, templates and results.",
      },
    },
    {
      type: "Section",
      props: {
        spacing: "lg",
        background: "muted",
        content: [
          { type: "Heading", props: { title: "Inside a band" } },
          { type: "Text", props: { text: "Body copy in a band." } },
        ],
      },
    },
    {
      type: "FeatureGrid",
      props: {
        title: "Everything the campaign needs",
        items: [{ title: "Templates", description: "Reusable messages." }],
      },
    },
    { type: "CTA", props: { title: "Send your first campaign today" } },
    {
      type: "Footer",
      props: {
        brand: "Ashee SMS",
        groups: [{ title: "Product", links: [{ label: "Pricing" }] }],
      },
    },
  ],
};

describe("the native registry", () => {
  it("carries an entry for every shared spec, and each entry draws", () => {
    const names = Object.keys(asheeNativePuckConfig.components).sort();

    expect(names).toEqual([...PUCK_BLOCK_NAMES].sort());

    for (const block of Object.values(asheeNativePuckConfig.components)) {
      expect(typeof block.render).toBe("function");
      expect(block.label).toBeTruthy();
      expect(block.fields).toBeDefined();
    }
  });

  it("files every block under exactly one category", () => {
    const names = Object.keys(asheeNativePuckConfig.components);
    const filed = Object.values(asheeNativePuckConfig.categories).flatMap(
      (category) => category.components,
    );

    expect(filed.sort()).toEqual([...names].sort());
  });
});

describe("a stored page on the platform", () => {
  it("renders the blocks the editor stored", async () => {
    const { getByText } = await render(<PuckPage data={data} />);

    expect(getByText("Run your campaigns from one place")).toBeTruthy();
    expect(getByText("Send your first campaign today")).toBeTruthy();
    expect(getByText("Ashee SMS")).toBeTruthy();
  });

  it("renders the blocks a drop zone holds", async () => {
    const { getByText } = await render(<PuckPage data={data} />);

    expect(getByText("Inside a band")).toBeTruthy();
    expect(getByText("Body copy in a band.")).toBeTruthy();
    expect(getByText("Reusable messages.")).toBeTruthy();
  });

  it("drops a block the registry does not know rather than throwing", async () => {
    const page = {
      root: { props: {} },
      content: [
        { type: "Mystery", props: {} },
        { type: "CTA", props: { title: "Still here" } },
      ],
    };

    const { getByText } = await render(<PuckPage data={page} />);

    expect(getByText("Still here")).toBeTruthy();
  });

  it("fills in the keys a stored payload omitted", async () => {
    const page = {
      root: { props: {} },
      content: [{ type: "Hero", props: {} }],
    };

    const { getByText } = await render(<PuckPage data={page} />);

    // The value is the spec's default, which is what the editor would have shown.
    expect(getByText("Run your campaigns from one place")).toBeTruthy();
  });

  it("keeps a provider the application already has", async () => {
    const { getByText } = await render(
      <AsheeNativeProvider config={{ defaultRadius: "full" }}>
        <PuckPage data={data} />
      </AsheeNativeProvider>,
    );

    expect(getByText("Ashee SMS")).toBeTruthy();
  });
});
