/**
 * Autocomplete component for AsheeUI.
 * This file provides the main Autocomplete component implementation, which
 * combines a text input with a floating suggestion dropdown. It supports
 * filtered options, free-form values, and controlled selection state.
 * The component uses Floating UI for positioning and follows AsheeUI's
 * configuration cascade for visual tokens.
 */
"use client";

import {
  useDismiss,
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
import type { Color, Variant } from "../../shared";
import { resolveCascade, resolveRadiusKey } from "../../utils/resolve-token";
import type { FieldSizeKey } from "../field/field-config";
import { Input, type InputProps } from "../input/Input";
import { useSelectFloating, type SelectMenuOption } from "../select-menu";
import { SelectMenu } from "../select-menu/SelectMenu";
import {
  type AutocompleteConfig,
  FALLBACK_AUTOCOMPLETE_CONFIG,
} from "./autocomplete-config";

// ─── Component Interface ──────────────────────────────────────────────────────

type BaseAutocompleteProps = AutocompleteConfig &
  Omit<InputProps, "value" | "onChange">;

/**
 * Configuration options for the Autocomplete component.
 */
export interface AutocompleteProps extends BaseAutocompleteProps {
  /**
   * Suggestions shown while the user types.
   * Each option must have a label and a unique value.
   *
   * @default []
   */
  options: SelectMenuOption[];

  /**
   * Controlled selected value, shown as its option label.
   * When allowCustomValue is true, this can be a free-form string.
   */
  value?: string | number;

  /**
   * Callback fired with the selected value and option.
   * Called when a suggestion is selected from the dropdown.
   */
  onValueChange?: (value: string | number, option?: SelectMenuOption) => void;

  /**
   * Callback fired whenever the raw input text changes.
   * Called on every keystroke, providing the current input value.
   */
  onInputChange?: (inputValue: string) => void;

  /**
   * Allows free-form values that are not in the options list.
   *
   * When enabled, typing emits the raw text through `onValueChange`.
   * The dropdown will still show filtered suggestions, but the user
   * can enter any text.
   *
   * @default false
   */
  allowCustomValue?: boolean;

  /**
   * Content rendered below the options list.
   * Useful for adding "Add new" buttons or status messages.
   */
  belowList?: ReactNode;

  /**
   * Extra classes applied to the floating dropdown.
   */
  dropdownClassName?: string;
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
 * The component handles accessibility through Floating UI's interaction
 * hooks, including focus management, dismissal on outside clicks,
 * and proper ARIA roles for the combobox pattern.
 *
 * By default, the dropdown menu uses React's createPortal to render at the
 * document body level. This ensures the menu escapes CSS containment, overflow
 * clipping, and stacking context issues. The portal can be disabled via the
 * `portal` prop or `components.autocomplete.portal` in the config if the menu
 * needs to stay within a specific parent container.
 *
 * @param props - Autocomplete configuration options and input props.
 * @param props.options - Suggestion list.
 * @param props.value - Controlled selected value.
 * @param props.onValueChange - Selection callback.
 * @param props.onInputChange - Raw input change callback.
 * @param props.allowCustomValue - Allow free-form values. Defaults to false.
 * @param props.belowList - Content below the options list.
 * @param props.dropdownClassName - Extra dropdown classes.
 * @param props.menuVariant - Dropdown variant. Defaults to "solid".
 * @param props.color - Dropdown color. Defaults to "default".
 * @param props.radius - Dropdown radius. Defaults to "md".
 * @param props.size - Dropdown density. Defaults to "sm".
 * @param props.disabled - Whether the input is disabled.
 * @param props.placeholder - Placeholder text for the input.
 * @param props.className - Extra classes for the input.
 * @param props.portal - Whether to render the dropdown in a portal. Defaults to true.
 * @param props.portalTarget - Custom portal target element. Defaults to document.body.
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
 *
 * @example
 * ```tsx
 * // With free-form values
 * <Autocomplete
 *   allowCustomValue
 *   options={fruits}
 *   onValueChange={(value) => console.log('Selected:', value)}
 *   placeholder="Type a fruit name..."
 * />
 * ```
 *
 * @see AutocompleteConfig - The configuration type for component defaults.
 * @see SelectMenu - The dropdown component used for suggestions.
 * @see useAsheeConfig - Hook for accessing the global configuration.
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
      menu,
      variant,
      color,
      radius,
      size,
      endContent,
      onClick,
      disabled,
      placeholder = "Type to search...",
      className,
      portal: portalProp,
      portalTarget: portalTargetProp,
      ...inputProps
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.autocomplete as
      | AutocompleteConfig
      | undefined;

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedVariantKey = resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant,
      FALLBACK_AUTOCOMPLETE_CONFIG.variant,
    );

    const resolvedColorKey = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor,
      FALLBACK_AUTOCOMPLETE_CONFIG.color,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_AUTOCOMPLETE_CONFIG.radius,
    );

    const resolvedSizeKey = resolveCascade<FieldSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_AUTOCOMPLETE_CONFIG.size,
    );

    const resolvedPortal = resolveCascade<boolean>(
      portalProp,
      sectionConfig?.portal,
      undefined,
      FALLBACK_AUTOCOMPLETE_CONFIG.portal,
    );

    const resolvedPortalTarget = resolveCascade<HTMLElement | null>(
      portalTargetProp,
      sectionConfig?.portalTarget,
      undefined,
      FALLBACK_AUTOCOMPLETE_CONFIG.portalTarget,
    );

    // ─── 2. State ──────────────────────────────────────────────────────────────

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

    // ─── 3. Floating UI ──────────────────────────────────────────────────────

    const { refs, floatingStyles, context } =
      useSelectFloating<HTMLInputElement>({
        isOpen,
        onOpenChange: setIsOpen,
        disabled,
      });

    const focus = useFocus(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "combobox" });
    const { getReferenceProps, getFloatingProps } = useInteractions([
      focus,
      dismiss,
      role,
    ]);

    // ─── 4. Handlers ──────────────────────────────────────────────────────────

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
      (option: SelectMenuOption) => {
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
          variant={resolvedVariantKey}
          radius={resolvedRadiusKey}
          color={resolvedColorKey}
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
          aria-autocomplete="none"
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
          menuProps={menu}
          menuConfig={sectionConfig?.menu}
          initialFocus={-1}
          returnFocus={false}
          portal={resolvedPortal}
          portalTarget={resolvedPortalTarget}
        />
      </div>
    );
  },
);

Autocomplete.displayName = "Autocomplete";
