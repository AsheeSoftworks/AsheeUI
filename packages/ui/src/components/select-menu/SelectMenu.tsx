/**
 * SelectMenu component for AsheeUI.
 * This file provides the SelectMenu component, a reusable dropdown menu
 * for selecting options from a list. It supports search filtering, custom
 * option rendering, and configurable styles. The component is used by
 * Select, MultiSelect, and Autocomplete components as their dropdown
 * implementation.
 */
"use client";

import { type FloatingContext, FloatingFocusManager } from "@floating-ui/react";
import { type ChangeEvent, type ReactNode, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { CheckIcon } from "../../icons/CheckIcon";
import { SearchIcon } from "../../icons/SearchIcon";
import { useAsheeConfig } from "../../libs/context";
import type { Color, Size, Variant } from "../../shared";
import { cn } from "../../utils";
import { resolveCascade, resolveRadiusKey } from "../../utils/resolve-token";
import { Button } from "../button/Button";
import { Input } from "../input/Input";
import {
  FALLBACK_SELECT_MENU_CONFIG,
  type SelectMenuConfig,
} from "./select-menu-config";

/**
 * Type alias for a select option.
 * Each option must have a label and a unique value.
 */
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: unknown;
}

/**
 * Props for the SelectMenu component.
 */
export interface SelectMenuProps {
  /**
   * Whether the menu is open.
   */
  isOpen: boolean;

  /**
   * Floating UI context from the parent component.
   */
  context: FloatingContext;

  /**
   * CSS styles for positioning from Floating UI.
   */
  floatingStyles: React.CSSProperties;

  /**
   * Props getter for floating element from Floating UI.
   */
  getFloatingProps: (
    userProps?: Record<string, unknown>,
  ) => Record<string, unknown>;

  /**
   * Ref setter for the floating element.
   */
  setFloatingRef: (node: HTMLElement | null) => void;

  /**
   * Available options to display in the menu.
   */
  options: SelectOption[];

  /**
   * Currently selected values.
   * Used to highlight selected options with a checkmark.
   */
  selectedValues?: (string | number)[];

  /**
   * Callback fired when an option is selected.
   * Receives the selected option object.
   */
  onSelectOption: (option: SelectOption) => void;

  /**
   * Whether search input is shown in the menu.
   * @default true
   */
  isSearch?: boolean;

  /**
   * Placeholder text for the search input.
   * @default "Search..."
   */
  searchPlaceholder?: string;

  /**
   * Name attribute for the search input.
   * @default "select-menu-search"
   */
  searchInputName?: string;

  /**
   * Controlled search query value.
   */
  searchQuery?: string;

  /**
   * Callback fired when the search query changes.
   */
  onSearchChange?: (query: string) => void;

  /**
   * Content rendered below the options list.
   */
  belowList?: ReactNode;

  /**
   * Extra CSS classes for the dropdown.
   */
  dropdownClassName?: string;

  /**
   * Configuration for menu items from the parent component.
   */
  menuConfig?: SelectMenuConfig;

  /**
   * Props override for menu configuration.
   */
  menuProps?: SelectMenuConfig;

  /**
   * Custom render function for each option.
   * Receives the option and a boolean indicating if it's selected.
   */
  renderOption?: (option: SelectOption, isSelected: boolean) => ReactNode;

  /**
   * Initial focus target for the FloatingFocusManager.
   */
  initialFocus?: number | React.RefObject<HTMLElement>;

  /**
   * Whether to return focus to the trigger after closing.
   * @default false
   */
  returnFocus?: boolean;

  /**
   * Whether to render the menu in a React portal.
   * When true, the menu is rendered at the document body level.
   * Defaults to true. This is typically controlled by the parent
   * component (Select, MultiSelect, Autocomplete) via their own
   * config or props.
   */
  portal?: boolean;

  /**
   * Custom portal target element for the menu.
   * When portal is enabled, the menu is rendered into this element.
   * Defaults to document.body.
   */
  portalTarget?: HTMLElement | null;
}

/**
 * A reusable dropdown menu for selecting options from a list.
 *
 * SelectMenu renders a floating dropdown with search, option list, and
 * selection state management. It is designed to be used as the dropdown
 * implementation for Select, MultiSelect, and Autocomplete components.
 *
 * The component uses Floating UI for positioning and accessibility, and
 * supports custom option rendering, search filtering, and configurable
 * item styles through the cascade resolution system.
 *
 * By default, the menu uses React's createPortal to render at the document
 * body level. This ensures the menu escapes CSS containment, overflow
 * clipping, and stacking context issues. The portal can be disabled via
 * the `portal` prop if the menu needs to stay within a specific parent
 * container. This is typically controlled by the parent component.
 *
 * @param props - SelectMenu configuration options.
 * @param props.isOpen - Whether the menu is open.
 * @param props.context - Floating UI context.
 * @param props.floatingStyles - CSS styles for positioning.
 * @param props.getFloatingProps - Props getter for the floating element.
 * @param props.setFloatingRef - Ref setter for the floating element.
 * @param props.options - Available options to display.
 * @param props.selectedValues - Currently selected values.
 * @param props.onSelectOption - Callback fired when an option is selected.
 * @param props.isSearch - Whether search is enabled. Defaults to true.
 * @param props.searchPlaceholder - Search placeholder. Defaults to "Search...".
 * @param props.belowList - Content below the options list.
 * @param props.dropdownClassName - Extra classes for the dropdown.
 * @param props.menuConfig - Configuration for menu items.
 * @param props.menuProps - Props override for menu configuration.
 * @param props.renderOption - Custom render function for options.
 * @param props.portal - Whether to render the menu in a portal. Defaults to true.
 * @param props.portalTarget - Custom portal target element. Defaults to document.body.
 *
 * @example
 * ```tsx
 * const { refs, floatingStyles, context } = useFloating(...);
 *
 * <SelectMenu
 *   isOpen={isOpen}
 *   context={context}
 *   floatingStyles={floatingStyles}
 *   getFloatingProps={getFloatingProps}
 *   setFloatingRef={refs.setFloating}
 *   options={options}
 *   selectedValues={selectedValues}
 *   onSelectOption={handleSelect}
 * />
 * ```
 *
 * @see SelectMenuConfig - The configuration type for menu items.
 * @see Button - The button component used for menu items.
 */
