"use client";

import { useSettings } from "@ashee/settings";
import { type Radius, useResponsiveVars } from "@ashee/theme";
import { cn } from "@ashee/utils";
import {
  autoUpdate,
  FloatingFocusManager,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, useCallback, useMemo, useState } from "react";
import { useAsheeConfig } from "../../../context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import type { Variant } from "../../../shared/variant";
import { resolveScale } from "../../../utils/resolve-token";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon";
import type { ButtonProps } from "../button/Button";
import { Button } from "../button/Button";
import type {
  ButtonDropdownConfig,
  ButtonDropdownList,
  ButtonDropdownSizeKey,
  ButtonDropdownSizeScale,
} from "./button-dropdown-config";
import { defaultButtonDropdownSizeScale } from "./default-button-dropdown-config";
import { flattenButtonDropdownSizeScale } from "./latten-button-dropdown-size-scale";

// ─── Props Interface ──────────────────────────────────────────────────────────

export interface ButtonDropdownProps
  extends Omit<ButtonProps, "children" | "icon" | "size" | "color"> {
  options: ButtonDropdownList[];
  buttonText?: string;
  variant?: Variant;
  size?: ButtonDropdownSizeKey;
  radius?: keyof Radius;
  animation?: AnimationProp;
  buttonColor?: string;
  className?: string;
  menuClassName?: string;
  isLoading?: boolean;
}

// ─── Component Implementation ─────────────────────────────────────────────────

export const ButtonDropdown = forwardRef<
  HTMLButtonElement,
  ButtonDropdownProps
>(
  (
    {
      options = [],
      buttonText = "Select...",
      variant,
      size,
      radius,
      animation,
      buttonColor,
      className,
      menuClassName,
      disabled,
      isLoading,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const { settings } = useSettings();
    const sectionConfig = config.components?.buttonDropdown as
      | ButtonDropdownConfig
      | undefined;

    const [isOpen, setIsOpen] = useState(false);

    // Floating UI Hook Setup
    const { refs, floatingStyles, context } = useFloating<HTMLButtonElement>({
      open: isOpen,
      onOpenChange: (open) => !disabled && setIsOpen(open),
      placement: "bottom-start",
      whileElementsMounted: autoUpdate,
      middleware: [offset(4), flip(), shift({ padding: 8 })],
    });

    const click = useClick(context, { enabled: !disabled });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "menu" });
    const { getReferenceProps, getFloatingProps } = useInteractions([
      click,
      dismiss,
      role,
    ]);

    // Token & Scale Resolvers
    const sizeScale = (sectionConfig?.size ??
      defaultButtonDropdownSizeScale) as ButtonDropdownSizeScale;
    const resolvedSizeKey = size ?? sizeScale.default;
    const responsiveVars = useMemo(
      () => flattenButtonDropdownSizeScale(sizeScale),
      [sizeScale],
    );
    useResponsiveVars(
      "ashee-button-dropdown-tokens",
      responsiveVars,
      config.theme.breakpoints,
    );

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

    const resolvedVariant = variant ?? sectionConfig?.variant ?? "bordered";
    const motionProps = resolveAnimation(
      animation ?? (sectionConfig?.animation as AnimationProp | undefined),
      settings.enableAnimations,
    );

    const handleSelect = useCallback((option: ButtonDropdownList) => {
      if (option.disabled) return;
      option.onClick?.();
      setIsOpen(false);
    }, []);

    return (
      <div className="relative inline-block w-full text-left">
        {/* Trigger Target using Button Primitive */}
        <Button
          ref={(node) => {
            if (node) refs.setReference(node);
            if (typeof ref === "function") ref(node);
            else if (ref)
              (ref as React.RefObject<HTMLButtonElement | null>).current = node;
          }}
          type="button"
          variant={resolvedVariant}
          disabled={disabled}
          isLoading={isLoading}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          icon={false}
          className={cn(
            "w-full flex items-center justify-between font-normal text-left transition-all duration-200 outline-none select-none",
            buttonColor && `bg-[${buttonColor}]`,
            sectionConfig?.className,
            className,
          )}
          style={{
            borderRadius: resolvedRadius,
            height: `var(--ashee-button-dropdown-${resolvedSizeKey}-height)`,
            paddingInline: `var(--ashee-button-dropdown-${resolvedSizeKey}-padding-x)`,
            fontSize: `var(--ashee-button-dropdown-${resolvedSizeKey}-font-s)`,
          }}
          {...getReferenceProps()}
          {...props}>
          <span>{buttonText}</span>
          <ChevronDownIcon
            className={cn(
              "ml-2 shrink-0 text-muted-foreground",
              isOpen && "rotate-180",
            )}
          />
        </Button>

        {/* Animated Menu Popover */}
        <AnimatePresence>
          {isOpen && (
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={refs.setFloating}
                style={{ ...floatingStyles, zIndex: 99999 }}
                className="w-full min-w-50 outline-none"
                {...getFloatingProps()}>
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={cn(
                    "w-full max-h-60 overflow-y-auto shadow-xl bg-background border border-border rounded-lg p-1 flex flex-col gap-0.5 overflow-x-hidden",
                    menuClassName,
                  )}
                  {...(motionProps as HTMLMotionProps<"div">)}>
                  {options.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-muted-foreground text-center">
                      No options available.
                    </div>
                  ) : (
                    options.map((option, idx) => (
                      <Button
                        key={option.label || idx}
                        type="button"
                        variant={option.danger ? "solid" : "ghost"}
                        color={option.danger ? "danger" : "primary"}
                        disabled={option.disabled}
                        onClick={() => handleSelect(option)}
                        className={cn(
                          "w-full justify-start font-normal text-xs px-3 py-2 h-auto text-left rounded-md transition-colors",
                          !option.danger &&
                            "hover:bg-accent hover:text-accent-foreground text-foreground",
                        )}>
                        {option.icon && (
                          <span className="mr-2 shrink-0">{option.icon}</span>
                        )}
                        <span>{option.label}</span>
                      </Button>
                    ))
                  )}
                </motion.div>
              </div>
            </FloatingFocusManager>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

ButtonDropdown.displayName = "ButtonDropdown";
