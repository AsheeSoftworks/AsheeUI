"use client";

import { type FloatingContext, FloatingFocusManager } from "@floating-ui/react";
import { type ChangeEvent, type ReactNode, useMemo, useState } from "react";
import { CheckIcon } from "../../icons/CheckIcon";
import { SearchIcon } from "../../icons/SearchIcon";
import { RADIUS_CLASS, type Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import type { Color, Variant } from "../../shared/variant";
import { cn } from "../../utils";
import { resolveClassKey } from "../../utils/resolve-token";
import { Button } from "../button/Button";
import { Input } from "../input/Input";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface SelectMenuProps {
  isOpen: boolean;
  context: FloatingContext;
  floatingStyles: React.CSSProperties;
  getFloatingProps: (
    userProps?: Record<string, unknown>,
  ) => Record<string, unknown>;
  setFloatingRef: (node: HTMLElement | null) => void;

  options: SelectOption[];
  selectedValues?: (string | number)[];
  onSelectOption: (option: SelectOption) => void;

  isSearch?: boolean;
  searchPlaceholder?: string;
  searchInputName?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;

  belowList?: ReactNode;
  dropdownClassName?: string;

  variant?: Variant;
  color?: Color;
  size?: Size;
  radius?: Radius;

  renderOption?: (option: SelectOption, isSelected: boolean) => ReactNode;
  initialFocus?: number | React.RefObject<HTMLElement>;
  returnFocus?: boolean;
}

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
  variant = "ghost",
  color = "primary",
  size = "sm",
  radius,
  renderOption,
  initialFocus,
  returnFocus,
}: SelectMenuProps) => {
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

  const menuRadiusClass = resolveClassKey(
    radius === "full" ? "xl" : (radius ?? "md"),
    RADIUS_CLASS,
    "md",
  );

  if (!isOpen) return null;

  return (
    <FloatingFocusManager
      context={context}
      modal={false}
      initialFocus={initialFocus}
      returnFocus={returnFocus}>
      <div
        ref={setFloatingRef}
        style={{ ...floatingStyles, zIndex: 9998 }}
        className="w-full min-w-55 outline-none"
        {...getFloatingProps()}>
        <div
          className={cn(
            "w-full max-h-60 overflow-y-auto shadow-xl bg-background border border-border p-1 flex flex-col gap-0.5 overflow-x-hidden",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150 ease-out",
            menuRadiusClass,
            dropdownClassName,
          )}>
          {/* Search Input Bar */}
          {isSearch && (
            <div className="w-full p-1 mb-1 sticky top-0 z-10 border-b border-border">
              <Input
                name={searchInputName}
                type="text"
                value={activeQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleQueryChange(e.target.value)
                }
                startContent={
                  <SearchIcon className="w-3.5 h-3.5  text-foreground/70" />
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
                  type="button"
                  variant={selected ? variant : "ghost"}
                  color={selected ? color : "secondary"}
                  size={size}
                  isDisabled={option.disabled}
                  onClick={() => onSelectOption(option)}
                  className="w-full justify-between font-normal text-left transition-colors">
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
};

SelectMenu.displayName = "SelectMenu";
