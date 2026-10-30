/**
 * Behaviour tests for the native Sidebar.
 *
 * The tests state the component's contract: it renders a list of sections under their labels and a
 * flat list as one unnamed section; a row is a link a screen reader can find, the row of the page
 * being shown is reported as selected rather than only styled, a row that cannot be used is
 * reported as disabled and sends no press, and a press reports the row and follows the destination
 * the row names; a section that is disabled keeps its rows on screen and refuses their presses; a
 * collapsed row keeps its name even though the icon is all it draws; the destination belongs to the
 * component the consumer names, when it names one;
 * the rows and sections the consumer's role does not name are left out, and so is a section left
 * with nothing; the application's own control folds the sidebar to an icon rail and unfolds it
 * again, and reports the request rather than deciding when its owner holds the state; a sidebar that
 * cannot collapse disables that control and keeps its footer slot; the width, the surface and the
 * corner resolve through the configuration cascade; the header
 * holds the title and the back control, and gives up the title while collapsed; a collapsed row
 * explains itself with the hint the framework's tooltip states; the consumer's class is carried
 * last; and the component says out loud that it is being rendered without the provider, because
 * that is a setup mistake.
 */

import {
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement, ReactNode } from "react";
import { Pressable, Text } from "react-native";
import { AsheeUIProvider } from "../../../provider/AsheeUIProvider";
import { openDestination } from "../../../utils/open-destination";
import { Sidebar } from "./Sidebar";
import { useSidebarCollapse } from "./sidebar-collapse";
import type { SidebarSection } from "./sidebar-config";

jest.mock("../../../utils/open-destination", () => ({
  openDestination: jest.fn(),
}));

beforeEach(() => {
  // Each test states what it expects the platform to have been asked to do, so the
  // record of the last one is cleared rather than carried over.
  jest.clearAllMocks();
});

/**
 * The application's own control, built from the state the column publishes.
 *
 * It stands in for the button a consumer draws — in the footer, or anywhere else inside the column — which
 * is what replaced the control the framework used to render itself.
 *
 * @param props - The state the test wants to see.
 * @param props.onChange - Called with the collapsed state on every render.
 * @returns The rendered control.
 */
function ConsumerControl({
  onChange,
}: {
  onChange?: (value: boolean) => void;
}) {
  const { isCollapsed, collapsible, toggleCollapse } = useSidebarCollapse();

  onChange?.(isCollapsed);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      accessibilityState={{ expanded: !isCollapsed, disabled: !collapsible }}
      disabled={!collapsible}
      onPress={toggleCollapse}>
      <Text>{isCollapsed ? "Expand" : "Collapse"}</Text>
    </Pressable>
  );
}

/**
 * A stand-in for an application's own navigation component.
 *
 * The component owns where a row leads, which is why the framework hands the press
 * over rather than following the destination itself.
 *
 * @param props - The props the link substitution passes down.
 * @param props.children - The row's content.
 * @param props.onPress - The press the framework reports through the substitution.
 * @returns The rendered row.
 */
function RoutedRow({
  children,
  onPress,
}: {
  children?: ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable testID="routed-row" onPress={onPress}>
      {children}
    </Pressable>
  );
}

/**
 * Render a sidebar inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderSidebar(ui: ReactElement, config?: object) {
  return render(<AsheeUIProvider config={config}>{ui}</AsheeUIProvider>);
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

/** The workspace a test sidebar navigates: sections, rows and a badge. */
const WORKSPACE: SidebarSection[] = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { id: "dashboard", label: "Dashboard", href: "/dashboard" },
      { id: "campaigns", label: "Campaigns", href: "/campaigns", badge: "3" },
    ],
  },
  {
    id: "team",
    label: "Team",
    items: [{ id: "contacts", label: "Contacts", href: "/contacts" }],
  },
];

