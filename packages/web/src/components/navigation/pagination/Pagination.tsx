/**
 * Pagination component for AsheeUI.
 * This file provides the Pagination component, which renders a set of page
 * controls whose size, variant, colour and radius resolve through the standard
 * AsheeUI cascade system.
 */

"use client";

import type { Color, Radius, Size, Variant } from "@asheeui/core";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "@asheeui/core";
import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { ChevronLeftIcon } from "../../../icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../../../icons/ChevronRightIcon";
import { useAsheeConfig } from "../../../libs/context";
import { resolveVariantClass } from "../../../shared/variant";
import {
  PAGINATION_BASE_CLASS,
  PAGINATION_CONTROL_CLASS,
  PAGINATION_DISABLED_CLASS,
  PAGINATION_GAP_CLASS,
  PAGINATION_LINK_CONTROL_CLASS,
  PAGINATION_LIST_CLASS,
} from "../../../styles/pagination";
import { RADIUS_CLASS } from "../../../styles/radius";
import { cn } from "../../../utils/cn";
import { Button } from "../../forms/button";
import { Link } from "../link";
import { getPaginationRange } from "./pagination.helpers";
import {
  FALLBACK_PAGINATION_CONFIG,
  type PaginationConfig,
} from "./pagination-config";

type BasePaginationProps = PaginationConfig &
  Omit<HTMLAttributes<HTMLElement>, "color" | "onChange">;

/**
 * Substitution applied to every control the pagination renders as a link.
 *
 * The shape is the one `Navbar` and `Footer` take: `component` replaces the
 * native anchor, such as a framework router link, and `props` carries the props
 * that component needs. A paginated collection with real addresses can then
 * keep its router without the pagination having to know about it.
 */
export interface PaginationLink {
  /** Component that replaces the anchor, such as a framework router link. */
  component?: ElementType | undefined;

  /** Additional props for that component. */
  props?: Record<string, unknown> | undefined;
}

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
   *
   * It is called in both modes. A link navigates to its destination and also
   * reports the chosen page here, so a consumer can update its own state before
   * the destination renders; a control the collection cannot act on reports
   * nothing in either mode.
   */
  onPageChange?: ((page: number) => void) | undefined;

  /**
   * Builds the destination of a page.
   *
   * Supplying it renders every control as a link rather than as a button,
   * which is what a paginated collection with real addresses wants. Without
   * it the controls are buttons that report the chosen page through
   * `onPageChange`.
   *
   * A control the collection cannot act on (the previous control on the first
   * page, or a page outside the collection) renders without a destination and
   * out of the tab order, so activating it cannot navigate anywhere.
   */
  hrefForPage?: ((page: number) => string) | undefined;

  /**
   * Substitution applied to every control rendered as a link, such as a
   * framework router's link component.
   *
   * It only applies when `hrefForPage` supplies destinations.
   */
  link?: PaginationLink | undefined;

  /**
   * Name of the navigation landmark.
   *
   * @default "Pagination"
   */
  label?: string | undefined;

  /**
   * Whether the controls are unavailable, for example while a page loads.
   *
   * @default false
   */
  isDisabled?: boolean | undefined;
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
 * reported as a change, because it is already where the reader is. A link also
 * reports the page it navigates to through `onPageChange`, so the two modes
 * agree on what the consumer is told.
 *
 * Size, variant, colour and radius resolve through the standard AsheeUI
 * cascade: prop, component config, global theme defaults, and the built-in
 * fallback. `size` reaches the link controls as well as the button controls, so
 * a paginated collection keeps its density when it switches to real addresses.
 *
 * @param props - Pagination configuration options and navigation attributes.
 * @param props.page - The current page, counted from one.
 * @param props.pageCount - How many pages the collection has.
 * @param props.onPageChange - Called with the page the consumer chose, in both modes.
 * @param props.hrefForPage - Builds a page's destination, which renders links.
 * @param props.link - Substitution applied to the link controls (component and props).
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
 * @example
 * ```tsx
 * // Real addresses that keep the router.
 * <Pagination
 *   page={3}
 *   pageCount={42}
 *   hrefForPage={(page) => `/invoices?page=${page}`}
 *   link={{ component: RouterLink, props: { prefetch: true } }}
 * />
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
      link,
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
     * The box of a link control at the resolved size.
     *
     * A link is not a button, so it does not inherit the button size scale; the
     * map restates the box for the density the cascade resolved.
     */
    const linkControlClass = resolveClassKey(
      resolvedSizeKey,
      PAGINATION_LINK_CONTROL_CLASS,
      FALLBACK_PAGINATION_CONFIG.size,
    );

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
      const isUnavailable = isDisabled || target < 1 || target > pageCount;

      if (hrefForPage) {
        return (
          <Link
            // An unavailable control has no destination to go to, so it keeps
            // `aria-disabled` and the dimmed treatment but loses its `href` and
            // its place in the tab order: keyboard activation cannot navigate
            // to a page the collection does not have.
            href={isUnavailable ? undefined : hrefForPage(target)}
            component={link?.component}
            componentProps={link?.props}
            aria-label={controlLabel}
            aria-current={isCurrent ? "page" : undefined}
            aria-disabled={isUnavailable ? true : undefined}
            tabIndex={isUnavailable ? -1 : undefined}
            // The destination is followed by the browser; reporting the page as
            // well keeps `onPageChange` meaningful in link mode.
            onClick={isUnavailable ? undefined : () => selectPage(target)}
            className={cn(
              PAGINATION_CONTROL_CLASS,
              linkControlClass,
              RADIUS_CLASS[resolvedRadiusKey as Radius],
              resolveVariantClass(resolvedVariantKey, resolvedColorKey),
              isUnavailable && PAGINATION_DISABLED_CLASS,
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
          isDisabled={isUnavailable}
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
