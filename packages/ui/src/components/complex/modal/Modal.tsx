"use client";

import { useSettings } from "@ashee/settings";
import { type Radius, useResponsiveVars } from "@ashee/theme";
import { cn } from "@ashee/utils";
import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion";
import { type ReactNode, useCallback, useEffect, useMemo } from "react";
import { useAsheeConfig } from "../../../context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { defaultModalSizeScale } from "./default-modal-config";
import { flattenModalSizeScale } from "./flatten-modal-size-scale";
import type {
  ModalConfig,
  ModalPosition,
  ModalSizeKey,
  ModalSizeScale,
} from "./modal-config";
import { useModal } from "./modal-context";

export interface ModalProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  /** Optional unique identifier for state management via ModalProvider / useModal(). */
  id?: string;

  /** Controlled open state (overrides context if id is also provided). */
  isOpen?: boolean;

  /** Close event callback. */
  onClose?: () => void;

  /** Modal inner content. */
  children: ReactNode;

  /** Modal content width override (e.g. "clamp(300px, 40vw, 800px)"). */
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
  animation?: AnimationProp;

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
  id,
  isOpen: controlledIsOpen,
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
  const { settings } = useSettings();
  const { isOpen: isContextOpen, closeModal } = useModal();

  const sectionConfig = config.components?.modal as ModalConfig | undefined;

  // Resolve Open State (Controlled vs Context ID)
  const open = controlledIsOpen ?? (id ? isContextOpen(id) : false);

  const handleClose = useCallback(() => {
    if (id) {
      closeModal(id);
    }
    onClose?.();
  }, [id, closeModal, onClose]);

  // Design Token Resolvers
  const sizeScale = (sectionConfig?.size ??
    defaultModalSizeScale) as ModalSizeScale;
  const resolvedSizeKey = size ?? sizeScale.default;
  const responsiveVars = useMemo(
    () => flattenModalSizeScale(sizeScale),
    [sizeScale],
  );
  useResponsiveVars(
    "ashee-modal-tokens",
    responsiveVars,
    config.theme.breakpoints,
  );

  const position = resolveValue<ModalPosition>(
    positionProp,
    sectionConfig?.position,
    "center",
  );

  const closeOnBackdropClick =
    closeOnBackdropClickProp ?? sectionConfig?.closeOnBackdropClick ?? true;

  const closeOnEscape =
    closeOnEscapeProp ?? sectionConfig?.closeOnEscape ?? true;

  const resolvedRadiusKey = typeof radius === "string" ? radius : undefined;
  const resolvedSectionRadiusKey =
    typeof sectionConfig?.radius === "string"
      ? sectionConfig.radius
      : undefined;
  const resolvedRadius = resolveScale(
    resolvedRadiusKey,
    resolvedSectionRadiusKey,
    config.theme.radius.default,
    config.theme.radius.values,
  );

  const motionProps = resolveAnimation(
    animation ?? (sectionConfig?.animation as AnimationProp | undefined),
    settings.enableAnimations,
  ) as unknown as Partial<HTMLMotionProps<"div">>;

  // Keyboard Escape Handler
  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEscape, handleClose]);

  // Body Scroll Lock
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
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
            onClick={closeOnBackdropClick ? handleClose : undefined}
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
              "relative z-10 w-full bg-card text-card-foreground border border-border shadow-xl overflow-y-auto scrollbar-hide max-h-[90vh]",
              position === "top" && "self-start mt-12",
              position === "bottom" && "self-end mb-12",
              sectionConfig?.contentClassName,
              contentClassName,
              className,
            )}
            style={{
              maxWidth: width ?? `var(--ashee-modal-${resolvedSizeKey}-max-w)`,
              padding: padding ?? `var(--ashee-modal-${resolvedSizeKey}-p)`,
              borderRadius: resolvedRadius,
              height,
              ...style,
            }}
            {...props}>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

Modal.displayName = "Modal";
