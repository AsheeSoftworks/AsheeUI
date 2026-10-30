import { createRef, type ReactElement, useState } from "react";
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
} from "../../test";
import { Drawer } from "./drawer/Drawer";
import { Modal } from "./modal/Modal";
import { Tooltip, type TooltipProps } from "./tooltip/Tooltip";

describe("Drawer", () => {
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

describe("Modal", () => {
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

describe("Tooltip", () => {
  const trigger = <button type="button">Trigger</button>;

  it("stays hidden until the trigger is focused or hovered", () => {
    const { queryByRole } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0}>
        {trigger}
      </Tooltip>,
    );

    expect(queryByRole("tooltip")).toBeNull();
  });

  it("opens on hover and describes the trigger", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0}>
        {trigger}
      </Tooltip>,
    );
    const target = getByRole("button", { name: "Trigger" });

    await user.hover(target);

    const tooltip = await screen.findByRole("tooltip");

    expect(tooltip).toHaveTextContent("Helpful text");
    expect(target.getAttribute("aria-describedby")).toContain(tooltip.id);
  });

  it("opens on keyboard focus", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0}>
        {trigger}
      </Tooltip>,
    );
    const target = getByRole("button", { name: "Trigger" });

    await user.tab();
    expect(target).toHaveFocus();

    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
  });

  it("closes again on Escape", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0}>
        {trigger}
      </Tooltip>,
    );

    await user.hover(getByRole("button", { name: "Trigger" }));
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();

    await pressKey(user, "Escape");

    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).toBeNull();
    });
  });

  it("never opens when disabled", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0} isDisabled>
        {trigger}
      </Tooltip>,
    );

    await user.hover(getByRole("button", { name: "Trigger" }));

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("renders outside the trigger subtree when portalled", async () => {
    const user = createUser();
    const { getByRole, container } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0} portal>
        {trigger}
      </Tooltip>,
    );

    await user.hover(getByRole("button", { name: "Trigger" }));
    const tooltip = await screen.findByRole("tooltip");

    expectPortalled(tooltip, container);
  });

  it("treats a count of zero as content rather than as no hint", async () => {
    // `content` is a node, so a falsy one is not the same as an empty one: a remaining
    // count of `0` is exactly the number the reader needs.
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Tooltip content={0} delay={0}>
        <button type="button">Remaining</button>
      </Tooltip>,
    );
    const target = getByRole("button", { name: "Remaining" });

    await user.hover(target);

    expect(await screen.findByRole("tooltip")).toHaveTextContent("0");
  });

  it("attaches nothing when the content is empty", () => {
    const { getByRole } = renderWithProvider(
      <Tooltip content="" delay={0}>
        {trigger}
      </Tooltip>,
    );

    const target = getByRole("button", { name: "Trigger" });

    expect(target).not.toHaveAttribute("aria-describedby");
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("keeps the description the trigger already states", async () => {
    // A field that carries its own description must keep it while the hint is open: the
    // hint adds to the description list instead of replacing it.
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0}>
        <button type="button" aria-describedby="field-description">
          Trigger
        </button>
      </Tooltip>,
    );
    const target = getByRole("button", { name: "Trigger" });

    expect(target.getAttribute("aria-describedby")).toBe("field-description");

    await user.hover(target);
    const tooltip = await screen.findByRole("tooltip");
    const describedBy = target.getAttribute("aria-describedby") ?? "";

    expect(describedBy.split(" ")).toContain("field-description");
    expect(describedBy.split(" ")).toContain(tooltip.id);

    // And the trigger's own description is all that is left once the hint closes.
    await pressKey(user, "Escape");

    await waitFor(() => {
      expect(target.getAttribute("aria-describedby")).toBe("field-description");
    });
  });

  it("still measures a trigger that carries a ref of its own", async () => {
    // Under React 19 a `ref` is an ordinary prop, so the consumer's ref used to overwrite
    // the floating reference and leave the hint pinned to the origin.
    const user = createUser();
    const triggerRef = createRef<HTMLButtonElement>();
    const { getByRole } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0}>
        <button ref={triggerRef} type="button">
          Trigger
        </button>
      </Tooltip>,
    );
    const target = getByRole("button", { name: "Trigger" });

    expect(triggerRef.current).toBe(target);

    await user.hover(target);
    const tooltip = await screen.findByRole("tooltip");

    // `offset(8)` on a `top` placement is only computed from a reference element, so the
    // translation proves the trigger is still the one Floating UI measures.
    expect(tooltip.style.transform).toContain("-8px");
  });

  it("refuses text as its trigger", () => {
    // A string can be neither hovered as a control nor focused, so the hint on one would be
    // pointer-only. The type is what refuses it — if `children` ever widens again, the
    // directive below stops suppressing anything and the build fails.
    // @ts-expect-error — `children` is one element a keyboard reader can reach.
    const props: TooltipProps = { content: "Hint", children: "Plain text" };

    expect(props.content).toBe("Hint");
  });

  it("keeps an untyped text child reachable with a keyboard", async () => {
    // What the type refuses, a JavaScript consumer can still pass. The wrapper takes a tab
    // stop in that case, so the hint is not pointer-only even then.
    const user = createUser();
    const textChild = "Plain text" as unknown as ReactElement;
    const { getByText } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0}>
        {textChild}
      </Tooltip>,
    );
    const fallback = getByText("Plain text");

    expect(fallback).toHaveAttribute("tabindex", "0");

    await user.tab();
    expect(fallback).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Helpful text",
    );
  });

  it("draws its pointer in the hint's surface and border", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0} showArrow>
        {trigger}
      </Tooltip>,
    );

    await user.hover(getByRole("button", { name: "Trigger" }));
    const tooltip = await screen.findByRole("tooltip");
    const arrow = tooltip.querySelector("svg");

    expect(arrow).not.toBeNull();
    // The pointer is filled with the bubble's surface and stroked with its border, so it
    // reads as part of the hint rather than as a wedge lying on top of it.
    expect(arrow).toHaveClass("fill-background");
    expect(arrow).toHaveClass("[&>path:first-of-type]:stroke-border");
    expect(arrow).toHaveClass("[&>path:last-of-type]:stroke-background");
    expect(arrow).not.toHaveClass("text-border");
  });
});
