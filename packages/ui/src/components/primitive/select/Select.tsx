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
import { useAsheeConfig } from "../../../libs/context";
import type { AnimationProp } from "../../../motion/types";
import {
  type Color,
  resolveVariantClass,
  type Variant,
} from "../../../shared/variant";
import type { Radius } from "../../../theme/token/radius/radius-config";
import { useResponsiveVars } from "../../../theme/token/responsive/use-responsive-vars";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon";
import type { ButtonSizeKey } from "../../primitive/button/button-config";
import { FieldShell } from "../field/FieldShell";
import type {
  FieldSizeKey,
  FieldStatus,
  InputAnimationPreset,
  LabelAlign,
} from "../field/field-config";
import { SelectMenu } from "../select-menu/SelectMenu";
import { defaultSelectSizeScale } from "./default-select-config";
import { flattenSelectSizeScale } from "./flatten-select-size-scale";
import type {
  SelectConfig,
  SelectOption,
  SelectSizeScale,
} from "./select-config";

// ─── Status Class Override ───────────────────────────────────────────────────

const STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "",
  error:
    "border-danger focus-visible:border-danger focus-visible:ring-danger/20",
  warning:
    "border-warning focus-visible:border-warning focus-visible:ring-warning/20",
  success:
    "border-success focus-visible:border-success focus-visible:ring-success/20",
};

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
  radius?: keyof Radius;
  variant?: Variant;
  color?: Color;
  animation?: AnimationProp<InputAnimationPreset>;
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
  menuRadius?: keyof Radius;
  menuSize?: ButtonSizeKey;
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

    // ─── Token Resolvers ──────────────────────────────────────────────────────

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

    const resolvedRadius = resolveScale(
      radius,
      sectionConfig?.radius,
      config.theme.radius.default,
      config.theme.radius.values,
    );

    const resolvedVariant = resolveValue<Variant>(
      variant,
      sectionConfig?.variant,
      (config.theme.defaultVariant as Variant) ?? "bordered",
    );

    const resolvedColor = resolveValue<Color>(
      color,
      sectionConfig?.color,
      (config.theme.defaultColor as Color) ?? "primary",
    );

    const resolvedStatus = status ?? "default";
    const resolvedLabelAlign = resolveValue(
      labelAlign,
      sectionConfig?.labelAlign,
      "left",
    );

    // ─── Menu Token Resolvers ─────────────────────────────────────────────────

    const resolvedMenuVariant = resolveValue<Variant>(
      menuVariant,
      sectionConfig?.menuVariant,
      (config.theme.defaultVariant as Variant) ?? "bordered",
    );

    const resolvedMenuColor = resolveValue<Color>(
      menuColor,
      sectionConfig?.menuColor,
      resolvedColor,
    );

    const resolvedMenuRadius = resolveScale(
      menuRadius,
      sectionConfig?.menuRadius,
      resolvedRadius,
      config.theme.radius.values,
    );

    const resolvedMenuSize = resolveValue<ButtonSizeKey>(
      menuSize,
      sectionConfig?.menuSize,
      "sm",
    );

    // Apply global variant/color styling & status overrides
    const variantClass = resolveVariantClass(resolvedVariant, resolvedColor);
    const statusClass =
      resolvedStatus !== "default" ? STATUS_BORDER_CLASS[resolvedStatus] : "";

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
        isLoading={isLoading}
        labelClassName={sectionConfig?.labelClassName}
        descriptionClassName={sectionConfig?.descriptionClassName}
        messageClassName={sectionConfig?.messageClassName}>
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
              "w-full flex items-center justify-between font-normal text-left text-foreground transition-colors outline-none select-none cursor-pointer",
              "focus-visible:ring-2 focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              variantClass,
              statusClass,
              buttonColor && `bg-[${buttonColor}]`,
              sectionConfig?.className,
              className,
            )}
            style={{
              borderRadius:
                resolvedVariant === "underlined" ? "0px" : resolvedRadius,
              height: `var(--ashee-select-${resolvedSizeKey}-height)`,
              paddingInline:
                resolvedVariant === "underlined"
                  ? "0px"
                  : `var(--ashee-select-${resolvedSizeKey}-padding-x)`,
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
                "ml-2 shrink-0 text-muted-foreground transition-transform duration-200",
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
            radius={resolvedMenuRadius}
            size={resolvedMenuSize}
            animation={
              animation ??
              (sectionConfig?.animation as AnimationProp | undefined)
            }
          />
        </div>
      </FieldShell>
    );
  },
);

Select.displayName = "Select";

// Backward Compatibility Alias
export const Dropdown = Select;
export type DropdownProps = SelectProps;
