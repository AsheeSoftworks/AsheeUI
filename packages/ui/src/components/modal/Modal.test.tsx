import { describe, expect, it, vi } from "vitest";
import { createUser, pressKey, renderWithProvider, within } from "../../test";
import { Modal } from "./Modal";

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

    await user.click(within(closable.container).getByRole("button"));
    expect(onClose).toHaveBeenCalledTimes(1);

    const persistent = renderWithProvider(
      <Modal isOpen closeOnBackdropClick={false} onClose={onClose}>
        Modal content
      </Modal>,
    );

    await user.click(within(persistent.container).getByRole("button"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Defect register (M1, D-18): the dialog is rendered inline (no portal) and
  // nothing moves, contains, or restores focus, although `TEST-028` requires
  // initial focus placement, focus containment, and focus restoration.
  it.todo(
    "moves focus into the dialog, contains it, and restores it on close (defect register D-18)",
  );

  // Defect register (M1, D-19): the dialog has no accessible name; there is no
  // title or labelling prop and the container carries no aria-labelledby.
  it.todo("names the dialog for assistive technology (defect register D-19)");

  // Defect register (M1, D-21): the backdrop is an unnamed, focusable button,
  // so it is announced as an unnamed control and can receive keyboard focus.
  it.todo(
    "keeps the backdrop out of the accessibility tree and the tab order (defect register D-21)",
  );

  // Defect register (M1, D-22): the component documentation states that body
  // scroll is locked while open, but no body style is ever written.
  it.todo(
    "locks body scroll while open, as documented (defect register D-22)",
  );
});
