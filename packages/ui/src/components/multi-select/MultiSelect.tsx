/**
 * MultiSelect component for AsheeUI.
 * This file provides the main MultiSelect component implementation, which
 * renders a multi-select dropdown with search, selected value chips, and
 * configurable menu and chip styles. It supports both controlled and
 * uncontrolled selection state, validation states, and the standard
 * AsheeUI cascade for visual tokens.
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
import { CloseIcon } from "../../icons/CloseIcon";
import { useAsheeConfig } from "../../libs/context";
import type { Color, Size, Variant } from "../../shared";
import { RADIUS_CLASS } from "../../shared";
import { cn } from "../../utils";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { Button } from "../button/Button";
import { Chip } from "../chip/Chip";
import { FieldShell } from "../field/FieldShell";
import type { FieldSizeKey, LabelAlign } from "../field/field-config";
import type { InputProps } from "../input/Input";
import type { MenuConfig } from "../select-menu";
import { type SelectMenuOption, useSelectFloating } from "../select-menu";
import { type MenuProps, SelectMenu } from "../select-menu/SelectMenu";
import {
  FALLBACK_MULTI_SELECT_CONFIG,
  type MultiSelectConfig,
} from "./multi-select-config";
import {
  MULTI_SELECT_FONT_CLASS,
  MULTI_SELECT_HEIGHT_CLASS,
  MULTI_SELECT_PADDING_CLASS,
  STATUS_BORDER_CLASS,
} from "./multi-select-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

/**
 * Field-related props that MultiSelect inherits from Input.
 * Picked to avoid conflicts with Button-specific props.
 */
type MultiSelectFieldProps = Pick<
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
 * Content-related props from Input.
 */
type MultiSelectContentProps = Pick<InputProps, "startContent" | "endContent">;

/**
 * Configuration options for the MultiSelect component.
 * Extends field and content props from Input, and MultiSelectConfig for
 * component-specific options. Uses Button for trigger styling.
 */
export interface MultiSelectProps
  extends MultiSelectFieldProps,
    MultiSelectContentProps,
    Omit<MultiSelectConfig, "menu"> {
  /**
   * Available options to select from.
   * Each option must have a label and a unique value.
   */
  options: SelectMenuOption[];

  /**
   * Controlled selected values.
   * Array of selected option values.
   */
  value?: (string | number)[];

  /**
   * Callback fired when the selection changes.
   * Receives the updated array of selected values.
   */
  onChange?: (values: (string | number)[]) => void;

  /**
   * Label shown in the trigger when no items are selected.
   *
   * @default "Select Options..."
   */
  InputLabel?: string;

  /**
   * Whether search input is shown in the dropdown.
   *
   * @default true
   */
  isSearch?: boolean;

  /**
   * Placeholder text for the search input.
   *
   * @default "Search..."
   */
  searchPlaceholder?: string;

  /**
   * Name attribute for the search input.
   *
   * @default "multiselect-search"
   */
  searchInputName?: string;

  /**
   * Content rendered below the options list.
   * Useful for adding "Add new" buttons or status messages.
   */
  belowList?: ReactNode;

  /**
   * Custom chip options for legacy or external control.
   * When provided, this overrides the derived chips from value.
   */
  chipOptions?: SelectMenuOption[];

  /**
   * Custom handler for removing a chip.
   * For legacy or external control patterns.
   */
  handleRemoveChip?: (id: string | number) => void;

  /**
   * Custom handler for adding a chip.
   * For legacy or external control patterns.
   */
  handleAddChip?: (item: SelectMenuOption) => void;

  /**
   * Label shown above the chip list.
   */
  chipLabel?: string;

  /**
   * Whether to hide the chip display section.
   *
   * @default false
   */
  disableChipDisplay?: boolean;

  /**
   * Extra classes for the container.
   */
  containerClassName?: string;

  /**
   * Name attribute for the select.
   */
  name?: string;

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
  menu?: MenuProps;
}

