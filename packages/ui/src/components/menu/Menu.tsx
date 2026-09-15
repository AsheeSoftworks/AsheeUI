/**
 * Menu component for AsheeUI.
 * This file provides the Menu component, a reusable dropdown menu
 * for selecting options from a list. It supports search filtering, custom
 * option rendering, and configurable styles. The component is used by
 * Dropmenu, MultiSelect, and Autocomplete components as their dropdown
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
  type KeyboardEvent,
  type MutableRefObject,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CheckIcon } from "../../icons/CheckIcon";
import { SearchIcon } from "../../icons/SearchIcon";
import { useAsheeConfig } from "../../libs/context";
import { useBodyScrollLock } from "../../libs/use-body-scroll-lock";
import type { Color, Radius, Size, Variant } from "../../shared";
import { cn } from "../../utils";
import { resolveCascade, resolveRadiusKey } from "../../utils/resolve-token";
import { Button } from "../button/Button";
import { Input } from "../input/Input";
import {
  FALLBACK_MENU_CONFIG,
  type MenuConfig,
  type MenuOption,
} from "./menu-config";
import {
  edgeOptionIndex,
  matchingOptionIndex,
  nextOptionIndex,
} from "./menu-navigation";

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
 * Props for the Menu component.
 */
export interface MenuComponentProps {
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
  options: MenuOption[];

  /**
   * Currently selected values.
   * Used to highlight selected options with a checkmark.
   */
  selectedValues?: (string | number)[];

  /**
   * Callback fired when an option is selected.
   * Receives the selected option object.
   */
  onOptionSelect: (option: MenuOption) => void;

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
   * @default "menu-search"
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
  renderOption?: (option: MenuOption, isSelected: boolean) => ReactNode;

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
   * Index of the option that keyboard navigation treats as current.
   * When omitted, the menu tracks the current option itself.
   */
  activeIndex?: number | null;

  /**
   * Called when the current option changes through keyboard navigation.
   * A consumer that keeps focus in its own trigger uses this to mirror the
   * current option in `aria-activedescendant`.
   */
  onActiveIndexChange?: (index: number | null) => void;

  /**
   * Whether the listbox accepts more than one selection.
   * Exposed as `aria-multiselectable` on the option list.
   *
   * @default false
   */
  isMultiSelectable?: boolean;
}

/**
 * Props for the memoized options list rendered inside Menu.
 * Isolated so Menu's other re-renders (open/close, search typing,
 * the one-time `isPositioned` flip) don't force the entire option list to
 * re-render along with it.
 */
interface MenuOptionsListProps {
  filteredOptions: MenuOption[];
  selectedValues: (string | number)[];
  onOptionSelect: (option: MenuOption) => void;
  renderOption?: (option: MenuOption, isSelected: boolean) => ReactNode;
  itemVariant: Variant;
  itemColor: Color;
  activeItemVariant: Variant;
  activeItemColor: Color;
  radius: Radius;
  size: Size;
  optionRefs: MutableRefObject<Array<HTMLButtonElement | null>>;
  listboxId: string | undefined;
  onOptionFocus: (index: number) => void;
}

/**
 * Identifier of one option inside a menu listbox.
 *
 * The listbox id comes from the floating element, so the identifier a consumer
 * publishes through `aria-activedescendant` and the identifier the option
 * carries are built the same way from the same id.
 *
 * @param listboxId - Id of the option list container.
 * @param index - Position of the option in the rendered list.
 * @returns The option id, or `undefined` when the list has no id yet.
 */
export function menuOptionId(
  listboxId: string | undefined,
  index: number,
): string | undefined {
  return listboxId ? `${listboxId}-option-${index}` : undefined;
}

/**
 * Renders the selectable option list.
 *
 * Kept as a separate memoized component so Menu's positioning wrapper
 * and other state changes (open/close, search, selection) don't re-create
 * every option `Button` even though nothing about the options themselves
 * changed. React.memo lets this subtree bail out unless its own props change.
 */
