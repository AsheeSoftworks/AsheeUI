/**
 * SearchInput component for AsheeUI.
 *
 * This file provides the `SearchInput` component: a text field that searches.
 * It composes the framework's `Input`, `Button` and `Spinner` rather than
 * reimplementing a control, and it adds the three things a search field needs
 * that a text field does not: a search landmark with a name, a control that
 * empties the field, and the ability to report the query when the reader submits
 * it.
 */

"use client";

import {
  type ChangeEventHandler,
  forwardRef,
  type InputHTMLAttributes,
  useId,
  useRef,
  useState,
} from "react";
import { ClearIcon } from "../../icons/ClearIcon";
import { SearchIcon } from "../../icons/SearchIcon";
import { useAsheeConfig } from "../../libs/context";
import { cn } from "../../utils";
import { resolveConfigCascade } from "../../utils/resolve-token";
import { Button } from "../button";
import type { FieldStatus } from "../field/field-config";
import { Input } from "../input";
import { Spinner } from "../spinner/spinner";
import {
  FALLBACK_SEARCH_INPUT_CONFIG,
  type SearchInputConfig,
} from "./search-input-config";
import {
  SEARCH_INPUT_CLEAR_CLASS,
  SEARCH_INPUT_HIDDEN_LABEL_CLASS,
  SEARCH_INPUT_HINT_CLASS,
  SEARCH_INPUT_HINT_SIZE_CLASS,
  SEARCH_INPUT_REGION_CLASS,
} from "./search-input-styles";

type BaseSearchInputProps = SearchInputConfig &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "children"
    | "className"
    | "color"
    | "defaultValue"
    | "onChange"
    | "size"
    | "type"
    | "value"
  >;

/**
 * Props for the SearchInput component.
 */
export interface SearchInputProps extends BaseSearchInputProps {
  /**
   * The current query, for a consumer that owns it.
   */
  value?: string;

  /**
   * The initial query, for a consumer that does not.
   */
  defaultValue?: string;

  /**
   * Called with the native change event, which is how a form library hears
   * about the field.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;

  /**
   * Called with the next query whenever it changes, including when the field is
   * emptied. It is the handler to use when the query drives a result list.
   */
  onValueChange?: (value: string) => void;

  /**
   * Called with the query when the reader submits the field.
   * Supplying it makes the component a form, so Enter submits and the field is
   * announced as the page's search.
   */
  onSearch?: (value: string) => void;

  /**
   * Supporting text under the field.
   */
  description?: string;

  /**
   * Validation message under the field.
   */
  message?: string;

  /**
   * Validation status of the field.
   *
   * @default "default"
   */
  status?: FieldStatus;

  /**
   * Whether a search is in progress, which the field reports as busy.
   *
   * @default false
   */
  isLoading?: boolean;

  /**
   * Keyboard shortcut a consumer has bound elsewhere, shown as a hint.
   * The field only displays it: binding a global shortcut is an application
   * concern, because the field cannot know what else the shortcut should do.
   */
  shortcut?: string;

  /**
   * Extra classes for the search region.
   */
  className?: string;
}

