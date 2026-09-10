/**
 * Select component for AsheeUI.
 * This file provides the main Select component implementation, which renders
 * a dropdown selector with search, label, validation, and configurable styles.
 * It supports both controlled and uncontrolled selection state, integrates
 * with FieldShell for consistent label and validation handling, and uses
 * the Button component as the trigger. Visual tokens resolve through the
 * standard AsheeUI cascade system.
 */
"use client";

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
import type { Color, Variant } from "../../shared";
import { cn } from "../../utils";
import { resolveCascade, resolveRadiusKey } from "../../utils/resolve-token";
import { Button } from "../button/Button";
import { FieldShell } from "../field/FieldShell";
import type { FieldSizeKey, LabelAlign } from "../field/field-config";
import type { InputProps } from "../input/Input";
import { useSelectFloating } from "../select-menu";
import { SelectMenu } from "../select-menu/SelectMenu";
import type {
  MenuConfig,
  SelectMenuOption,
} from "../select-menu/select-menu-config";
import { FALLBACK_SELECT_CONFIG, type SelectConfig } from "./select-config";
import { SELECT_STATUS_BORDER_CLASS } from "./select-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

/**
 * Field-related props that Select inherits from Input.
 * Picked to avoid conflicts with Button-specific props.
 */
type SelectFieldProps = Pick<
  InputProps,
  | "label"
  | "description"
  | "message"
  | "required"
  | "isLoading"
  | "status"
  | "labelAlign"
  | "className"
  | "id"
  | "style"
>;

/**
 * Configuration options for the Select component.
 * Extends field props from Input, and SelectConfig for
 * component-specific options. Uses Button for trigger styling.
 */
export interface SelectProps
  extends SelectFieldProps,
    Omit<SelectConfig, "menu"> {
  /**
   * Available options to select from.
   * Each option must have a label and a unique value.
   */
  options: SelectMenuOption[];

  /**
   * Controlled selected value.
   */
  value?: string | number;

  /**
   * Native change event handler.
   * Receives a synthetic change event.
   */
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  /**
   * Value change handler.
   * Receives the new selected value directly.
   */
  onValueChange?: (value: string | number) => void;

  /**
   * Whether search input is shown in the dropdown.
   *
   * @default false
   */
  isSearch?: boolean;

  /**
   * Placeholder text for the search input.
   *
   * @default "Search options..."
   */
  searchPlaceholder?: string;

  /**
   * Name attribute for the search input.
   *
   * @default "select-search"
   */
  searchInputName?: string;

  /**
   * Initial value for uncontrolled usage.
   */
  initialValue?: string | number;

  /**
   * Content rendered below the options list.
   * Useful for adding "Add new" buttons or status messages.
   */
  belowList?: ReactNode;

  /**
   * Placeholder text shown when no value is selected.
   *
   * @default "Select..."
   */
  placeholder?: string;

  /**
   * Name attribute for the select.
   */
  name?: string;

  /**
   * Content rendered at the start of the button.
   * Typically an icon or adornment.
   */
  startContent?: ReactNode;

  /**
   * Content rendered at the end of the button.
   * Typically an icon, badge, or adornment.
   */
  endContent?: ReactNode;

  /**
   * Whether the select is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Menu configuration overrides including portal, portalTarget, className, and visual styles.
   * All menu-related props should be passed through this object.
   */
  menu?: MenuConfig;
}

