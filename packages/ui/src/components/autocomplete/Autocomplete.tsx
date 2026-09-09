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
import { type SelectMenuOption, useSelectFloating } from "../select-menu";
import { type MenuProps, SelectMenu } from "../select-menu/SelectMenu";
import {
  type AutocompleteConfig,
  FALLBACK_AUTOCOMPLETE_CONFIG,
} from "./autocomplete-config";

// ─── Component Interface ──────────────────────────────────────────────────────

/**
 * Configuration options for the Autocomplete component.
 * Extends InputProps to inherit all input field capabilities including
 * label, description, validation, and content slots.
 */
export interface AutocompleteProps
  extends Omit<InputProps, "value" | "onChange" | "children">,
    Omit<AutocompleteConfig, "menu"> {
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
   * Menu configuration overrides including portal, portalTarget, className, and visual styles.
   * All menu-related props should be passed through this object.
   */
  menu?: MenuProps;
}

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
 * `menu.portal` prop or `components.autocomplete.menu.portal` in the config
 * if the menu needs to stay within a specific parent container.
 *
 * @param props - Autocomplete configuration options and input props.
 * @param props.options - Suggestion list. Defaults to [].
 * @param props.value - Controlled selected value.
 * @param props.onValueChange - Selection callback.
 * @param props.onInputChange - Raw input change callback.
 * @param props.allowCustomValue - Allow free-form values. Defaults to false.
 * @param props.belowList - Content below the options list.
 * @param props.menu - Menu configuration overrides including className, portal, portalTarget, and visual styles.
 * @param props.variant - Visual style variant. Defaults to "bordered".
 * @param props.color - Theme accent color. Defaults to "primary".
 * @param props.radius - Corner rounding. Defaults to "md".
 * @param props.size - Size of the input. Defaults to "md".
 * @param props.disabled - Whether the input is disabled.
 * @param props.placeholder - Placeholder text. Defaults to "Type to search...".
 * @param props.className - Extra classes for the input.
 * @param props.label - Label text for the input.
 * @param props.description - Description text.
 * @param props.message - Validation message.
 * @param props.required - Whether the field is required. Defaults to false.
 * @param props.status - Validation status.
 * @param props.startContent - Content at the start of the input.
 * @param props.endContent - Content at the end of the input.
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
 *       label="Framework"
 *       description="Choose your preferred framework"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With free-form values, custom content, and menu configuration
 * <Autocomplete
 *   allowCustomValue
 *   options={fruits}
 *   onValueChange={(value) => console.log('Selected:', value)}
 *   placeholder="Type a fruit name..."
 *   belowList={<button onClick={addNew}>Add new fruit</button>}
 *   isClearable
 *   menu={{
 *     className: "custom-dropdown",
 *     portal: false,
 *     itemVariant: "solid"
 *   }}
 * />
 * ```
 *
 * @see AutocompleteConfig - The configuration type for component defaults.
 * @see Input - The underlying input component for the trigger.
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
      ...inputProps
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.autocomplete as
      | AutocompleteConfig
      | undefined;

    // ─── Token Resolvers ──────────────────────────────────────────────────

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

    // ─── State ──────────────────────────────────────────────────────────────

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

    // ─── Floating UI ─────────────────────────────────────────────────────

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

    // ─── Handlers ────────────────────────────────────────────────────────

    // Filter options dynamically as user types
    const filteredOptions = useMemo(() => {
      if (!inputValue.trim()) return options;
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }, [options, inputValue]);

    /**
     * Handles input changes and updates the search query.
     * Opens the dropdown and optionally emits custom values.
     */
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

    /**
     * Handles option selection from the dropdown.
     * Updates the input value and closes the dropdown.
     */
    const handleSelectMenuOption = useCallback(
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
          onSelectMenuOption={handleSelectMenuOption}
          isSearch={false}
          belowList={belowList}
          menuProps={menu}
          menuConfig={sectionConfig?.menu}
          initialFocus={-1}
          returnFocus={false}
        />
      </div>
    );
  },
);

Autocomplete.displayName = "Autocomplete";
