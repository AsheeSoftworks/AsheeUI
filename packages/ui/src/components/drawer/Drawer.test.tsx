import { describe, expect, it, vi } from "vitest";
import { createUser, pressKey, renderWithProvider, within } from "../../test";
import { Drawer } from "./Drawer";

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

    await user.click(within(dismissible.container).getByRole("button"));
    expect(onClose).toHaveBeenCalledTimes(1);

    const persistent = renderWithProvider(
      <Drawer isOpen closeOnOverlayClick={false} onClose={onClose}>
        Drawer content
      </Drawer>,
    );

    await user.click(within(persistent.container).getByRole("button"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders on the requested edge", () => {
    const { getByRole } = renderWithProvider(
      <Drawer isOpen placement="left" onClose={() => {}}>
        Drawer content
      </Drawer>,
    );

    expect(getByRole("dialog").className).toMatch(/justify-start|left/);
  });

  // Defect register (M1, D-18): shared with Modal. The dialog is rendered
  // inline (no portal) and nothing moves, contains, or restores focus, although
  // `TEST-028` requires initial focus placement, containment, and restoration.
  it.todo(
    "moves focus into the dialog, contains it, and restores it on close (defect register D-18)",
  );

  // Defect register (M1, D-19): shared with Modal. The dialog has no
  // accessible name and no labelling prop.
  it.todo("names the dialog for assistive technology (defect register D-19)");

  // Defect register (M1, D-21): shared with Modal. The overlay is an unnamed,
  // focusable button.
  it.todo(
    "keeps the overlay out of the accessibility tree and the tab order (defect register D-21)",
  );

  // Defect register (M1, D-22): scroll locking is documented for the overlay
  // family but no body style is ever written.
  it.todo(
    "locks body scroll while open, as documented (defect register D-22)",
  );
});
