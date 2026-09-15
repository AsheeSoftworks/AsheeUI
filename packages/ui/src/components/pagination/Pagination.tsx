/**
 * Pagination component for AsheeUI.
 * This file provides the Pagination component, which renders a set of page
 * controls whose size, variant, colour and radius resolve through the standard
 * AsheeUI cascade system.
 */

"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { ChevronLeftIcon } from "../../icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import { useAsheeConfig } from "../../libs/context";
import type { Color, Radius, Size, Variant } from "../../shared";
import { RADIUS_CLASS, resolveVariantClass } from "../../shared";
import { cn } from "../../utils";
import { resolveCascade, resolveRadiusKey } from "../../utils/resolve-token";
import { Button } from "../button";
import { Link } from "../link";
import { getPaginationRange } from "./pagination.helpers";
import {
  FALLBACK_PAGINATION_CONFIG,
  type PaginationConfig,
} from "./pagination-config";
import {
  PAGINATION_BASE_CLASS,
  PAGINATION_GAP_CLASS,
  PAGINATION_LIST_CLASS,
} from "./pagination-styles";

type BasePaginationProps = PaginationConfig &
  Omit<HTMLAttributes<HTMLElement>, "color" | "onChange">;

/**
 * Configuration options for the Pagination component.
 */
export interface PaginationProps extends BasePaginationProps {
  /**
   * The current page, counted from one.
   */
  page: number;

  /**
   * How many pages the collection has.
   */
  pageCount: number;

  /**
   * Called with the page the consumer chose.
   * It is not called when the chosen page is already the current page.
   */
  onPageChange?: (page: number) => void;

  /**
   * Builds the destination of a page.
   *
   * Supplying it renders every control as a link rather than as a button,
   * which is what a paginated collection with real addresses wants. Without
   * it the controls are buttons that report the chosen page through
   * `onPageChange`.
   */
  hrefForPage?: (page: number) => string;

  /**
   * Name of the navigation landmark.
   *
   * @default "Pagination"
   */
  label?: string;

  /**
   * Whether the controls are unavailable, for example while a page loads.
   *
   * @default false
   */
  isDisabled?: boolean;
}

