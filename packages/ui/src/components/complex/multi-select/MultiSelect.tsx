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
import { CloseIcon } from "../../icons/CloseIcon";
import { SearchIcon } from "../../icons/SearchIcon";
import { Button } from "../../primitive/button/Button";
import type {
  FieldSizeKey,
  FieldStatus,
  LabelAlign,
} from "../../primitive/field/field-config";
import { FieldShell } from "../../primitive/field/field-shell";
import { Input } from "../../primitive/input/Input";
import { defaultMultiSelectSizeScale } from "./default-multi-select-config";
import { flattenMultiSelectSizeScale } from "./flatten-multi-select-size-scale";
import type {
  MultiSelectConfig,
  MultiSelectOption,
  MultiSelectSizeScale,
} from "./multi-select-config";

const STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "border-border focus:border-primary",
  error: "border-danger focus:border-danger",
  warning: "border-warning focus:border-warning",
  success: "border-success focus:border-success",
};

// ─── Props Interface ──────────────────────────────────────────────────────────

export interface MultiSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: MultiSelectOption[];
  value?: (string | number)[];
  onChange?: (values: (string | number)[]) => void;
  InputLabel?: string;
  isSearch?: boolean;
  searchPlaceholder?: string;
  searchInputName?: string;
  belowList?: ReactNode;

  // Custom/Legacy Chip Handlers
  chipOptions?: MultiSelectOption[];
  handleRemoveChip?: (id: string | number) => void;
  handleAddChip?: (item: MultiSelectOption) => void;
  chipLabel?: string;
  disableChipDisplay?: boolean;

  // Styling & Tokens
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
  disabled?: boolean;
  containerClassName?: string;
  dropdownClassName?: string;
}

