/**
 * Drawer component for AsheeUI.
 * This file provides the main Drawer component implementation, which renders
 * a sliding panel that appears from the edge of the screen. It supports
 * multiple placements, sizes, animation, and overlay interactions. Visual
 * tokens resolve through the standard AsheeUI cascade system.
 */
"use client";

import {
  ASHEE_GLOBAL_LAYER,
  cn,
  DRAWER_ANIMATION_STATE,
  resolveCascade,
  resolveClassKey,
} from "@asheeui/core";
import { FloatingFocusManager, FloatingPortal } from "@floating-ui/react";
import {
  type CSSProperties,
  forwardRef,
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
  DRAWER_BORDER_PLACEMENT_CLASS,
  DRAWER_CONTAINER_PLACEMENT_CLASS,
  DRAWER_HEIGHT_CLASS,
  DRAWER_WIDTH_CLASS,
} from "../../../styles/drawer";
import {
  type DrawerConfigOptions,
  type DrawerPlacement,
  type DrawerSize,
  FALLBACK_DRAWER_CONFIG,
} from "./drawer-config";

type BaseDrawerProps = DrawerConfigOptions &
  Omit<HTMLAttributes<HTMLDivElement>, "content">;

/**
 * Props for the drawer's backdrop overlay.
 */
export interface DrawerOverlayProps {
  /**
   * Extra classes applied to the overlay.
   */
  className?: string | undefined;
}

/**
 * Props for the drawer's content panel.
 */
export interface DrawerContentProps {
  /**
   * Extra classes applied to the drawer content.
   */
  className?: string | undefined;
}

/**
 * Configuration options for the Drawer component.
 */
export interface DrawerProps extends BaseDrawerProps {
  /**
   * Whether the drawer is open.
   * Controls the visibility of the drawer.
   */
  isOpen: boolean;

  /**
   * Callback fired when the drawer should close.
   * Called by its own close control, by a press on the overlay, or by Escape.
   *
   * The type keeps this optional for source compatibility, but a drawer cannot
   * dismiss itself without it. A drawer that omits `onClose` is rendered
   * without the body scroll lock and the focus trap — a layer that cannot close
   * must not hold the page — and logs a warning. Wire it to the state that
   * controls `isOpen`.
   */
  onClose?: (() => void) | undefined;

  /**
   * Accessible name for the close control the drawer draws itself.
   * @default "Close drawer"
   */
  closeLabel?: string | undefined;

  /**
   * Backdrop overlay overrides, including its class override.
   */
  overlay?: DrawerOverlayProps | undefined;

  /**
   * Content panel overrides, including its class override.
   */
  content?: DrawerContentProps | undefined;

  /**
   * Extra classes for the dialog container — the full-screen wrapper that
   * receives `role="dialog"` and the rest of the div attributes.
   *
   * The split is deliberate for source compatibility: the container is the
   * dialog, so attributes that describe the dialog land on it. The panel's own
   * classes belong in `content.className`, and its inline styles in `style`.
   */
  className?: string | undefined;

  /**
   * Inline styles for the panel — the element the drawer's content fills.
   *
   * `className` and the rest of the div attributes stay on the dialog
   * container; use `content.className` to add classes to the panel itself.
   */
  style?: CSSProperties | undefined;

  /**
   * The content to display inside the drawer.
   */
  children: ReactNode;
}

