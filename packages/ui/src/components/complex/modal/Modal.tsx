"use client";
import { cn } from "@asheeui/utils";
import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion";
import { type ReactNode, useEffect, useMemo } from "react";
import { useAsheeConfig } from "../../../libs/context";
import type { Radius } from "../../../theme/token/radius/radius-config";
import { useResponsiveVars } from "../../../theme/token/responsive/use-responsive-vars";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { defaultModalSizeScale } from "./default-modal-config";
import { flattenModalSizeScale } from "./flatten-modal-size-scale";
import type {
  ModalAnimationPreset,
  ModalConfig,
  ModalPosition,
  ModalSizeKey,
  ModalSizeScale,
} from "./modal-config";
import { resolveModalAnimation } from "./modal-motion";

export interface ModalProps
  extends Omit<React.SelectHTMLAttributes<HTMLDivElement>, "ref" | "size"> {
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

  const motionProps = resolveModalAnimation(
    animation ?? sectionConfig?.animation,
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
            {...(props as HTMLMotionProps<"div">)}>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

Modal.displayName = "Modal";
