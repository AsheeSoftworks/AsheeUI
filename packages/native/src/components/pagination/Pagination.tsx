/**
 * Pagination component for the native package.
 *
 * The component satisfies the framework's pagination contract — where the reader is in a
 * paged collection, and how they ask for more of it — and states it the way a platform list
 * states it.
 *
 * The web draws a trail of numbered controls, because a browser has addresses to name: the
 * first and last page, the reader's neighbours and a gap between them, each control either
 * a link or a button. The platform has neither addresses nor the room for a trail on a
 * phone, and its lists grow instead: a reader reaches the end of what is loaded, the footer
 * says where they are, and one control loads the next page. That is why the footer states
 * its position rather than drawing a range.
 *
 * The two options the web's trail needs and this footer does not — `siblingCount`, which
 * says how many neighbours to draw, and `showEdges`, which says whether the ends are
 * offered — still resolve through the shared contract, so one configuration describes both
 * platforms; they simply have nothing to describe here, which is stated rather than hidden.
 */

import {
  NATIVE_ANNOUNCEMENT_LIVE_REGION,
  NATIVE_PAGINATION_BASE_CLASS,
  NATIVE_PAGINATION_POSITION_CLASS,
  resolveConfigCascade,
} from "@asheeui/core";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { Button } from "../button/Button";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_PAGINATION_CONFIG,
  type NativePaginationConfig,
} from "./pagination-config";

/**
 * Props for the native Pagination.
 */
export interface PaginationProps
  extends NativePaginationConfig,
    Omit<ViewProps, "children" | "style"> {
  /** The current page, counted from one. */
  page: number;

  /** How many pages the collection has. */
  pageCount: number;

  /**
   * Called with the page the consumer chose.
   * It is not called when the chosen page is already the current page, and it is never
   * called with a page outside the collection, so a consumer never receives a change it
   * cannot act on.
   */
  onPageChange?: (page: number) => void;

  /**
   * Name of the collection the footer belongs to.
   *
   * The web states it as the navigation landmark's name. The platform has no landmark
   * role, so the name is stated where a reader hears it: in front of the footer's own
   * statement of where they are, which is what a landmark name does for a trail.
   *
   * @default "Pagination"
   */
  label?: string;

  /**
   * Whether the control is unavailable, for example while a page loads.
   *
   * @default false
   */
  isDisabled?: boolean;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Where the reader is in a paged collection, and how they ask for more of it.
 *
 * With nothing left to load, the footer states where the reader is and offers no control:
 * the list itself shows the end of the collection, which is what a reader sees on the
 * platform. With no collection at all there is nothing to page through, so the footer
 * renders nothing — an empty state belongs to the list, not to its footer.
 *
 * @param props - The footer's options and the platform's view props.
 * @param props.page - The current page, counted from one.
 * @param props.pageCount - How many pages the collection has.
 * @param props.onPageChange - Called with the page the consumer chose.
 * @param props.label - Name of the collection. Defaults to "Pagination".
 * @param props.isDisabled - Whether the control is unavailable. Defaults to false.
 * @param props.size - Size of the control. Defaults to "md".
 * @param props.variant - Visual style of the control. Defaults to the configured value.
 * @param props.color - Accent colour of the control. Defaults to the configured value.
 * @param props.radius - Corner rounding of the control. Defaults to "md".
 * @returns The rendered footer, or nothing when the collection has no pages.
 *
 * @example
 * ```tsx
 * <Pagination
 *   page={page}
 *   pageCount={42}
 *   label="Invoices"
 *   onPageChange={setPage}
 * />
 * ```
 *
 * @see PaginationConfig - The configuration type for component defaults.
 */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  label = "Pagination",
  size,
  variant,
  color,
  radius,
  siblingCount,
  showEdges,
  isDisabled = false,
  className,
  style,
  ...rest
}: PaginationProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.pagination;

  const resolved = resolveConfigCascade<
    NativePaginationConfig,
    Required<NativePaginationConfig>
  >(
    { size, variant, color, radius, siblingCount, showEdges },
    sectionConfig,
    FALLBACK_NATIVE_PAGINATION_CONFIG,
  );

  // A collection with no pages has nothing to page through.
  if (pageCount <= 0) return null;

  const currentPage = Math.min(Math.max(page, 1), pageCount);
  const hasMore = currentPage < pageCount;
  const position = `Page ${currentPage} of ${pageCount}`;

  return (
    <View
      className={classNames(NATIVE_PAGINATION_BASE_CLASS, className)}
      style={style}
      {...rest}>
      <Text
        role="body-sm"
        tone="muted"
        className={NATIVE_PAGINATION_POSITION_CLASS}
        // The name the web gives its landmark, then the statement: a reader hears where
        // they are and which collection they are in.
        accessibilityLabel={`${label}. ${position}`}
        // Where the reader is changes as pages load, and a change is not announced on its
        // own; the statement is a live region so that it is.
        accessibilityLiveRegion={NATIVE_ANNOUNCEMENT_LIVE_REGION.status}>
        {position}
      </Text>

      {hasMore ? (
        <Button
          variant={resolved.variant}
          color={resolved.color}
          size={resolved.size}
          radius={resolved.radius}
          isDisabled={isDisabled}
          onPress={
            isDisabled ? undefined : () => onPageChange?.(currentPage + 1)
          }>
          Load more
        </Button>
      ) : null}
    </View>
  );
}
