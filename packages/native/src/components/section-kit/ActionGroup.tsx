/**
 * Action group helper for the native package.
 *
 * This file provides the internal `ActionGroup` component, which renders the
 * configured actions a pattern takes (`primaryAction`, `secondaryAction`) through
 * the public native `Button`. Configured actions therefore render exactly like
 * hand-written buttons and inherit the framework's configuration cascade, variant
 * and colour resolution and accessible name handling. It is an internal helper and
 * is not part of the public component inventory.
 *
 * A configured action describes a destination rather than a callback, so following
 * one is the platform's URL handler's job, through the same helper the framework's
 * link uses; an action that runs a React handler is passed as a child, exactly as
 * on the web.
 */

import {
  type ActionConfig,
  type ColorRole,
  NATIVE_SECTION_BLOCK_ACTIONS_ALIGN_CLASS,
  NATIVE_SECTION_BLOCK_ACTIONS_CLASS,
  type SectionBlockAlign,
} from "@asheeui/core";
import type { ReactNode } from "react";
import { View } from "react-native";
import { classNames } from "../../utils/class-names";
import { openDestination } from "../../utils/open-destination";
import { Button } from "../button/Button";

/**
 * Props for the internal ActionGroup helper.
 */
export interface ActionGroupProps {
  /**
   * The emphasised action of the pattern.
   * Renders as a solid button.
   */
  primaryAction?: ActionConfig;

  /**
   * The supporting action of the pattern.
   * Renders as a bordered button.
   */
  secondaryAction?: ActionConfig;

  /**
   * Horizontal alignment of the group.
   *
   * @default "start"
   */
  align?: SectionBlockAlign;

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
 * The press a configured action becomes on the platform.
 *
 * @param action - The configured action.
 * @returns A handler that follows its destination, or undefined when it has none.
 */
function pressFor(action: ActionConfig): (() => void) | undefined {
  const { href } = action;

  return href ? () => openDestination(href) : undefined;
}

/**
 * Renders a pattern's configured actions.
 *
 * The row wraps rather than stacking into a column that becomes a row at a
 * breakpoint: the platform has one width, so two actions move onto a second line
 * when their labels need the room, which is what a thumb reads best.
 *
 * @param props - The configured actions and their alignment.
 * @returns The rendered group, or null when the pattern has no actions.
 *
 * @example
 * ```tsx
 * <ActionGroup
 *   primaryAction={{ label: "Start free", href: "https://example.com/signup" }}
 *   secondaryAction={{ label: "Read the docs", href: "https://example.com/docs" }}
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
    <View
      className={classNames(
        NATIVE_SECTION_BLOCK_ACTIONS_CLASS,
        NATIVE_SECTION_BLOCK_ACTIONS_ALIGN_CLASS[align],
        className,
      )}>
      {primaryAction && (
        <Button
          variant={primaryAction.variant ?? "solid"}
          color={primaryAction.color as ColorRole | undefined}
          size={primaryAction.size}
          radius={primaryAction.radius}
          onPress={pressFor(primaryAction)}>
          {primaryAction.label}
        </Button>
      )}
      {secondaryAction && (
        <Button
          variant={secondaryAction.variant ?? "bordered"}
          color={secondaryAction.color as ColorRole | undefined}
          size={secondaryAction.size}
          radius={secondaryAction.radius}
          onPress={pressFor(secondaryAction)}>
          {secondaryAction.label}
        </Button>
      )}
      {children}
    </View>
  );
}
