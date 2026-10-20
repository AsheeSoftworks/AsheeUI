/**
 * Modal component for AsheeUI.
 * This file provides the main Modal component implementation, which renders
 * a dialog overlay with backdrop, scroll locking, animation, and configurable
 * positioning. It supports size, position, radius, animation, and behavior
 * options that resolve through the standard AsheeUI cascade system.
 */
"use client";

import {
  ASHEE_GLOBAL_LAYER,
  cn,
  MODAL_MAX_WIDTH_CLASS,
  MODAL_POSITION_CLASS,
  RADIUS_CLASS,
  type Radius,
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "@asheeui/core";
import { FloatingFocusManager, FloatingPortal } from "@floating-ui/react";
import {
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import { useLayerEscape } from "../../../libs/layer-stack";
import { OverlayCloseControl } from "../../../libs/overlay-close-control";
import { useBodyScrollLock } from "../../../libs/use-body-scroll-lock";
import { useDialogOverlay } from "../../../libs/use-dialog-overlay";
import {
  FALLBACK_MODAL_CONFIG,
  type ModalConfig,
  type ModalPosition,
  type ModalSizeKey,
} from "./modal-config";

type BaseModalProps = ModalConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "size" | "content">;

/**
 * Props for the modal's backdrop overlay.
 */
export interface ModalOverlayProps {
  /**
   * Extra classes applied to the backdrop element.
   */
  className?: string | undefined;
}

/**
 * Props for the modal's content container.
 */
export interface ModalContentProps {
  /**
   * Extra classes applied to the modal content container.
   */
  className?: string | undefined;
}

/**
 * Configuration options for the Modal component.
 */
export interface ModalProps extends BaseModalProps {
  /**
   * Controls open visibility state.
   * When true, the modal is rendered and visible.
   */
  isOpen: boolean;

  /**
   * Close event callback.
   * Called when the modal should close: by its own close control, by a backdrop
   * press, or by Escape.
   *
   * The type keeps this optional for source compatibility, but a modal cannot
   * dismiss itself without it. A modal that omits `onClose` is rendered without
   * the body scroll lock and the focus trap — a layer that cannot close must
   * not hold the page — and logs a warning. Wire it to the state that controls
   * `isOpen`.
   */
  onClose?: (() => void) | undefined;

  /**
   * Accessible name for the close control the modal draws itself.
   * @default "Close dialog"
   */
  closeLabel?: string | undefined;

  /**
   * Modal inner content.
   * The content to display inside the modal.
   */
  children: ReactNode;

  /**
   * Modal content width override.
   * Accepts any CSS width value (e.g., "500px", "80%").
   * Overrides the size prop. The content box stays capped at the width its
   * padded viewport layer can hold, so a stated width is still shrunk on a
   * narrow screen instead of overflowing a locked page.
   */
  width?: string | undefined;

  /**
   * Modal content height override.
   * Accepts any CSS height value (e.g., "400px", "auto").
   */
  height?: string | undefined;

  /**
   * Backdrop overlay overrides, including its class override.
   */
  overlay?: ModalOverlayProps | undefined;

  /**
   * Content container overrides, including its class override.
   */
  content?: ModalContentProps | undefined;
}

/**
 * A dialog overlay with backdrop, scroll locking, and configurable animations.
 *
 * Modal renders a dialog that appears over the page content with a backdrop.
 * It supports size, position, radius, animation, and behavior options. The
 * dialog renders in a portal, locks body scroll while open, handles Escape key
 * dismissal, and supports click-outside-to-close functionality. It also draws
 * its own close control, so an open dialog always offers a visible way out.
 *
 * While the dialog is open, focus moves into it, cannot leave it, and returns
 * to the element that was focused before it opened. A modal mounted without an
 * `onClose` cannot dismiss itself, so it is rendered without the scroll lock and
 * the focus trap rather than trapping the page. The dialog element is the
 * content box, so a consumer names the dialog with the standard `aria-label` or
 * `aria-labelledby` attribute.
 *
 * The modal manages its own animation states using a two-phase rendering
 * approach: it renders the modal with an enter animation when opened, and
 * plays an exit animation before removing from the DOM when closed.
 *
 * Escape is claimed by the topmost layer through the shared layer stack
 * (`libs/layer-stack`), so a modal opened from another layer closes only
 * itself.
 *
 * Visual tokens resolve through the standard AsheeUI cascade: prop,
 * component config, global theme defaults, and the built-in fallback.
 *
 * @param props - Modal configuration options and HTML div props.
 * @param props.isOpen - Whether the modal is open.
 * @param props.onClose - Callback fired when the modal should close.
 * @param props.closeLabel - Accessible name for the built-in close control. Defaults to "Close dialog".
 * @param props.size - Size of the modal. Defaults to "md".
 * @param props.position - Position of the modal. Defaults to "center".
 * @param props.radius - Corner rounding. Resolves from the application's `defaultRadius` first — the framework default is `xs` — and falls back to `lg` only when no application default is stated.
 * @param props.animated - Whether the modal has animations. Defaults to true.
 * @param props.closeOnBackdropClick - Whether clicking the backdrop closes the modal. Defaults to true.
 * @param props.closeOnEscape - Whether pressing Escape closes the modal. Defaults to true.
 * @param props.width - Width override for the modal. Still capped at the viewport.
 * @param props.height - Height override for the modal.
 * @param props.overlay - Backdrop overlay overrides (className).
 * @param props.content - Content container overrides (className).
 * @param props.children - The modal content.
 *
 * @example
 * ```tsx
 * import { Modal, Button } from "@asheeui/web";
 * import { useState } from "react";
 *
 * export function Example() {
 *   const [isOpen, setIsOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
 *       <Modal
 *         isOpen={isOpen}
 *         onClose={() => setIsOpen(false)}
 *         size="lg"
 *         position="center"
 *       >
 *         <div className="p-6">
 *           <h2 className="text-xl font-bold">Modal Title</h2>
 *           <p className="mt-2">Modal content goes here.</p>
 *           <Button onClick={() => setIsOpen(false)}>Close</Button>
 *         </div>
 *       </Modal>
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Top-positioned modal with custom width
 * <Modal
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   position="top"
 *   width="600px"
 *   radius="md"
 *   closeOnBackdropClick={false}
 * >
 *   {content}
 * </Modal>
 * ```
 *
 * @see ModalConfig - The configuration type for component defaults.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
export function Modal({
  isOpen,
  onClose,
  closeLabel = "Close dialog",
  children,
  width,
  height,
  size,
  position: positionProp,
  radius,
  animated: animatedProp,
  closeOnBackdropClick: closeOnBackdropClickProp,
  closeOnEscape: closeOnEscapeProp,
  overlay,
  content,
  className,
  style,
  ...props
}: ModalProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.modal as ModalConfig | undefined;

  // State for exit animation
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  // A layer can only leave if it has a close handler. Without one the modal is
  // still rendered, but it is not allowed to be modal: no scroll lock and no
  // focus trap may hold a page the reader cannot get out of.
  const isDismissible = Boolean(onClose);

  // ─── 1. Token Resolvers ──────────────────────────────────────────────────

  const resolvedSizeKey = resolveCascade<ModalSizeKey>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_MODAL_CONFIG.size,
  );

  const position = resolveCascade<ModalPosition>(
    positionProp,
    sectionConfig?.position,
    undefined,
    FALLBACK_MODAL_CONFIG.position,
  );

  const closeOnBackdropClick = resolveCascade<boolean>(
    closeOnBackdropClickProp,
    sectionConfig?.closeOnBackdropClick,
    undefined,
    FALLBACK_MODAL_CONFIG.closeOnBackdropClick,
  );

  const closeOnEscape = resolveCascade<boolean>(
    closeOnEscapeProp,
    sectionConfig?.closeOnEscape,
    undefined,
    FALLBACK_MODAL_CONFIG.closeOnEscape,
  );

  const resolvedRadiusKey = resolveRadiusKey(
    radius,
    sectionConfig?.radius,
    config.defaultRadius as Radius,
    FALLBACK_MODAL_CONFIG.radius,
  );

  const animated = resolveCascade<boolean>(
    animatedProp,
    sectionConfig?.animated,
    undefined,
    FALLBACK_MODAL_CONFIG.animated,
  );

  // Overlay behaviour: the dialog renders in a portal, manages focus while it
  // is open, and stops the page behind it from scrolling (`COMP-035`). A modal
  // with no close handler cannot be left, so it holds neither the lock nor the
  // focus scope.
  const { context, setDialogRef } = useDialogOverlay(isOpen);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // The focus manager needs the dialog element as a ref for the initial focus
  // target, and the dialog context needs the same element in state.
  const registerDialog = useCallback(
    (node: HTMLDivElement | null) => {
      dialogRef.current = node;
      setDialogRef(node);
    },
    [setDialogRef],
  );

  useBodyScrollLock(isOpen && isDismissible);

  // ─── 2. Class Maps ────────────────────────────────────────────────────────

  // A stated width replaces the size's maximum, but not the viewport's: the
  // stage's cap (`max-w-full` inside the padded layer) is what keeps a wide
  // dialog from overflowing a page whose scroll is locked. twMerge lets a
  // consumer's own `max-w-*` class win over this one.
  const widthClass = width
    ? "max-w-full"
    : resolveClassKey(
        resolvedSizeKey,
        MODAL_MAX_WIDTH_CLASS,
        FALLBACK_MODAL_CONFIG.size,
      );

  const radiusClass = resolveClassKey(
    resolvedRadiusKey as Radius,
    RADIUS_CLASS,
    FALLBACK_MODAL_CONFIG.radius,
  );

  const positionClass =
    MODAL_POSITION_CLASS[position] ?? MODAL_POSITION_CLASS.center;

  // ─── 3. Animation Handling ──────────────────────────────────────────────

  // Handle open/close with animation. The closing flag is reset in the same
  // batch as the mount so the first painted frame already uses the enter
  // animation. Resetting it from a `requestAnimationFrame` callback painted one
  // frame with `animate-modal-out` first, and because that keyframe starts at
  // `opacity: 1` the modal flashed fully visible before `animate-modal-in`
  // restarted from `opacity: 0` — the flicker seen on every re-open.
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setShouldRender(true);
    } else if (animated) {
      // Start exit animation
      setIsClosing(true);
      // Remove from DOM after animation completes
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200); // Match exit animation duration
      return () => clearTimeout(timer);
    } else {
      setShouldRender(false);
    }
  }, [isOpen, animated]);

  // Escape belongs to the topmost layer; the shared stack answers it only from
  // the last registered layer, so a modal opened over a drawer closes alone.
  // A modal whose Escape is switched off still claims the press rather than
  // handing it to the layer underneath.
  useLayerEscape(isOpen, () => {
    if (closeOnEscape && onClose) onClose();
  });

  // A layer that cannot close must not hold the page. The fallback keeps the
  // content visible without making the rest of the page unreachable, and says
  // what is missing so the omission is not silent.
  useEffect(() => {
    if (!isOpen || isDismissible) return;

    console.warn(
      "[Modal] `onClose` is missing, so the modal has no way out: it is " +
        "rendered without the body scroll lock or the focus trap. Pass " +
        "`onClose` and set `isOpen` to false from it.",
    );
  }, [isOpen, isDismissible]);

  if (!shouldRender) return null;

  // Determine animation classes
  const getBackdropAnimation = () => {
    if (!animated) return "";
    return isClosing ? "animate-backdrop-out" : "animate-backdrop-in";
  };

  const getModalAnimation = () => {
    if (!animated) return "";
    return isClosing ? "animate-modal-out" : "animate-modal-in";
  };

  return (
    <FloatingPortal>
      <FloatingFocusManager
        context={context}
        modal={isDismissible}
        initialFocus={dialogRef}
        returnFocus
        closeOnFocusOut={false}>
        <div
          className={cn(
            "fixed inset-0 flex items-center justify-center p-4 sm:p-6 h-screen w-screen scrollbar-hide",
            getBackdropAnimation(),
          )}
          style={{ zIndex: ASHEE_GLOBAL_LAYER.overlay }}>
          {/* Backdrop Overlay. It is decorative: it dismisses the dialog on a
              pointer press and carries no accessible name, so it stays out of
              the accessibility tree and out of the tab order. */}
          <div
            data-ashee-backdrop=""
            aria-hidden="true"
            onClick={closeOnBackdropClick ? onClose : undefined}
            className={cn(
              "fixed inset-0 bg-background/80 backdrop-blur-xs",
              overlay?.className,
              getBackdropAnimation(),
            )}
          />

          {/* Modal Content Box. The dialog element is the content box itself, so
              an `aria-label` or `aria-labelledby` passed by the consumer names
              the dialog rather than a wrapper or the backdrop. */}
          <div
            ref={registerDialog}
            role="dialog"
            aria-modal={isDismissible ? "true" : undefined}
            tabIndex={-1}
            className={cn(
              "relative z-10 w-full bg-background text-foreground overflow-y-auto max-h-[90vh] outline-none",
              positionClass,
              widthClass,
              radiusClass,
              content?.className,
              getModalAnimation(),
              className,
            )}
            style={{
              width,
              height,
              ...style,
            }}
            {...props}>
            {/* The built-in close control is first in the tab order, so one Tab
                from the dialog reaches the way out before the content. */}
            {onClose ? (
              <OverlayCloseControl label={closeLabel} onClose={onClose} />
            ) : null}
            {children}
          </div>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
}

Modal.displayName = "Modal";
