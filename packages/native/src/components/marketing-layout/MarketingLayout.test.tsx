/**
 * Behaviour tests for the native MarketingLayout composition.
 *
 * The tests state the composition's contract: it holds the navigation, the sections and the
 * footer in one scrolling region, in that order, with the sections inside the named main
 * region; it paints the background it is configured with; it names the main region with the
 * identifier it is given; it renders a page that has only sections; and it keeps the web's
 * skip link out of the platform's way rather than inventing one.
 */

import {
  type ReactTestInstance,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Text, View } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { MarketingLayout } from "./MarketingLayout";

/**
 * Render a composition inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderPage(ui: ReactElement, config?: object) {
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

/** The page a test composes: a navigation, two sections and a footer. */
function page() {
  return (
    <MarketingLayout
      testID="page"
      navigation={
        <View testID="navigation">
          <Text>Ashee</Text>
        </View>
      }
      footer={
        <View testID="footer">
          <Text>Ashee Softworks</Text>
        </View>
      }>
      <View testID="hero">
        <Text>A complete UI system</Text>
      </View>
      <View testID="features">
        <Text>Everything a page needs</Text>
      </View>
    </MarketingLayout>
  );
}

describe("Native MarketingLayout", () => {
  it("holds the navigation, the sections and the footer in one scroller", async () => {
    const view = await renderPage(page());

    expect(view.getByText("Ashee")).toBeTruthy();
    expect(view.getByText("A complete UI system")).toBeTruthy();
    expect(view.getByText("Everything a page needs")).toBeTruthy();
    expect(view.getByText("Ashee Softworks")).toBeTruthy();

    // The sections sit inside the main region, and the navigation and the footer sit beside
    // it rather than inside it, in the order the web shows them.
    const main = view.getByTestId("hero").parent;
    const column = main?.parent;

    expect(main?.props.nativeID).toBe("main-content");
    expect(column).toBeDefined();
    expect(
      ((column as ReactTestInstance).props.children as ReactElement[]).map(
        (child) => (child.props as { testID?: string }).testID,
      ),
    ).toEqual(["navigation", undefined, "footer"]);
    expect(ancestorWithClass(view.getByTestId("hero"), "flex-1")).toBeDefined();
  });

  it("names the main region with the identifier it is given", async () => {
    const view = await renderPage(
      <MarketingLayout mainId="campaign-content">
        <View testID="hero">
          <Text>A complete UI system</Text>
        </View>
      </MarketingLayout>,
    );

    const main = ancestorWithClass(
      view.getByTestId("hero"),
      "flex w-full flex-col",
    );

    expect(main?.props.nativeID).toBe("campaign-content");
  });

  it("paints the background it is configured with", async () => {
    const painted = await renderPage(page());
    const muted = await renderPage(page(), {
      components: { marketinglayout: { background: "muted" } },
    });

    expect(classesOf(painted, "page")).toContain("bg-background");
    expect(classesOf(muted, "page")).toContain("bg-secondary/40");
  });

  it("keeps the web's skip link out of the platform's way", async () => {
    const view = await renderPage(page());

    // A skip link is a keyboard reader's way past the navigation, and a platform screen has
    // no focus order to skip through, so the option resolves and nothing is invented for it.
    expect(view.queryByText("Skip to content")).toBeNull();
  });

  it("renders a page that has only sections", async () => {
    const view = await renderPage(
      <MarketingLayout>
        <View testID="hero">
          <Text>A complete UI system</Text>
        </View>
      </MarketingLayout>,
    );

    expect(view.getByText("A complete UI system")).toBeTruthy();
    expect(view.queryByTestId("navigation")).toBeNull();
    expect(view.queryByTestId("footer")).toBeNull();
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(render(<MarketingLayout />)).rejects.toThrow(
      /AsheeNativeProvider/,
    );

    silence.mockRestore();
  });
});