/**
 * A text field that searches.
 *
 * SearchInput composes the framework's text field and adds the search contract:
 * the field is announced as a search region with a name, so a screen reader user
 * can jump to it; the query is reported through `onValueChange` while it is typed
 * and through `onSearch` when it is submitted; and the field can empty itself
 * with a named control instead of requiring the reader to select the text and
 * delete it.
 *
 * The component is controlled when `value` is given, and owns the query
 * otherwise. The clear control works in both cases: it empties the field and
 * returns focus to it, and a controlled consumer hears about the change through
 * `onValueChange` so it can update its own state.
 *
 * @param props - SearchInput configuration options and input attributes.
 * @param props.value - The query, for a controlled consumer.
 * @param props.defaultValue - The initial query, for an uncontrolled one.
 * @param props.onValueChange - Called with the next query.
 * @param props.onSearch - Called with the query on submit, which is also what
 * makes the component a form.
 * @param props.label - Name of the region and of the field. Defaults to
 * "Search".
 * @param props.hideLabel - Keep the name for assistive technology only.
 * Defaults to true.
 * @param props.clearable - Offer a control that empties the field. Defaults to
 * true.
 * @param props.shortcut - Shortcut a consumer has bound, shown as a hint.
 * @param props.isLoading - Report a search in progress. Defaults to false.
 * @param props.size - Density of the field and its controls. Defaults to "md".
 * @returns The rendered field.
 *
 * @example
 * ```tsx
 * <SearchInput
 *   placeholder="Search invoices"
 *   onValueChange={setQuery}
 *   onSearch={runSearch}
 *   shortcut="Command K"
 * />
 * ```
 *
 * @see Input - The text field the component composes.
 * @see DataTable - Uses it for the search control above a table.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      onValueChange,
      onSearch,
      description,
      message,
      status,
      isLoading,
      shortcut,
      label,
      hideLabel,
      clearable,
      size,
      color,
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const resolved = resolveConfigCascade<
      SearchInputConfig,
      Required<SearchInputConfig>
    >(
      { size, color, clearable, label, hideLabel },
      config.components?.searchinput,
      FALLBACK_SEARCH_INPUT_CONFIG,
    );

    // The mirrored query is what the clear control's visibility follows. A
    // controlled field mirrors the prop; an uncontrolled one mirrors what the
    // reader has typed.
    const [typedValue, setTypedValue] = useState(defaultValue ?? "");
    const query = value ?? typedValue;
    const hasQuery = query.length > 0;

    const localRef = useRef<HTMLInputElement | null>(null);

    const setInputRef = (node: HTMLInputElement | null) => {
      localRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      onChange?.(event);

      if (value === undefined) {
        setTypedValue(event.target.value);
      }

      onValueChange?.(event.target.value);
    };

    const handleClear = () => {
      const node = localRef.current;

      if (node) {
        // An uncontrolled field is emptied through the element, because React
        // does not rewrite a value it does not own.
        node.value = "";
        node.focus();
      }

      if (value === undefined) {
        setTypedValue("");
      }

      onValueChange?.("");
    };

    const isForm = Boolean(onSearch);

    const region = (
      <>
        {resolved.hideLabel && (
          <label htmlFor={inputId} className={SEARCH_INPUT_HIDDEN_LABEL_CLASS}>
            {resolved.label}
          </label>
        )}
        <Input
          {...rest}
          ref={setInputRef}
          id={inputId}
          type="search"
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={handleChange}
          label={resolved.hideLabel ? undefined : resolved.label}
          description={description}
          message={message}
          status={status}
          size={resolved.size}
          color={resolved.color}
          aria-busy={isLoading}
          startContent={<SearchIcon />}
          endContent={
            <>
              {shortcut && (
                <kbd
                  className={cn(
                    SEARCH_INPUT_HINT_CLASS,
                    SEARCH_INPUT_HINT_SIZE_CLASS[resolved.size],
                  )}>
                  {shortcut}
                </kbd>
              )}
              {isLoading && <Spinner size="sm" />}
              {resolved.clearable && hasQuery && (
                <Button
                  icon
                  type="button"
                  variant="ghost"
                  size={resolved.size}
                  color={resolved.color}
                  aria-label="Clear search"
                  className={SEARCH_INPUT_CLEAR_CLASS}
                  onClick={handleClear}>
                  <ClearIcon />
                </Button>
              )}
            </>
          }
        />
      </>
    );

    const regionClassName = cn(SEARCH_INPUT_REGION_CLASS, className);

    // The landmark is stated as a role rather than as the `search` element: React
    // warns that `<search>` is an unrecognised tag in current versions, and a
    // console warning in every consumer's application is worse than a redundant
    // role on an element the browser maps. The role is what this component
    // documents and tests.
    if (!isForm) {
      return (
        <div
          role="search"
          aria-label={resolved.label}
          className={regionClassName}>
          {region}
        </div>
      );
    }

    return (
      <form
        role="search"
        aria-label={resolved.label}
        className={regionClassName}
        onSubmit={(event) => {
          event.preventDefault();
          onSearch?.(query);
        }}>
        {region}
      </form>
    );
  },
);

SearchInput.displayName = "SearchInput";