/**
 * A sliding panel that appears from the edge of the screen.
 *
 * Drawer displays content in a panel that slides in from the right, left,
 * top, or bottom edge. It supports overlay click and Escape key dismissal,
 * animation controls, and sizing options. It also draws its own close control,
 * so an open panel always offers a visible way out. Visual tokens resolve
 * through the standard AsheeUI cascade: prop, component config, global theme
 * defaults, and the built-in fallback.
 *
 * The drawer renders in a portal with dialog semantics and locks body scroll
 * while it is open. A drawer mounted without an `onClose` cannot dismiss
 * itself, so it is rendered without the scroll lock and the focus trap rather
 * than trapping the page. Focus moves into the drawer, cannot leave it, and
 * returns to the element that was focused before it opened. The dialog element
 * is the container that receives the consumer's attributes, so a consumer names
 * the drawer with the standard `aria-label` or `aria-labelledby` attribute.
 * The component manages its own animation states to prevent transition flashes.
 *
 * Escape is claimed by the topmost layer through the shared layer stack
 * (`libs/layer-stack`), so a confirmation modal opened over a drawer closes
 * only itself.
 *
 * @param props - Drawer configuration options and HTML div props.
 * @param props.isOpen - Whether the drawer is open.
 * @param props.onClose - Callback fired when the drawer should close.
 * @param props.closeLabel - Accessible name for the built-in close control. Defaults to "Close drawer".
 * @param props.placement - The placement of the drawer. Defaults to "right".
 * @param props.size - The size of the drawer. Defaults to "md".
 * @param props.animated - Whether the drawer has slide animations. Defaults to true.
 * @param props.closeOnBackdropClick - Whether pressing the overlay closes the drawer (canonical name, shared with Modal). Defaults to true.
 * @param props.closeOnEscape - Whether pressing Escape closes the drawer (canonical name, shared with Modal). Defaults to true.
 * @param props.closeOnOverlayClick - Deprecated alias of `closeOnBackdropClick`.
 * @param props.closeOnEsc - Deprecated alias of `closeOnEscape`.
 * @param props.overlay - Backdrop overlay overrides (className).
 * @param props.content - Content panel overrides (className).
 * @param props.children - The content to display inside the drawer.
 * @param props.className - Extra classes for the dialog container; use `content.className` for the panel.
 * @param props.style - Inline styles for the panel.
 *
 * @example
 * ```tsx
 * import { Drawer, Button } from "@asheeui/web";
 * import { useState } from "react";
 *
 * export function Example() {
 *   const [isOpen, setIsOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
 *       <Drawer
 *         isOpen={isOpen}
 *         onClose={() => setIsOpen(false)}
 *         placement="right"
 *         size="md"
 *       >
 *         <div className="p-6">
 *           <h2 className="text-xl font-bold">Drawer Content</h2>
 *           <p>This is the drawer content.</p>
 *           <Button onClick={() => setIsOpen(false)}>Close</Button>
 *         </div>
 *       </Drawer>
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Bottom drawer with custom sizing
 * <Drawer
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   placement="bottom"
 *   size="full"
 *   overlay={{ className: "bg-background/80" }}
 * >
 *   <div className="p-6 max-h-[80vh] overflow-y-auto">
 *     {content}
 *   </div>
 * </Drawer>
 * ```
 *
 * @see DrawerConfig - The configuration type for component defaults.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      isOpen,
      onClose,
      closeLabel = "Close drawer",
      placement: placementProp,
      size,
      animated: animatedProp,
      closeOnBackdropClick: closeOnBackdropClickProp,
      closeOnEscape: closeOnEscapeProp,
      closeOnOverlayClick: closeOnOverlayClickProp,
      closeOnEsc: closeOnEscProp,
      overlay,
      content,
      className,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.drawer;

    // A layer can only leave if it has a close handler. Without one the drawer
    // is still rendered, but it is not allowed to be modal: no scroll lock and
    // no focus trap may hold a page the reader cannot get out of.
    const isDismissible = Boolean(onClose);

    // Use explicit animation status states to avoid flash transitions.
    const [renderState, setRenderState] = useState<
      "unmounted" | "opening" | "open" | "closing"
    >(isOpen ? "open" : "unmounted");

    // Overlay behaviour: the dialog renders in a portal, manages focus while it
    // is open, and stops the page behind it from scrolling (`COMP-036`). A
    // drawer with no close handler cannot be left, so it holds neither the lock
    // nor the focus scope.
    const { context, setDialogRef } = useDialogOverlay(isOpen);
    const dialogRef = useRef<HTMLDivElement | null>(null);

    // The forwarded ref stays on the dialog container for consumers, while the
    // same element also feeds the dialog context and the initial focus target.
    const registerDialog = useCallback(
      (node: HTMLDivElement | null) => {
        dialogRef.current = node;
        setDialogRef(node);
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref, setDialogRef],
    );

    useBodyScrollLock(isOpen && isDismissible);

    // ─── 1. Token Resolvers ──────────────────────────────────────────────────

    const resolvedSizeKey = resolveCascade<DrawerSize>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_DRAWER_CONFIG.size,
    );

    const placement = resolveCascade<DrawerPlacement>(
      placementProp,
      sectionConfig?.placement,
      undefined,
      FALLBACK_DRAWER_CONFIG.placement,
    );

    // The canonical names come first, and the deprecated aliases are read only
    // when the canonical spelling is absent. The registered default uses the
    // alias spelling so a consumer's override under either name is visible to
    // this resolution instead of being shadowed by a registered value.
    const shouldCloseOnOverlay = resolveCascade<boolean>(
      closeOnBackdropClickProp ?? closeOnOverlayClickProp,
      sectionConfig?.closeOnBackdropClick ?? sectionConfig?.closeOnOverlayClick,
      undefined,
      FALLBACK_DRAWER_CONFIG.closeOnBackdropClick,
    );

    const shouldCloseOnEsc = resolveCascade<boolean>(
      closeOnEscapeProp ?? closeOnEscProp,
      sectionConfig?.closeOnEscape ?? sectionConfig?.closeOnEsc,
      undefined,
      FALLBACK_DRAWER_CONFIG.closeOnEscape,
    );

    const animated = resolveCascade<boolean>(
      animatedProp,
      sectionConfig?.animated,
      undefined,
      FALLBACK_DRAWER_CONFIG.animated,
    );

    // An unanimated drawer has nothing to wait for: opening goes straight to
    // "open" and closing unmounts in the same commit, so `animated={false}`
    // cannot leave a fully visible panel sitting on screen for 250 ms.
    useEffect(() => {
      if (isOpen) {
        if (!animated) {
          setRenderState("open");
          return;
        }
        setRenderState("opening");
        const frame = requestAnimationFrame(() => {
          setRenderState("open");
        });
        return () => cancelAnimationFrame(frame);
      }

      if (renderState === "unmounted") return;

      if (!animated) {
        setRenderState("unmounted");
        return;
      }

      setRenderState("closing");
      const timer = setTimeout(() => {
        setRenderState("unmounted");
      }, 250); // Matches CSS keyframe duration (250ms)
      return () => clearTimeout(timer);
    }, [isOpen, animated]);

    // Both part overrides are merged with `cn`, as the modal's are: a class
    // passed here adds to (or replaces one utility of) the component's surface
    // instead of dropping the whole surface.
    const overlayClassName = cn(
      "bg-background/80 backdrop-blur-xs",
      overlay?.className,
    );

    const contentClassName = cn("bg-secondary", content?.className);

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const isHorizontal = placement === "left" || placement === "right";

    const widthClass = isHorizontal
      ? resolveClassKey(
          resolvedSizeKey,
          DRAWER_WIDTH_CLASS,
          FALLBACK_DRAWER_CONFIG.size,
        )
      : "w-full";

    const heightClass = !isHorizontal
      ? resolveClassKey(
          resolvedSizeKey,
          DRAWER_HEIGHT_CLASS,
          FALLBACK_DRAWER_CONFIG.size,
        )
      : "h-full";

    const containerPlacementClass =
      DRAWER_CONTAINER_PLACEMENT_CLASS[placement] ??
      DRAWER_CONTAINER_PLACEMENT_CLASS.right;

    const borderPlacementClass =
      DRAWER_BORDER_PLACEMENT_CLASS[placement] ??
      DRAWER_BORDER_PLACEMENT_CLASS.right;

    // Animation state class mapping
    const animState = DRAWER_ANIMATION_STATE[placement];
    const isVisible = renderState === "open" || renderState === "opening";

    const animationClass = animated
      ? isVisible
        ? animState.open
        : animState.closed
      : "";

    const backdropAnimationClass = animated
      ? isVisible
        ? "drawer-backdrop-in"
        : "drawer-backdrop-out"
      : "";

    // Escape belongs to the topmost layer; the shared stack answers it only
    // from the last registered layer, so a drawer under an open modal does not
    // close on the same press. A drawer whose Escape is switched off still
    // claims the press rather than handing it to the layer underneath.
    useLayerEscape(isOpen, () => {
      if (shouldCloseOnEsc && onClose) onClose();
    });

    // A layer that cannot close must not hold the page. The fallback keeps the
    // content visible without making the rest of the page unreachable, and says
    // what is missing so the omission is not silent.
    useEffect(() => {
      if (!isOpen || isDismissible) return;

      console.warn(
        "[Drawer] `onClose` is missing, so the drawer has no way out: it is " +
          "rendered without the body scroll lock or the focus trap. Pass " +
          "`onClose` and set `isOpen` to false from it.",
      );
    }, [isOpen, isDismissible]);

    if (renderState === "unmounted") return null;

    return (
      <FloatingPortal>
        <FloatingFocusManager
          context={context}
          modal={isDismissible}
          initialFocus={dialogRef}
          returnFocus
          closeOnFocusOut={false}>
          <div
            ref={registerDialog}
            role="dialog"
            aria-modal={isDismissible ? "true" : undefined}
            tabIndex={-1}
            className={cn(
              "fixed inset-0 flex w-full h-full outline-none",
              containerPlacementClass,
              className,
            )}
            style={{ zIndex: ASHEE_GLOBAL_LAYER.overlay }}
            {...props}>
            {/* Backdrop Overlay. It is decorative: it dismisses the drawer on a
                pointer press and carries no accessible name, so it stays out of
                the accessibility tree and out of the tab order. */}
            <div
              data-ashee-backdrop=""
              aria-hidden="true"
              onClick={shouldCloseOnOverlay ? onClose : undefined}
              className={cn(
                "absolute inset-0",
                overlayClassName,
                backdropAnimationClass,
              )}
            />

            {/* Drawer Content. The panel is the scroll container: the page
                behind it is locked, so a panel whose content is taller than
                its fixed height would otherwise clip the rest out of reach. */}
            <div
              data-ashee-panel=""
              style={style}
              className={cn(
                "relative z-10 flex flex-col text-foreground shadow-2xl border-border overflow-y-auto",
                borderPlacementClass,
                widthClass,
                heightClass,
                contentClassName,
                animationClass,
              )}>
              {/* The built-in close control is first in the tab order, so one
                  Tab from the dialog reaches the way out before the content. */}
              {onClose ? (
                <OverlayCloseControl label={closeLabel} onClose={onClose} />
              ) : null}
              {children}
            </div>
          </div>
        </FloatingFocusManager>
      </FloatingPortal>
    );
  },
);

Drawer.displayName = "Drawer";
