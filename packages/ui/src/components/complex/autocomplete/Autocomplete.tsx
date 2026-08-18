"use client";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import type { AnimationProp } from "../../../motion/types";
import type { Color, Variant } from "../../../shared/variant";
import type { Radius } from "../../../theme/token/radius/radius-config";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import type { ButtonSizeKey } from "../../primitive/button/button-config";
import { Input, type InputProps } from "../../primitive/input/Input";
import { SelectMenu } from "../../primitive/select-menu/SelectMenu";
import type {
  AutocompleteConfig,
  AutocompleteOption,
} from "./autocomplete-config";

// ─── Component Interface ──────────────────────────────────────────────────────

export interface AutocompleteProps
  extends Omit<InputProps, "value" | "onChange"> {
  options: AutocompleteOption[];
  value?: string | number;
  onValueChange?: (value: string | number, option?: AutocompleteOption) => void;
  onInputChange?: (inputValue: string) => void;
  allowCustomValue?: boolean;
  belowList?: ReactNode;
  dropdownClassName?: string;

  // Menu / Popover Overrides
  menuVariant?: Variant;
  menuColor?: Color;
  menuRadius?: keyof Radius;
  menuSize?: ButtonSizeKey;
}

// ─── Component Implementation ─────────────────────────────────────────────────

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      options = [],
      value,
      onValueChange,
      onInputChange,
      allowCustomValue = false,
      belowList,
      dropdownClassName,
      menuVariant,
      menuColor,
      menuRadius,
      menuSize,
      endContent,
      onClick,
      disabled,
      placeholder = "Type to search...",
      className,
      size, // Extracted here so it isn't bundled into inputProps
      ...inputProps
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.autocomplete as
      | AutocompleteConfig
      | undefined;

    // Find selected option to compute initial display text
    const selectedOption = useMemo(
      () => options.find((opt) => opt.value === value),
      [options, value],
    );

    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(
      selectedOption ? selectedOption.label : String(value ?? ""),
    );

    // Sync input text when value prop changes externally
    useMemo(() => {
      if (selectedOption) {
        setInputValue(selectedOption.label);
      }
    }, [selectedOption]);

    // Floating UI context
    const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
      open: isOpen,
      onOpenChange: (open) => !disabled && setIsOpen(open),
      placement: "bottom-start",
      whileElementsMounted: autoUpdate,
      middleware: [offset(4), flip(), shift({ padding: 8 })],
    });

    const focus = useFocus(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "combobox" });
    const { getReferenceProps, getFloatingProps } = useInteractions([
      focus,
      dismiss,
      role,
    ]);

    // Menu Token Resolvers
    const resolvedMenuVariant = resolveValue<Variant>(
      menuVariant,
      sectionConfig?.menuVariant,
      config.theme.defaultVariant as Variant,
    );

    const resolvedMenuColor = resolveValue<Color>(
      menuColor,
      sectionConfig?.menuColor,
      config.theme.defaultColor ?? "primary",
    );

    const resolvedMenuRadius = resolveScale(
      menuRadius,
      sectionConfig?.menuRadius,
      inputProps.radius ?? sectionConfig?.radius ?? config.theme.radius.default,
      config.theme.radius.values,
    );

    const resolvedMenuSize = resolveValue<ButtonSizeKey>(
      menuSize,
      sectionConfig?.menuSize,
      "sm",
    );

    // Filter options dynamically as user types
    const filteredOptions = useMemo(() => {
      if (!inputValue.trim()) return options;
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }, [options, inputValue]);

    // Handle Input Changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      setInputValue(text);
      onInputChange?.(text);
      setIsOpen(true);

      if (allowCustomValue) {
        onValueChange?.(text);
      }
    };

    // Handle Option Selection
    const handleSelectOption = useCallback(
      (option: AutocompleteOption) => {
        setInputValue(option.label);
        onValueChange?.(option.value, option);
        setIsOpen(false);
      },
      [onValueChange],
    );

    const selectedValues = useMemo(
      () => (value !== undefined && value !== null ? [value] : []),
      [value],
    );

    return (
      <div className="w-full relative inline-block">
        {/* Triggering custom Input component */}
        <Input
          ref={(node) => {
            refs.setReference(node);
            if (typeof ref === "function") ref(node);
            else if (ref)
              (ref as React.RefObject<HTMLInputElement | null>).current = node;
          }}
          size={size}
          disabled={disabled}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onClick={(e) => {
            if (!disabled) setIsOpen(true);
            onClick?.(e);
          }}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          endContent={endContent}
          className={className}
          {...getReferenceProps(inputProps)}
        />

        {/* Floating SelectMenu */}
        <SelectMenu
          isOpen={isOpen}
          context={context}
          floatingStyles={floatingStyles}
          getFloatingProps={getFloatingProps}
          setFloatingRef={refs.setFloating}
          options={filteredOptions}
          selectedValues={selectedValues}
          onSelectOption={handleSelectOption}
          isSearch={false} // Handled directly by the Input component
          belowList={belowList}
          dropdownClassName={dropdownClassName}
          variant={resolvedMenuVariant}
          color={resolvedMenuColor}
          radius={resolvedMenuRadius}
          size={resolvedMenuSize}
          initialFocus={-1}
          returnFocus={false}
          animation={
            inputProps.animation ??
            (sectionConfig?.animation as AnimationProp | undefined)
          }
        />
      </div>
    );
  },
);

Autocomplete.displayName = "Autocomplete";
