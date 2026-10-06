/**
 * Behaviour tests for the native SidebarLayout shell.
 *
 * The tests state the shell's contract: it holds the header, the navigation column, the content
 * column and the footer in one region, in that order; it stacks its navigation above its content on
 * a narrow window and places it beside the content once the window is wide enough, with the
 * separator following the arrangement and the side; it puts the column at the trailing edge when it
 * is told to; it names the column with the name the web gives its landmark; its width resolves
 * through the configuration cascade; the web's stickiness changes nothing, because the platform
 * places the column outside the region that scrolls; it carries the consumer's class last; and it
 * says out loud that it is being rendered without the provider, because that is a setup mistake.
 */

import {
  type ReactElement,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import { Dimensions, Text, View } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { SidebarLayout } from "./SidebarLayout";

/**
 * Render a shell inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderShell(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/**
 * Report a window width to the platform.
 * The shell reads the window rather than a media query, so a test states the width the device is
 * reporting and the shell decides from it.
 *
 * @param width - The width in density-independent pixels.
 * @returns The spy, so a test can put the window back.
 */
function reportWidth(width: number) {
  return jest.spyOn(Dimensions, "get").mockReturnValue({
    width,
    height: 844,
    scale: 2,
    fontScale: 2,
  });
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
 * List the regions of the shell, in the order the shell placed them.
 *
 * @param view - The rendered tree.
 * @returns The test identifiers of the shell's children.
 */
function regionsOf(view: RenderResult): (string | undefined)[] {
  const { children } = view.getByTestId("shell").props as {
    children?: unknown;
  };
  const list = Array.isArray(children) ? children : [children];

  return list
    .filter(
      (child): child is ReactElement =>
        Boolean(child) && typeof child === "object",
    )
    .map((child) => (child.props as { testID?: string }).testID);
}

/** The shell a test renders: a header, a navigation column, content and a footer. */
function shell() {
  return (
    <SidebarLayout
      testID="shell"
      header={
        <View testID="header">
          <Text>Ashee SMS</Text>
        </View>
      }
      sidebar={
        <View testID="sidebar">
          <Text>Campaigns</Text>
        </View>
      }
      footer={
        <View testID="footer">
          <Text>Ashee Softworks</Text>
        </View>
      }>
      <Text>Report</Text>
    </SidebarLayout>
  );
}

describe("Native SidebarLayout", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("holds the header, the navigation column, the content column and the footer", async () => {
    const view = await renderShell(shell());

    expect(view.getByText("Ashee SMS")).toBeTruthy();
    expect(view.getByText("Campaigns")).toBeTruthy();
    expect(view.getByText("Report")).toBeTruthy();
    expect(view.getByText("Ashee Softworks")).toBeTruthy();
    // The navigation sits between the header and the footer, and beside the content rather than
    // inside it, which is what makes the content scrollable on its own.
    expect(regionsOf(view)).toEqual(["header", "sidebar-layout-row", "footer"]);
    expect(
      view.getByTestId("sidebar-layout-content").props.children,
    ).toBeDefined();
  });

  it("stacks the navigation above the content on a narrow window", async () => {
    reportWidth(390);
    const view = await renderShell(shell());

    // A phone has no room beside the content, so the column is placed above it, as wide as the
    // screen, and the separator follows the arrangement rather than the side.
    expect(classesOf(view, "sidebar-layout-row")).not.toContain("flex-row");
    expect(classesOf(view, "sidebar-layout-sidebar")).toContain("border-b");
    expect(classesOf(view, "sidebar-layout-sidebar")).not.toContain("w-64");
  });

  it("places the column beside the content once the window is wide enough", async () => {
    reportWidth(1280);
    const view = await renderShell(shell());

    expect(classesOf(view, "sidebar-layout-row")).toContain("flex-row");
    expect(classesOf(view, "sidebar-layout-sidebar")).toContain("border-r");
    expect(classesOf(view, "sidebar-layout-sidebar")).toContain("w-64");
  });

  it("puts the column at the trailing edge and separates it on that side", async () => {
    reportWidth(1280);
    const beside = await renderShell(
      <SidebarLayout testID="shell" sidebar={<View />} side="end" />,
    );

    expect(classesOf(beside, "sidebar-layout-sidebar")).toContain("order-last");
    expect(classesOf(beside, "sidebar-layout-sidebar")).toContain("border-l");

    reportWidth(390);
    const stacked = await renderShell(
      <SidebarLayout testID="shell" sidebar={<View />} side="end" />,
    );

    expect(classesOf(stacked, "sidebar-layout-sidebar")).toContain(
      "order-last",
    );
    expect(classesOf(stacked, "sidebar-layout-sidebar")).toContain("border-b");
  });

  it("names the column with the name the web gives its landmark", async () => {
    const view = await renderShell(shell());

    expect(view.getByLabelText("Sidebar")).toBe(
      view.getByTestId("sidebar-layout-sidebar"),
    );

    const named = await renderShell(
      <SidebarLayout
        testID="shell"
        sidebar={<View />}
        sidebarLabel="Workspace"
      />,
    );

    expect(named.getByLabelText("Workspace").props.testID).toBe(
      "sidebar-layout-sidebar",
    );
  });

  it("resolves the width of the column through configuration", async () => {
    reportWidth(1280);
    const view = await renderShell(shell(), {
      components: { sidebarlayout: { sidebarWidth: "lg" } },
    });

    expect(classesOf(view, "sidebar-layout-sidebar")).toContain("w-80");
  });

  it("states the web's stickiness as nothing, because a native column is placed, not pinned", async () => {
    reportWidth(1280);
    const pinned = await renderShell(shell());
    const loose = await renderShell(shell(), {
      components: { sidebarlayout: { stickySidebar: false } },
    });

    // The platform has no scroll-linked positioning: the shell keeps the column outside the
    // consumer's own scrolling region, so the option resolves and states no rule either way.
    expect(classesOf(pinned, "sidebar-layout-sidebar")).not.toContain("sticky");
    expect(classesOf(loose, "sidebar-layout-sidebar")).not.toContain("sticky");
  });

  it("carries the consumer's class last, so it wins", async () => {
    const view = await renderShell(
      <SidebarLayout
        testID="shell"
        className="bg-primary"
        sidebar={<View />}
      />,
    );

    expect(classesOf(view, "shell").endsWith("bg-primary")).toBe(true);
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(render(<SidebarLayout sidebar={<View />} />)).rejects.toThrow(
      /AsheeNativeProvider/,
    );

    silence.mockRestore();
  });
});
