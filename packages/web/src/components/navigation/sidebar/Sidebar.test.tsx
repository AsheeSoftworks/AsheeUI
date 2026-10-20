import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  makeComponentConfig,
  renderWithProvider,
} from "../../../test";
import { Sidebar } from "./Sidebar";

const ITEMS = [
  { id: "home", label: "Home" },
  { id: "settings", label: "Settings" },
];

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

  it("reports a collapse request from the collapse control", async () => {
    const user = createUser();
    const onCollapseChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Sidebar items={ITEMS} onCollapseChange={onCollapseChange} />,
    );

    await user.click(getByRole("button", { name: "Collapse sidebar" }));

    expect(onCollapseChange).toHaveBeenCalledWith(true);
  });

  it("collapses itself when it is not controlled", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<Sidebar items={ITEMS} />);

    await user.click(getByRole("button", { name: "Collapse sidebar" }));

    expect(getByRole("button", { name: "Expand sidebar" })).toBeInTheDocument();
  });

  it("honours a controlled collapsed state", () => {
    const { getByRole } = renderWithProvider(
      <Sidebar items={ITEMS} isCollapsed />,
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

  it("hides the collapse control when collapse is disabled", () => {
    const { queryByRole } = renderWithProvider(
      <Sidebar items={ITEMS} collapsible={false} />,
    );

    expect(queryByRole("button", { name: /sidebar/i })).toBeNull();
  });

  // Defect register (M1, D-12): when `onCollapseChange` is provided without a
  // controlled `isCollapsed`, the collapse control reported the request but the
  // sidebar never updated its own state.
  it("updates its own collapsed state when a change callback is provided without a controlled value", async () => {
    const user = createUser();
    const onCollapseChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Sidebar items={ITEMS} onCollapseChange={onCollapseChange} />,
    );

    await user.click(getByRole("button", { name: "Collapse sidebar" }));

    expect(onCollapseChange).toHaveBeenCalledWith(true);
    // The sidebar followed its own state, so the control now offers to expand.
    expect(getByRole("button", { name: "Expand sidebar" })).toBeInTheDocument();
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

  // The footer lived inside the collapse-button branches, so with the default
  // `showCollapseButton: true` and `collapsible={false}` neither branch ran and
  // the footer disappeared.
  it("renders the footer when collapse is disabled", () => {
    const { getByText, queryByRole } = renderWithProvider(
      <Sidebar
        items={ITEMS}
        collapsible={false}
        footer={<span>Account</span>}
      />,
    );

    expect(getByText("Account")).toBeInTheDocument();
    expect(queryByRole("button", { name: /sidebar/i })).toBeNull();
  });

  it("renders the footer alongside the collapse control", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Sidebar items={ITEMS} footer={<span>Account</span>} />,
    );

    expect(getByText("Account")).toBeInTheDocument();
    expect(
      getByRole("button", { name: "Collapse sidebar" }),
    ).toBeInTheDocument();
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
