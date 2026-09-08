/**
 * Select component for AsheeUI.
 * This file provides the main Select component implementation, which renders
 * a dropdown selector with search, label, validation, and configurable styles.
 * It supports both controlled and uncontrolled selection state, and integrates
 * with the FieldShell for consistent label and validation handling. Visual
 * tokens resolve through the standard AsheeUI cascade system.
 */
"use client";

import {
  useClick,
  useDismiss,
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
import {
  type Color,
  RADIUS_CLASS,
  resolveVariantClass,
  type Variant,
} from "../../shared";
import { cn } from "../../utils";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { FieldShell } from "../field/FieldShell";
import type { FieldSizeKey, LabelAlign } from "../field/field-config";
import { SelectMenu } from "../select-menu/SelectMenu";
import type { SelectMenuOption } from "../select-menu/select-menu-config";
import { useSelectFloating } from "../select-menu";
import { FALLBACK_SELECT_CONFIG, type SelectConfig } from "./select-config";
import { SELECT_SIZE_CLASS, SELECT_STATUS_BORDER_CLASS } from "./select-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

type BaseSelectProps = SelectConfig &
  Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "color" | "size" | "value" | "onChange"
  >;

/**
 * Configuration options for the Select component.
 */
export interface SelectProps extends BaseSelectProps {
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
   * Label text for the field.
   */
  label?: string;

  /**
   * Description text shown below the label.
   */
  description?: string;

  /**
   * Validation message shown below the field.
   */
  message?: string;

  /**
   * Whether the field is required.
   * @default false
   */
  required?: boolean;

  /**
   * Whether the field is in a loading state.
   * @default false
   */
  isLoading?: boolean;

  /**
   * Whether search input is shown in the dropdown.
   * @default false
   */
  isSearch?: boolean;

  /**
   * Placeholder text for the search input.
   * @default "Search options..."
   */
  searchPlaceholder?: string;

  /**
   * Name attribute for the search input.
   * @default "select-search"
   */
  searchInputName?: string;

  /**
   * Initial value for uncontrolled usage.
   */
  initialValue?: string | number;

  /**
   * Content rendered below the options list.
   */
  belowList?: ReactNode;

  /**
   * Placeholder text shown when no value is selected.
   * @default "Select..."
   */
  placeholder?: string;

  /**
   * Extra CSS classes for the trigger button.
   */
  className?: string;

  /**
   * Extra CSS classes for the dropdown.
   */
  dropdownClassName?: string;

  /**
   * Optional ID for the field.
   */
  id?: string;

  /**
   * Name attribute for the select.
   */
  name?: string;
}

// ─── Component Implementation ─────────────────────────────────────────────────

/**
 * A dropdown selector with search, label, validation, and configurable styles.
 *
 * Select renders a dropdown that allows selecting a single option from a list.
 * It supports search filtering, controlled and uncontrolled selection state,
 * validation states, and custom menu and trigger styles. Visual tokens resolve
 * through the standard AsheeUI cascade system.
 *
 * The component uses Floating UI for positioning and accessibility, and
 * integrates with the FieldShell for consistent label and validation handling.
 *
 * By default, the dropdown menu uses React's createPortal to render at the
 * document body level. This ensures the menu escapes CSS containment, overflow
 * clipping, and stacking context issues. The portal can be disabled via the
 * `portal` prop or `components.select.portal` in the config if the menu needs
 * to stay within a specific parent container.
 *
 * @param props - Select configuration options.
 * @param props.options - Available options to select from.
 * @param props.value - Controlled selected value.
 * @param props.onChange - Native change event handler.
 * @param props.onValueChange - Value change handler.
 * @param props.label - Field label text.
 * @param props.description - Description text.
 * @param props.message - Validation message.
 * @param props.required - Whether the field is required.
 * @param props.isLoading - Loading state.
 * @param props.disabled - Disabled state.
 * @param props.isSearch - Whether search is enabled. Defaults to false.
 * @param props.searchPlaceholder - Search placeholder. Defaults to "Search options...".
 * @param props.initialValue - Initial value for uncontrolled usage.
 * @param props.belowList - Content below the options list.
 * @param props.placeholder - Placeholder text. Defaults to "Select...".
 * @param props.size - Size of the trigger. Defaults to "md".
 * @param props.radius - Corner rounding. Defaults to "md".
 * @param props.variant - Visual style variant. Defaults to "bordered".
 * @param props.color - Theme accent color. Defaults to "primary".
 * @param props.status - Validation status.
 * @param props.labelAlign - Alignment of the label. Defaults to "left".
 * @param props.portal - Whether to render the dropdown in a portal. Defaults to true.
 * @param props.portalTarget - Custom portal target element. Defaults to document.body.
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
 * // With search and validation
 * <Select
 *   options={fruits}
 *   label="Favorite Fruit"
 *   isSearch
 *   status="error"
 *   message="Please select a fruit"
 *   required
 * />
 * ```
 *
 * @see SelectConfig - The configuration type for component defaults.
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
      dropdownClassName,
      id,
      name,
      menu,
      portal: portalProp,
      portalTarget: portalTargetProp,
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

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

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

    const resolvedPortal = resolveCascade<boolean>(
      portalProp,
      sectionConfig?.portal,
      undefined,
      FALLBACK_SELECT_CONFIG.portal,
    );

    const resolvedPortalTarget = resolveCascade<HTMLElement | null>(
      portalTargetProp,
      sectionConfig?.portalTarget,
      undefined,
      FALLBACK_SELECT_CONFIG.portalTarget,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const variantClass = resolveVariantClass(
      resolvedVariantKey,
      resolvedColorKey,
    );
    const statusClass =
      resolvedStatus !== "default"
        ? SELECT_STATUS_BORDER_CLASS[resolvedStatus]
        : "";
    const radiusClass =
      resolvedVariantKey === "underlined"
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

    // ─── 3. Floating UI ──────────────────────────────────────────────────────

    const { refs, floatingStyles, context } =
      useSelectFloating<HTMLButtonElement>({
        isOpen,
        onOpenChange: setIsOpen,
        disabled,
      });

    const click = useClick(context, { enabled: !disabled });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "listbox" });
    const { getReferenceProps, getFloatingProps } = useInteractions([
      click,
      dismiss,
      role,
    ]);

    // ─── 4. Handlers ──────────────────────────────────────────────────────────

    const handleSelectOption = useCallback(
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
            menuProps={menu}
            menuConfig={sectionConfig}
            portal={resolvedPortal}
            portalTarget={resolvedPortalTarget}
          />
        </div>
      </FieldShell>
    );
  },
);

Select.displayName = "Select";
