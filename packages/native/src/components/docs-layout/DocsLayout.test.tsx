/**
 * Behaviour tests for the native DocsLayout composition.
 *
 * The tests state the composition's contract: it holds the header, the navigation, the article,
 * the contents and the footer in one scrolling region, in that order; it titles the navigation and
 * the contents with the names the web states as landmark labels; it names the article with the
 * identifier it is given; it keeps the reading measure of the article; it renders no contents
 * section when none is supplied; it resolves the names through the configuration cascade; and it
 * states that the two options a document needs and a screen does not — the skip link and the
 * sticky contents — change nothing here.
 */

import {
  type ReactElement,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import { Text, View } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { DocsLayout } from "./DocsLayout";

/**
 * Render a page inside the framework provider.
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
 * List the regions of the page, in the order the composition placed them.
 *
 * @param view - The rendered tree.
 * @returns The test identifiers of the scrolling content's children.
 */
function regionsOf(view: RenderResult): (string | undefined)[] {
  const content = view.getByTestId("docs-layout-navigation")
    .parent as ReactTestInstance;
  const { children } = content.props as { children?: unknown };
  const list = Array.isArray(children) ? children : [children];

  return list
    .filter(
      (child): child is ReactElement =>
        Boolean(child) && typeof child === "object",
    )
    .map((child) => (child.props as { testID?: string }).testID);
}

/** The page a test composes: a header, navigation, an article and a footer. */
function page() {
  return (
    <DocsLayout
      testID="page"
      header={
        <View testID="header">
          <Text>Ashee</Text>
        </View>
      }
      navigation={
        <View testID="navigation">
          <Text>Sections</Text>
        </View>
      }
      footer={
        <View testID="footer">
          <Text>Ashee Softworks</Text>
        </View>
      }>
      <Text>Layout</Text>
    </DocsLayout>
  );
}

describe("Native DocsLayout", () => {
  it("stacks the header, the navigation, the article and the footer in one scroller", async () => {
    const view = await renderPage(page());

    expect(view.getByText("Ashee")).toBeTruthy();
    expect(view.getByText("Sections")).toBeTruthy();
    expect(view.getByText("Layout")).toBeTruthy();
    expect(view.getByText("Ashee Softworks")).toBeTruthy();
    expect(regionsOf(view)).toEqual([
      "header",
      "docs-layout-navigation",
      "docs-layout-article",
      "footer",
    ]);
    expect(classesOf(view, "page")).toContain("flex-1");
  });

  it("titles the navigation with the name the web states as its landmark", async () => {
    const view = await renderPage(page());

    expect(view.getByText("Documentation")).toBeTruthy();
    expect(view.queryByText("On this page")).toBeNull();
  });

  it("names the article with the identifier it is given", async () => {
    const view = await renderPage(
      <DocsLayout
        testID="page"
        mainId="article"
        navigation={<Text>Sections</Text>}>
        <Text>Layout</Text>
      </DocsLayout>,
    );

    expect(view.getByTestId("docs-layout-article").props.nativeID).toBe(
      "article",
    );
  });

  it("keeps the article's reading measure inside the framework's container", async () => {
    const view = await renderPage(page());
    const body = view.getByText("Layout");
    const measure = body.parent;

    expect(
      (measure as { props: { className?: string } }).props.className ?? "",
    ).toContain("gap-6");
    expect(
      ((measure?.parent?.props ?? {}) as { className?: string }).className ??
        "",
    ).toContain("max-w-3xl");
  });

  it("adds a contents section only when one is supplied", async () => {
    const without = await renderPage(page());

    expect(without.queryByTestId("docs-layout-toc")).toBeNull();

    const withContents = await renderPage(
      <DocsLayout
        testID="page"
        navigation={<Text>Sections</Text>}
        toc={<Text>Getting started</Text>}>
        <Text>Layout</Text>
      </DocsLayout>,
    );

    expect(withContents.getByText("On this page")).toBeTruthy();
    expect(withContents.getByText("Getting started")).toBeTruthy();
    expect(regionsOf(withContents)).toEqual([
      "docs-layout-navigation",
      "docs-layout-article",
      "docs-layout-toc",
    ]);
  });

  it("keeps the web's skip link out of the platform's way", async () => {
    const view = await renderPage(page());

    expect(view.queryByText("Skip to content")).toBeNull();
  });

  it("takes the names of its sections from configuration", async () => {
    const view = await renderPage(
      <DocsLayout
        testID="page"
        navigation={<Text>Sections</Text>}
        toc={<Text>Getting started</Text>}>
        <Text>Layout</Text>
      </DocsLayout>,
      {
        components: {
          docslayout: { navigationLabel: "Guides", tocLabel: "Contents" },
        },
      },
    );

    expect(view.getByText("Guides")).toBeTruthy();
    expect(view.getByText("Contents")).toBeTruthy();
    expect(view.queryByText("Documentation")).toBeNull();
  });

  it("states that the web's column width and sticky contents change nothing here", async () => {
    const narrow = await renderPage(
      <DocsLayout
        testID="page"
        navigationWidth="sm"
        stickyToc={false}
        navigation={<Text>Sections</Text>}
        toc={<Text>Getting started</Text>}>
        <Text>Layout</Text>
      </DocsLayout>,
    );
    const wide = await renderPage(
      <DocsLayout
        testID="page"
        navigationWidth="lg"
        stickyToc
        navigation={<Text>Sections</Text>}
        toc={<Text>Getting started</Text>}>
        <Text>Layout</Text>
      </DocsLayout>,
    );

    expect(classesOf(narrow, "docs-layout-article")).toBe(
      classesOf(wide, "docs-layout-article"),
    );
    expect(classesOf(narrow, "docs-layout-toc")).toBe(
      classesOf(wide, "docs-layout-toc"),
    );
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      render(
        <DocsLayout navigation={<Text>Sections</Text>}>
          <Text>Layout</Text>
        </DocsLayout>,
      ),
    ).rejects.toThrow(/AsheeNativeProvider/);

    silence.mockRestore();
  });
});