export const SelectMenu = ({
  isOpen,
  context,
  floatingStyles,
  getFloatingProps,
  setFloatingRef,
  options = [],
  selectedValues = [],
  onSelectOption,
  isSearch = true,
  searchPlaceholder = "Search...",
  searchInputName = "select-menu-search",
  searchQuery,
  onSearchChange,
  belowList,
  dropdownClassName,
  menuConfig,
  menuProps,
  renderOption,
  initialFocus,
  returnFocus,
  portal = true,
  portalTarget,
}: SelectMenuProps) => {
  const config = useAsheeConfig();
  const [internalQuery, setInternalQuery] = useState("");

  const activeQuery = searchQuery ?? internalQuery;
  const handleQueryChange = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setInternalQuery(val);
    }
  };

  const filteredOptions = useMemo(() => {
    if (!isSearch || !activeQuery.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(activeQuery.toLowerCase()),
    );
  }, [options, isSearch, activeQuery]);

  const isOptionSelected = (val: string | number) =>
    selectedValues.includes(val);

  // Resolve all config values
  const resolvedItemVariant = resolveCascade<Variant>(
    menuProps?.itemVariant,
    menuConfig?.itemVariant,
    undefined,
    FALLBACK_SELECT_MENU_CONFIG.itemVariant,
  );

  const resolvedItemColor = resolveCascade<Color>(
    menuProps?.itemColor,
    menuConfig?.itemColor,
    config.defaultColor,
    FALLBACK_SELECT_MENU_CONFIG.itemColor,
  );

  const resolvedActiveVariant = resolveCascade<Variant>(
    menuProps?.activeItemVariant,
    menuConfig?.activeItemVariant,
    config.defaultVariant,
    FALLBACK_SELECT_MENU_CONFIG.activeItemVariant,
  );

  const resolvedActiveColor = resolveCascade<Color>(
    menuProps?.activeItemColor,
    menuConfig?.activeItemColor,
    config.defaultColor,
    FALLBACK_SELECT_MENU_CONFIG.activeItemColor,
  );

  const resolvedRadiusKey = resolveRadiusKey(
    menuProps?.radius,
    menuConfig?.radius,
    config.defaultRadius,
    FALLBACK_SELECT_MENU_CONFIG.radius,
  );

  const resolvedSize = resolveCascade<Size>(
    menuProps?.size,
    menuConfig?.size,
    undefined,
    FALLBACK_SELECT_MENU_CONFIG.size,
  );

  // Resolve portal target - use prop > document.body fallback
  const resolvedPortalTarget =
    portalTarget ?? (typeof document !== "undefined" ? document.body : null);

  if (!isOpen) return null;

  const menuContent = (
    <FloatingFocusManager
      context={context}
      modal={false}
      initialFocus={initialFocus}
      returnFocus={returnFocus}>
      <div
        ref={setFloatingRef}
        style={{ ...floatingStyles, zIndex: 999999 }}
        className="w-full outline-none"
        {...getFloatingProps()}>
        <div
          className={cn(
            "max-h-60 shadow-xl bg-background border border-border p-1 flex flex-col gap-0.5 overflow-y-auto scrollbar-hide",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150 ease-out",
            dropdownClassName,
          )}>
          {/* Search Input Bar */}
          {isSearch && (
            <div className="w-full p-1 mb-1 sticky top-0 z-10 border-b border-border">
              <Input
                name={searchInputName}
                type="text"
                variant="bordered"
                radius={resolvedRadiusKey}
                color={resolvedItemColor}
                size={resolvedSize}
                value={activeQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleQueryChange(e.target.value)
                }
                startContent={
                  <SearchIcon className="w-3.5 h-3.5 text-foreground/70" />
                }
                placeholder={searchPlaceholder}
                autoFocus
                className="w-full pl-8 h-8 text-xs bg-secondary/30 border-none focus-visible:ring-0"
              />
            </div>
          )}

          {/* Options List */}
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-4 text-xs text-foreground/70 text-center">
              No options found
            </div>
          ) : (
            filteredOptions.map((option) => {
              const selected = isOptionSelected(option.value);

              if (renderOption) {
                return renderOption(option, selected);
              }

              return (
                <Button
                  key={String(option.value)}
                  variant={
                    selected ? resolvedActiveVariant : resolvedItemVariant
                  }
                  color={selected ? resolvedActiveColor : resolvedItemColor}
                  radius={resolvedRadiusKey}
                  size={resolvedSize}
                  isDisabled={option.disabled}
                  onClick={() => onSelectOption(option)}
                  className="w-full justify-between font-normal text-left transition-colors truncate">
                  <span>{option.label}</span>
                  {selected && (
                    <CheckIcon className="w-3.5 h-3.5 shrink-0 ml-2" />
                  )}
                </Button>
              );
            })
          )}

          {belowList && (
            <div className="border-t border-border pt-1 mt-1">{belowList}</div>
          )}
        </div>
      </div>
    </FloatingFocusManager>
  );

  // Render with or without portal based on portal prop and portalTarget availability
  if (portal && resolvedPortalTarget) {
    return createPortal(menuContent, resolvedPortalTarget);
  }

  return menuContent;
};

SelectMenu.displayName = "SelectMenu";
