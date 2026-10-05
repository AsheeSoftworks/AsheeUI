import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  expectAccessibleName,
  expectFocused,
  expectPortalled,
  getOverlayBackdrop,
  pressKey,
  renderWithProvider,
  screen,
  waitFor,
} from "../../test";
import { Drawer } from "./Drawer";

/**
 * Stand-in consumer: a trigger that opens the drawer and a control inside the
 * drawer that closes it, which is how focus restoration is observed.
 */
function DrawerHarness() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open
      </button>
      <Drawer
        isOpen={isOpen}
        animated={false}
        aria-label="Harness drawer"
        onClose={() => setIsOpen(false)}>
        <button type="button" onClick={() => setIsOpen(false)}>
          Close
        </button>
      </Drawer>
    </>
  );
}

describe("Drawer", () => {
  it("does not expose a dialog while it is closed", () => {
    const { queryByRole } = renderWithProvider(
      <Drawer isOpen={false} onClose={() => {}}>
        Drawer content
      </Drawer>,
    );

    expect(queryByRole("dialog")).toBeNull();
  });

  it("exposes dialog semantics with its content while open", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Drawer isOpen onClose={() => {}}>
        Drawer content
      </Drawer>,
    );

    expect(getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    expect(getByText("Drawer content")).toBeInTheDocument();
  });

  it("renders on the requested edge", () => {
    const { getByRole } = renderWithProvider(
      <Drawer isOpen placement="left" onClose={() => {}}>
        Drawer content
      </Drawer>,
    );

    expect(getByRole("dialog").className).toMatch(/justify-start|left/);
  });

  // Defect register (M1, D-18): shared with Modal. The dialog was rendered
  // inline and managed no focus at all.
  it("renders the drawer in a portal, outside the component subtree", () => {
    const { container, getByRole } = renderWithProvider(
      <Drawer isOpen onClose={() => {}}>
        Drawer content
      </Drawer>,
    );

    expectPortalled(getByRole("dialog"), container);
  });

  // Defect register (M1, D-19): shared with Modal. The dialog had no accessible
  // name and no way to give it one.
  it("takes its accessible name from the consumer's labelling attribute", () => {
    const { getByRole } = renderWithProvider(
      <Drawer isOpen aria-label="Account settings" onClose={() => {}}>
        Drawer content
      </Drawer>,
    );

    expectAccessibleName(getByRole("dialog"), "Account settings");
  });

  it("moves focus into the drawer and restores it to the trigger on close", async () => {
    const user = createUser();

    renderWithProvider(<DrawerHarness />);

    const trigger = screen.getByRole("button", { name: "Open" });

    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Harness drawer" });

    await waitFor(() => {
      expectFocused(dialog);
    });

    await user.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expectFocused(trigger);
    });
  });

  it("keeps keyboard focus inside the drawer while it is open", async () => {
    const user = createUser();

    renderWithProvider(
      <Drawer isOpen aria-label="Focus drawer" onClose={() => {}}>
        <button type="button">First</button>
        <button type="button">Second</button>
      </Drawer>,
    );

    const dialog = screen.getByRole("dialog", { name: "Focus drawer" });

    await waitFor(() => {
      expectFocused(dialog);
    });

    for (let step = 0; step < 4; step += 1) {
      await user.tab();

      // The trap restores focus to the drawer's first control after each wrap,
      // which happens once the focus guard hands focus back.
      await waitFor(() => {
        expect(dialog.contains(document.activeElement)).toBe(true);
      });
    }
  });

  // Defect register (M1, D-21): shared with Modal. The overlay was an unnamed,
  // focusable button.
  it("keeps the backdrop out of the accessibility tree and the tab order", () => {
    renderWithProvider(
      <Drawer isOpen aria-label="Backdrop drawer" onClose={() => {}}>
        Drawer content
      </Drawer>,
    );

    const backdrop = getOverlayBackdrop();

    expect(backdrop.tagName).toBe("DIV");
    expect(backdrop).toHaveAttribute("aria-hidden", "true");
    expect(backdrop).not.toHaveAttribute("role");
    expect(backdrop).not.toHaveAttribute("tabindex");

    backdrop.focus();

    expect(backdrop).not.toHaveFocus();
  });

  it("closes on Escape and reports it", async () => {
    const user = createUser();
    const onClose = vi.fn();

    renderWithProvider(
      <Drawer isOpen onClose={onClose}>
        Drawer content
      </Drawer>,
    );

    await pressKey(user, "Escape");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close on Escape when that is disabled", async () => {
    const user = createUser();
    const onClose = vi.fn();

    renderWithProvider(
      <Drawer isOpen closeOnEsc={false} onClose={onClose}>
        Drawer content
      </Drawer>,
    );

    await pressKey(user, "Escape");

    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes from the overlay and honours the overlay setting", async () => {
    const user = createUser();
    const onClose = vi.fn();
    const dismissible = renderWithProvider(
      <Drawer isOpen onClose={onClose}>
        Drawer content
      </Drawer>,
    );

    await user.click(getOverlayBackdrop());
    expect(onClose).toHaveBeenCalledTimes(1);

    dismissible.unmount();

    renderWithProvider(
      <Drawer isOpen closeOnOverlayClick={false} onClose={onClose}>
        Drawer content
      </Drawer>,
    );

    await user.click(getOverlayBackdrop());
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Defect register (M1, D-22): scroll locking is documented for the overlay
  // family and no body style was ever written.
  it("locks body scroll while open, as documented", () => {
    const { unmount } = renderWithProvider(
      <Drawer isOpen animated={false} onClose={() => {}}>
        Drawer content
      </Drawer>,
    );

    expect(document.body.style.overflow).toBe("hidden");

    unmount();

    expect(document.body.style.overflow).toBe("");
  });
});