/**
 * A set of controls for moving through a paged collection.
 *
 * Pagination shows the current page, a range of pages around it, and the
 * controls that move between them. The first and last pages are always
 * offered, a longer range becomes an ellipsis, and the current page carries
 * `aria-current="page"` so assistive technology can announce where the reader
 * is in the collection.
 *
 * The controls are links when the consumer supplies `hrefForPage`, which is
 * what a collection with real addresses wants, and buttons that report the
 * chosen page through `onPageChange` otherwise. The current page is never
 * reported as a change, because it is already where the reader is.
 *
 * Size, variant, colour and radius resolve through the standard AsheeUI
 * cascade: prop, component config, global theme defaults, and the built-in
 * fallback.
 *
 * @param props - Pagination configuration options and navigation attributes.
 * @param props.page - The current page, counted from one.
 * @param props.pageCount - How many pages the collection has.
 * @param props.onPageChange - Called with the page the consumer chose.
 * @param props.hrefForPage - Builds a page's destination, which renders links.
 * @param props.label - Name of the navigation landmark. Defaults to "Pagination".
 * @param props.siblingCount - Pages shown each side of the current page. Defaults to 1.
 * @param props.showEdges - Whether first and last page controls are shown. Defaults to false.
 * @param props.isDisabled - Whether the controls are unavailable. Defaults to false.
 * @param props.size - Size of the controls. Defaults to "md".
 * @param props.variant - Visual style of the controls. Defaults to the configured value.
 * @param props.color - Accent colour of the controls. Defaults to the configured value.
 * @param props.radius - Corner rounding of the controls. Defaults to "md".
 * @param props.className - Extra classes applied last.
 *
 * @example
 * ```tsx
 * <Pagination page={3} pageCount={42} onPageChange={setPage} />
 * ```
 *
 * @example
 * ```tsx
 * // Real addresses, so every control is a link.
 * <Pagination page={3} pageCount={42} hrefForPage={(page) => `/invoices?page=${page}`} />
 * ```
 *
 * @see PaginationConfig - The configuration type for component defaults.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      page,
      pageCount,
      onPageChange,
      hrefForPage,
      label = "Pagination",
      size,
      variant,
      color,
      radius,
      siblingCount,
      showEdges,
      isDisabled = false,
      className,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.pagination as
      | PaginationConfig
      | undefined;

    const resolvedSizeKey = resolveCascade<Size>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_PAGINATION_CONFIG.size,
    );

    const resolvedVariantKey = resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant,
      FALLBACK_PAGINATION_CONFIG.variant,
    );

    const resolvedColorKey = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor,
      FALLBACK_PAGINATION_CONFIG.color,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_PAGINATION_CONFIG.radius,
    );

    const resolvedSiblingCount = resolveCascade<number>(
      siblingCount,
      sectionConfig?.siblingCount,
      undefined,
      FALLBACK_PAGINATION_CONFIG.siblingCount,
    );

    const resolvedShowEdges = resolveCascade<boolean>(
      showEdges,
      sectionConfig?.showEdges,
      undefined,
      FALLBACK_PAGINATION_CONFIG.showEdges,
    );

    const currentPage = Math.min(Math.max(page, 1), Math.max(pageCount, 1));
    const lastPage = Math.max(pageCount, 1);

    /**
     * Moves to a page.
     * The current page and pages outside the collection are ignored, so a
     * consumer never receives a change it cannot act on.
     */
    const selectPage = (target: number) => {
      if (target === currentPage || target < 1 || target > pageCount) return;

      onPageChange?.(target);
    };

    /** Renders one control, as a link when destinations are supplied. */
    const renderControl = (
      target: number,
      controlLabel: string,
      content: ReactNode,
      isCurrent = false,
    ) => {
      const isOutOfRange = target < 1 || target > pageCount;

      if (hrefForPage) {
        return (
          <Link
            href={hrefForPage(target)}
            aria-label={controlLabel}
            aria-current={isCurrent ? "page" : undefined}
            aria-disabled={isDisabled || isOutOfRange ? true : undefined}
            className={cn(
              "inline-flex items-center justify-center min-w-8 h-8 px-2",
              RADIUS_CLASS[resolvedRadiusKey as Radius],
              resolveVariantClass(resolvedVariantKey, resolvedColorKey),
              (isDisabled || isOutOfRange) &&
                "opacity-50 pointer-events-none cursor-not-allowed",
            )}>
            {content}
          </Link>
        );
      }

      return (
        <Button
          type="button"
          size={resolvedSizeKey}
          variant={resolvedVariantKey}
          color={resolvedColorKey}
          radius={resolvedRadiusKey as Radius}
          aria-label={controlLabel}
          aria-current={isCurrent ? "page" : undefined}
          isDisabled={isDisabled || isOutOfRange}
          onClick={() => selectPage(target)}>
          {content}
        </Button>
      );
    };

    const range = getPaginationRange(
      currentPage,
      pageCount,
      resolvedSiblingCount,
    );

    return (
      <nav
        ref={ref}
        aria-label={label}
        className={cn(PAGINATION_BASE_CLASS, className)}
        {...props}>
        <ul className={PAGINATION_LIST_CLASS}>
          {resolvedShowEdges && (
            <li>
              {renderControl(
                1,
                "First page",
                <ChevronLeftIcon aria-hidden="true" />,
              )}
            </li>
          )}

          <li>
            {renderControl(
              currentPage - 1,
              "Previous page",
              <ChevronLeftIcon aria-hidden="true" />,
            )}
          </li>

          {range.map((item, index) =>
            item === "ellipsis" ? (
              <li key={`gap-${index}`}>
                {/* A gap conveys nothing on its own, so it is decoration. */}
                <span aria-hidden="true" className={PAGINATION_GAP_CLASS}>
                  &#8230;
                </span>
              </li>
            ) : (
              <li key={item}>
                {renderControl(
                  item,
                  `Page ${item}`,
                  item,
                  item === currentPage,
                )}
              </li>
            ),
          )}

          <li>
            {renderControl(
              currentPage + 1,
              "Next page",
              <ChevronRightIcon aria-hidden="true" />,
            )}
          </li>

          {resolvedShowEdges && (
            <li>
              {renderControl(
                lastPage,
                "Last page",
                <ChevronRightIcon aria-hidden="true" />,
              )}
            </li>
          )}
        </ul>
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";
