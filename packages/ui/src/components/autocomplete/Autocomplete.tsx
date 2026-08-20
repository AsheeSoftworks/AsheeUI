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
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import type { AnimationProp } from "../../motion/types";
import type { Color, Variant } from "../../shared/variant";
import type { Radius } from "../../theme/token/radius/radius-config";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import type { ButtonSizeKey } from "../button/button-config";
import type { FieldSizeKey } from "../field/field-config";
import { Input, type InputProps } from "../input/Input";
import { SelectMenu } from "../select-menu/SelectMenu";
import {
  FALLBACK_AUTOCOMPLETE_CONFIG,
  type AutocompleteConfig,
  type AutocompleteOption,
} from "./autocomplete-config";
import { AUTOCOMPLETE_RADIUS_CLASS } from "./autocomplete-styles";

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
      size,
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
    const [inputValue, setInputValue] = useState(() =>
      selectedOption ? selectedOption.label : String(value ?? ""),
    );

    // Sync input text when value prop changes externally
    useEffect(() => {
      if (selectedOption) {
        setInputValue(selectedOption.label);
      } else if (value !== undefined && value !== null) {
        setInputValue(String(value));
      }
    }, [selectedOption, value]);

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

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedSizeKey = resolveCascade<FieldSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_AUTOCOMPLETE_CONFIG.size,
    );

    const resolvedMenuVariant = resolveCascade<Variant>(
      menuVariant,
      sectionConfig?.menuVariant,
      config.theme.defaultVariant as Variant | undefined,
      FALLBACK_AUTOCOMPLETE_CONFIG.variant,
    );

    const resolvedMenuColor = resolveCascade<Color>(
      menuColor,
      sectionConfig?.menuColor,
      config.theme.defaultColor as Color | undefined,
      FALLBACK_AUTOCOMPLETE_CONFIG.color,
    );

    const resolvedMenuRadiusKey = resolveRadiusKey(
      typeof menuRadius === "string" ? menuRadius : undefined,
      typeof sectionConfig?.menuRadius === "string"
        ? { radius: sectionConfig.menuRadius }
        : undefined,
      typeof inputProps.radius === "string"
        ? inputProps.radius
        : config.theme.radius?.default,
      FALLBACK_AUTOCOMPLETE_CONFIG.radius,
    );

    const resolvedMenuSize = resolveCascade<ButtonSizeKey>(
      menuSize,
      sectionConfig?.menuSize,
      undefined,
      FALLBACK_AUTOCOMPLETE_CONFIG.menuSize,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const menuRadiusClass = resolveClassKey(
      resolvedMenuRadiusKey,
      AUTOCOMPLETE_RADIUS_CLASS,
      FALLBACK_AUTOCOMPLETE_CONFIG.radius,
    );

    // Filter options dynamically as user types
    const filteredOptions = useMemo(() => {
      if (!inputValue.trim()) return options;
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }, [options, inputValue]);

    // Handle Input Changes
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setInputValue(text);
        onInputChange?.(text);
        setIsOpen(true);

        if (allowCustomValue) {
          onValueChange?.(text);
        }
      },
      [allowCustomValue, onInputChange, onValueChange],
    );

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
          size={resolvedSizeKey}
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
          isSearch={false}
          belowList={belowList}
          dropdownClassName={dropdownClassName}
          variant={resolvedMenuVariant}
          color={resolvedMenuColor}
          radius={menuRadiusClass}
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
