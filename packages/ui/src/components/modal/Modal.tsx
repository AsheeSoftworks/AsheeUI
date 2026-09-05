"use client";

import { cn } from "@asheeui/utils";
import {
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, type Radius } from "../../shared/radius";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import {
  FALLBACK_MODAL_CONFIG,
  type ModalConfig,
  type ModalPosition,
  type ModalSizeKey,
} from "./modal-config";
import {
  MODAL_MAX_WIDTH_CLASS,
  MODAL_PADDING_CLASS,
  MODAL_POSITION_CLASS,
} from "./modal-styles";

export interface ModalProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "size"> {
  /** Controls open visibility state. */
  isOpen: boolean;

  /** Close event callback. */
  onClose?: () => void;

  /** Modal inner content. */
  children: ReactNode;

  /** Modal content width override. */
  width?: string;

  /** Modal content height override. */
  height?: string;

  /** Padding token or CSS string override. */
  padding?: string;

  /** Modal size scale token key. */
  size?: ModalSizeKey;

  /** Vertical placement position. */
  position?: ModalPosition;

  /** Radius scale token for modal content box. */
  radius?: Radius;

  /** Enable/disable pop animation. Default: true */
  animated?: boolean;

  /** Close modal when clicking dark backdrop overlay. Default: true. */
  closeOnBackdropClick?: boolean;

  /** Close modal on Escape key press. Default: true. */
  closeOnEscape?: boolean;

  /** Backdrop overlay custom class name. */
  overlayClassName?: string;

  /** Content container custom class name. */
  contentClassName?: string;
}

export function Modal({
  isOpen,
  onClose,
  children,
  width,
  height,
  padding,
  size,
  position: positionProp,
  radius,
  animated: animatedProp,
  closeOnBackdropClick: closeOnBackdropClickProp,
  closeOnEscape: closeOnEscapeProp,
  overlayClassName: overlayClassNameProp,
  contentClassName: contentClassNameProp,
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

  const paddingClass = padding
    ? ""
    : resolveClassKey(
        resolvedSizeKey,
        MODAL_PADDING_CLASS,
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

  // Handle open/close with animation
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Reset closing state after a microtask to trigger enter animation
      requestAnimationFrame(() => {
        setIsClosing(false);
      });
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

  // Body Scroll Lock
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

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
        "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto",
        getBackdropAnimation(),
      )}>
      {/* Backdrop Overlay */}
      <button
        type="button"
        onClick={closeOnBackdropClick ? onClose : undefined}
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-xs dark:bg-black/70",
          overlayClassNameProp,
          getBackdropAnimation(),
        )}
      />

      {/* Modal Content Box */}
      <div
        className={cn(
          "relative z-10 w-full bg-background text-foreground overflow-y-auto max-h-[90vh]",
          positionClass,
          widthClass,
          paddingClass,
          radiusClass,
          contentClassNameProp,
          getModalAnimation(),
          className,
        )}
        style={{
          width,
          height,
          ...(padding ? { padding } : {}),
          ...style,
        }}
        {...props}>
        {children}
      </div>
    </div>
  );
}

Modal.displayName = "Modal";
