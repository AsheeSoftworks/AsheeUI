"use client";

import { type Radius, useResponsiveVars } from "@ashee/theme";
import { cn } from "@ashee/utils";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import type { AnimationProp } from "../../../libs/motion/types";
import type { Color, Variant } from "../../../shared/variant";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon";
import { CloseIcon } from "../../icons/CloseIcon";
import { Button } from "../../primitive/button/Button";
import type { ButtonSizeKey } from "../../primitive/button/button-config";
import { FieldShell } from "../../primitive/field/FieldShell";
import type {
  FieldSizeKey,
  FieldStatus,
  LabelAlign,
} from "../../primitive/field/field-config";
import { SelectMenu } from "../../primitive/select-menu/SelectMenu";
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

  // Chip Specific Overrides
  chipVariant?: Variant;
  chipColor?: Color;
  chipRadius?: keyof Radius;
  chipSize?: ButtonSizeKey;

  // Menu Overrides
  menuVariant?: Variant;
  menuColor?: Color;
  menuRadius?: keyof Radius;
  menuSize?: ButtonSizeKey;

  // Styling & Tokens
  variant?: Variant;
  color?: Color;
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
      chipVariant,
      chipColor,
      chipRadius,
      chipSize,
      menuVariant,
      menuColor,
      menuRadius,
      menuSize,
      variant,
      color,
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

    // Variant & Color Tokens
    const resolvedVariant = resolveValue(
      variant,
      sectionConfig?.variant,
      config.theme.defaultVariant ?? "bordered",
    );

    const resolvedColor = resolveValue(
      color,
      sectionConfig?.color,
      config.theme.defaultColor ?? "primary",
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

    // Menu Token Resolvers
    const resolvedMenuVariant = resolveValue(
      menuVariant,
      sectionConfig?.menuVariant,
      resolvedVariant,
    );

    const resolvedMenuColor = resolveValue(
      menuColor,
      sectionConfig?.menuColor,
      resolvedColor,
    );

    const resolvedMenuSize = resolveValue(
      menuSize,
      sectionConfig?.menuSize,
      "sm",
    );

    const resolvedMenuRadiusKey =
      typeof menuRadius === "string" ? menuRadius : undefined;
    const resolvedSectionMenuRadiusKey =
      typeof sectionConfig?.menuRadius === "string"
        ? sectionConfig.menuRadius
        : undefined;
    const resolvedMenuRadius = resolveScale(
      resolvedMenuRadiusKey,
      resolvedSectionMenuRadiusKey,
      resolvedRadius,
      config.theme.radius.values,
    );

    // Chip Styling Resolvers
    const resolvedChipVariant = resolveValue(
      chipVariant,
      sectionConfig?.chipVariant,
      resolvedVariant,
    );

    const resolvedChipColor = resolveValue(
      chipColor,
      sectionConfig?.chipColor,
      resolvedColor,
    );

    const resolvedChipSize = resolveValue(
      chipSize,
      sectionConfig?.chipSize,
      "sm",
    );

    const resolvedChipRadiusKey =
      typeof chipRadius === "string" ? chipRadius : undefined;
    const resolvedSectionChipRadiusKey =
      typeof sectionConfig?.chipRadius === "string"
        ? sectionConfig.chipRadius
        : undefined;
    const resolvedChipRadius = resolveScale(
      resolvedChipRadiusKey,
      resolvedSectionChipRadiusKey,
      resolvedRadius,
      config.theme.radius.values,
    );

    const resolvedStatus = status ?? "default";
    const resolvedLabelAlign = resolveValue(
      labelAlign,
      sectionConfig?.labelAlign,
      "left",
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

    const selectedValues = useMemo(
      () => activeChips.map((chip) => chip.value),
      [activeChips],
    );

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
                  (ref as React.RefObject<HTMLButtonElement | null>).current =
                    node;
              }}
              type="button"
              variant={resolvedVariant}
              color={resolvedColor}
              isDisabled={disabled}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-invalid={resolvedStatus === "error"}
              className={cn(
                "w-full flex items-center justify-between font-normal text-left transition-all duration-200 outline-none select-none",
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
              <span>
                {activeChips.length > 0
                  ? `${activeChips.length} selected`
                  : InputLabel}
              </span>
              <ChevronDownIcon
                className={cn(
                  "ml-2 shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </Button>

            {/* Reusable SelectMenu */}
            <SelectMenu
              isOpen={isOpen}
              context={context}
              floatingStyles={floatingStyles}
              getFloatingProps={getFloatingProps}
              setFloatingRef={refs.setFloating}
              options={options}
              selectedValues={selectedValues}
              onSelectOption={handleSelectOption}
              isSearch={isSearch}
              searchPlaceholder={searchPlaceholder}
              searchInputName={searchInputName}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              belowList={belowList}
              dropdownClassName={dropdownClassName}
              variant={resolvedMenuVariant}
              color={resolvedMenuColor}
              size={resolvedMenuSize}
              radius={resolvedMenuRadius}
              animation={
                animation ??
                (sectionConfig?.animation as AnimationProp | undefined)
              }
            />
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
                    <Button
                      key={String(chip.value)}
                      type="button"
                      variant={resolvedChipVariant}
                      color={resolvedChipColor}
                      size={resolvedChipSize}
                      isDisabled={disabled}
                      className="inline-flex items-center gap-1.5 font-medium shadow-xs"
                      style={{ borderRadius: resolvedChipRadius }}>
                      <span>{chip.label}</span>
                      <button
                        type="button"
                        tabIndex={disabled ? -1 : 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!disabled) handleRemove(chip.value);
                        }}
                        onKeyDown={(e) => {
                          if (
                            (e.key === "Enter" || e.key === " ") &&
                            !disabled
                          ) {
                            e.stopPropagation();
                            handleRemove(chip.value);
                          }
                        }}
                        aria-label={`Remove ${chip.label}`}
                        className="inline-flex items-center justify-center h-3.5 w-3.5 rounded-full hover:bg-black/20 dark:hover:bg-white/20 transition-colors cursor-pointer shrink-0">
                        <CloseIcon className="w-3 h-3" />
                      </button>
                    </Button>
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
