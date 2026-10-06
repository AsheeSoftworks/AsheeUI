/**
 * Behaviour tests for the native Footer.
 *
 * The tests state the component's contract: the footer draws its brand column, its
 * navigation groups and their links, each group's title is announced as a heading, a
 * link follows its destination through the platform's URL handler, the footer renders
 * nothing it was not given, and its surface, rhythm and container resolve through the
 * configuration cascade.
 */

import {
  fireEvent,
  type ReactTestInstance,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { openDestination } from "../../utils/open-destination";
import { Footer } from "./Footer";

jest.mock("../../utils/open-destination", () => ({
  openDestination: jest.fn(),
}));

/** The navigation a test footer carries. */
const GROUPS = [
  {
    title: "Product",
    links: [
      { label: "Campaigns", href: "https://example.com/campaigns" },
      { label: "Templates" },
    ],
  },
  {
    title: "Company",
    links: [{ label: "About", href: "https://example.com" }],
  },
];

/**
 * Render a footer inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderFooter(ui: ReactElement, config?: object) {
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
 * Find the nearest ancestor of a node that carries a class.
 * The footer's own parts have no test identifiers — they are not public — so a test
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

describe("Native Footer", () => {
  it("renders the brand column, the navigation groups and the lower row", async () => {
    const view = await renderFooter(
      <Footer
        testID="footer"
        brand="Ashee SMS"
        description="Campaign messaging for growing teams."
        groups={GROUPS}
        social={[{ label: "GitHub", href: "https://example.com/github" }]}
        legal={[{ label: "Privacy" }]}
        copyright="Ashee Softworks"
      />,
    );

    expect(view.getByText("Ashee SMS")).toBeTruthy();
    expect(
      view.getByText("Campaign messaging for growing teams."),
    ).toBeTruthy();
    expect(view.getByText("Campaigns")).toBeTruthy();
    expect(view.getByText("Templates")).toBeTruthy();
    expect(view.getByText("About")).toBeTruthy();
    expect(view.getByText("Ashee Softworks")).toBeTruthy();
    expect(view.getByText("Privacy")).toBeTruthy();
    expect(view.getByText("GitHub")).toBeTruthy();
  });

  it("names each group's title as a heading, so a reader can move between them", async () => {
    const view = await renderFooter(<Footer testID="footer" groups={GROUPS} />);

    expect(view.getByRole("header", { name: "Product" })).toBeTruthy();
    expect(view.getByRole("header", { name: "Company" })).toBeTruthy();
  });

  it("follows a link's destination through the platform", async () => {
    const view = await renderFooter(<Footer testID="footer" groups={GROUPS} />);

    await fireEvent.press(view.getByRole("link", { name: "Campaigns" }));

    expect(openDestination).toHaveBeenCalledWith(
      "https://example.com/campaigns",
    );
  });

  it("renders nothing it was not given", async () => {
    const view = await renderFooter(
      <Footer testID="footer" copyright="Ashee Softworks" />,
    );

    expect(view.getByText("Ashee Softworks")).toBeTruthy();
    expect(view.queryByRole("header")).toBeNull();
    expect(view.queryByRole("link")).toBeNull();
  });

  it("resolves its surface, rhythm and container through the cascade", async () => {
    const view = await renderFooter(
      <Footer testID="footer" brand="Ashee SMS" />,
      {
        components: {
          footer: { variant: "muted", spacing: "sm", containerSize: "sm" },
        },
      },
    );

    expect(classesOf(view, "footer")).toContain("bg-secondary/40");
    expect(classesOf(view, "footer")).toContain("py-6");
    expect(
      ancestorWithClass(view.getByText("Ashee SMS"), "max-w-xl"),
    ).toBeDefined();
  });

  it("draws the separator the bordered surface names and drops it for a muted one", async () => {
    const bordered = await renderFooter(
      <Footer testID="footer" brand="Ashee SMS" />,
    );
    const muted = await renderFooter(
      <Footer testID="footer" brand="Ashee SMS" variant="muted" />,
    );

    expect(classesOf(bordered, "footer")).toContain("border-t border-border");
    expect(classesOf(muted, "footer")).not.toContain("border-t");
  });

  it("leaves the framework's width alone when it is asked to", async () => {
    const bare = await renderFooter(
      <Footer testID="footer" brand="Ashee SMS" contained={false} />,
    );

    expect(
      ancestorWithClass(bare.getByText("Ashee SMS"), "max-w-5xl"),
    ).toBeUndefined();
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      render(<Footer copyright="Ashee Softworks" />),
    ).rejects.toThrow(/AsheeNativeProvider/);

    silence.mockRestore();
  });
});
