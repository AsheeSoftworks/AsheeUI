/**
 * Action group helper for AsheeUI.
 *
 * This file provides the public `ActionGroup` component, which renders the
 * configured actions a pattern takes (`primaryAction`, `secondaryAction`)
 * through the public Button. Configured actions therefore render exactly like
 * hand-written buttons and inherit the framework's configuration cascade,
 * variant and colour resolution, loading and disabled behaviour, and accessible
 * name handling. It is public through the `@asheeui/web/section-kit` subpath
 * rather than the package entry point, and is documented on the section page
 * (https://www.asheeui.com/components/layouts/section) under "The section kit".
 */

import type { ActionConfig, SectionBlockAlign } from "@asheeui/core";
import type { ReactNode } from "react";
import {
  SECTION_BLOCK_ACTIONS_ALIGN_CLASS,
  SECTION_BLOCK_ACTIONS_CLASS,
} from "../../../styles/section-block";
import { cn } from "../../../utils/cn";
import { Button } from "../../forms/button/Button";

/**
 * Props for the public ActionGroup helper.
 */
export interface ActionGroupProps {
  /**
   * The emphasised action of the pattern.
   * Renders as a solid button or link.
   */
  primaryAction?: ActionConfig | undefined;

  /**
   * The supporting action of the pattern.
   * Renders as a bordered button or link.
   */
  secondaryAction?: ActionConfig | undefined;

  /**
   * Horizontal alignment of the group on a wide screen.
   * The actions are always stacked vertically on a narrow screen.
   *
   * @default "start"
   */
  align?: SectionBlockAlign | undefined;

  /**
   * Additional classes for the wrapper.
   */
  className?: string | undefined;

  /**
   * Content rendered inside the group, after the configured actions.
   *
   * A configured action describes a destination rather than a React callback,
   * so a consumer composing directly with the kit puts a handler-carrying
   * `Button` here and it lands in the same row as the configured actions.
   *
   * The shipped patterns do not use it that way: `Hero`, `CTA` and
   * `PricingCard` place their own `children` *below* the row, because each
   * documents that slot as content under the actions (a logo row, a small-print
   * line, a plan's notes). A button that carries a handler and belongs in the
   * row is therefore a direct use of this helper, or a consumer's own row.
   */
  children?: ReactNode | undefined;
}

/**
 * Renders a pattern's configured actions.
 *
 * The group stacks on a narrow screen and sits in a row from the `sm`
 * breakpoint, which is the arrangement that keeps two actions readable on a
 * phone without the consumer writing a media query.
 *
 * @param props - The configured actions and their alignment.
 * @returns The rendered group, or null when the pattern has no actions.
 *
 * @example
 * ```tsx
 * <ActionGroup
 *   primaryAction={{ label: "Start free", href: "/signup" }}
 *   secondaryAction={{ label: "Read the docs", href: "/docs" }}
 * />
 * ```
 */
export function ActionGroup({
  primaryAction,
  secondaryAction,
  align = "start",
  className,
  children,
}: ActionGroupProps) {
  if (!primaryAction && !secondaryAction && !children) {
    return null;
  }

  return (
    <div
      className={cn(
        SECTION_BLOCK_ACTIONS_CLASS,
        SECTION_BLOCK_ACTIONS_ALIGN_CLASS[align],
        className,
      )}>
      {primaryAction && (
        <ConfiguredAction action={primaryAction} defaultVariant="solid" />
      )}
      {secondaryAction && (
        <ConfiguredAction action={secondaryAction} defaultVariant="bordered" />
      )}
      {children}
    </div>
  );
}

/**
 * One configured action, rendered through the public Button.
 *
 * @param props - The action and the variant its position implies.
 * @returns The rendered button or link.
 */
function ConfiguredAction({
  action,
  defaultVariant,
}: {
  action: ActionConfig;
  defaultVariant: "solid" | "bordered";
}) {
  const {
    label,
    href,
    variant,
    color,
    size,
    radius,
    icon,
    component,
    componentProps,
  } = action;

  return (
    <Button
      href={href}
      variant={variant ?? defaultVariant}
      color={color}
      size={size}
      radius={radius}
      startContent={icon}
      link={component ? { component, props: componentProps } : undefined}>
      {label}
    </Button>
  );
}