/**
 * A multi-select dropdown with search, chips, and configurable styles.
 *
 * MultiSelect renders a dropdown that allows selecting multiple options
 * from a list. Selected options are displayed as chips below the trigger.
 * It supports search filtering, controlled selection state, validation
 * states, custom menu and chip styles, and start/end content slots.
 * Visual tokens resolve through the standard AsheeUI cascade system.
 *
 * The component uses a Button component as the trigger, which provides
 * consistent button styling and behavior. It integrates with FieldShell for
 * label, description, and message handling, and uses Floating UI for
 * positioning and accessibility.
 *
 * By default, the dropdown menu uses Floating UI's FloatingPortal to render
 * at the document body level. This ensures the menu escapes CSS containment,
 * overflow clipping, and stacking context issues. The portal can be disabled
 * via the `menu.portal` prop or `components.multiSelect.menu.portal` in the
 * config if the menu needs to stay within a specific parent container.
 *
 * @param props - MultiSelect configuration options.
 * @param props.options - Available options to select from.
 * @param props.value - Controlled selected values.
 * @param props.onChange - Callback fired when selection changes.
 * @param props.InputLabel - Label shown in trigger. Defaults to "Select Options...".
 * @param props.isSearch - Whether search is enabled. Defaults to true.
 * @param props.searchPlaceholder - Search placeholder. Defaults to "Search...".
 * @param props.searchInputName - Name attribute for the search input. Defaults to "multiselect-search".
 * @param props.belowList - Content below the options list.
 * @param props.chipLabel - Label shown above the chip list.
 * @param props.disableChipDisplay - Hide chip display section. Defaults to false.
 * @param props.label - Field label text.
 * @param props.description - Description text.
 * @param props.message - Validation message.
 * @param props.required - Whether the field is required. Defaults to false.
 * @param props.isLoading - Loading state. Defaults to false.
 * @param props.disabled - Disabled state. Defaults to false.
 * @param props.size - Size of the trigger. Defaults to "md".
 * @param props.radius - Corner rounding. Defaults to "md".
 * @param props.variant - Visual style variant. Defaults to "bordered".
 * @param props.color - Theme accent color. Defaults to "primary".
 * @param props.status - Validation status.
 * @param props.labelAlign - Alignment of the label. Defaults to "left".
 * @param props.startContent - Content at the start of the trigger button.
 * @param props.endContent - Content at the end of the trigger button.
 * @param props.menu - Menu configuration overrides including className, portal, portalTarget, and visual styles.
 * @param props.containerClassName - Extra classes for the container.
 * @param props.chip - Chip configuration overrides including color, size, and radius.
 * @param props.chipOptions - Custom chip options for legacy control.
 * @param props.handleRemoveChip - Custom handler for removing a chip.
 * @param props.handleAddChip - Custom handler for adding a chip.
 * @param props.name - Name attribute for the select.
 *
 * @example
 * ```tsx
 * import { MultiSelect } from "asheeui";
 * import { useState } from "react";
 *
 * export function Example() {
 *   const [values, setValues] = useState<(string | number)[]>([]);
 *
 *   const options = [
 *     { label: "React", value: "react" },
 *     { label: "Vue", value: "vue" },
 *     { label: "Svelte", value: "svelte" },
 *   ];
 *
 *   return (
 *     <MultiSelect
 *       options={options}
 *       value={values}
 *       onChange={setValues}
 *       label="Select Frameworks"
 *       InputLabel="Choose frameworks..."
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom chip colors and menu configuration
 * <MultiSelect
 *   options={fruits}
 *   value={selectedFruits}
 *   onChange={setSelectedFruits}
 *   label="Favorite Fruits"
 *   chip={{ color: "success", size: "sm" }}
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
 * @see MultiSelectConfig - The configuration type for component defaults.
 * @see Input - The input component that provides field capabilities.
 * @see Button - The button component used as the trigger.
 * @see SelectMenu - The dropdown menu component.
 * @see Chip - The chip component for selected items.
 * @see FieldShell - The wrapper component for label and validation.
 */
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
      id,
      className,
      menu,
      chip,
      style,
      startContent,
      endContent,
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.multiSelect;

    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // ─── Token Resolvers ──────────────────────────────────────────────────

    const resolvedSizeKey = resolveCascade<FieldSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_MULTI_SELECT_CONFIG.size,
    );

    const resolvedVariantKey = resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant,
      FALLBACK_MULTI_SELECT_CONFIG.variant,
    );

    const resolvedColorKey = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor,
      FALLBACK_MULTI_SELECT_CONFIG.color,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_MULTI_SELECT_CONFIG.radius,
    );

    // Chip Token Resolvers (chip override bag → component config → resolved tokens)
    const resolvedChipColor = resolveCascade<Color>(
      chip?.color,
      sectionConfig?.chip?.color,
      resolvedColorKey,
      FALLBACK_MULTI_SELECT_CONFIG.chip.color,
    );

    const resolvedChipSize = resolveCascade<Size>(
      chip?.size,
      sectionConfig?.chip?.size,
      undefined,
      FALLBACK_MULTI_SELECT_CONFIG.chip.size,
    );

    const resolvedChipRadiusKey = resolveRadiusKey(
      chip?.radius,
      sectionConfig?.chip?.radius,
      resolvedRadiusKey,
      FALLBACK_MULTI_SELECT_CONFIG.chip.radius,
    );

    const resolvedStatus = status ?? FALLBACK_MULTI_SELECT_CONFIG.status;
    const resolvedStatusColor: Color =
      resolvedStatus === "error"
        ? "danger"
        : resolvedStatus === "success"
          ? "success"
          : resolvedStatus === "warning"
            ? "warning"
            : resolvedColorKey;

    const resolvedLabelAlign = resolveCascade<LabelAlign>(
      labelAlign,
      sectionConfig?.labelAlign,
      undefined,
      FALLBACK_MULTI_SELECT_CONFIG.labelAlign,
    );

    // ─── Class Maps ──────────────────────────────────────────────────────

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
      FALLBACK_MULTI_SELECT_CONFIG.chip.radius,
    );

    // ─── Floating UI ─────────────────────────────────────────────────────

    const { refs, context, isPositioned, floatingStyles } =
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

    // ─── Handlers ────────────────────────────────────────────────────────

    // Controlled or Custom Chip Selection Determination
    const activeChips = useMemo(() => {
      if (chipOptions !== undefined) return chipOptions;
      if (Array.isArray(value)) {
        return options.filter((opt) => value.includes(opt.value));
      }
      return [];
    }, [chipOptions, value, options]);

    /**
     * Checks if an option is currently selected.
     * Used to determine if a chip should be highlighted.
     */
    const isOptionSelected = useCallback(
      (optValue: string | number) => {
        return activeChips.some((chip) => chip.value === optValue);
      },
      [activeChips],
    );

    /**
     * Handles option selection from the dropdown.
     * Toggles the selection state and updates the value.
     */
    const handleSelectMenuOption = useCallback(
      (option: SelectMenuOption) => {
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

    /**
     * Handles removal of a chip.
     * Removes the value from the selection.
     */
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

    const displayLabel = useMemo(() => {
      if (activeChips.length > 0) {
        return `${activeChips.length} selected`;
      }
      return InputLabel;
    }, [activeChips.length, InputLabel]);

    // ─── Render ─────────────────────────────────────────────────────────

    // Get reference props from Floating UI
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
        <div
          className={cn("w-full flex flex-col gap-3", containerClassName)}
          style={style}>
          <div className="relative w-full">
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
              color={resolvedStatusColor}
              size={resolvedSizeKey}
              radius={resolvedRadiusKey}
              isDisabled={disabled}
              isLoading={isLoading}
              fullWidth
              animate={false}
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
                STATUS_BORDER_CLASS[resolvedStatus],
                heightClass,
                paddingClass,
                fontClass,
                className,
              )}
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
                  activeChips.length > 0
                    ? "text-foreground"
                    : "text-foreground/70",
                )}>
                {displayLabel}
              </span>
            </Button>

            {/* Floating SelectMenu */}
            <SelectMenu
              isOpen={isOpen}
              floatingStyles={floatingStyles}
              context={context}
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
              menuConfig={sectionConfig?.menu as MenuConfig | undefined}
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
                      variant="bordered"
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
