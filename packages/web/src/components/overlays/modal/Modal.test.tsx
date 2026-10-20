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
} from "../../../test";
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

  // F-139: `onClose` was the only way out and the type said it was optional,
  // so a modal mounted without it locked scroll and trapped focus forever. The
  // component now draws a close control, so a visible way out always exists.
  it("draws a close control and makes it the first stop in the dialog", async () => {
    const user = createUser();
    const onClose = vi.fn();

    renderWithProvider(
      <Modal isOpen aria-label="Close control dialog" onClose={onClose}>
        <button type="button">Action</button>
      </Modal>,
    );

    const dialog = screen.getByRole("dialog", {
      name: "Close control dialog",
    });
    const close = screen.getByRole("button", { name: "Close dialog" });

    expect(dialog).toContainElement(close);

    await waitFor(() => {
      expectFocused(dialog);
    });

    await user.tab();

    // One Tab from the dialog reaches the way out before the consumer's content.
    expect(close).toHaveFocus();

    await user.click(close);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("takes the close control's name from closeLabel", () => {
    renderWithProvider(
      <Modal isOpen onClose={() => {}} closeLabel="Dismiss dialog">
        Modal content
      </Modal>,
    );

    expect(
      screen.getByRole("button", { name: "Dismiss dialog" }),
    ).toBeInTheDocument();
  });

  // F-139: with both configurable gestures off, the built-in control is what
  // keeps the dialog from being a keyboard trap.
  it("still offers a way out when both dismissal switches are off", () => {
    const onClose = vi.fn();

    renderWithProvider(
      <Modal
        isOpen
        onClose={onClose}
        closeOnBackdropClick={false}
        closeOnEscape={false}>
        Modal content
      </Modal>,
    );

    expect(
      screen.getByRole("button", { name: "Close dialog" }),
    ).toBeInTheDocument();
  });

  // F-139: a layer with no close handler cannot dismiss itself, so it must not
  // take the page hostage. It stays visible and non-modal instead.
  it("does not lock the page or trap focus when onClose is missing", async () => {
    const user = createUser();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    renderWithProvider(
      <>
        <button type="button">Outside</button>
        <Modal isOpen aria-label="No close handler">
          Modal content
        </Modal>
      </>,
    );

    const dialog = screen.getByRole("dialog", { name: "No close handler" });

    expect(dialog).not.toHaveAttribute("aria-modal");
    expect(document.body.style.overflow).toBe("");
    expect(
      screen.queryByRole("button", { name: "Close dialog" }),
    ).not.toBeInTheDocument();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("onClose"));

    await waitFor(() => {
      expectFocused(dialog);
    });

    await user.tab();

    // With no focus trap, focus can leave the layer: the floating focus guard
    // is the first stop outside it, and the page itself is still reachable.
    expect(dialog.contains(document.activeElement)).toBe(false);
  });

  // F-145: a stated width cleared the size's maximum and had no viewport cap,
  // so a wide dialog overflowed a page whose scroll was locked.
  it("keeps a viewport cap when width overrides the size", () => {
    renderWithProvider(
      <Modal isOpen width="1200px" onClose={() => {}}>
        Modal content
      </Modal>,
    );

    const dialog = screen.getByRole("dialog");

    expect(dialog).toHaveClass("max-w-full");
    expect(dialog).not.toHaveClass("max-w-lg");
    expect(dialog.style.width).toBe("1200px");
  });

  // F-153: the props table said `lg`, but the radius resolves from the
  // application's defaultRadius first. Pin the cascade the JSDoc now states.
  it("resolves radius from the application's defaultRadius before the lg fallback", () => {
    renderWithProvider(
      <Modal isOpen onClose={() => {}}>
        Modal content
      </Modal>,
      { config: { defaultRadius: "xl" } },
    );

    expect(screen.getByRole("dialog")).toHaveClass("rounded-xl");
    expect(screen.getByRole("dialog")).not.toHaveClass("rounded-lg");
  });

  it("pins the modal's radius through its own section", () => {
    renderWithProvider(
      <Modal isOpen onClose={() => {}}>
        Modal content
      </Modal>,
      { config: { components: { modal: { radius: "sm" } } } },
    );

    expect(screen.getByRole("dialog")).toHaveClass("rounded-sm");
  });

  // F-155: the modal and the drawer dim the page with one backdrop treatment.
  it("dims the page with the shared backdrop token", () => {
    renderWithProvider(
      <Modal isOpen onClose={() => {}}>
        Modal content
      </Modal>,
    );

    expect(getOverlayBackdrop()).toHaveClass("backdrop-blur-xs");
    expect(getOverlayBackdrop()).not.toHaveClass("backdrop-blur-md");
  });
});
