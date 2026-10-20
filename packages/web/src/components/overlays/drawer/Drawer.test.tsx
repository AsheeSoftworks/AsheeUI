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
  useFakeTimers,
  waitFor,
} from "../../../test";
import { Modal } from "../modal/Modal";
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

/**
 * Stand-in consumer for `F-140`: a drawer that opens a confirmation modal over
 * itself, which is the two-layer case a single Escape used to close at once.
 */
function NestedLayers({ modalEscape = true }: { modalEscape?: boolean }) {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Drawer
        isOpen={drawerOpen}
        animated={false}
        aria-label="Filters"
        onClose={() => setDrawerOpen(false)}>
        <button type="button" onClick={() => setModalOpen(true)}>
          Open confirmation
        </button>
      </Drawer>
      <Modal
        isOpen={modalOpen}
        animated={false}
        aria-label="Confirmation"
        closeOnEscape={modalEscape}
        onClose={() => setModalOpen(false)}>
        <button type="button" onClick={() => setModalOpen(false)}>
          Confirm
        </button>
      </Modal>
    </>
  );
}

/** The drawer's panel, which is the scrolled surface rather than the dialog wrapper. */
function getDrawerPanel(): HTMLElement {
  const panel = document.querySelector<HTMLElement>("[data-ashee-panel]");

  if (!panel) {
    throw new Error("No drawer panel is rendered.");
  }

  return panel;
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

  // F-139: `onClose` was the only way out and the type said it was optional,
  // so a drawer mounted without it locked scroll and trapped focus forever. The
  // component now draws a close control, so a visible way out always exists.
  it("draws a close control and makes it the first stop in the dialog", async () => {
    const user = createUser();
    const onClose = vi.fn();

    renderWithProvider(
      <Drawer isOpen aria-label="Close control drawer" onClose={onClose}>
        <button type="button">Action</button>
      </Drawer>,
    );

    const dialog = screen.getByRole("dialog", {
      name: "Close control drawer",
    });
    const close = screen.getByRole("button", { name: "Close drawer" });

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

  // F-139: with both configurable gestures off, the built-in control is what
  // keeps the panel from being a keyboard trap.
  it("still offers a way out when both dismissal switches are off", () => {
    const onClose = vi.fn();

    renderWithProvider(
      <Drawer
        isOpen
        onClose={onClose}
        closeOnBackdropClick={false}
        closeOnEscape={false}>
        Drawer content
      </Drawer>,
    );

    expect(
      screen.getByRole("button", { name: "Close drawer" }),
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
        <Drawer isOpen aria-label="No close handler">
          Drawer content
        </Drawer>
      </>,
    );

    const dialog = screen.getByRole("dialog", { name: "No close handler" });

    expect(dialog).not.toHaveAttribute("aria-modal");
    expect(document.body.style.overflow).toBe("");
    expect(
      screen.queryByRole("button", { name: "Close drawer" }),
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

  // F-140: one Escape used to close the modal *and* the drawer it was opened
  // from, because each layer had its own window listener with no topmost check.
  it("closes only the topmost layer on one Escape", async () => {
    const user = createUser();

    renderWithProvider(<NestedLayers />);

    await user.click(screen.getByRole("button", { name: "Open confirmation" }));

    expect(
      screen.getByRole("dialog", { name: "Confirmation" }),
    ).toBeInTheDocument();

    await pressKey(user, "Escape");

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Confirmation" }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByRole("dialog", { name: "Filters" })).toBeInTheDocument();

    // The next Escape reaches the drawer, which is now the topmost layer.
    await pressKey(user, "Escape");

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Filters" }),
      ).not.toBeInTheDocument();
    });
  });

  it("does not hand Escape to the layer under a topmost layer that ignores it", async () => {
    const user = createUser();

    renderWithProvider(<NestedLayers modalEscape={false} />);

    await user.click(screen.getByRole("button", { name: "Open confirmation" }));

    await pressKey(user, "Escape");

    expect(
      screen.getByRole("dialog", { name: "Confirmation" }),
    ).toBeInTheDocument();
    // The modal makes the rest of the document inert, so the drawer under it
    // is still in the DOM but hidden from the accessibility tree.
    expect(
      screen.getByRole("dialog", { name: "Filters", hidden: true }),
    ).toBeInTheDocument();
  });

  // F-141: the page behind is locked while the drawer is open, so the panel
  // itself has to scroll; otherwise tall content was clipped and unreachable.
  it("gives the panel the scroll container while the page is locked", () => {
    renderWithProvider(
      <Drawer isOpen onClose={() => {}}>
        <div>Tall drawer content</div>
      </Drawer>,
    );

    expect(getDrawerPanel()).toHaveClass("overflow-y-auto");
    expect(getDrawerPanel()).toHaveClass("flex");
    expect(getDrawerPanel()).toHaveClass("flex-col");
  });

  // F-142: the drawer and the modal name the two dismissal gestures the same
  // way. The drawer's old names stay as deprecated aliases.
  it("accepts the canonical dismissal names and the deprecated aliases", async () => {
    const user = createUser();
    const onClose = vi.fn();

    const canonical = renderWithProvider(
      <Drawer isOpen closeOnEscape={false} onClose={onClose}>
        Drawer content
      </Drawer>,
    );

    await pressKey(user, "Escape");
    expect(onClose).not.toHaveBeenCalled();
    canonical.unmount();

    const alias = renderWithProvider(
      <Drawer isOpen closeOnEsc={false} onClose={onClose}>
        Drawer content
      </Drawer>,
    );

    await pressKey(user, "Escape");
    expect(onClose).not.toHaveBeenCalled();
    alias.unmount();

    renderWithProvider(
      <Drawer isOpen closeOnBackdropClick={false} onClose={onClose}>
        Drawer content
      </Drawer>,
    );

    await user.click(getOverlayBackdrop());
    expect(onClose).not.toHaveBeenCalled();
  });

  it("reads either dismissal spelling from components.drawer", async () => {
    const user = createUser();
    const onClose = vi.fn();

    const canonical = renderWithProvider(
      <Drawer isOpen onClose={onClose}>
        Drawer content
      </Drawer>,
      { config: { components: { drawer: { closeOnEscape: false } } } },
    );

    await pressKey(user, "Escape");
    expect(onClose).not.toHaveBeenCalled();
    canonical.unmount();

    renderWithProvider(
      <Drawer isOpen onClose={onClose}>
        Drawer content
      </Drawer>,
      { config: { components: { drawer: { closeOnEsc: false } } } },
    );

    await pressKey(user, "Escape");
    expect(onClose).not.toHaveBeenCalled();
  });

  // F-143: the drawer's part overrides replaced the component's classes while
  // the modal's merged them, so `content={{ className: "p-6" }}` dropped the
  // panel's surface. Both merge through `cn` now.
  it("merges the part class overrides with the component's classes", () => {
    renderWithProvider(
      <Drawer
        isOpen
        onClose={() => {}}
        overlay={{ className: "bg-foreground/20" }}
        content={{ className: "p-6" }}>
        Drawer content
      </Drawer>,
    );

    const panel = getDrawerPanel();

    expect(panel).toHaveClass("p-6");
    expect(panel).toHaveClass("bg-secondary");
    expect(panel).toHaveClass("shadow-2xl");
    expect(getOverlayBackdrop()).toHaveClass("bg-foreground/20");
    expect(getOverlayBackdrop()).toHaveClass("backdrop-blur-xs");
  });

  // F-144: `animated={false}` still waited out the 250 ms exit and then made a
  // fully visible panel vanish. An unanimated close unmounts immediately.
  it("unmounts immediately on close when it is not animated", () => {
    const { rerender } = renderWithProvider(
      <Drawer isOpen animated={false} onClose={() => {}}>
        Drawer content
      </Drawer>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    rerender(
      <Drawer isOpen={false} animated={false} onClose={() => {}}>
        Drawer content
      </Drawer>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps an animated drawer mounted for its exit", () => {
    const timers = useFakeTimers();
    const { rerender } = renderWithProvider(
      <Drawer isOpen animated onClose={() => {}}>
        Drawer content
      </Drawer>,
    );

    rerender(
      <Drawer isOpen={false} animated onClose={() => {}}>
        Drawer content
      </Drawer>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    timers.advance(250);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    timers.restore();
  });

  // F-154: `className` and the rest of the div attributes are the dialog
  // wrapper's; `style` is the panel's. The split is now stated on both props.
  it("applies className to the dialog container and style to the panel", () => {
    renderWithProvider(
      <Drawer
        isOpen
        onClose={() => {}}
        className="ring-1"
        style={{ padding: "2rem" }}>
        Drawer content
      </Drawer>,
    );

    expect(screen.getByRole("dialog")).toHaveClass("ring-1");
    expect(screen.getByRole("dialog").style.padding).toBe("");
    expect(getDrawerPanel().style.padding).toBe("2rem");
  });

  // F-155: the drawer and the modal dim the page with one backdrop treatment.
  it("dims the page with the shared backdrop token", () => {
    renderWithProvider(
      <Drawer isOpen onClose={() => {}}>
        Drawer content
      </Drawer>,
    );

    expect(getOverlayBackdrop()).toHaveClass("backdrop-blur-xs");
    expect(getOverlayBackdrop()).not.toHaveClass("backdrop-blur-md");
  });
});
