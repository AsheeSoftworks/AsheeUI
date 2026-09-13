import { describe, expect, it, vi } from "vitest";
import { createUser, renderWithProvider } from "../../test";
import { Sidebar } from "./Sidebar";

const ITEMS = [
  { id: "home", label: "Home" },
  { id: "settings", label: "Settings" },
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
  // controlled `isCollapsed`, the collapse control reports the request but the
  // sidebar never updates its own state, so an uncontrolled consumer that
  // listens for the change can never collapse it.
  it.todo(
    "updates its own collapsed state when a change callback is provided without a controlled value (defect register D-12)",
  );

  // Defect register (M1, D-11): the active item is marked only by classes
  // (`font-medium` plus the active variant classes). `COMP-044` requires the
  // active-item state to be exposed, and the testing matrix expects
  // `aria-current` on the active navigation item.
  it.todo(
    "exposes the active item with aria-current (defect register D-11)",
  );
});
