/**
 * Behaviour tests for the native Navbar and its TabBar.
 *
 * The tests state the bar's contract: it holds the brand, its destinations and its actions; it states
 * its destinations as a tab list named by the name the web gives its navigation landmark; it marks
 * the destination of the current page as selected rather than styling it alone; it renders the brand
 * as a destination when it has one; its surface, its alignment and its width resolve through the
 * configuration cascade, and its sticky option states no rule because the platform pins a bar by
 * where the screen places it; the web's disclosure changes nothing here, because the platform keeps
 * every destination in reach; and the bar at the edge draws the same destinations the same way, which
 * is the platform's other half of a navigation.
 */

import {
  type ReactTestInstance,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Text } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Navbar, TabBar } from "./Navbar";
import type { NavbarLinkItem } from "./navbar-config";

/** The destinations a test bar shows. */
const LINKS: NavbarLinkItem[] = [
  { label: "Campaigns", href: "/campaigns", isActive: true },
  { label: "Contacts", href: "/contacts" },
];

/**
 * Render a bar inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderBar(ui: ReactElement, config?: object) {
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
 * Reach the control a destination is rendered as.
 *
 * The label is what a reader sees and what the tree exposes, so a test finds a destination through it
 * rather than through a class.
 *
 * @param view - The rendered tree.
 * @param label - The destination's label.
 * @returns The control carrying it.
 */
function destinationOf(view: RenderResult, label: string): ReactTestInstance {
  return view.getByText(label).parent as ReactTestInstance;
}

/**
 * Reach the classes of the control a destination is rendered as.
 *
 * @param view - The rendered tree.
 * @param label - The destination's label.
 * @returns The control's class string.
 */
function destinationClasses(view: RenderResult, label: string): string {
  return (
    (destinationOf(view, label).props as { className?: string }).className ?? ""
  );
}

