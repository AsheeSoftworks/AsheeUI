/**
 * Behaviour tests for the native FeatureGrid.
 *
 * The tests state the component's contract: the band draws its heading and one card per
 * feature, the icon badge exists only to hold an icon, a feature with a destination is a
 * control that follows it while one without stays a surface, the column count is
 * resolved from the window the platform reports, and the band options resolve through
 * the configuration cascade.
 */

import {
  fireEvent,
  type ReactTestInstance,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Dimensions, Text } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { openDestination } from "../../utils/open-destination";
import { FeatureGrid } from "./FeatureGrid";

jest.mock("../../utils/open-destination", () => ({
  openDestination: jest.fn(),
}));

/**
 * Render a feature grid inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderGrid(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/**
 * Read the classes a rendered element carries.
 *
 * @param view - The rendered tree.
 * @param testID - The element's test identifier.
 * @returns Its class string.
 */
function classesOf(view: RenderResult, testID: string): string {
  return (view.getByTestId(testID).props as { className?: string })
    .className as string;
}

/**
 * Read the classes a node carries.
 *
 * @param node - The node, when one was found.
 * @returns Its class string, or an empty one.
 */
function classesOfNode(node: ReactTestInstance | null | undefined): string {
  return ((node?.props ?? {}) as { className?: string }).className ?? "";
}

/**
 * Find the nearest ancestor of a node that carries a class.
 * The band's own parts have no test identifiers — they are not public — so a test
 * reaches one from the content it recognised.
 *
 * @param node - The node to start from.
 * @param marker - A class the ancestor must carry.
 * @returns The ancestor, or undefined when there is none.
 */
function ancestorWithClass(
  node: ReactTestInstance,
  marker: string,
): ReactTestInstance | undefined {
  let current = node.parent;

  while (current) {
    const { className } = current.props as { className?: string };

    if (typeof className === "string" && className.includes(marker)) {
      return current;
    }

    current = current.parent;
  }

  return undefined;
}

/**
 * Report a window width to the platform.
 * The grid is responsive, so a test states the window it is testing rather than
 * depending on the one the test environment happens to have.
 *
 * @param width - The window width, in density-independent pixels.
 */
function reportWindowWidth(width: number): void {
  jest.spyOn(Dimensions, "get").mockReturnValue({
    width,
    height: 844,
    scale: 2,
    fontScale: 2,
  });
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Native FeatureGrid", () => {
  it("renders its heading and one card per feature", async () => {
    const view = await renderGrid(
      <FeatureGrid
        testID="grid"
        eyebrow="Why teams switch"
        title="Everything the campaign needs"
        description="One workspace, no switching tools."
        items={[
          { title: "Templates", description: "Reusable messages." },
          { title: "Scheduling", description: "Send at the right time." },
        ]}
      />,
    );

    expect(view.getByText("Why teams switch")).toBeTruthy();
    expect(view.getByText("Everything the campaign needs")).toBeTruthy();
    expect(view.getByText("One workspace, no switching tools.")).toBeTruthy();
    expect(view.getByText("Templates")).toBeTruthy();
    expect(view.getByText("Reusable messages.")).toBeTruthy();
    expect(view.getByText("Scheduling")).toBeTruthy();
    expect(view.getByText("Send at the right time.")).toBeTruthy();
  });

  it("draws the icon badge only for a feature that has an icon", async () => {
    const view = await renderGrid(
      <FeatureGrid
        testID="grid"
        items={[
          { title: "Templates", icon: <Text>⚡</Text> },
          { title: "Scheduling" },
        ]}
      />,
    );

    const badge = ancestorWithClass(view.getByText("⚡"), "w-10 h-10");

    expect(badge).toBeDefined();
    expect(classesOfNode(badge)).toContain("bg-primary/10");
    expect(
      ancestorWithClass(view.getByText("Scheduling"), "w-10 h-10"),
    ).toBeUndefined();
  });

  it("makes a feature with a destination a control that follows it", async () => {
    const view = await renderGrid(
      <FeatureGrid
        testID="grid"
        items={[
          { title: "Templates", href: "https://example.com/templates" },
          { title: "Scheduling" },
        ]}
      />,
    );

    await fireEvent.press(view.getByRole("button", { name: "Templates" }));

    expect(openDestination).toHaveBeenCalledWith(
      "https://example.com/templates",
    );
  });

  it("leaves a feature without a destination a plain surface", async () => {
    const view = await renderGrid(
      <FeatureGrid testID="grid" items={[{ title: "Scheduling" }]} />,
    );

    expect(view.queryByRole("button", { name: "Scheduling" })).toBeNull();
    // A surface still holds the feature, which is what a reader reads.
    expect(
      ancestorWithClass(view.getByText("Scheduling"), "rounded-md"),
    ).toBeDefined();
  });

  it("resolves its column count and band options through the cascade", async () => {
    reportWindowWidth(1024);

    const view = await renderGrid(
      <FeatureGrid
        testID="grid"
        eyebrow="Why teams switch"
        items={[{ title: "Templates", href: "https://example.com/templates" }]}
      />,
      {
        components: {
          featuregrid: {
            columnsLg: 2,
            gap: "sm",
            background: "muted",
            containerSize: "xl",
          },
        },
      },
    );

    expect(classesOf(view, "grid")).toContain("bg-secondary/40");
    expect(
      ancestorWithClass(view.getByText("Why teams switch"), "max-w-7xl"),
    ).toBeDefined();
    // The grid states the width of a cell rather than a column count, so two
    // columns of gap-separated cells is what lands on the card.
    expect(
      classesOfNode(view.getByRole("button", { name: "Templates" })),
    ).toContain("w-[48%]");
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      render(<FeatureGrid items={[{ title: "Templates" }]} />),
    ).rejects.toThrow(/AsheeNativeProvider/);

    silence.mockRestore();
  });
});
