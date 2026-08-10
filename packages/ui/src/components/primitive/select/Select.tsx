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
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react";
import { useAsheeConfig } from "../../../context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { CheckIcon } from "../../icons/CheckIcon";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon";
import { SearchIcon } from "../../icons/SearchIcon";
import { Button } from "../button/Button";
import type {
  FieldSizeKey,
  FieldStatus,
  LabelAlign,
} from "../field/field-config";
import { FieldShell } from "../field/field-shell";
import { Input } from "../input/Input";
import { defaultSelectSizeScale } from "./default-select-config";
import { flattenSelectSizeScale } from "./flatten-select-size-scale";
import type {
  SelectConfig,
  SelectOption,
  SelectSizeScale,
} from "./select-config";

// ─── Inline Icon Helpers ──────────────────────────────────────────────────────

const STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "border-border focus:border-primary",
  error: "border-danger focus:border-danger",
  warning: "border-warning focus:border-warning",
  success: "border-success focus:border-success",
};

// ─── Props Interface ──────────────────────────────────────────────────────────

export interface SelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "size" | "onChange" | "value"
  > {
  options: SelectOption[];
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onValueChange?: (value: string | number) => void;
  size?: FieldSizeKey;
  radius?: keyof Radius;
  animation?: AnimationProp;
  status?: FieldStatus;
  label?: string;
  labelAlign?: LabelAlign;
  description?: string;
  message?: string;
  required?: boolean;
  isLoading?: boolean;
  isSearch?: boolean;
  searchPlaceholder?: string;
  searchInputName?: string;
  initialValue?: string | number;
  belowList?: ReactNode;
  placeholder?: string;
  buttonColor?: string;
  className?: string;
  id?: string;
  name?: string;
}

