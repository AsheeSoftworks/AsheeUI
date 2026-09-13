import { describe, expect, it, vi } from "vitest";
import { createUser, pressArrow, pressKey, renderWithProvider } from "../../test";
import { Tabs } from "./Tabs";

const TABS = [
  { id: "first", label: "First", content: <p>First panel</p> },
  { id: "second", label: "Second", content: <p>Second panel</p> },
];

describe("Tabs", () => {
  it("exposes tablist, tab and tabpanel semantics", () => {
    const { getByRole } = renderWithProvider(<Tabs tabs={TABS} />);

    expect(getByRole("tablist")).toBeInTheDocument();
    expect(getByRole("tabpanel")).toBeInTheDocument();
  });

  it("selects the first tab by default and keeps only it focusable", () => {
    const { getByRole, getAllByRole } = renderWithProvider(<Tabs tabs={TABS} />);
    const first = getByRole("tab", { name: "First" });
    const second = getByRole("tab", { name: "Second" });

    expect(first).toHaveAttribute("aria-selected", "true");
    expect(first).toHaveAttribute("tabindex", "0");
    expect(second).toHaveAttribute("aria-selected", "false");
    expect(second).toHaveAttribute("tabindex", "-1");
    expect(getAllByRole("tab")).toHaveLength(2);
  });

  it("switches the active panel on click and reports the change", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole, getByText, queryByText } = renderWithProvider(
      <Tabs tabs={TABS} onChange={onChange} />,
    );

    expect(getByText("First panel")).toBeInTheDocument();
    expect(queryByText("Second panel")).toBeNull();

    await user.click(getByRole("tab", { name: "Second" }));

    expect(onChange).toHaveBeenCalledWith("second");
    expect(getByRole("tab", { name: "Second" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(getByText("Second panel")).toBeInTheDocument();
    expect(queryByText("First panel")).toBeNull();
  });

  it("moves between tabs with arrow keys and jumps with Home and End", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<Tabs tabs={TABS} />);
    const first = getByRole("tab", { name: "First" });
    const second = getByRole("tab", { name: "Second" });

    first.focus();
    await pressArrow(user, "ArrowRight");
    expect(second).toHaveAttribute("aria-selected", "true");

    await pressKey(user, "Home");
    expect(first).toHaveAttribute("aria-selected", "true");

    await pressKey(user, "End");
    expect(second).toHaveAttribute("aria-selected", "true");

    // Arrow navigation wraps around the ends of the tab list.
    await pressArrow(user, "ArrowRight");
    expect(first).toHaveAttribute("aria-selected", "true");

    await pressArrow(user, "ArrowLeft");
    expect(second).toHaveAttribute("aria-selected", "true");
  });

  it("respects a controlled active tab", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Tabs tabs={TABS} activeId="first" onChange={onChange} />,
    );
    const second = getByRole("tab", { name: "Second" });

    await user.click(second);

    expect(onChange).toHaveBeenCalledWith("second");
    expect(second).toHaveAttribute("aria-selected", "false");
  });
});