/**
 * Find the nearest ancestor of a node that carries a class, which is how a test states where a part
 * of the bar sits rather than the order its elements happen to be written in.
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

describe("Native Navbar", () => {
  it("renders the brand, the destinations and the actions", async () => {
    const view = await renderBar(
      <Navbar
        testID="bar"
        brand={<Text>Ashee SMS</Text>}
        links={LINKS}
        actions={<Text>Sign in</Text>}
      />,
    );

    expect(view.getByText("Ashee SMS")).toBeTruthy();
    expect(view.getByText("Campaigns")).toBeTruthy();
    expect(view.getByText("Contacts")).toBeTruthy();
    expect(view.getByText("Sign in")).toBeTruthy();
  });

  it("states its destinations as a tab list named by the landmark's name", async () => {
    const view = await renderBar(<Navbar testID="bar" links={LINKS} />);
    const row = view.getByLabelText("Main");

    // The web names a navigation landmark; the platform has no landmark, and a row of destinations
    // is a tab list, so the same name states the role the platform does have.
    expect(row.props.accessibilityRole).toBe("tablist");
    expect(destinationOf(view, "Campaigns").props.accessibilityRole).toBe(
      "tab",
    );
  });

  it("marks the destination of the current page as selected", async () => {
    const view = await renderBar(<Navbar testID="bar" links={LINKS} />);
    const current = destinationOf(view, "Campaigns");
    const other = destinationOf(view, "Contacts");

    expect(current.props.accessibilityState).toMatchObject({ selected: true });
    expect(other.props.accessibilityState).toMatchObject({ selected: false });
    expect(destinationClasses(view, "Campaigns")).toContain("bg-secondary/60");
    expect(destinationClasses(view, "Contacts")).not.toContain(
      "bg-secondary/60",
    );
  });

  it("renders the brand as a destination when it has one", async () => {
    const asLink = await renderBar(
      <Navbar testID="bar" brand="Ashee SMS" brandHref="/" links={LINKS} />,
    );
    const asText = await renderBar(
      <Navbar testID="bar" brand="Ashee SMS" links={LINKS} />,
    );

    expect(destinationOf(asLink, "Ashee SMS").props.accessibilityRole).toBe(
      "link",
    );
    expect(destinationOf(asText, "Ashee SMS").props.accessibilityRole).toBe(
      undefined,
    );
  });
});

describe("Native Navbar options", () => {
  it("resolves its surface, its alignment and its sticky option through configuration", async () => {
    const view = await renderBar(<Navbar testID="bar" links={LINKS} />, {
      components: {
        navbar: { position: "static", variant: "bordered", align: "end" },
      },
    });

    expect(classesOf(view, "bar")).toContain("border-b");
    // A platform screen has no scroll-linked positioning, so the option resolves and states no rule.
    // The screen pins its bar by placing it outside the region that scrolls.
    expect(classesOf(view, "bar")).not.toContain("sticky");
    expect(view.getByLabelText("Main").props.className).toContain(
      "justify-end",
    );
  });

  it("wraps itself in a container of the configured width, unless it is told not to", async () => {
    const contained = await renderBar(<Navbar testID="bar" links={LINKS} />);
    const bare = await renderBar(<Navbar testID="bar" links={LINKS} />, {
      components: { navbar: { contained: false } },
    });

    expect(
      ancestorWithClass(contained.getByLabelText("Main"), "max-w-5xl"),
    ).toBeDefined();
    expect(
      ancestorWithClass(bare.getByLabelText("Main"), "max-w-"),
    ).toBeUndefined();
  });

  it("keeps the web's disclosure out of the platform's way", async () => {
    const onMobileOpenChange = jest.fn();
    const view = await renderBar(
      <Navbar
        testID="bar"
        links={LINKS}
        mobileLabel="Open navigation"
        mobileOpen={false}
        onMobileOpenChange={onMobileOpenChange}
      />,
    );

    // A browser hides the row below `md` and opens a panel instead, because its bar is a single line
    // it cannot scroll sideways. The platform scrolls its row and keeps every destination in reach,
    // so no panel is invented, nothing is named for one and nothing reports a change to it.
    expect(view.queryByText("Open navigation")).toBeNull();
    expect(view.queryByRole("button")).toBeNull();
    expect(view.getByText("Campaigns")).toBeTruthy();
    expect(onMobileOpenChange).not.toHaveBeenCalled();
  });

  it("carries the consumer's class last, so it wins", async () => {
    const view = await renderBar(
      <Navbar testID="bar" className="bg-primary" links={LINKS} />,
    );

    expect(classesOf(view, "bar").endsWith("bg-primary")).toBe(true);
  });
});
describe("Native TabBar", () => {
  it("draws the same destinations as a bar the screen places at the edge", async () => {
    const view = await renderBar(<TabBar testID="tabs" items={LINKS} />);
    const row = view.getByLabelText("Main");

    expect(row.props.accessibilityRole).toBe("tablist");
    expect(
      destinationOf(view, "Campaigns").props.accessibilityState,
    ).toMatchObject({ selected: true });
    expect(classesOf(view, "tabs")).toContain("border-t");
  });

  it("states a destination that is unavailable as disabled", async () => {
    const view = await renderBar(
      <TabBar
        testID="tabs"
        items={[{ label: "Campaigns" }, { label: "Contacts", disabled: true }]}
      />,
    );

    expect(
      destinationOf(view, "Contacts").props.accessibilityState,
    ).toMatchObject({ disabled: true });
  });

  it("names itself through the option the bar's row uses", async () => {
    const view = await renderBar(
      <TabBar testID="tabs" items={LINKS} label="Primary" />,
    );

    expect(view.getByLabelText("Primary").props.accessibilityRole).toBe(
      "tablist",
    );
  });

  it("carries the consumer's class last, so it wins", async () => {
    const view = await renderBar(
      <TabBar testID="tabs" items={LINKS} className="bg-primary" />,
    );

    expect(classesOf(view, "tabs").endsWith("bg-primary")).toBe(true);
  });
});

describe("Native Navbar setup", () => {
  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(render(<Navbar links={LINKS} />)).rejects.toThrow(
      /AsheeNativeProvider/,
    );

    silence.mockRestore();
  });
});