// ─── Component Implementation ─────────────────────────────────────────────────

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options = [],
      value,
      onChange,
      onValueChange,
      size,
      radius,
      animation,
      status,
      label,
      labelAlign,
      description,
      message,
      required,
      isLoading,
      disabled,
      isSearch = false,
      searchPlaceholder = "Search options...",
      searchInputName,
      initialValue,
      belowList,
      placeholder = "Select...",
      buttonColor,
      className,
      id,
      name,
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const { settings } = useSettings();
    const sectionConfig = config.components?.select as SelectConfig | undefined;

    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Floating UI context
    const { refs, floatingStyles, context } = useFloating<HTMLButtonElement>({
      open: isOpen,
      onOpenChange: (open) => !disabled && setIsOpen(open),
      placement: "bottom-start",
      whileElementsMounted: autoUpdate,
      middleware: [offset(4), flip(), shift({ padding: 8 })],
    });

    const click = useClick(context, { enabled: !disabled });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "listbox" });
    const { getReferenceProps, getFloatingProps } = useInteractions([
      click,
      dismiss,
      role,
    ]);

    // Token Scale Resolvers
    const sizeScale = (sectionConfig?.size ??
      defaultSelectSizeScale) as SelectSizeScale;
    const resolvedSizeKey = size ?? sizeScale.default;
    const responsiveVars = useMemo(
      () => flattenSelectSizeScale(sizeScale),
      [sizeScale],
    );
    useResponsiveVars(
      "ashee-select-tokens",
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

    const resolvedStatus = status ?? "default";
    const resolvedLabelAlign = resolveValue(
      labelAlign,
      sectionConfig?.labelAlign,
      "left",
    );
    const motionProps = resolveAnimation(
      animation ?? (sectionConfig?.animation as AnimationProp | undefined),
      settings.enableAnimations,
    );

    const selectedOption = useMemo(
      () => options.find((opt) => opt.value === value),
      [options, value],
    );

    const filteredOptions = useMemo(() => {
      if (!isSearch || !searchQuery.trim()) return options;
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }, [options, isSearch, searchQuery]);

    const handleSelect = useCallback(
      (val: string | number) => {
        onValueChange?.(val);
        if (onChange) {
          const event = {
            target: { value: val, name: name ?? "" },
          } as React.ChangeEvent<HTMLSelectElement>;
          onChange(event);
        }
        setIsOpen(false);
        setSearchQuery("");
      },
      [name, onChange, onValueChange],
    );

    const displayLabel = useMemo(() => {
      if (selectedOption?.label) return selectedOption.label;
      if (initialValue !== undefined) return String(initialValue);
      return placeholder;
    }, [selectedOption, initialValue, placeholder]);

    return (
      <FieldShell
        id={fieldId}
        label={label}
        labelAlign={resolvedLabelAlign}
        description={description}
        message={message}
        status={resolvedStatus}
        required={required}
        isLoading={isLoading}
        labelClassName={sectionConfig?.labelClassName}
        descriptionClassName={sectionConfig?.descriptionClassName}
        messageClassName={sectionConfig?.messageClassName}>
        <div className="w-full relative inline-block">
          {/* Trigger Button using Button Primitive */}
          <Button
            ref={(node) => {
              refs.setReference(node);
              if (typeof ref === "function") ref(node);
              else if (ref)
                (
                  ref as React.MutableRefObject<HTMLButtonElement | null>
                ).current = node;
            }}
            type="button"
            variant="bordered"
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-invalid={resolvedStatus === "error"}
            className={cn(
              "w-full flex items-center justify-between font-normal text-left border bg-background text-foreground transition-all duration-200 outline-none select-none",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              STATUS_BORDER_CLASS[resolvedStatus],
              buttonColor && `bg-[${buttonColor}]`,
              sectionConfig?.className,
              className,
            )}
            style={{
              borderRadius: resolvedRadius,
              height: `var(--ashee-select-${resolvedSizeKey}-height)`,
              paddingInline: `var(--ashee-select-${resolvedSizeKey}-padding-x)`,
              fontSize: `var(--ashee-select-${resolvedSizeKey}-font-s)`,
            }}
            {...getReferenceProps()}>
            <span
              className={
                selectedOption || initialValue
                  ? "text-foreground"
                  : "text-muted-foreground"
              }>
              {displayLabel}
            </span>
            <ChevronDownIcon
              className={cn(
                "ml-2 shrink-0 text-muted-foreground",
                isOpen && "rotate-180",
              )}
            />
          </Button>

          {/* Animated Floating Options Menu */}
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
                    className="w-full max-h-60 overflow-y-auto shadow-xl bg-background border border-border rounded-lg p-1 flex flex-col gap-0.5 overflow-x-hidden"
                    {...(motionProps as HTMLMotionProps<"div">)}>
                    {/* Search Input Filter */}
                    {isSearch && (
                      <div className="p-1 mb-1 sticky top-0 bg-background z-10 border-b border-border">
                        <div className="relative flex items-center">
                          <SearchIcon className="absolute left-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                          <Input
                            name={searchInputName ?? "select-search"}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={searchPlaceholder}
                            autoFocus
                            className="w-full pl-8 h-8 text-xs bg-muted/30 border-none focus-visible:ring-0"
                          />
                        </div>
                      </div>
                    )}

                    {/* Options List */}
                    {filteredOptions.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-muted-foreground text-center">
                        No options found.
                      </div>
                    ) : (
                      filteredOptions.map((option) => {
                        const isSelected = value === option.value;
                        return (
                          <Button
                            key={String(option.value)}
                            type="button"
                            variant="ghost"
                            disabled={option.disabled}
                            onClick={() => handleSelect(option.value)}
                            className={cn(
                              "w-full justify-between font-normal text-xs px-3 py-2 h-auto text-left rounded-md transition-colors",
                              isSelected
                                ? "bg-primary/10 text-primary font-medium hover:bg-primary/20"
                                : "hover:bg-accent hover:text-accent-foreground text-foreground",
                            )}>
                            <span>{option.label}</span>
                            {isSelected && (
                              <CheckIcon className="w-3.5 h-3.5 text-primary shrink-0 ml-2" />
                            )}
                          </Button>
                        );
                      })
                    )}

                    {belowList && (
                      <div className="border-t border-border pt-1 mt-1">
                        {belowList}
                      </div>
                    )}
                  </motion.div>
                </div>
              </FloatingFocusManager>
            )}
          </AnimatePresence>
        </div>
      </FieldShell>
    );
  },
);

Select.displayName = "Select";

// Backward Compatibility Alias
export const Dropdown = Select;
export type DropdownProps = SelectProps;
