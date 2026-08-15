"use client";

import { useSettings } from "@ashee/settings";
import { cn } from "@ashee/utils";
import { type FloatingContext, FloatingFocusManager } from "@floating-ui/react";
import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion";
import { type ReactNode, useMemo, useState } from "react";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import type { Color, Variant } from "../../../shared/variant";
import { CheckIcon } from "../../icons/CheckIcon";
import { SearchIcon } from "../../icons/SearchIcon";
import { Button } from "../../primitive/button/Button";
import type { ButtonSizeKey } from "../../primitive/button/button-config";
import { Input } from "../../primitive/input/Input";

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
  size?: ButtonSizeKey;
  radius?: string | number;
  animation?: AnimationProp;

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
  animation,
  renderOption,
  initialFocus,
  returnFocus,
}: SelectMenuProps) => {
  const { settings } = useSettings();
  const [internalQuery, setInternalQuery] = useState("");

  const activeQuery = searchQuery ?? internalQuery;
  const handleQueryChange = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setInternalQuery(val);
    }
  };

  const motionProps = resolveAnimation(animation, settings.enableAnimations);

  const filteredOptions = useMemo(() => {
    if (!isSearch || !activeQuery.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(activeQuery.toLowerCase()),
    );
  }, [options, isSearch, activeQuery]);

  const isOptionSelected = (val: string | number) =>
    selectedValues.includes(val);

  return (
    <AnimatePresence>
      {isOpen && (
        <FloatingFocusManager
          context={context}
          modal={false}
          initialFocus={initialFocus}
          returnFocus={returnFocus}>
          <div
            ref={setFloatingRef}
            style={{ ...floatingStyles, zIndex: 99999 }}
            className="w-full min-w-55 outline-none"
            {...getFloatingProps()}>
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "w-full max-h-60 overflow-y-auto shadow-xl bg-background border border-border p-1 flex flex-col gap-0.5 overflow-x-hidden",
                dropdownClassName,
              )}
              style={{ borderRadius: radius }}
              {...(motionProps as HTMLMotionProps<"div">)}>
              {/* Search Input Bar */}
              {isSearch && (
                <div className="w-full p-1 mb-1 sticky top-0 bg-background z-10 border-b border-border">
                  <div className="relative flex items-center">
                    <SearchIcon className="absolute left-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      name={searchInputName}
                      type="text"
                      value={activeQuery}
                      onChange={(e) => handleQueryChange(e.target.value)}
                      placeholder={searchPlaceholder}
                      autoFocus
                      className="w-full pl-8 h-8 text-xs bg-muted/30 border-none focus-visible:ring-0"
                    />
                  </div>
                </div>
              )}

              {/* Options List */}
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-xs text-muted-foreground text-center">
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
                      color={selected ? color : "default"}
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
                <div className="border-t border-border pt-1 mt-1">
                  {belowList}
                </div>
              )}
            </motion.div>
          </div>
        </FloatingFocusManager>
      )}
    </AnimatePresence>
  );
};

SelectMenu.displayName = "SelectMenu";