// ─── Component Implementation ─────────────────────────────────────────────────

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options = [],
      value,
      onChange,
      InputLabel = "Select Options...",
      isSearch = true,
      searchPlaceholder = "Search...",
      searchInputName = "multiselect-search",
      belowList,
      chipOptions,
      handleRemoveChip,
      handleAddChip,
      chipLabel,
      disableChipDisplay = false,
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
      containerClassName,
      dropdownClassName,
      id,
      className,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const { settings } = useSettings();
    const sectionConfig = config.components?.multiSelect as
      | MultiSelectConfig
      | undefined;

    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Floating UI Context
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

    // Design Token Resolvers
    const sizeScale = (sectionConfig?.size ??
      defaultMultiSelectSizeScale) as MultiSelectSizeScale;
    const resolvedSizeKey = size ?? sizeScale.default;
    const responsiveVars = useMemo(
      () => flattenMultiSelectSizeScale(sizeScale),
      [sizeScale],
    );
    useResponsiveVars(
      "ashee-multi-select-tokens",
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

    // Controlled or Custom Chip Selection Determination
    const activeChips = useMemo(() => {
      if (chipOptions !== undefined) return chipOptions;
      if (Array.isArray(value)) {
        return options.filter((opt) => value.includes(opt.value));
      }
      return [];
    }, [chipOptions, value, options]);

    const isOptionSelected = useCallback(
      (optValue: string | number) => {
        return activeChips.some((chip) => chip.value === optValue);
      },
      [activeChips],
    );

    const handleSelectOption = useCallback(
      (option: MultiSelectOption) => {
        const selected = isOptionSelected(option.value);

        if (handleAddChip || handleRemoveChip) {
          if (selected) handleRemoveChip?.(option.value);
          else handleAddChip?.(option);
        } else if (onChange) {
          const currentValues = value ?? [];
          const nextValues = selected
            ? currentValues.filter((v) => v !== option.value)
            : [...currentValues, option.value];
          onChange(nextValues);
        }
      },
      [isOptionSelected, handleAddChip, handleRemoveChip, onChange, value],
    );

    const handleRemove = useCallback(
      (val: string | number) => {
        if (handleRemoveChip) {
          handleRemoveChip(val);
        } else if (onChange && Array.isArray(value)) {
          onChange(value.filter((v) => v !== val));
        }
      },
      [handleRemoveChip, onChange, value],
    );

    const filteredOptions = useMemo(() => {
      if (!isSearch || !searchQuery.trim()) return options;
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }, [options, isSearch, searchQuery]);

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
        <div
          className={cn("w-full flex flex-col gap-3", containerClassName)}
          {...props}>
          <div className="relative w-full">
            {/* Trigger Button built on Button Primitive */}
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
                sectionConfig?.className,
                className,
              )}
              style={{
                borderRadius: resolvedRadius,
                height: `var(--ashee-multi-select-${resolvedSizeKey}-height)`,
                paddingInline: `var(--ashee-multi-select-${resolvedSizeKey}-padding-x)`,
                fontSize: `var(--ashee-multi-select-${resolvedSizeKey}-font-s)`,
              }}
              {...getReferenceProps()}>
              <span
                className={
                  activeChips.length > 0
                    ? "text-foreground"
                    : "text-muted-foreground"
                }>
                {activeChips.length > 0
                  ? `${activeChips.length} selected`
                  : InputLabel}
              </span>
              <ChevronDownIcon
                className={cn(
                  "ml-2 shrink-0 text-muted-foreground",
                  isOpen && "rotate-180",
                )}
              />
            </Button>

            {/* Animated Options Popover */}
            <AnimatePresence>
              {isOpen && (
                <FloatingFocusManager context={context} modal={false}>
                  <div
                    ref={refs.setFloating}
                    style={{ ...floatingStyles, zIndex: 99999 }}
                    className="w-full min-w-55 outline-none"
                    {...getFloatingProps()}>
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className={cn(
                        "w-full max-h-60 overflow-y-auto shadow-xl bg-background border border-border rounded-lg p-1 flex flex-col gap-0.5 overflow-x-hidden",
                        dropdownClassName,
                      )}
                      {...(motionProps as HTMLMotionProps<"div">)}>
                      {/* Search Input Bar */}
                      {isSearch && (
                        <div className="p-1 mb-1 sticky top-0 bg-background z-10 border-b border-border">
                          <div className="relative flex items-center">
                            <SearchIcon className="absolute left-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                            <Input
                              name={searchInputName}
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
                        <div className="px-3 py-4 text-xs text-muted-foreground text-center">
                          No options found
                        </div>
                      ) : (
                        filteredOptions.map((option) => {
                          const selected = isOptionSelected(option.value);
                          return (
                            <Button
                              key={String(option.value)}
                              type="button"
                              variant="ghost"
                              disabled={option.disabled}
                              onClick={() => handleSelectOption(option)}
                              className={cn(
                                "w-full justify-between font-normal text-xs px-3 py-2 h-auto text-left rounded-md transition-colors",
                                selected
                                  ? "bg-primary/10 text-primary font-medium hover:bg-primary/20"
                                  : "hover:bg-accent hover:text-accent-foreground text-foreground",
                              )}>
                              <span>{option.label}</span>
                              {selected && (
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

          {/* Selected Chips Section */}
          {!disableChipDisplay && (
            <div className="flex flex-col gap-1.5">
              {chipLabel && (
                <span className="text-xs font-medium text-muted-foreground">
                  {chipLabel}
                </span>
              )}
              <div className="flex flex-wrap gap-1.5 p-2 min-h-12 bg-muted/20 border border-dashed border-border rounded-lg items-center">
                {activeChips.length === 0 ? (
                  <span className="text-xs text-muted-foreground px-2 py-1">
                    No selections made
                  </span>
                ) : (
                  activeChips.map((chip) => (
                    <span
                      key={String(chip.value)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background border border-border text-xs text-foreground font-medium rounded-md shadow-xs">
                      <span>{chip.label}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={disabled}
                        onClick={() => handleRemove(chip.value)}
                        aria-label={`Remove ${chip.label}`}
                        className="h-4 w-4 p-0 min-w-0 hover:bg-danger/10 hover:text-danger rounded transition-colors">
                        <CloseIcon />
                      </Button>
                    </span>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </FieldShell>
    );
  },
);

MultiSelect.displayName = "MultiSelect";