/**
 * A dropdown selector with search, label, validation, and configurable styles.
 *
 * Select renders a dropdown that allows selecting a single option from a list.
 * It supports search filtering, controlled and uncontrolled selection state,
 * validation states, custom menu and trigger styles, and start/end content
 * slots. Visual tokens resolve through the standard AsheeUI cascade system.
 *
 * The component uses a Button component as the trigger, which provides
 * consistent button styling and behavior. It integrates with FieldShell for
 * label, description, and message handling, and uses Floating UI for
 * positioning and accessibility.
 *
 * By default, the dropdown menu uses Floating UI's FloatingPortal to render
 * at the document body level. This ensures the menu escapes CSS containment,
 * overflow clipping, and stacking context issues. The portal can be disabled
 * via the `menu.portal` prop or `components.select.menu.portal` in the config
 * if the menu needs to stay within a specific parent container.
 *
 * @param props - Select configuration options.
 * @param props.options - Available options to select from.
 * @param props.value - Controlled selected value.
 * @param props.onChange - Native change event handler.
 * @param props.onValueChange - Value change handler.
 * @param props.label - Field label text.
 * @param props.description - Description text.
 * @param props.message - Validation message.
 * @param props.required - Whether the field is required. Defaults to false.
 * @param props.isLoading - Loading state. Defaults to false.
 * @param props.disabled - Disabled state. Defaults to false.
 * @param props.isSearch - Whether search is enabled. Defaults to false.
 * @param props.searchPlaceholder - Search placeholder. Defaults to "Search options...".
 * @param props.searchInputName - Name attribute for the search input. Defaults to "select-search".
 * @param props.initialValue - Initial value for uncontrolled usage.
 * @param props.belowList - Content below the options list.
 * @param props.placeholder - Placeholder text. Defaults to "Select...".
 * @param props.size - Size of the trigger. Defaults to "md".
 * @param props.radius - Corner rounding. Defaults to "md".
 * @param props.variant - Visual style variant. Defaults to "bordered".
 * @param props.color - Theme accent color. Defaults to "primary".
 * @param props.status - Validation status.
 * @param props.labelAlign - Alignment of the label. Defaults to "left".
 * @param props.startContent - Content at the start of the trigger button.
 * @param props.endContent - Content at the end of the trigger button.
 * @param props.menu - Menu configuration overrides including className, portal, portalTarget, and visual styles.
 * @param props.name - Name attribute for the select.
 * @param props.className - Extra classes for the trigger button.
 * @param props.id - HTML id attribute.
 *
 * @example
 * ```tsx
 * import { Select } from "asheeui";
 * import { useState } from "react";
 *
 * export function Example() {
 *   const [value, setValue] = useState<string | number>("react");
 *
 *   const options = [
 *     { label: "React", value: "react" },
 *     { label: "Vue", value: "vue" },
 *     { label: "Svelte", value: "svelte" },
 *   ];
 *
 *   return (
 *     <Select
 *       options={options}
 *       value={value}
 *       onValueChange={setValue}
 *       label="Select Framework"
 *       placeholder="Choose a framework..."
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With search, validation, and menu configuration
 * <Select
 *   options={fruits}
 *   label="Favorite Fruit"
 *   isSearch
 *   status="error"
 *   message="Please select a fruit"
 *   required
 *   startContent={<FruitIcon />}
 *   menu={{
 *     className: "custom-dropdown",
 *     portal: false,
 *     itemVariant: "solid",
 *     activeItemColor: "success"
 *   }}
 * />
 * ```
 *
 * @see SelectConfig - The configuration type for component defaults.
 * @see Input - The input component that provides field capabilities.
 * @see Button - The button component used as the trigger.
 * @see SelectMenu - The dropdown menu component.
 * @see FieldShell - The wrapper component for label and validation.
 */
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
      className,
      id,
      name,
      menu,
      style,
      startContent,
      endContent,
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.select as SelectConfig | undefined;

    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // ─── Token Resolvers ──────────────────────────────────────────────────

    const resolvedSizeKey = resolveCascade<FieldSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_SELECT_CONFIG.size,
    );

    const resolvedVariantKey = resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant,
      FALLBACK_SELECT_CONFIG.variant,
    );

    const resolvedColorKey = resolveCascade<Color>(
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

    // ─── Class Maps ──────────────────────────────────────────────────────

    const statusClass =
      resolvedStatus !== "default"
        ? SELECT_STATUS_BORDER_CLASS[resolvedStatus]
        : "";

    /**
     * The currently selected option object.
     * Used to display the label in the trigger button.
     */
    const selectedOption = useMemo(
      () => options.find((opt) => opt.value === value),
      [options, value],
    );

    // ─── Floating UI ─────────────────────────────────────────────────────

    const {
      refs,
      context,
      floatingStyles,
      isPositioned,
      getReferenceProps,
      getFloatingProps,
    } = useSelectFloating<HTMLButtonElement>({
      isOpen,
      onOpenChange: setIsOpen,
      disabled,
    });

    // ─── Handlers ────────────────────────────────────────────────────────

    /**
     * Handles option selection from the dropdown.
     * Updates the value, triggers onChange, and closes the dropdown.
     */
    const handleSelectMenuOption = useCallback(
      (option: SelectMenuOption) => {
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

    /**
     * The label displayed in the trigger button.
     * Shows the selected option label, initial value, or placeholder.
     */
    const displayLabel = useMemo(() => {
      if (selectedOption?.label) return selectedOption.label;
      if (initialValue !== undefined) return String(initialValue);
      return placeholder;
    }, [selectedOption, initialValue, placeholder]);

    const selectedValues = useMemo(
      () => (value !== undefined && value !== null ? [value] : []),
      [value],
    );

    // ─── Render ─────────────────────────────────────────────────────────

    const referenceProps = getReferenceProps();

    return (
      <FieldShell
        id={fieldId}
        label={label}
        labelAlign={resolvedLabelAlign}
        description={description}
        descriptionId={description ? `${fieldId}-description` : undefined}
        message={message}
        messageId={message ? `${fieldId}-message` : undefined}
        status={resolvedStatus}
        required={required}
        isLoading={isLoading}>
        <div className="w-full relative inline-block">
          {/* Trigger Button */}
          <Button
            ref={(node) => {
              refs.setReference(node);
              if (typeof ref === "function") ref(node);
              else if (ref)
                (ref as React.RefObject<HTMLButtonElement | null>).current =
                  node;
            }}
            type="button"
            variant={resolvedVariantKey}
            color={resolvedColorKey}
            animate={false}
            size={resolvedSizeKey}
            radius={resolvedRadiusKey}
            isDisabled={disabled}
            isLoading={isLoading}
            fullWidth
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-invalid={resolvedStatus === "error"}
            aria-describedby={
              [description ? `${fieldId}-description` : undefined]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={cn(
              "font-normal text-left justify-between",
              statusClass,
              className,
            )}
            style={style}
            startContent={startContent}
            endContent={
              <>
                {endContent}
                <ChevronDownIcon
                  className={cn(
                    "shrink-0 text-foreground/70 transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </>
            }
            {...referenceProps}>
            <span
              className={cn(
                "truncate",
                selectedOption || initialValue
                  ? "text-foreground"
                  : "text-foreground/70",
              )}>
              {displayLabel}
            </span>
          </Button>

          {/* Floating SelectMenu */}
          <SelectMenu
            isOpen={isOpen}
            context={context}
            floatingStyles={floatingStyles}
            getFloatingProps={getFloatingProps}
            setFloatingRef={refs.setFloating}
            isPositioned={isPositioned}
            options={options}
            selectedValues={selectedValues}
            onSelectMenuOption={handleSelectMenuOption}
            isSearch={isSearch}
            searchPlaceholder={searchPlaceholder}
            searchInputName={searchInputName}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            belowList={belowList}
            menuProps={menu}
            menuConfig={sectionConfig?.menu}
          />
        </div>
      </FieldShell>
    );
  },
);

Select.displayName = "Select";
