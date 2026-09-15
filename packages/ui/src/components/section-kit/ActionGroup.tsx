/**
 * Action group helper for AsheeUI.
 *
 * This file provides the internal `ActionGroup` component, which renders the
 * configured actions a pattern takes (`primaryAction`, `secondaryAction`)
 * through the public Button. Configured actions therefore render exactly like
 * hand-written buttons and inherit the framework's configuration cascade,
 * variant and colour resolution, loading and disabled behaviour, and accessible
 * name handling. It is an internal helper and is not part of the public
 * component inventory.
 */

import type { ReactNode } from "react";
import type { ActionConfig } from "../../shared";
import { cn } from "../../utils";
import { Button } from "../button/Button";

/**
 * Props for the internal ActionGroup helper.
 */
export interface ActionGroupProps {
  /**
   * The emphasised action of the pattern.
   * Renders as a solid button or link.
   */
  primaryAction?: ActionConfig;

  /**
   * The supporting action of the pattern.
   * Renders as a bordered button or link.
   */
  secondaryAction?: ActionConfig;

  /**
   * Horizontal alignment of the group on a wide screen.
   * The actions are always stacked vertically on a narrow screen.
   *
   * @default "start"
   */
  align?: "start" | "center";

  /**
   * Additional classes for the wrapper.
   */
  className?: string;

  /**
   * Content rendered alongside the configured actions, inside the same group.
   * It is the way a pattern places an action that carries a handler, because a
   * configured action describes a destination rather than a React callback.
   */
  children?: ReactNode;
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
        "flex flex-col gap-3 sm:flex-row sm:items-center",
        align === "center" && "sm:justify-center",
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
