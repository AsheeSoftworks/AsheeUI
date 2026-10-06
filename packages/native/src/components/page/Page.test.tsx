/**
 * Behaviour tests for the four native page parts.
 *
 * The tests state the shell's contract: the shell fills the screen and owns the theme
 * background, the header is the platform's header landmark and draws a rule against the
 * content, the content area grows into what is left and carries the shared rhythm, the
 * footer closes the screen, and every option resolves through one `components.page`
 * configuration entry.
 */

import { type RenderResult, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Text } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Page, PageContent, PageFooter, PageHeader } from "./Page";

/**
 * Render a page part inside the framework provider.
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
 * Read every class string in the rendered tree.
 *
 * The parts are not public, so a test reaches them by what they are: the container the
 * framework puts around a part is the only element in a page that carries a maximum width,
 * and the rules are the only elements that carry a border. Walking the tree for the classes
 * also means a test never has to state how many views deep a part happens to be.
 *
 * @param view - The rendered tree.
 * @returns Each class string the tree holds.
 */
function classesIn(view: RenderResult): string[] {
  const collected: string[] = [];

  const walk = (node: unknown) => {
    if (Array.isArray(node)) {
      for (const child of node) walk(child);
      return;
    }

    if (!node || typeof node !== "object") return;

    const element = node as {
      props?: { className?: unknown };
      children?: unknown;
    };

    if (typeof element.props?.className === "string") {
      collected.push(element.props.className);
    }

    walk(element.children);
  };

  walk(view.toJSON());

  return collected;
}

/**
 * Ask whether any element in the rendered tree carries a class.
 *
 * @param view - The rendered tree.
 * @param className - The class to look for.
 * @returns Whether the class is present.
 */
function hasClass(view: RenderResult, className: string): boolean {
  return classesIn(view).some((value) => value.includes(className));
}

describe("Native page parts", () => {
  it("renders a shell that fills the screen and owns the theme background", async () => {
    const view = await renderPage(
      <Page testID="page">
        <Text>Body</Text>
      </Page>,
    );

    const className = (view.getByTestId("page").props as { className?: string })
      .className as string;

    expect(className).toContain("flex-1");
    expect(className).toContain("flex-col");
    expect(className).toContain("bg-background");
  });

  it("renders the header as the platform's header landmark", async () => {
    const view = await renderPage(
      <PageHeader testID="header">
        <Text>Invoices</Text>
      </PageHeader>,
    );

    expect(view.getByTestId("header").props.accessibilityRole).toBe("header");
    expect(view.getByText("Invoices")).toBeTruthy();
  });

  it("draws the header's rule against the content by default", async () => {
    const view = await renderPage(
      <PageHeader testID="header">
        <Text>Invoices</Text>
      </PageHeader>,
    );

    const className = (
      view.getByTestId("header").props as { className?: string }
    ).className as string;

    expect(className).toContain("border-b");
    expect(className).toContain("bg-background");
  });

  it("leaves the header's rule out when it is asked to", async () => {
    const view = await renderPage(
      <PageHeader divider={false}>
        <Text>Invoices</Text>
      </PageHeader>,
    );

    // The page shell paints no background of its own parts either, so nothing in the tree
    // carries the rule once the option is off.
    expect(hasClass(view, "border-b")).toBe(false);
  });

  it("fills the height between the bars with the shared rhythm", async () => {
    const view = await renderPage(
      <PageContent>
        <Text>Body</Text>
      </PageContent>,
    );

    expect(hasClass(view, "flex-1")).toBe(true);
    expect(hasClass(view, "py-8")).toBe(true);
  });

  it("contains a part in the framework's width until it is asked not to", async () => {
    const contained = await renderPage(
      <PageContent>
        <Text>Body</Text>
      </PageContent>,
    );

    expect(hasClass(contained, "max-w-5xl")).toBe(true);

    const bare = await renderPage(
      <PageContent contained={false}>
        <Text>Body</Text>
      </PageContent>,
    );

    // Nothing in an uncontained page caps its width, so no element carries a maximum.
    expect(classesIn(bare).some((value) => value.includes("max-w-"))).toBe(
      false,
    );
  });

  it("closes the screen with a footer that keeps its content", async () => {
    const view = await renderPage(
      <PageFooter testID="footer">
        <Text>Version 1.1.0</Text>
      </PageFooter>,
    );

    const className = (
      view.getByTestId("footer").props as { className?: string }
    ).className as string;

    expect(className).toContain("border-t");
    expect(view.getByText("Version 1.1.0")).toBeTruthy();
  });

  it("resolves the shared options from one configuration entry", async () => {
    const view = await renderPage(
      <Page>
        <PageHeader testID="header">
          <Text>Invoices</Text>
        </PageHeader>
        <PageContent>
          <Text>Body</Text>
        </PageContent>
      </Page>,
      {
        components: {
          page: {
            contained: false,
            containerSize: "sm",
            spacing: "lg",
            divider: false,
          },
        },
      },
    );

    const className = (
      view.getByTestId("header").props as { className?: string }
    ).className as string;

    expect(className).not.toContain("border-b");
    expect(classesIn(view).some((value) => value.includes("max-w-"))).toBe(
      false,
    );
    expect(hasClass(view, "py-12")).toBe(true);
  });
});
