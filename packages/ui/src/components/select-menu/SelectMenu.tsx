/**
 * SelectMenu component for AsheeUI.
 * This file provides the SelectMenu component, a reusable dropdown menu
 * for selecting options from a list. It supports search filtering, custom
 * option rendering, and configurable styles. The component is used by
 * Select, MultiSelect, and Autocomplete components as their dropdown
 * implementation.
 */
"use client";

import {
  type FloatingContext,
  FloatingFocusManager,
  FloatingPortal,
} from "@floating-ui/react";
import {
  type ChangeEvent,
  memo,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CheckIcon } from "../../icons/CheckIcon";
import { SearchIcon } from "../../icons/SearchIcon";
import { useAsheeConfig } from "../../libs/context";
import type { Color, Radius, Size, Variant } from "../../shared";
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
   * CSS styles for positioning from Floating UI.
   */
  floatingStyles: React.CSSProperties;

  /**
   * Floating UI context from the parent component.
   */
  context: FloatingContext;

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
   * Whether the floating element has completed its first position update.
   * When false, the menu stays in the DOM (so Floating UI can measure it)
   * but is hidden (`invisible opacity-0 pointer-events-none`), preventing a
   * visible flash at its initial (0, 0) coordinate. The enter animation
   * classes are only applied once this is true so the reveal and animation
   * start together.
   *
   * @default true
   */
  isPositioned?: boolean;

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
 * Props for the memoized options list rendered inside SelectMenu.
 * Isolated so SelectMenu's other re-renders (open/close, search typing,
 * the one-time `isPositioned` flip) don't force the entire option list to
 * re-render along with it.
 */
interface SelectMenuOptionsListProps {
  filteredOptions: SelectMenuOption[];
  selectedValues: (string | number)[];
  onSelectMenuOption: (option: SelectMenuOption) => void;
  renderOption?: (option: SelectMenuOption, isSelected: boolean) => ReactNode;
  itemVariant: Variant;
  itemColor: Color;
  activeItemVariant: Variant;
  activeItemColor: Color;
  radius: Radius;
  size: Size;
}

/**
 * Renders the selectable option list.
 *
 * Kept as a separate memoized component so SelectMenu's positioning wrapper
 * and other state changes (open/close, search, selection) don't re-create
 * every option `Button` even though nothing about the options themselves
 * changed. React.memo lets this subtree bail out unless its own props change.
 */
const SelectMenuOptionsList = memo(function SelectMenuOptionsList({
  filteredOptions,
  selectedValues,
  onSelectMenuOption,
  renderOption,
  itemVariant,
  itemColor,
  activeItemVariant,
  activeItemColor,
  radius,
  size,
}: SelectMenuOptionsListProps) {
  const isOptionSelected = (val: string | number) =>
    selectedValues.includes(val);

  if (filteredOptions.length === 0) {
    return (
      <div className="px-3 py-4 text-xs text-foreground/70 text-center">
        No options found
      </div>
    );
  }

  return (
    <>
      {filteredOptions.map((option) => {
        const selected = isOptionSelected(option.value);

        if (renderOption) {
          return renderOption(option, selected);
        }

        return (
          <Button
            key={String(option.value)}
            variant={selected ? activeItemVariant : itemVariant}
            color={selected ? activeItemColor : itemColor}
            radius={radius}
            size={size}
            isDisabled={option.disabled}
            onClick={() => onSelectMenuOption(option)}
            className="w-full justify-between font-normal text-left transition-colors truncate">
            <span>{option.label}</span>
            {selected && <CheckIcon className="w-3.5 h-3.5 shrink-0 ml-2" />}
          </Button>
        );
      })}
    </>
  );
});

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
 * By default, the menu uses Floating UI's FloatingPortal to render at the
 * document body level. This ensures the menu escapes CSS containment, overflow
 * clipping, and stacking context issues. The portal can be disabled via
 * the `menuProps.portal` prop if the menu needs to stay within a specific
 * parent container. This is typically controlled by the parent component.
 *
 * @param props - SelectMenu configuration options.
 * @param props.isOpen - Whether the menu is open.
 * @param props.context - Floating UI context.
 * @param props.getFloatingProps - Props getter for the floating element.
 * @param props.setFloatingRef - Ref setter for the floating element.
 * @param props.isPositioned - Whether the floating element has been positioned by Floating UI. Defaults to true.
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
 * const { refs, context } = useFloating(...);
 *
 * <SelectMenu
 *   isOpen={isOpen}
 *   context={context}
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
  floatingStyles,
  context,
  getFloatingProps,
  setFloatingRef,
  isPositioned = true,
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

  // Lock body scroll when the dropdown is open.
  useEffect(() => {
    if (!isOpen || !resolvedLockScroll) return;

    // Capture the current scroll offset before locking. Setting
    // `position: fixed` on <body> makes it ignore the page's scroll
    // position entirely — without compensating with `top: -scrollY`, the
    // page visually snaps to the very top the instant the lock applies.
    // That jump moves the trigger button out from under the menu (which
    // was already positioned based on its pre-lock location), and since
    // the jump isn't a real scroll/resize event, Floating UI's autoUpdate
    // never notices to reposition — leaving the menu visibly detached
    // from a now off-screen trigger.
    const scrollY = window.scrollY;

    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalLeft = document.body.style.left;
    const originalRight = document.body.style.right;
    const originalWidth = document.body.style.width;
    const originalOverflow = document.body.style.overflow;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.left = originalLeft;
      document.body.style.right = originalRight;
      document.body.style.width = originalWidth;
      document.body.style.overflow = originalOverflow;

      // Restore the actual scroll position. Simply clearing the styles
      // above leaves the browser at scrollY 0 (where the fixed-position
      // trick visually left it) — this scrolls back to where the user
      // actually was.
      window.scrollTo(0, scrollY);
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
          // z-index is applied through `floatingStyles`, derived from the
          // trigger's stacking context by the shared `useSelectFloating` hook.
          "w-full outline-none max-h-60 shadow-xl bg-background border border-border p-1 flex flex-col gap-0.5 overflow-y-auto scrollable-hidden",
          // Explicitly disable transitions on the floating element. Floating UI
          // positions this node via a `transform` written on every scroll tick
          // (through floatingStyles). If any transition — global, inherited, or
          // otherwise — applies to `transform` on this element, the browser eases
          // toward each new position instead of snapping to it, which compounds
          // under rapid scroll ticks into a visible spring/bounce effect that
          // worsens with scroll speed. transition-none guarantees position
          // updates apply instantly.
          "transition-none",
          isPositioned
            ? "animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150 ease-out"
            : "invisible opacity-0 pointer-events-none",
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
        <SelectMenuOptionsList
          filteredOptions={filteredOptions}
          selectedValues={selectedValues}
          onSelectMenuOption={onSelectMenuOption}
          renderOption={renderOption}
          itemVariant={resolvedItemVariant}
          itemColor={resolvedItemColor}
          activeItemVariant={resolvedActiveVariant}
          activeItemColor={resolvedActiveColor}
          radius={resolvedRadiusKey}
          size={resolvedSize}
        />

        {belowList && (
          <div className="border-t border-border pt-1 mt-1">{belowList}</div>
        )}
      </div>
    </FloatingFocusManager>
  );

  // Render in a FloatingPortal when enabled. FloatingPortal accepts a null
  // `root` and falls back to creating its own body-level node.
  if (resolvedPortal) {
    return (
      <FloatingPortal root={resolvedPortalTarget}>{menuContent}</FloatingPortal>
    );
  }

  return menuContent;
};

SelectMenu.displayName = "SelectMenu";
