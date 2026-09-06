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
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import type { Color, Variant } from "../../shared/variant";
import { resolveCascade, resolveRadiusKey } from "../../utils/resolve-token";
import type { FieldSizeKey } from "../field/field-config";
import { Input, type InputProps } from "../input/Input";
import { SelectMenu } from "../select-menu/SelectMenu";
import {
  type AutocompleteConfig,
  type AutocompleteOption,
  FALLBACK_AUTOCOMPLETE_CONFIG,
} from "./autocomplete-config";

// ─── Component Interface ──────────────────────────────────────────────────────

/**
 * Configuration options for the Autocomplete component.
 */
export interface AutocompleteProps
  extends Omit<InputProps, "value" | "onChange"> {
  /** Suggestions shown while the user types.
   *
   * @default []
   */
  options: AutocompleteOption[];
  /** Controlled selected value, shown as its option label. */
  value?: string | number;
  /** Callback fired with the selected value and option. */
  onValueChange?: (value: string | number, option?: AutocompleteOption) => void;
  /** Callback fired whenever the raw input text changes. */
  onInputChange?: (inputValue: string) => void;
  /** Allows free-form values that are not in the options list.
   *
   * When enabled, typing emits the raw text through `onValueChange`.
   *
   * @default false
   */
  allowCustomValue?: boolean;
  /** Content rendered below the options list. */
  belowList?: ReactNode;
  /** Extra classes applied to the floating dropdown. */
  dropdownClassName?: string;

  // Menu / Popover Overrides
  /** Visual style of the dropdown menu.
   *
   * @default "solid"
   */
  menuVariant?: Variant;
  /** Theme accent color of the dropdown menu.
   *
   * @default "default"
   */
  menuColor?: Color;
  /** Corner rounding of the dropdown menu.
   *
   * @default "md"
   */
  menuRadius?: Radius;
  /** Density scale of the dropdown menu.
   *
   * @default "sm"
   */
  menuSize?: Size;
}

// ─── Component Implementation ─────────────────────────────────────────────────

/**
 * A text input with a filterable suggestion dropdown.
 *
 * Autocomplete combines an {@link Input} trigger with a floating
 * {@link SelectMenu}. Suggestions are filtered as the user types, the
 * selected value is reported through `onValueChange`, and free-form
 * values are supported via `allowCustomValue`. Menu tokens resolve
 * through the standard AsheeUI cascade.
 *
 * @param props - Autocomplete configuration options and input props.
 * @param props.options - Suggestion list.
 * @param props.value - Controlled selected value.
 * @param props.onValueChange - Selection callback.
 * @param props.onInputChange - Raw input change callback.
 * @param props.allowCustomValue - Allow free-form values. Defaults to
 *   false.
 * @param props.belowList - Content below the options list.
 * @param props.dropdownClassName - Extra dropdown classes.
 * @param props.menuVariant - Dropdown variant. Defaults to "solid".
 * @param props.menuColor - Dropdown color. Defaults to "default".
 * @param props.menuRadius - Dropdown radius. Defaults to "md".
 * @param props.menuSize - Dropdown density. Defaults to "sm".
 *
 * @example
 * ```tsx
 * import { Autocomplete } from "asheeui";
 *
 * export function Example() {
 *   return (
 *     <Autocomplete
 *       options={[
 *         { label: "React", value: "react" },
 *         { label: "Vue", value: "vue" },
 *         { label: "Svelte", value: "svelte" },
 *       ]}
 *       onValueChange={(value) => console.log(value)}
 *     />
 *   );
 * }
 * ```
 */
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
      config.defaultVariant as Variant | undefined,
      FALLBACK_AUTOCOMPLETE_CONFIG.variant,
    );

    const resolvedMenuColor = resolveCascade<Color>(
      menuColor,
      sectionConfig?.menuColor,
      config.defaultColor as Color | undefined,
      FALLBACK_AUTOCOMPLETE_CONFIG.color,
    );

    const resolvedMenuRadiusKey = resolveRadiusKey(
      menuRadius,
      sectionConfig?.menuRadius,
      config.defaultRadius,
      FALLBACK_AUTOCOMPLETE_CONFIG.radius,
    );

    const resolvedMenuSize = resolveCascade<Size>(
      menuSize,
      sectionConfig?.menuSize,
      undefined,
      FALLBACK_AUTOCOMPLETE_CONFIG.menuSize,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

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
          radius={resolvedMenuRadiusKey}
          size={resolvedMenuSize}
          initialFocus={-1}
          returnFocus={false}
        />
      </div>
    );
  },
);

Autocomplete.displayName = "Autocomplete";
