"use client";

import { cn } from "@asheeui/utils";
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
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon";
import { CloseIcon } from "../../icons/CloseIcon";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, type Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import type { Color, Variant } from "../../shared/variant";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { Button } from "../button/Button";
import { Chip } from "../chip/Chip";
import { FieldShell } from "../field/FieldShell";
import type {
  FieldSizeKey,
  FieldStatus,
  LabelAlign,
} from "../field/field-config";
import { SelectMenu } from "../select-menu/SelectMenu";
import {
  FALLBACK_MULTI_SELECT_CONFIG,
  type MultiSelectConfig,
  type MultiSelectOption,
} from "./multi-select-config";
import {
  MULTI_SELECT_FONT_CLASS,
  MULTI_SELECT_HEIGHT_CLASS,
  MULTI_SELECT_PADDING_CLASS,
  STATUS_BORDER_CLASS,
} from "./multi-select-styles";

// ─── Props Interface ──────────────────────────────────────────────────────────

export interface MultiSelectProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
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
  chipRadius?: Radius;
  chipSize?: Size;

  // Menu Overrides
  menuVariant?: Variant;
  menuColor?: Color;
  menuRadius?: Radius;
  menuSize?: Size;

  // Styling & Tokens
  variant?: Variant;
  color?: Color;
  size?: FieldSizeKey;
  radius?: Radius;
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
      style,
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

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedSizeKey = resolveCascade<FieldSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_MULTI_SELECT_CONFIG.size,
    );

    const resolvedVariant = resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant,
      FALLBACK_MULTI_SELECT_CONFIG.variant,
    );

    const resolvedColor = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor as Color | undefined,
      FALLBACK_MULTI_SELECT_CONFIG.color,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_MULTI_SELECT_CONFIG.radius,
    );

    // Menu Token Resolvers
    const resolvedMenuVariant = resolveCascade<Variant>(
      menuVariant,
      sectionConfig?.menuVariant,
      resolvedVariant,
      FALLBACK_MULTI_SELECT_CONFIG.variant,
    );

    const resolvedMenuColor = resolveCascade<Color>(
      menuColor,
      sectionConfig?.menuColor,
      resolvedColor,
      FALLBACK_MULTI_SELECT_CONFIG.color,
    );

    const resolvedMenuSize = resolveCascade<Size>(
      menuSize,
      sectionConfig?.menuSize,
      undefined,
      FALLBACK_MULTI_SELECT_CONFIG.menuSize,
    );

    const resolvedMenuRadiusKey = resolveRadiusKey(
      menuRadius,
      sectionConfig?.menuRadius,
      resolvedRadiusKey,
      FALLBACK_MULTI_SELECT_CONFIG.radius,
    );

    // Chip Token Resolvers
    const resolvedChipVariant = resolveCascade<Variant>(
      chipVariant,
      sectionConfig?.chipVariant,
      resolvedVariant,
      FALLBACK_MULTI_SELECT_CONFIG.variant,
    );

    const resolvedChipColor = resolveCascade<Color>(
      chipColor,
      sectionConfig?.chipColor,
      resolvedColor,
      FALLBACK_MULTI_SELECT_CONFIG.color,
    );

    const resolvedChipSize = resolveCascade<Size>(
      chipSize,
      sectionConfig?.chipSize,
      undefined,
      FALLBACK_MULTI_SELECT_CONFIG.chipSize,
    );

    const resolvedChipRadiusKey = resolveRadiusKey(
      chipRadius,
      sectionConfig?.chipRadius,
      resolvedRadiusKey,
      FALLBACK_MULTI_SELECT_CONFIG.radius,
    );

    const resolvedStatus = status ?? "default";
    const resolvedStatusColor: Color =
      resolvedStatus === "error"
        ? "danger"
        : resolvedStatus === "success"
          ? "success"
          : resolvedStatus === "warning"
            ? "warning"
            : resolvedColor;
    const resolvedLabelAlign = resolveCascade<LabelAlign>(
      labelAlign,
      sectionConfig?.labelAlign,
      undefined,
      FALLBACK_MULTI_SELECT_CONFIG.labelAlign,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const heightClass = resolveClassKey(
      resolvedSizeKey,
      MULTI_SELECT_HEIGHT_CLASS,
      FALLBACK_MULTI_SELECT_CONFIG.size,
    );

    const paddingClass = resolveClassKey(
      resolvedSizeKey,
      MULTI_SELECT_PADDING_CLASS,
      FALLBACK_MULTI_SELECT_CONFIG.size,
    );

    const fontClass = resolveClassKey(
      resolvedSizeKey,
      MULTI_SELECT_FONT_CLASS,
      FALLBACK_MULTI_SELECT_CONFIG.size,
    );

    const chipRadiusClass = resolveClassKey(
      resolvedChipRadiusKey,
      RADIUS_CLASS,
      FALLBACK_MULTI_SELECT_CONFIG.radius,
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
        isLoading={isLoading}>
        <div
          className={cn("w-full flex flex-col gap-3", containerClassName)}
          style={style}
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
              variant={resolvedVariant}
              color={resolvedStatusColor}
              radius={resolvedRadiusKey}
              animate={false}
              size={resolvedSizeKey}
              isDisabled={disabled}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-invalid={resolvedStatus === "error"}
              className={cn(
                "w-full flex items-center justify-between font-normal text-left transition-all duration-200 outline-none select-none",
                STATUS_BORDER_CLASS[resolvedStatus],
                heightClass,
                paddingClass,
                fontClass,
                className,
              )}
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
              radius={resolvedMenuRadiusKey}
            />
          </div>

          {/* Selected Chips Section */}
          {!disableChipDisplay && (
            <div className="flex flex-col gap-1.5">
              {chipLabel && (
                <span className="text-xs font-medium text-foreground/70">
                  {chipLabel}
                </span>
              )}
              <div className="flex flex-wrap gap-1.5 p-2 min-h-12 bg-secondary/20 border border-dashed border-border rounded-lg items-center">
                {activeChips.length === 0 ? (
                  <span className="text-xs text-foreground/70 px-2 py-1">
                    No selections made
                  </span>
                ) : (
                  activeChips.map((chip) => (
                    <Chip
                      key={String(chip.value)}
                      variant={
                        resolvedChipVariant === "underlined"
                          ? "bordered"
                          : "bordered"
                      }
                      color={resolvedChipColor}
                      size={resolvedChipSize}
                      isDisabled={disabled}
                      className={cn(
                        "inline-flex items-center gap-1.5 font-medium shadow-xs",
                        chipRadiusClass,
                      )}>
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
                    </Chip>
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
