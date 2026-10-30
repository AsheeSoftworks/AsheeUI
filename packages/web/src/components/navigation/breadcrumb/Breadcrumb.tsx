/**
 * Breadcrumb component for AsheeUI.
 * This file provides the Breadcrumb component, a hierarchical navigation trail
 * whose scale and link colour resolve through the standard AsheeUI cascade
 * system.
 */

"use client";

import type { Color, Size } from "@asheeui/core";
import { resolveCascade, resolveClassKey } from "@asheeui/core";
import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { ChevronRightIcon } from "../../../icons/ChevronRightIcon";
import { useAsheeConfig } from "../../../libs/context";
import { LINK_ICON_SIZE_CLASS } from "../../../styles/link";
import { LINK_SIZE_CLASS } from "../../../styles/portable";
import { cn } from "../../../utils/cn";
import { Link } from "../link";
import {
  type BreadcrumbConfig,
  FALLBACK_BREADCRUMB_CONFIG,
} from "./breadcrumb-config";
import {
  BREADCRUMB_BASE_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  BREADCRUMB_FONT_CLASS,
  BREADCRUMB_GAP_CLASS,
  BREADCRUMB_LIST_CLASS,
  BREADCRUMB_SEPARATOR_ICON_CLASS,
} from "./breadcrumb-styles";

/**
 * One step of a breadcrumb trail.
 */
export interface BreadcrumbItem {
  /**
   * Stable identifier for the step.
   * Defaults to the step's position in the trail.
   */
  id?: string | number | undefined;

  /**
   * Visible label of the step.
   */
  label: ReactNode;

  /**
   * Destination of the step.
   * Without one the step is presented as text, which is what the current
   * location of the trail needs.
   */
  href?: string | undefined;

  /**
   * Content before the label, typically an icon.
   */
  icon?: ReactNode | undefined;

  /**
   * Whether this step is the current location.
   * Defaults to the last step of the trail, unless another step marks itself
   * as the current location.
   */
  isCurrent?: boolean | undefined;

  /**
   * Whether the step leads to an external resource.
   */
  isExternal?: boolean | undefined;

  /**
   * Component that replaces the anchor for this step, such as a framework
   * router link. Passed to {@link Link} as its `component`.
   */
  component?: ElementType | undefined;

  /**
   * Additional props for that component, passed to {@link Link}.
   */
  componentProps?: Record<string, unknown> | undefined;
}

/**
 * Substitution applied to every linked step of a trail.
 *
 * It is the same shape the Navbar and the Footer take, so a consumer learns one
 * substitution and uses it on all three patterns.
 */
export interface BreadcrumbLink {
  /** Component that replaces the anchor, such as a framework router link. */
  component?: ElementType | undefined;

  /** Additional props for that component. */
  props?: Record<string, unknown> | undefined;
}

type BaseBreadcrumbProps = BreadcrumbConfig &
  Omit<HTMLAttributes<HTMLElement>, "color">;

/**
 * Configuration options for the Breadcrumb component.
 */
export interface BreadcrumbProps extends BaseBreadcrumbProps {
  /**
   * The trail, from the root to the current location.
   */
  items: BreadcrumbItem[];

  /**
   * Content shown between two steps.
   * It is decoration and is not read by assistive technology.
   */
  separator?: ReactNode | undefined;

  /**
   * Name of the navigation landmark.
   * A trail is a navigation landmark, so it carries a name that distinguishes
   * it from the consumer's other navigation regions.
   *
   * @default "Breadcrumb"
   */
  label?: string | undefined;

  /**
   * Substitution applied to every linked step of the trail.
   *
   * A trail that keeps a framework router is the common case, so the
   * substitution is offered once for the whole trail as well as per step; a
   * step's own `component` wins over it.
   */
  link?: BreadcrumbLink | undefined;
}

