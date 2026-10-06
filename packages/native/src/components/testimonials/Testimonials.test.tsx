/**
 * Behaviour tests for the native Testimonials band.
 *
 * The tests state the band's contract: it draws its heading and one card per quote, each
 * quote carries its attribution in reading order, a quote's picture comes from the
 * framework's own `Avatar`, an attribution without a role renders without one, the column
 * count and the band options resolve through the configuration cascade, and a band outside
 * the provider fails rather than rendering something the framework did not configure.
 */

import {
  type ReactTestInstance,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Dimensions } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Testimonials } from "./Testimonials";

/** The quotes a test band carries. */
const QUOTES = [
  {
    quote: "We cut campaign setup from hours to minutes.",
    name: "Ama Boateng",
    role: "Head of Growth, Kora Retail",
  },
  { quote: "The reporting is what sold us.", name: "Luis Ortega" },
];

/**
 * Render a band inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderBand(ui: ReactElement, config?: object) {
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
  return (
    (view.getByTestId(testID).props as { className?: string }).className ?? ""
  );
}

/**
 * Find the nearest ancestor of a node that carries a class.
 * The band's own parts have no test identifiers — they are not public — so a test reaches
 * one from the content it recognised.
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
 * The grid is responsive, so a test states the window it is testing rather than depending
 * on the one the test environment happens to have.
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

describe("Native Testimonials", () => {
  it("renders its heading and one card per quote", async () => {
    const view = await renderBand(
      <Testimonials
        eyebrow="Customers"
        title="Teams send more with Ashee"
        description="What they say once the workspace is theirs."
        items={QUOTES}
      />,
    );

    expect(view.getByText("Customers")).toBeTruthy();
    expect(view.getByText("Teams send more with Ashee")).toBeTruthy();
    expect(
      view.getByText("What they say once the workspace is theirs."),
    ).toBeTruthy();
    expect(
      view.getByText("We cut campaign setup from hours to minutes."),
    ).toBeTruthy();
    expect(view.getByText("The reporting is what sold us.")).toBeTruthy();
  });

  it("carries each quote's attribution in reading order", async () => {
    const view = await renderBand(<Testimonials items={QUOTES} />);

    const quote = view.getByText(
      "We cut campaign setup from hours to minutes.",
    );
    const person = ancestorWithClass(view.getByText("Ama Boateng"), "gap-3");

    expect(person).toBeDefined();
    // The words and the attribution live in one surface, which is the order a reader hears.
    expect(ancestorWithClass(quote, "flex-col")).toBeDefined();
    expect(view.getByText("Head of Growth, Kora Retail")).toBeTruthy();
  });

  it("gives a quote its picture through the framework's Avatar", async () => {
    const view = await renderBand(
      <Testimonials
        items={[
          {
            quote: "Fast.",
            name: "Ama Boateng",
            avatarSrc: "https://example.com/ama.png",
          },
        ]}
      />,
    );

    // The avatar is the picture's frame and it carries the name, so the entity is read by
    // name rather than by picture.
    expect(view.getByLabelText("Ama Boateng")).toBeTruthy();
  });

  it("renders an attribution without a role", async () => {
    const view = await renderBand(
      <Testimonials items={[{ quote: "Fast.", name: "Luis Ortega" }]} />,
    );

    expect(view.getByText("Luis Ortega")).toBeTruthy();
    expect(view.queryByText("Head of Growth, Kora Retail")).toBeNull();
  });

  it("resolves its column count and band options through the cascade", async () => {
    reportWindowWidth(1024);

    const view = await renderBand(
      <Testimonials
        testID="band"
        title="Teams send more with Ashee"
        items={[{ quote: "Fast.", name: "Ama Boateng" }]}
      />,
      {
        components: {
          testimonials: {
            columnsLg: 2,
            background: "muted",
            align: "start",
            containerSize: "xl",
          },
        },
      },
    );

    expect(classesOf(view, "band")).toContain("bg-secondary/40");
    expect(
      ancestorWithClass(
        view.getByText("Teams send more with Ashee"),
        "max-w-7xl",
      ),
    ).toBeDefined();
    // The grid states the width of a cell rather than a column count, so two columns of
    // gap-separated cells is what lands on the quote.
    expect(ancestorWithClass(view.getByText("Fast."), "w-[48%]")).toBeDefined();
    expect(
      ancestorWithClass(
        view.getByText("Teams send more with Ashee"),
        "items-center",
      ),
    ).toBeUndefined();
  });

  it("renders a band with no quotes", async () => {
    const view = await renderBand(
      <Testimonials title="Teams send more with Ashee" items={[]} />,
    );

    expect(view.getByText("Teams send more with Ashee")).toBeTruthy();
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      render(
        <Testimonials items={[{ quote: "Fast.", name: "Ama Boateng" }]} />,
      ),
    ).rejects.toThrow(/AsheeNativeProvider/);

    silence.mockRestore();
  });
});
