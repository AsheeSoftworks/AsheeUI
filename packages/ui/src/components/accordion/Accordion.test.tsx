import { describe, expect, it, vi } from "vitest";
import { createUser, expectState, pressKey, renderWithProvider } from "../../test";
import { Accordion } from "./Accordion";

const ITEMS = [
  { id: "first", title: "First", content: <p>First content</p> },
  { id: "second", title: "Second", content: <p>Second content</p> },
];

describe("Accordion", () => {
  it("renders one collapsed trigger per item", () => {
    const { getAllByRole } = renderWithProvider(<Accordion items={ITEMS} />);
    const triggers = getAllByRole("button");

    expect(triggers).toHaveLength(2);
    for (const trigger of triggers) {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    }
  });

  it("expands on click and links the trigger to its panel", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<Accordion items={ITEMS} />);
    const trigger = getByRole("button", { name: /First/ });

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const panelId = trigger.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    const panel = document.getElementById(panelId ?? "");
    expect(panel).not.toBeNull();
    expect(panel).toHaveAttribute("data-state", "open");
    expect(panel).toHaveAttribute("aria-labelledby", trigger.id);
  });

  it("toggles with the keyboard", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<Accordion items={ITEMS} />);
    const trigger = getByRole("button", { name: /First/ });

    trigger.focus();
    await pressKey(user, "Enter");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await pressKey(user, " ");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps a single item open by default", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<Accordion items={ITEMS} />);
    const first = getByRole("button", { name: /First/ });
    const second = getByRole("button", { name: /Second/ });

    await user.click(first);
    await user.click(second);

    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps multiple items open when configured", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Accordion items={ITEMS} allowMultiple />,
    );
    const first = getByRole("button", { name: /First/ });
    const second = getByRole("button", { name: /Second/ });

    await user.click(first);
    await user.click(second);

    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(second).toHaveAttribute("aria-expanded", "true");
  });

  it("reports changes and respects a controlled value", async () => {
    const user = createUser();
    const onValueChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Accordion items={ITEMS} value={["first"]} onValueChange={onValueChange} />,
    );
    const first = getByRole("button", { name: /First/ });
    const second = getByRole("button", { name: /Second/ });

    expect(first).toHaveAttribute("aria-expanded", "true");

    await user.click(second);

    expect(onValueChange).toHaveBeenCalled();
    expect(second).toHaveAttribute("aria-expanded", "false");
  });

  it("does not open a disabled item", async () => {
    const user = createUser();
    const items = [
      { id: "locked", title: "Locked", content: <p>Locked content</p>, disabled: true },
    ];
    const { getByRole } = renderWithProvider(<Accordion items={items} />);
    const trigger = getByRole("button", { name: /Locked/ });

    expectState(trigger, { disabled: true });

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  // Defect register (M1, D-10): a collapsed panel keeps its content mounted
  // with only `grid-rows-[0fr] opacity-0 pointer-events-none`, so interactive
  // content inside a collapsed panel stays in the focus order and in the
  // accessibility tree.
  it.todo(
    "removes collapsed panel content from the focus order and the accessibility tree (defect register D-10)",
  );
});
