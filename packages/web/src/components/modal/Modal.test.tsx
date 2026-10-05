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
import { Modal } from "./Modal";

/**
 * Stand-in consumer: a trigger that opens the dialog and a control inside the
 * dialog that closes it, which is how focus restoration is observed.
 */
function ModalHarness() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open
      </button>
      <Modal
        isOpen={isOpen}
        animated={false}
        aria-label="Harness dialog"
        onClose={() => setIsOpen(false)}>
        <button type="button" onClick={() => setIsOpen(false)}>
          Close
        </button>
      </Modal>
    </>
  );
}

describe("Modal", () => {
  it("does not expose a dialog while it is closed", () => {
    const { queryByRole } = renderWithProvider(
      <Modal isOpen={false} onClose={() => {}}>
        Modal content
      </Modal>,
    );

    expect(queryByRole("dialog")).toBeNull();
  });

  it("exposes dialog semantics with its content while open", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Modal isOpen onClose={() => {}}>
        Modal content
      </Modal>,
    );

    expect(getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    expect(getByText("Modal content")).toBeInTheDocument();
  });

  // Defect register (M1, D-18): the dialog was rendered inline and managed no
  // focus at all. It now renders in a portal and delegates focus to the shared
  // dialog wiring, so this proves the portal relationship.
  it("renders the dialog in a portal, outside the component subtree", () => {
    const { container, getByRole } = renderWithProvider(
      <Modal isOpen onClose={() => {}}>
        Modal content
      </Modal>,
    );

    expectPortalled(getByRole("dialog"), container);
  });

  // Defect register (M1, D-19): the dialog had no accessible name and no way to
  // give it one. The dialog element is the content box that receives the
  // consumer's attributes, so a labelling attribute names it.
  it("takes its accessible name from the consumer's labelling attribute", () => {
    const { getByRole } = renderWithProvider(
      <Modal isOpen aria-label="Account settings" onClose={() => {}}>
        Modal content
      </Modal>,
    );

    expectAccessibleName(getByRole("dialog"), "Account settings");
  });

  it("accepts a referenced element as its accessible name", () => {
    const { getByRole } = renderWithProvider(
      <Modal isOpen aria-labelledby="modal-heading" onClose={() => {}}>
        <h2 id="modal-heading">Account settings</h2>
      </Modal>,
    );

    expectAccessibleName(getByRole("dialog"), "Account settings");
  });

  // Defect register (M1, D-18): focus placement, containment and restoration.
  it("moves focus into the dialog and restores it to the trigger on close", async () => {
    const user = createUser();

    renderWithProvider(<ModalHarness />);

    const trigger = screen.getByRole("button", { name: "Open" });

    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Harness dialog" });

    await waitFor(() => {
      expectFocused(dialog);
    });

    await user.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expectFocused(trigger);
    });
  });

  it("keeps keyboard focus inside the dialog while it is open", async () => {
    const user = createUser();

    renderWithProvider(
      <Modal isOpen aria-label="Focus dialog" onClose={() => {}}>
        <button type="button">First</button>
        <button type="button">Second</button>
      </Modal>,
    );

    const dialog = screen.getByRole("dialog", { name: "Focus dialog" });

    await waitFor(() => {
      expectFocused(dialog);
    });

    for (let step = 0; step < 4; step += 1) {
      await user.tab();

      // The trap restores focus to the dialog's first control after each wrap,
      // which happens once the focus guard hands focus back.
      await waitFor(() => {
        expect(dialog.contains(document.activeElement)).toBe(true);
      });
    }
  });

  // Defect register (M1, D-21): the backdrop was an unnamed button, so it was
  // announced as a control and could take keyboard focus.
  it("keeps the backdrop out of the accessibility tree and the tab order", () => {
    renderWithProvider(
      <Modal isOpen aria-label="Backdrop dialog" onClose={() => {}}>
        Modal content
      </Modal>,
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
      <Modal isOpen onClose={onClose}>
        Modal content
      </Modal>,
    );

    await pressKey(user, "Escape");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close on Escape when that is disabled", async () => {
    const user = createUser();
    const onClose = vi.fn();

    renderWithProvider(
      <Modal isOpen closeOnEscape={false} onClose={onClose}>
        Modal content
      </Modal>,
    );

    await pressKey(user, "Escape");

    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes from the backdrop and honours the backdrop setting", async () => {
    const user = createUser();
    const onClose = vi.fn();
    const closable = renderWithProvider(
      <Modal isOpen onClose={onClose}>
        Modal content
      </Modal>,
    );

    await user.click(getOverlayBackdrop());
    expect(onClose).toHaveBeenCalledTimes(1);

    closable.unmount();

    renderWithProvider(
      <Modal isOpen closeOnBackdropClick={false} onClose={onClose}>
        Modal content
      </Modal>,
    );

    await user.click(getOverlayBackdrop());
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Defect register (M1, D-22): the component documents that body scroll is
  // locked while it is open, and no body style was ever written.
  it("locks body scroll while open, as documented", () => {
    const { unmount } = renderWithProvider(
      <Modal isOpen animated={false} onClose={() => {}}>
        Modal content
      </Modal>,
    );

    expect(document.body.style.overflow).toBe("hidden");

    unmount();

    expect(document.body.style.overflow).toBe("");
  });
});
