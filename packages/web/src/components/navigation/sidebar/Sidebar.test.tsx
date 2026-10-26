import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  makeComponentConfig,
  renderWithProvider,
} from "../../../test";
import { Sidebar } from "./Sidebar";
import { useSidebarCollapse } from "./sidebar-collapse";

const ITEMS = [
  { id: "home", label: "Home" },
  { id: "settings", label: "Settings" },
];

/**
 * The application's own control, built from the state the column publishes.
 *
 * It stands in for the button a consumer draws — in the footer, or anywhere else inside the column — which is
 * what replaced the control the framework used to render itself.
 */
function ConsumerControl({
  onChange,
}: {
  onChange?: (value: boolean) => void;
}) {
  const { isCollapsed, collapsible, toggleCollapse } = useSidebarCollapse();

  onChange?.(isCollapsed);

  return (
    <button type="button" disabled={!collapsible} onClick={toggleCollapse}>
      {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    </button>
  );
}

const ITEMS_WITH_HREF = [
  { id: "home", label: "Home", href: "/home" },
  { id: "settings", label: "Settings", href: "/settings" },
];

const DISABLED_SECTION = [
  {
    id: "main",
    label: "Main",
    disabled: true,
    items: [{ id: "home", label: "Home", href: "/home" }],
  },
];

describe("Sidebar", () => {
  it("renders a navigation landmark with its title and items", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Sidebar items={ITEMS} title="Workspace" />,
    );

    expect(getByRole("navigation")).toBeInTheDocument();
    expect(getByText("Workspace")).toBeInTheDocument();
    expect(getByText("Home")).toBeInTheDocument();
    expect(getByText("Settings")).toBeInTheDocument();
  });

  it("reports the selected item key", async () => {
    const user = createUser();
    const onSelect = vi.fn();
    const { getByText } = renderWithProvider(
      <Sidebar items={ITEMS} onSelect={onSelect} />,
    );

    await user.click(getByText("Home"));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "home" }),
    );
  });

  // The column states its collapse state and draws no control of its own: the button belongs to the
  // application, which builds it from `useSidebarCollapse` (or from the controlled props).
  it("draws no collapse control of its own", () => {
    const { container } = renderWithProvider(
      <Sidebar items={ITEMS} title="Workspace" />,
    );

    expect(container.querySelectorAll("button")).toHaveLength(0);
  });

  // The column used to draw its own "Collapse sidebar" button. The control belongs to the application now,
  // and the column publishes the state that control reads.
  it("reports a collapse request from the application's own control", async () => {
    const user = createUser();
    const onCollapseChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Sidebar
        items={ITEMS}
        onCollapseChange={onCollapseChange}
        footer={<ConsumerControl />}
      />,
    );

    await user.click(getByRole("button", { name: "Collapse sidebar" }));

    expect(onCollapseChange).toHaveBeenCalledWith(true);
  });

  // Defect register (M1, D-12): when `onCollapseChange` is provided without a
  // controlled `isCollapsed`, the control reported the request but the sidebar
  // never updated its own state.
  it("updates its own collapsed state when a change callback is provided without a controlled value", async () => {
    const user = createUser();
    const onCollapseChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Sidebar
        items={ITEMS}
        onCollapseChange={onCollapseChange}
        footer={<ConsumerControl />}
      />,
    );

    await user.click(getByRole("button", { name: "Collapse sidebar" }));

    expect(onCollapseChange).toHaveBeenCalledWith(true);
    // The column followed its own state, so the control now offers to expand.
    expect(getByRole("button", { name: "Expand sidebar" })).toBeInTheDocument();
  });

  it("honours a controlled collapsed state", () => {
    const { getByRole } = renderWithProvider(
      <Sidebar items={ITEMS} isCollapsed footer={<ConsumerControl />} />,
    );

    expect(getByRole("button", { name: "Expand sidebar" })).toBeInTheDocument();
  });

  it("reports header back navigation", async () => {
    const user = createUser();
    const onBack = vi.fn();
    const { getByRole } = renderWithProvider(
      <Sidebar items={ITEMS} title="Workspace" onBack={onBack} />,
    );

    await user.click(getByRole("button", { name: "Go back" }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // A folded column hides its title, so a header that held nothing else was an empty band with a dashed rule
  // under it. Nothing to show means no header; a back control is something to show.
  it("draws no header when a folded column has only a title, and keeps it while expanded", () => {
    const expanded = renderWithProvider(
      <Sidebar items={ITEMS} title="Workspace" />,
    );
    const collapsed = renderWithProvider(
      <Sidebar items={ITEMS} title="Workspace" isCollapsed />,
    );

    expect(expanded.container.querySelector("aside > div")).not.toBeNull();
    expect(collapsed.container.querySelector("aside > div")).toBeNull();
    expect(collapsed.container.querySelector("aside > nav")).not.toBeNull();
  });

  it("refuses to fold, and says so, when collapse is disabled", async () => {
    const user = createUser();
    const onCollapseChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Sidebar
        items={ITEMS}
        collapsible={false}
        onCollapseChange={onCollapseChange}
        footer={<ConsumerControl />}
      />,
    );
    const control = getByRole("button", { name: "Collapse sidebar" });

    // The control reads `collapsible` and disables itself rather than offering an action the column refuses.
    expect(control).toBeDisabled();

    await user.click(control);

    expect(onCollapseChange).not.toHaveBeenCalled();
  });

  it("publishes a state that cannot move outside a column, and says so once", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const onChange = vi.fn();

    try {
      const { getByRole } = renderWithProvider(
        <ConsumerControl onChange={onChange} />,
      );
      const control = getByRole("button", { name: "Collapse sidebar" });

      expect(control).toBeDisabled();
      expect(onChange).toHaveBeenCalledWith(false);
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining("no Sidebar was found"),
      );
    } finally {
      warn.mockRestore();
    }
  });

  // Defect register (M1, D-11): the active item was marked only by classes.
  // `COMP-044` requires the active-item state to be exposed, and the testing
  // matrix expects `aria-current` on the active navigation item.
  it("exposes the active item with aria-current", () => {
    const { getByRole } = renderWithProvider(
      <Sidebar
        items={[
          { id: "home", label: "Home", href: "/home" },
          { id: "settings", label: "Settings", href: "/settings" },
        ]}
        title="Workspace"
        activeKey="settings"
      />,
    );

    expect(getByRole("link", { name: "Settings" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  // A collapsed row rendered only its icon, and the tooltip was
  // `aria-describedby` — a description, not a name — so the row was unnamed.
  it("keeps an accessible name on a collapsed row", () => {
    const { getByRole } = renderWithProvider(
      <Sidebar items={ITEMS_WITH_HREF} isCollapsed />,
    );
    const home = getByRole("link", { name: "Home" });

    expect(home.querySelector(".sr-only")?.textContent).toBe("Home");
  });

  // `animated` was registered and documented but the width transition was
  // hard-coded, so `components.sidebar.animated: false` did nothing.
  it("emits the width transition only when animated", () => {
    const animated = renderWithProvider(<Sidebar items={ITEMS} />);
    expect(animated.container.querySelector("aside")?.className).toContain(
      "transition-all",
    );

    const still = renderWithProvider(
      <Sidebar items={ITEMS} animated={false} />,
    );
    expect(still.container.querySelector("aside")?.className).not.toContain(
      "transition-all",
    );
  });

  it("reads the configured animated flag", () => {
    const { container } = renderWithProvider(<Sidebar items={ITEMS} />, {
      config: makeComponentConfig("sidebar", { animated: false }),
    });

    expect(container.querySelector("aside")?.className).not.toContain(
      "transition-all",
    );
  });

  // `SidebarSection.disabled` was declared and documented, and ignored: every
  // row of a disabled section still acted.
  it("disables every row of a disabled section", async () => {
    const user = createUser();
    const onSelect = vi.fn();
    const { getByText } = renderWithProvider(
      <Sidebar items={DISABLED_SECTION} onSelect={onSelect} />,
    );
    const home = getByText("Home").closest("a");

    expect(home).not.toBeNull();
    expect(home).not.toHaveAttribute("href");
    expect(home).toHaveAttribute("aria-disabled", "true");

    await user.click(home as HTMLElement);

    expect(onSelect).not.toHaveBeenCalled();
  });

  // The footer lived inside the collapse-button branches, so with `collapsible={false}` neither branch ran and
  // the footer disappeared. It belongs to the consumer, and it is drawn whatever the collapse settings are.
  it("renders the footer when collapse is disabled", () => {
    const { getByText } = renderWithProvider(
      <Sidebar
        items={ITEMS}
        collapsible={false}
        footer={<span>Account</span>}
      />,
    );

    expect(getByText("Account")).toBeInTheDocument();
  });

  // A control in the footer is how a collapsed column is unfolded again, so the footer cannot be hidden with
  // the labels: it is drawn in both states, and the control keeps its place.
  it("keeps the footer, and the control in it, while the column is collapsed", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Sidebar
        items={ITEMS}
        isCollapsed
        footer={
          <div>
            <span>Account</span>
            <ConsumerControl />
          </div>
        }
      />,
    );

    expect(getByText("Account")).toBeInTheDocument();
    expect(getByRole("button", { name: "Expand sidebar" })).toBeInTheDocument();
  });

  // The `aria-label` prop lands on the aside, and the inner `nav` had no name,
  // so two sidebars were indistinguishable in a landmark list.
  it("names the navigation landmark", () => {
    const { getByRole } = renderWithProvider(
      <Sidebar items={ITEMS} navLabel="Workspace navigation" />,
    );

    expect(
      getByRole("navigation", { name: "Workspace navigation" }),
    ).toBeInTheDocument();
  });

  it("names the navigation landmark by default", () => {
    const { getByRole } = renderWithProvider(<Sidebar items={ITEMS} />);

    expect(
      getByRole("navigation", { name: "Sidebar navigation" }),
    ).toBeInTheDocument();
  });

  // Sidebar was the only navigation component that was not a `forwardRef`.
  it("forwards its ref to the aside and keeps its display name", () => {
    const ref = createRef<HTMLElement>();
    const { container } = renderWithProvider(
      <Sidebar ref={ref} items={ITEMS} />,
    );

    expect(ref.current).toBe(container.querySelector("aside"));
    expect(Sidebar.displayName).toBe("Sidebar");
  });
});
