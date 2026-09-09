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
import {
  type ChangeEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  type MenuConfig,
  type SelectMenuOption,
} from "./select-menu-config";

/**
 * Menu props that extend MenuConfig with className.
 * Used for menu configuration overrides.
 */
export type MenuProps = MenuConfig & {
  /**
   * Extra CSS classes for the menu container.
   */
  className?: string;
};

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
  options: SelectMenuOption[];

  /**
   * Currently selected values.
   * Used to highlight selected options with a checkmark.
   */
  selectedValues?: (string | number)[];

  /**
   * Callback fired when an option is selected.
   * Receives the selected option object.
   */
  onSelectMenuOption: (option: SelectMenuOption) => void;

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
   * Configuration for menu items from the parent component.
   */
  menuConfig?: MenuConfig;

  /**
   * Props override for menu configuration.
   * Includes className, portal, portalTarget, and visual style options.
   */
  menuProps?: MenuProps;

  /**
   * Custom render function for each option.
   * Receives the option and a boolean indicating if it's selected.
   */
  renderOption?: (option: SelectMenuOption, isSelected: boolean) => ReactNode;

  /**
   * Initial focus target for the FloatingFocusManager.
   */
  initialFocus?: number | React.RefObject<HTMLElement>;

  /**
   * Whether to return focus to the trigger after closing.
   * @default false
   */
  returnFocus?: boolean;
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
 * the `menuProps.portal` prop if the menu needs to stay within a specific
 * parent container. This is typically controlled by the parent component.
 *
 * @param props - SelectMenu configuration options.
 * @param props.isOpen - Whether the menu is open.
 * @param props.context - Floating UI context.
 * @param props.floatingStyles - CSS styles for positioning.
 * @param props.getFloatingProps - Props getter for the floating element.
 * @param props.setFloatingRef - Ref setter for the floating element.
 * @param props.options - Available options to display.
 * @param props.selectedValues - Currently selected values.
 * @param props.onSelectMenuOption - Callback fired when an option is selected.
 * @param props.isSearch - Whether search is enabled. Defaults to true.
 * @param props.searchPlaceholder - Search placeholder. Defaults to "Search...".
 * @param props.searchInputName - Name attribute for the search input. Defaults to "select-menu-search".
 * @param props.searchQuery - Controlled search query value.
 * @param props.onSearchChange - Callback fired when the search query changes.
 * @param props.belowList - Content below the options list.
 * @param props.menuConfig - Configuration for menu items.
 * @param props.menuProps - Props override for menu configuration. Includes className, portal, portalTarget, and visual styles.
 * @param props.renderOption - Custom render function for options.
 * @param props.initialFocus - Initial focus target for the FloatingFocusManager.
 * @param props.returnFocus - Whether to return focus to the trigger after closing. Defaults to false.
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
 *   onSelectMenuOption={handleSelect}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom menu configuration
 * <SelectMenu
 *   isOpen={isOpen}
 *   context={context}
 *   floatingStyles={floatingStyles}
 *   getFloatingProps={getFloatingProps}
 *   setFloatingRef={refs.setFloating}
 *   options={options}
 *   selectedValues={selectedValues}
 *   onSelectMenuOption={handleSelect}
 *   menuProps={{
 *     className: "custom-dropdown",
 *     portal: false,
 *     itemVariant: "solid",
 *     activeItemColor: "success"
 *   }}
 * />
 * ```
 *
 * @see MenuConfig - The configuration type for menu items.
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
  onSelectMenuOption,
  isSearch = true,
  searchPlaceholder = "Search...",
  searchInputName = "select-menu-search",
  searchQuery,
  onSearchChange,
  belowList,
  menuConfig,
  menuProps = {},
  renderOption,
  initialFocus,
  returnFocus,
}: SelectMenuProps) => {
  const config = useAsheeConfig();
  const [internalQuery, setInternalQuery] = useState("");

  /**
   * The active search query value.
   * Uses controlled searchQuery if provided, otherwise internal state.
   */
  const activeQuery = searchQuery ?? internalQuery;

  /**
   * Handles search query changes.
   * Calls onSearchChange if provided, otherwise updates internal state.
   */
  const handleQueryChange = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setInternalQuery(val);
    }
  };

  // ─── 1. Resolve Config Values ───────────────────────────────────────────

  const resolvedLockScroll = resolveCascade<boolean>(
    menuProps?.lockScroll,
    menuConfig?.lockScroll,
    undefined,
    FALLBACK_SELECT_MENU_CONFIG.lockScroll,
  );

  // Resolve portal configuration
  const resolvedPortal = resolveCascade<boolean>(
    menuProps?.portal,
    menuConfig?.portal,
    undefined,
    FALLBACK_SELECT_MENU_CONFIG.portal,
  );

  // Resolve portal target configuration
  // Note: portalTarget doesn't have a fallback value since it's a DOM element
  // We'll use a default of document.body if not provided
  const resolvedPortalTarget = resolveCascade<HTMLElement | null>(
    menuProps?.portalTarget,
    menuConfig?.portalTarget,
    undefined,
    typeof document !== "undefined" ? document.body : null,
  );

  // ─── 2. Scroll Lock ──────────────────────────────────────────────────────

  // Lock body scroll when the dropdown is open
  useEffect(() => {
    if (!isOpen || !resolvedLockScroll) return;

    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = originalWidth;
    };
  }, [isOpen, resolvedLockScroll]);

  // ─── 3. Filter Options ──────────────────────────────────────────────────

  /**
   * Filters options based on the search query.
   * Returns all options if search is disabled or query is empty.
   */
  const filteredOptions = useMemo(() => {
    if (!isSearch || !activeQuery.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(activeQuery.toLowerCase()),
    );
  }, [options, isSearch, activeQuery]);

  /**
   * Checks if a value is currently selected.
   */
  const isOptionSelected = (val: string | number) =>
    selectedValues.includes(val);

  // ─── 4. Resolve Visual Config Values ────────────────────────────────────

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

  if (!isOpen) return null;

  const menuContent = (
    <FloatingFocusManager
      context={context}
      modal={false}
      initialFocus={initialFocus}
      returnFocus={returnFocus}>
      <div
        ref={setFloatingRef}
        style={{ ...floatingStyles }}
        className={cn(
          "z-100 w-full outline-none max-h-60 shadow-xl bg-background border border-border p-1 flex flex-col gap-0.5 overflow-y-auto scrollable-hidden",
          "animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150 ease-out",
          menuProps?.className,
        )}
        {...getFloatingProps()}>
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
                variant={selected ? resolvedActiveVariant : resolvedItemVariant}
                color={selected ? resolvedActiveColor : resolvedItemColor}
                radius={resolvedRadiusKey}
                size={resolvedSize}
                isDisabled={option.disabled}
                onClick={() => onSelectMenuOption(option)}
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
    </FloatingFocusManager>
  );

  // Render with or without portal based on resolved portal and portalTarget
  if (resolvedPortal && resolvedPortalTarget) {
    return createPortal(menuContent, resolvedPortalTarget);
  }

  return menuContent;
};

SelectMenu.displayName = "SelectMenu";