/**
 * A hierarchical navigation trail.
 *
 * Breadcrumb shows where the consumer is in a hierarchy and offers a way back
 * up it. The trail is a navigation landmark with a name of its own, its steps
 * are an ordered list, and the current location is presented as text with
 * `aria-current` instead of as a link, because a link to where you already are
 * leads nowhere.
 *
 * Linked steps are rendered through the framework's {@link Link} primitive, so
 * a consumer keeps its router link by passing `link` for the whole trail, or
 * `component` on a single step when only one step needs it.
 *
 * @param props - Breadcrumb configuration options and navigation attributes.
 * @param props.items - The trail, from the root to the current location.
 * @param props.separator - Content between two steps. Decorative.
 * @param props.label - Name of the navigation landmark. Defaults to "Breadcrumb".
 * @param props.link - Substitution applied to every linked step.
 * @param props.size - Text and spacing scale. Defaults to "md".
 * @param props.color - Colour of the links. Defaults to the configured value.
 * @param props.className - Extra classes applied last.
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: "Invoices", href: "/invoices" },
 *     { label: "March", href: "/invoices/2026-03" },
 *     { label: "INV-0042" },
 *   ]}
 * />
 * ```
 *
 * @see BreadcrumbConfig - The configuration type for component defaults.
 * @see Link - The framework's link primitive.
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      items,
      separator,
      label = "Breadcrumb",
      link,
      size,
      color,
      className,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.breadcrumb as
      | BreadcrumbConfig
      | undefined;

    const resolvedSizeKey = resolveCascade<Size>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_BREADCRUMB_CONFIG.size,
    );

    const resolvedColorKey = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor,
      FALLBACK_BREADCRUMB_CONFIG.color,
    );

    const fontClass = resolveClassKey(
      resolvedSizeKey,
      BREADCRUMB_FONT_CLASS,
      FALLBACK_BREADCRUMB_CONFIG.size,
    );

    const gapClass = resolveClassKey(
      resolvedSizeKey,
      BREADCRUMB_GAP_CLASS,
      FALLBACK_BREADCRUMB_CONFIG.size,
    );

    const separatorIconClass = resolveClassKey(
      resolvedSizeKey,
      BREADCRUMB_SEPARATOR_ICON_CLASS,
      FALLBACK_BREADCRUMB_CONFIG.size,
    );

    // The current location is the one step `Link` does not draw, so the trail borrows
    // Link's own scale for it: the same gap between an icon and its label, and the same
    // box around the icon, as every linked step beside it. A fixed gap would differ from
    // the linked steps at every density but one.
    const linkSizeClass = resolveClassKey(
      resolvedSizeKey,
      LINK_SIZE_CLASS,
      FALLBACK_BREADCRUMB_CONFIG.size,
    );

    const linkIconSizeClass = resolveClassKey(
      resolvedSizeKey,
      LINK_ICON_SIZE_CLASS,
      FALLBACK_BREADCRUMB_CONFIG.size,
    );

    const resolvedSeparator = separator ?? (
      <ChevronRightIcon aria-hidden="true" />
    );

    // A step that marks itself as the current location wins over the default,
    // so a trail whose last step is a link does not end up with two current
    // locations.
    const hasMarkedCurrent = items.some((item) => item.isCurrent);

    return (
      <nav
        ref={ref}
        aria-label={label}
        className={cn(BREADCRUMB_BASE_CLASS, fontClass, className)}
        {...props}>
        <ol className={cn(BREADCRUMB_LIST_CLASS, gapClass)}>
          {items.map((item, index) => {
            const isCurrent =
              item.isCurrent ??
              (!hasMarkedCurrent && index === items.length - 1);

            return (
              <li
                key={item.id ?? index}
                className={cn("inline-flex items-center min-w-0", gapClass)}>
                {index > 0 && (
                  // The separator is decoration: it conveys nothing a reader
                  // needs, so it stays out of the accessibility tree.
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-flex items-center text-foreground/50",
                      separatorIconClass,
                    )}>
                    {resolvedSeparator}
                  </span>
                )}

                {isCurrent || !item.href ? (
                  <span
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(BREADCRUMB_CURRENT_CLASS, linkSizeClass)}>
                    {item.icon && (
                      // The same slot `Link` gives a linked step's icon, so an icon
                      // reads the same size wherever the step it belongs to sits.
                      <span
                        className={cn(
                          "inline-flex items-center justify-center shrink-0",
                          linkIconSizeClass,
                        )}>
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    color={resolvedColorKey}
                    size={resolvedSizeKey}
                    isExternal={item.isExternal}
                    component={item.component ?? link?.component}
                    componentProps={{
                      ...link?.props,
                      ...item.componentProps,
                    }}
                    startIcon={item.icon}
                    className={cn(fontClass, "min-w-0 truncate")}>
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);

Breadcrumb.displayName = "Breadcrumb";
