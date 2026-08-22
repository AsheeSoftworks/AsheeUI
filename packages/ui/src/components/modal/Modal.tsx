"use client";

import { cn } from "@asheeui/utils";
import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion";
import { type HTMLAttributes, type ReactNode, useEffect } from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Radius } from "../../theme/radius/radius-config";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import {
  FALLBACK_MODAL_CONFIG,
  type ModalAnimationPreset,
  type ModalConfig,
  type ModalPosition,
  type ModalSizeKey,
} from "./modal-config";
import { resolveModalAnimation } from "./modal-motion";
import {
  MODAL_MAX_WIDTH_CLASS,
  MODAL_PADDING_CLASS,
  MODAL_POSITION_CLASS,
  MODAL_RADIUS_CLASS,
} from "./modal-styles";

export interface ModalProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "ref" | "size"> {
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
  radius?: keyof Radius;

  /** Motion animation preset. */
  animation?: ModalAnimationPreset;

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
  animation,
  closeOnBackdropClick: closeOnBackdropClickProp,
  closeOnEscape: closeOnEscapeProp,
  overlayClassName,
  contentClassName,
  className,
  style,
  ...props
}: ModalProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.modal as ModalConfig | undefined;

  // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

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
    typeof radius === "string" ? radius : undefined,
    typeof sectionConfig?.radius === "string" ? sectionConfig : undefined,
    config.theme.radius?.default,
    FALLBACK_MODAL_CONFIG.radius,
  );

  const resolvedAnimation =
    animation ?? sectionConfig?.animation ?? FALLBACK_MODAL_CONFIG.animation;

  // ─── 2. Class Maps ────────────────────────────────────────────────────────

  const maxWidthClass = width
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
    resolvedRadiusKey,
    MODAL_RADIUS_CLASS,
    FALLBACK_MODAL_CONFIG.radius,
  );

  const positionClass =
    MODAL_POSITION_CLASS[position] ?? MODAL_POSITION_CLASS.center;

  const motionProps = resolveModalAnimation(
    resolvedAnimation,
    position,
  ) as unknown as Partial<HTMLMotionProps<"div">>;

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeOnBackdropClick ? onClose : undefined}
            className={cn(
              "fixed inset-0 bg-background/80 backdrop-blur-xs dark:bg-black/70",
              sectionConfig?.overlayClassName,
              overlayClassName,
            )}
          />

          {/* Modal Content Box */}
          <motion.div
            {...motionProps}
            className={cn(
              "relative z-10 w-full bg-background text-foreground overflow-y-auto scrollbar-hide max-h-[90vh]",
              positionClass,
              maxWidthClass,
              paddingClass,
              radiusClass,
              sectionConfig?.contentClassName,
              contentClassName,
              className,
            )}
            style={{
              width,
              height,
              ...(padding ? { padding } : {}),
              ...style,
            }}
            {...(props as HTMLMotionProps<"div">)}>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

Modal.displayName = "Modal";
