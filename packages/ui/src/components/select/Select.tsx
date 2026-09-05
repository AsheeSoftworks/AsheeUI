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
  type ReactNode,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, type Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import {
  type Color,
  resolveVariantClass,
  type Variant,
} from "../../shared/variant";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { FieldShell } from "../field/FieldShell";
import type {
  FieldSizeKey,
  FieldStatus,
  LabelAlign,
} from "../field/field-config";
import { SelectMenu } from "../select-menu/SelectMenu";
import {
  FALLBACK_SELECT_CONFIG,
  type SelectConfig,
  type SelectOption,
} from "./select-config";
import { SELECT_SIZE_CLASS, SELECT_STATUS_BORDER_CLASS } from "./select-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

export interface SelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "size" | "color" | "onChange" | "value"
  > {
  options: SelectOption[];
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onValueChange?: (value: string | number) => void;
  size?: FieldSizeKey;
  radius?: Radius;
  variant?: Variant;
  color?: Color;
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
  dropdownClassName?: string;
  id?: string;
  name?: string;

  // Menu / Popover Overrides
  menuVariant?: Variant;
  menuColor?: Color;
  menuRadius?: Radius;
  menuSize?: Size;
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
      variant,
      color,
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
      searchInputName = "select-search",
      initialValue,
      belowList,
      placeholder = "Select...",
      buttonColor,
      className,
      dropdownClassName,
      id,
      name,
      menuVariant,
      menuColor,
      menuRadius,
      menuSize,
      style,
    },
    ref,
  ) => {
    const config = useAsheeConfig();
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

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedSizeKey = resolveCascade<FieldSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_SELECT_CONFIG.size,
    );

    const resolvedVariant = resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant,
      FALLBACK_SELECT_CONFIG.variant,
    );

    const resolvedColor = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor,
      FALLBACK_SELECT_CONFIG.color,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_SELECT_CONFIG.radius,
    );

    const resolvedStatus = status ?? FALLBACK_SELECT_CONFIG.status;

    const resolvedLabelAlign = resolveCascade<LabelAlign>(
      labelAlign,
      sectionConfig?.labelAlign,
      undefined,
      FALLBACK_SELECT_CONFIG.labelAlign,
    );

    // Menu Token Resolvers
    const resolvedMenuVariant = resolveCascade<Variant>(
      menuVariant,
      sectionConfig?.menuVariant,
      undefined,
      resolvedVariant,
    );

    const resolvedMenuColor = resolveCascade<Color>(
      menuColor,
      sectionConfig?.menuColor,
      undefined,
      resolvedColor,
    );

    const resolvedMenuRadiusKey = resolveRadiusKey(
      menuRadius,
      sectionConfig?.menuRadius,
      resolvedRadiusKey,
      FALLBACK_SELECT_CONFIG.radius,
    );

    const resolvedMenuSize = resolveCascade<Size>(
      menuSize,
      sectionConfig?.menuSize,
      undefined,
      FALLBACK_SELECT_CONFIG.menuSize,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const variantClass = resolveVariantClass(resolvedVariant, resolvedColor);
    const statusClass =
      resolvedStatus !== "default"
        ? SELECT_STATUS_BORDER_CLASS[resolvedStatus]
        : "";
    const radiusClass =
      resolvedVariant === "underlined"
        ? "rounded-none"
        : resolveClassKey(
            resolvedRadiusKey,
            RADIUS_CLASS,
            FALLBACK_SELECT_CONFIG.radius,
          );

    const selectedOption = useMemo(
      () => options.find((opt) => opt.value === value),
      [options, value],
    );

    const handleSelectOption = useCallback(
      (option: SelectOption) => {
        onValueChange?.(option.value);
        if (onChange) {
          const event = {
            target: { value: option.value, name: name ?? "" },
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

    const selectedValues = useMemo(
      () => (value !== undefined && value !== null ? [value] : []),
      [value],
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
        <div className="w-full relative inline-block">
          {/* Trigger Button */}
          <button
            ref={(node) => {
              refs.setReference(node);
              if (typeof ref === "function") ref(node);
              else if (ref)
                (ref as React.RefObject<HTMLButtonElement | null>).current =
                  node;
            }}
            type="button"
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-invalid={resolvedStatus === "error"}
            className={cn(
              "w-full flex items-center justify-between font-normal text-left text-foreground transition-colors outline-none select-none cursor-pointer shrink-0",
              "focus-visible:ring-2 focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
              SELECT_SIZE_CLASS[resolvedSizeKey],
              variantClass,
              statusClass,
              radiusClass,
              buttonColor && `bg-[${buttonColor}]`,
              className,
            )}
            style={style}
            {...getReferenceProps()}>
            <span
              className={
                selectedOption || initialValue
                  ? "text-foreground"
                  : "text-foreground/70"
              }>
              {displayLabel}
            </span>
            <ChevronDownIcon
              className={cn(
                "ml-2 shrink-0 text-foreground/70 transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </button>

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
            radius={resolvedMenuRadiusKey}
            size={resolvedMenuSize}
          />
        </div>
      </FieldShell>
    );
  },
);

Select.displayName = "Select";