describe("Native Sidebar", () => {
  it("renders a list of sections under their labels", async () => {
    const view = await renderSidebar(
      <Sidebar testID="sidebar" items={WORKSPACE} />,
    );

    expect(view.getByText("Workspace")).toBeTruthy();
    expect(view.getByText("Team")).toBeTruthy();
    expect(view.getByText("Dashboard")).toBeTruthy();
    expect(view.getByText("Campaigns")).toBeTruthy();
    expect(view.getByText("Contacts")).toBeTruthy();
  });

  it("renders a flat list as one unnamed section, so a consumer may hand over either shape", async () => {
    const view = await renderSidebar(
      <Sidebar
        testID="sidebar"
        items={[
          { id: "dashboard", label: "Dashboard", href: "/dashboard" },
          { id: "settings", label: "Settings", href: "/settings" },
        ]}
      />,
    );

    expect(view.getByText("Dashboard")).toBeTruthy();
    expect(view.getByText("Settings")).toBeTruthy();
    expect(view.getAllByRole("link")).toHaveLength(2);
  });

  it("renders a row with its icon and its badge", async () => {
    const view = await renderSidebar(
      <Sidebar
        testID="sidebar"
        items={[{ id: "campaigns", label: "Campaigns", badge: "3" }]}
      />,
    );

    expect(view.getByText("Campaigns")).toBeTruthy();
    expect(view.getByText("3")).toBeTruthy();
  });

  it("reports a row as the link it is, with the page being shown selected", async () => {
    const view = await renderSidebar(
      <Sidebar testID="sidebar" items={WORKSPACE} activeKey="dashboard" />,
    );

    const active = view.getByRole("link", { name: "Dashboard" });
    const other = view.getByRole("link", { name: "Contacts" });

    expect(active).toBeSelected();
    expect(other).not.toBeSelected();
    // The row of the page being shown carries the active treatment, which is what the web
    // states with aria-current and a surface class.
    expect((active.props as { className?: string }).className).toContain(
      "bg-primary",
    );
    expect((other.props as { className?: string }).className).not.toContain(
      "bg-primary",
    );
  });

  it("reports a row that cannot be used as disabled, and sends no press from it", async () => {
    const onSelect = jest.fn();
    const view = await renderSidebar(
      <Sidebar
        testID="sidebar"
        items={[
          {
            id: "settings",
            label: "Settings",
            href: "/settings",
            disabled: true,
          },
        ]}
        onSelect={onSelect}
      />,
    );

    const row = view.getByRole("link", { name: "Settings" });

    expect(row).toBeDisabled();

    await fireEvent.press(row);

    expect(onSelect).not.toHaveBeenCalled();
    expect(openDestination).not.toHaveBeenCalled();
  });

  it("honours a disabled section without taking its rows off the screen", async () => {
    const onSelect = jest.fn();
    const view = await renderSidebar(
      <Sidebar
        testID="sidebar"
        items={[
          {
            id: "workspace",
            label: "Workspace",
            disabled: true,
            items: [
              { id: "dashboard", label: "Dashboard", href: "/dashboard" },
              { id: "campaigns", label: "Campaigns", href: "/campaigns" },
            ],
          },
        ]}
        onSelect={onSelect}
      />,
    );
    const row = view.getByRole("link", { name: "Dashboard" });

    // A disabled section is still a section: its rows say what the application offers, so they
    // are drawn, and dimmed, rather than removed.
    expect(view.getByText("Campaigns")).toBeTruthy();
    expect(view.getByText("Workspace")).toBeTruthy();
    expect((row.props as { className?: string }).className).toContain(
      "opacity-50",
    );

    // Neither the row nor the section pretends to be usable.
    expect(row).toBeDisabled();
    expect(
      (view.getByText("Workspace").parent as { props: object }).props,
    ).toMatchObject({ accessibilityState: { disabled: true } });

    await fireEvent.press(row);

    expect(onSelect).not.toHaveBeenCalled();
    expect(openDestination).not.toHaveBeenCalled();
  });

  it("reports the row that was pressed and follows the destination it names", async () => {
    const onSelect = jest.fn();
    const view = await renderSidebar(
      <Sidebar testID="sidebar" items={WORKSPACE} onSelect={onSelect} />,
    );

    await fireEvent.press(view.getByRole("link", { name: "Dashboard" }));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "dashboard" }),
    );
    expect(openDestination).toHaveBeenCalledWith("/dashboard");
  });

  it("follows nothing when the row names no destination", async () => {
    const onSelect = jest.fn();
    const view = await renderSidebar(
      <Sidebar
        testID="sidebar"
        items={[{ id: "more", label: "More" }]}
        onSelect={onSelect}
      />,
    );

    await fireEvent.press(view.getByRole("link", { name: "More" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(openDestination).not.toHaveBeenCalled();
  });

  it("leaves the destination to the component the consumer names, because that component owns it", async () => {
    const onSelect = jest.fn();
    const view = await renderSidebar(
      <Sidebar
        testID="sidebar"
        items={WORKSPACE}
        link={{ component: RoutedRow }}
        onSelect={onSelect}
      />,
    );

    await fireEvent.press(view.getAllByTestId("routed-row")[0]);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(openDestination).not.toHaveBeenCalled();
  });

  it("leaves out the rows and sections the consumer's role does not name", async () => {
    const items: SidebarSection[] = [
      {
        id: "workspace",
        label: "Workspace",
        items: [
          { id: "overview", label: "Overview" },
          { id: "billing", label: "Billing", roles: ["admin"] },
        ],
      },
      {
        id: "administration",
        label: "Administration",
        roles: ["admin"],
        items: [{ id: "users", label: "Users" }],
      },
    ];

    const member = await renderSidebar(
      <Sidebar testID="sidebar" items={items} userRole="member" />,
    );

    expect(member.getByText("Workspace")).toBeTruthy();
    expect(member.getByText("Overview")).toBeTruthy();
    expect(member.queryByText("Billing")).toBeNull();
    // A section left with nothing is dropped rather than drawn as a label over nothing.
    expect(member.queryByText("Administration")).toBeNull();
    expect(member.queryByText("Users")).toBeNull();

    const admin = await renderSidebar(
      <Sidebar testID="sidebar" items={items} userRole="admin" />,
    );

    expect(admin.getByText("Overview")).toBeTruthy();
    expect(admin.getByText("Billing")).toBeTruthy();
    expect(admin.getByText("Administration")).toBeTruthy();
    expect(admin.getByText("Users")).toBeTruthy();
  });

  it("starts collapsed when it is told to", async () => {
    const view = await renderSidebar(
      <Sidebar testID="sidebar" items={WORKSPACE} defaultCollapsed />,
    );

    expect(classesOf(view, "sidebar")).toContain("w-18");
  });

  it("keeps a collapsed row named, even though the icon is all it draws", async () => {
    const view = await renderSidebar(
      <Sidebar testID="sidebar" items={WORKSPACE} isCollapsed />,
    );

    // Collapsed, the icon is the only thing the row shows, so the row states the name it no
    // longer draws. A tooltip is a description rather than a name, so the hint is not the word
    // the row is reached by.
    expect(view.getByRole("link", { name: "Dashboard" })).toBeTruthy();
    expect(view.getByRole("link", { name: "Campaigns" })).toBeTruthy();
    expect(view.getByHintText("Dashboard")).toBeTruthy();
    // The label moves into the row's name rather than being drawn twice.
    expect(view.queryByText("Dashboard")).toBeNull();
  });

  it("draws no collapse control of its own", async () => {
    const view = await renderSidebar(
      <Sidebar testID="sidebar" items={WORKSPACE} title="Ashee SMS" />,
    );

    expect(view.queryByLabelText("Collapse sidebar")).toBeNull();
    expect(view.queryByLabelText("Expand sidebar")).toBeNull();
  });

  it("folds to an icon rail when the application's control is pressed, and unfolds again", async () => {
    const onCollapseChange = jest.fn();
    const view = await renderSidebar(
      <Sidebar
        testID="sidebar"
        items={WORKSPACE}
        onCollapseChange={onCollapseChange}
        footer={<ConsumerControl />}
      />,
    );

    expect(classesOf(view, "sidebar")).toContain("w-64");

    await fireEvent.press(view.getByLabelText("Collapse sidebar"));

    expect(classesOf(view, "sidebar")).toContain("w-18");
    expect(view.queryByText("Dashboard")).toBeNull();
    expect(view.queryByText("Workspace")).toBeNull();
    expect(onCollapseChange).toHaveBeenLastCalledWith(true);

    await fireEvent.press(view.getByLabelText("Expand sidebar"));

    expect(classesOf(view, "sidebar")).toContain("w-64");
    expect(view.getByText("Dashboard")).toBeTruthy();
    expect(onCollapseChange).toHaveBeenLastCalledWith(false);
  });

  it("reports the request rather than deciding, when its owner holds the state", async () => {
    const onCollapseChange = jest.fn();
    const view = await renderSidebar(
      <Sidebar
        testID="sidebar"
        items={WORKSPACE}
        isCollapsed
        onCollapseChange={onCollapseChange}
        footer={<ConsumerControl />}
      />,
    );

    await fireEvent.press(view.getByLabelText("Expand sidebar"));

    expect(onCollapseChange).toHaveBeenCalledWith(false);
    // The owner has not answered yet, so the sidebar is where its owner put it.
    expect(classesOf(view, "sidebar")).toContain("w-18");
    expect(view.queryByText("Dashboard")).toBeNull();
  });

  it("disables the application's control, and keeps the footer, when it cannot collapse", async () => {
    const onCollapseChange = jest.fn();
    const view = await renderSidebar(
      <Sidebar
        testID="sidebar"
        items={WORKSPACE}
        collapsible={false}
        onCollapseChange={onCollapseChange}
        footer={<ConsumerControl />}
      />,
    );

    const control = view.getByLabelText("Collapse sidebar");

    expect(control).toBeDisabled();
    expect(view.getByTestId("sidebar-footer")).toBeTruthy();

    await fireEvent.press(control);

    expect(onCollapseChange).not.toHaveBeenCalled();
  });

  // A control in the footer is how a collapsed column is unfolded again, so the slot cannot be given up with
  // the labels: it is drawn in both states, and the control keeps its place.
  it("keeps the footer slot, and its control, while the column is collapsed", async () => {
    const view = await renderSidebar(
      <Sidebar
        testID="sidebar"
        items={WORKSPACE}
        isCollapsed
        footer={
          <Pressable accessibilityLabel="Account">
            <Text>Ashee Softworks</Text>
          </Pressable>
        }
      />,
    );

    expect(view.getByTestId("sidebar-footer")).toBeTruthy();
    expect(view.getByText("Ashee Softworks")).toBeTruthy();
  });

  it("states its width through the configuration cascade", async () => {
    const large = await renderSidebar(
      <Sidebar testID="sidebar" items={WORKSPACE} size="lg" />,
    );
    const configured = await renderSidebar(
      <Sidebar testID="sidebar" items={WORKSPACE} />,
      { components: { sidebar: { size: "sm" } } },
    );

    expect(classesOf(large, "sidebar")).toContain("w-72");
    expect(classesOf(configured, "sidebar")).toContain("w-56");
  });

  it("states its surface as the variant, and rounds a pill-shaped sidebar to a panel's corner", async () => {
    const view = await renderSidebar(
      <Sidebar
        testID="sidebar"
        items={WORKSPACE}
        variant="floating"
        radius="full"
      />,
    );

    expect(classesOf(view, "sidebar")).toContain("m-2");
    // A sidebar is a column rather than a pill, so `full` resolves to a panel's corner.
    expect(classesOf(view, "sidebar")).toContain("rounded-xl");
  });

  it("holds the title and the back control in the header", async () => {
    const onBack = jest.fn();
    const view = await renderSidebar(
      <Sidebar
        testID="sidebar"
        items={WORKSPACE}
        title="Ashee SMS"
        onBack={onBack}
      />,
    );

    expect(view.getByTestId("sidebar-header")).toBeTruthy();
    expect(view.getByText("Ashee SMS")).toBeTruthy();

    await fireEvent.press(view.getByLabelText("Go back"));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("has no header when it has neither a title nor a back control", async () => {
    const view = await renderSidebar(
      <Sidebar testID="sidebar" items={WORKSPACE} />,
    );

    expect(view.queryByTestId("sidebar-header")).toBeNull();
  });

  it("hides the title while collapsed, and keeps the back control", async () => {
    const view = await renderSidebar(
      <Sidebar
        testID="sidebar"
        items={WORKSPACE}
        title="Ashee SMS"
        onBack={jest.fn()}
        isCollapsed
      />,
    );

    expect(view.queryByText("Ashee SMS")).toBeNull();
    expect(view.getByLabelText("Go back")).toBeTruthy();
  });

  it("explains a collapsed row with the hint the framework's tooltip states", async () => {
    const collapsed = await renderSidebar(
      <Sidebar testID="sidebar" items={WORKSPACE} isCollapsed />,
    );

    expect(collapsed.getByHintText("Dashboard")).toBeTruthy();

    const silent = await renderSidebar(
      <Sidebar
        testID="sidebar"
        items={WORKSPACE}
        isCollapsed
        tooltip={{ show: false }}
      />,
    );

    expect(silent.queryByHintText("Dashboard")).toBeNull();

    const expanded = await renderSidebar(
      <Sidebar testID="sidebar" items={WORKSPACE} />,
    );

    // An expanded row says its label out loud, so it has no hint to state.
    expect(expanded.queryByHintText("Dashboard")).toBeNull();
  });

  it("carries the consumer's class last, so it wins", async () => {
    const view = await renderSidebar(
      <Sidebar testID="sidebar" items={WORKSPACE} className="bg-primary" />,
    );

    expect(classesOf(view, "sidebar").endsWith("bg-primary")).toBe(true);
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(render(<Sidebar items={WORKSPACE} />)).rejects.toThrow(
      /AsheeUIProvider/,
    );

    silence.mockRestore();
  });
});