const MenuOptionsList = memo(function MenuOptionsList({
  filteredOptions,
  selectedValues,
  onOptionSelect,
  renderOption,
  itemVariant,
  itemColor,
  activeItemVariant,
  activeItemColor,
  radius,
  size,
  optionRefs,
  listboxId,
  onOptionFocus,
}: MenuOptionsListProps) {
  const isOptionSelected = (val: string | number) =>
    selectedValues.includes(val);

  if (filteredOptions.length === 0) {
    return (
      <div
        role="status"
        className="px-3 py-4 text-xs text-foreground/70 text-center">
        No options found
      </div>
    );
  }

  return (
    <>
      {filteredOptions.map((option, index) => {
        const selected = isOptionSelected(option.value);

        if (renderOption) {
          return renderOption(option, selected);
        }

        return (
          <Button
            key={String(option.value)}
            ref={(node) => {
              optionRefs.current[index] = node;
            }}
            id={menuOptionId(listboxId, index)}
            role="option"
            aria-selected={selected}
            aria-disabled={option.disabled ? true : undefined}
            onFocus={() => onOptionFocus(index)}
            variant={selected ? activeItemVariant : itemVariant}
            color={selected ? activeItemColor : itemColor}
            radius={radius}
            size={size}
            isDisabled={option.disabled}
            onClick={() => onOptionSelect(option)}
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
 * Menu renders a floating dropdown with search, option list, and
 * selection state management. It is designed to be used as the dropdown
 * implementation for Dropmenu, MultiSelect, and Autocomplete components.
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
 * @param props - Menu configuration options.
 * @param props.isOpen - Whether the menu is open.
 * @param props.context - Floating UI context.
 * @param props.getFloatingProps - Props getter for the floating element.
 * @param props.setFloatingRef - Ref setter for the floating element.
 * @param props.isPositioned - Whether the floating element has been positioned by Floating UI. Defaults to true.
 * @param props.options - Available options to display.
 * @param props.selectedValues - Currently selected values.
 * @param props.onOptionSelect - Callback fired when an option is selected.
 * @param props.isSearch - Whether search is enabled. Defaults to true.
 * @param props.searchPlaceholder - Search placeholder. Defaults to "Search...".
 * @param props.searchInputName - Name attribute for the search input. Defaults to "menu-search".
 * @param props.searchQuery - Controlled search query value.
 * @param props.onSearchChange - Callback fired when the search query changes.
 * @param props.belowList - Content below the options list.
 * @param props.menuConfig - Configuration for menu items.
 * @param props.menuProps - Props override for menu configuration. Includes className, portal, portalTarget, and visual styles.
 * @param props.renderOption - Custom render function for options.
 * @param props.initialFocus - Initial focus target for the FloatingFocusManager.
 * @param props.returnFocus - Whether to return focus to the trigger after closing. Defaults to false.
 * @param props.activeIndex - Index the menu treats as the current option. Defaults to the menu tracking it itself.
 * @param props.onActiveIndexChange - Called when the current option changes through keyboard navigation.
 * @param props.isMultiSelectable - Whether the option list accepts more than one selection. Defaults to false.
 *
 * @example
 * ```tsx
 * const { refs, context } = useFloating(...);
 *
 * <Menu
 *   isOpen={isOpen}
 *   context={context}
 *   getFloatingProps={getFloatingProps}
 *   setFloatingRef={refs.setFloating}
 *   options={options}
 *   selectedValues={selectedValues}
 *   onOptionSelect={handleSelect}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom menu configuration
 * <Menu
 *   isOpen={isOpen}
 *   context={context}
 *   getFloatingProps={getFloatingProps}
 *   setFloatingRef={refs.setFloating}
 *   options={options}
 *   selectedValues={selectedValues}
 *   onOptionSelect={handleSelect}
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
export const Menu = ({
  isOpen,
  floatingStyles,
  context,
  getFloatingProps,
  setFloatingRef,
  isPositioned = true,
  options = [],
  selectedValues = [],
  onOptionSelect,
  isSearch = true,
  searchPlaceholder = "Search...",
  searchInputName = "menu-search",
  searchQuery,
  onSearchChange,
  belowList,
  menuConfig,
  menuProps = {},
  renderOption,
  initialFocus,
  returnFocus,
  activeIndex: activeIndexProp,
  onActiveIndexChange,
  isMultiSelectable = false,
}: MenuComponentProps) => {
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
    FALLBACK_MENU_CONFIG.lockScroll,
  );

  // Resolve portal configuration
  const resolvedPortal = resolveCascade<boolean>(
    menuProps?.portal,
    menuConfig?.portal,
    undefined,
    FALLBACK_MENU_CONFIG.portal,
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

  // Scroll Lock. The lock lives in the shared overlay mechanism so that a
  // dropdown opened on top of another overlay joins that overlay's lock,
  // instead of capturing and restoring the body styles on its own.
  useBodyScrollLock(isOpen && resolvedLockScroll);

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

  // Current option and keyboard navigation. The current option is the option
  // arrow keys act on; it is separate from the selection, and a consumer that
  // keeps focus in its own trigger mirrors it through
  // `aria-activedescendant`.

  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listNodeRef = useRef<HTMLDivElement | null>(null);
  const typeaheadBuffer = useRef("");
  const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [internalActiveIndex, setInternalActiveIndex] = useState<number | null>(
    null,
  );

  /**
   * The option list container is also the floating element, so the ref the
   * parent supplied for positioning and the ref used to decide whether focus
   * is inside the list are attached to the same node.
   */
  const setListNode = useCallback(
    (node: HTMLDivElement | null) => {
      listNodeRef.current = node;
      setFloatingRef(node);
    },
    [setFloatingRef],
  );

  const trackedActiveIndex =
    activeIndexProp !== undefined ? activeIndexProp : internalActiveIndex;

  // An index left over from a longer list must not point at a different option
  // once the search query has narrowed the list.
  const currentIndex =
    trackedActiveIndex !== null &&
    trackedActiveIndex >= 0 &&
    trackedActiveIndex < filteredOptions.length
      ? trackedActiveIndex
      : null;

  const setCurrentIndex = useCallback(
    (index: number | null) => {
      setInternalActiveIndex(index);
      onActiveIndexChange?.(index);
    },
    [onActiveIndexChange],
  );

  /**
   * Keeps the current option and the focused option the same option.
   *
   * Focus can arrive on an option without a key press (the list takes focus
   * when it opens, or a pointer hovers and focuses an option), and arrow keys
   * must continue from wherever focus is.
   */
  const handleOptionFocus = useCallback(
    (index: number) => {
      setCurrentIndex(index);
    },
    [setCurrentIndex],
  );

  /**
   * Moves focus together with the current option, but only while focus is
   * already inside the list. A consumer that keeps focus in its trigger reads
   * the current option from `aria-activedescendant`, so focus must stay there.
   */
  const focusCurrentOption = useCallback((index: number) => {
    const node = optionRefs.current[index];
    if (node && listNodeRef.current?.contains(document.activeElement)) {
      node.focus();
    }
  }, []);

  /**
   * Makes an option the current one, and moves focus with it while focus is
   * already inside the list.
   */
  const applyCurrentIndex = useCallback(
    (index: number | null) => {
      if (index === null) return;

      setCurrentIndex(index);
      focusCurrentOption(index);
    },
    [focusCurrentOption, setCurrentIndex],
  );

  const moveCurrent = useCallback(
    (delta: number) => {
      applyCurrentIndex(nextOptionIndex(filteredOptions, currentIndex, delta));
    },
    [applyCurrentIndex, currentIndex, filteredOptions],
  );

  const moveCurrentToEdge = useCallback(
    (edge: "first" | "last") => {
      applyCurrentIndex(edgeOptionIndex(filteredOptions, edge));
    },
    [applyCurrentIndex, filteredOptions],
  );

  const runTypeahead = useCallback(
    (key: string) => {
      typeaheadBuffer.current += key;

      applyCurrentIndex(
        matchingOptionIndex(filteredOptions, typeaheadBuffer.current),
      );

      if (typeaheadTimer.current) clearTimeout(typeaheadTimer.current);
      typeaheadTimer.current = setTimeout(() => {
        typeaheadBuffer.current = "";
      }, 500);
    },
    [applyCurrentIndex, filteredOptions],
  );

  useEffect(() => {
    return () => {
      if (typeaheadTimer.current) clearTimeout(typeaheadTimer.current);
    };
  }, []);

  /**
   * Keyboard interaction for the option list (defect register D-26).
   *
   * Arrow keys move the current option and wrap around, Home and End jump to
   * the list edges, and typed characters match an option by its label.
   * Keys typed into the search field belong to the search field, except for
   * the arrow keys that move into the list.
   */
  const handleListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const isTypingField =
      target.tagName === "INPUT" || target.tagName === "TEXTAREA";

    if (isTypingField && event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveCurrent(1);
        return;
      case "ArrowUp":
        event.preventDefault();
        moveCurrent(-1);
        return;
      case "Home":
        event.preventDefault();
        moveCurrentToEdge("first");
        return;
      case "End":
        event.preventDefault();
        moveCurrentToEdge("last");
        return;
      default:
        if (
          !isTypingField &&
          event.key.length === 1 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.altKey
        ) {
          runTypeahead(event.key);
        }
    }
  };

  // ─── 4. Resolve Visual Config Values ────────────────────────────────────

  const resolvedItemVariant = resolveCascade<Variant>(
    menuProps?.itemVariant,
    menuConfig?.itemVariant,
    undefined,
    FALLBACK_MENU_CONFIG.itemVariant,
  );

  const resolvedItemColor = resolveCascade<Color>(
    menuProps?.itemColor,
    menuConfig?.itemColor,
    config.defaultColor,
    FALLBACK_MENU_CONFIG.itemColor,
  );

  const resolvedActiveVariant = resolveCascade<Variant>(
    menuProps?.activeItemVariant,
    menuConfig?.activeItemVariant,
    config.defaultVariant,
    FALLBACK_MENU_CONFIG.activeItemVariant,
  );

  const resolvedActiveColor = resolveCascade<Color>(
    menuProps?.activeItemColor,
    menuConfig?.activeItemColor,
    config.defaultColor,
    FALLBACK_MENU_CONFIG.activeItemColor,
  );

  const resolvedRadiusKey = resolveRadiusKey(
    menuProps?.radius,
    menuConfig?.radius,
    config.defaultRadius,
    FALLBACK_MENU_CONFIG.radius,
  );

  const resolvedSize = resolveCascade<Size>(
    menuProps?.size,
    menuConfig?.size,
    undefined,
    FALLBACK_MENU_CONFIG.size,
  );

  // The list keyboard handler is chained with the dismissal handler that the
  // interaction hooks contribute, so Escape still closes the dropdown.
  const floatingProps = getFloatingProps({ onKeyDown: handleListKeyDown });
  const listboxId =
    typeof floatingProps.id === "string" ? floatingProps.id : undefined;

  if (!isOpen) return null;

  const menuContent = (
    <FloatingFocusManager
      context={context}
      modal={false}
      initialFocus={initialFocus}
      returnFocus={returnFocus}>
      <div
        ref={setListNode}
        style={{ ...floatingStyles }}
        className={cn(
          // z-index is applied through `floatingStyles`, derived from the
          // trigger's stacking context by the shared `useMenuFloating` hook.
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
        // The option list is always a listbox. The interaction hook supplies
        // the same role; stating it here keeps the list markup self-describing.
        role="listbox"
        aria-multiselectable={isMultiSelectable ? true : undefined}
        {...floatingProps}>
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
        <MenuOptionsList
          filteredOptions={filteredOptions}
          selectedValues={selectedValues}
          onOptionSelect={onOptionSelect}
          renderOption={renderOption}
          itemVariant={resolvedItemVariant}
          itemColor={resolvedItemColor}
          activeItemVariant={resolvedActiveVariant}
          activeItemColor={resolvedActiveColor}
          radius={resolvedRadiusKey}
          size={resolvedSize}
          optionRefs={optionRefs}
          listboxId={listboxId}
          onOptionFocus={handleOptionFocus}
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

Menu.displayName = "Menu";
