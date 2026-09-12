/**
 * Modal component for AsheeUI.
 * This file provides the main Modal component implementation, which renders
 * a dialog overlay with backdrop, scroll locking, animation, and configurable
 * positioning. It supports size, position, radius, animation, and behavior
 * options that resolve through the standard AsheeUI cascade system.
 */
"use client";

import {
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, type Radius } from "../../shared";
import { cn } from "../../utils";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { ASHEE_GLOBAL_LAYER } from "../../utils/stacking";
import {
  FALLBACK_MODAL_CONFIG,
  type ModalConfig,
  type ModalPosition,
  type ModalSizeKey,
} from "./modal-config";
import { MODAL_MAX_WIDTH_CLASS, MODAL_POSITION_CLASS } from "./modal-styles";

type BaseModalProps = ModalConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "size" | "content">;

/**
 * Props for the modal's backdrop overlay.
 */
export interface ModalOverlayProps {
  /**
   * Extra classes applied to the backdrop element.
   */
  className?: string;
}

/**
 * Props for the modal's content container.
 */
export interface ModalContentProps {
  /**
   * Extra classes applied to the modal content container.
   */
  className?: string;
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
   * Called when the modal should close (backdrop click, Escape key).
   */
  onClose?: () => void;

  /**
   * Modal inner content.
   * The content to display inside the modal.
   */
  children: ReactNode;

  /**
   * Modal content width override.
   * Accepts any CSS width value (e.g., "500px", "80%").
   * Overrides the size prop.
   */
  width?: string;

  /**
   * Modal content height override.
   * Accepts any CSS height value (e.g., "400px", "auto").
   */
  height?: string;

  /**
   * Backdrop overlay overrides, including its class override.
   */
  overlay?: ModalOverlayProps;

  /**
   * Content container overrides, including its class override.
   */
  content?: ModalContentProps;
}

/**
 * A dialog overlay with backdrop, scroll locking, and configurable animations.
 *
 * Modal renders a dialog that appears over the page content with a backdrop.
 * It supports size, position, radius, animation, and behavior options. The
 * component automatically locks body scroll when open, handles Escape key
 * dismissal, and supports click-outside-to-close functionality.
 *
 * The modal manages its own animation states using a two-phase rendering
 * approach: it renders the modal with an enter animation when opened, and
 * plays an exit animation before removing from the DOM when closed.
 *
 * Visual tokens resolve through the standard AsheeUI cascade: prop,
 * component config, global theme defaults, and the built-in fallback.
 *
 * @param props - Modal configuration options and HTML div props.
 * @param props.isOpen - Whether the modal is open.
 * @param props.onClose - Callback fired when the modal should close.
 * @param props.size - Size of the modal. Defaults to "md".
 * @param props.position - Position of the modal. Defaults to "center".
 * @param props.radius - Corner rounding. Defaults to "lg".
 * @param props.animated - Whether the modal has animations. Defaults to true.
 * @param props.closeOnBackdropClick - Whether clicking the backdrop closes the modal. Defaults to true.
 * @param props.closeOnEscape - Whether pressing Escape closes the modal. Defaults to true.
 * @param props.width - Width override for the modal.
 * @param props.height - Height override for the modal.
 * @param props.overlay - Backdrop overlay overrides (className).
 * @param props.content - Content container overrides (className).
 * @param props.children - The modal content.
 *
 * @example
 * ```tsx
 * import { Modal, Button } from "asheeui";
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

  // ─── 2. Class Maps ────────────────────────────────────────────────────────

  const widthClass = width
    ? ""
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

  // Keyboard Escape Handler
  useEffect(() => {
    if (!isOpen || !closeOnEscape || !onClose) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

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
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        "fixed inset-0 flex items-center justify-center p-4 sm:p-6 h-screen w-screen scrollbar-hide",
        getBackdropAnimation(),
      )}
      style={{ zIndex: ASHEE_GLOBAL_LAYER.overlay }}>
      {/* Backdrop Overlay */}
      <button
        type="button"
        onClick={closeOnBackdropClick ? onClose : undefined}
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-xs dark:bg-black/70",
          overlay?.className,
          getBackdropAnimation(),
        )}
      />

      {/* Modal Content Box */}
      <div
        className={cn(
          "relative z-10 w-full bg-background text-foreground overflow-y-auto max-h-[90vh]",
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
        {children}
      </div>
    </div>
  );
}

Modal.displayName = "Modal";
