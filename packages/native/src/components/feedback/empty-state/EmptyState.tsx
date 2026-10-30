/**
 * EmptyState component for the native package.
 *
 * The component satisfies the framework's empty-region contract: the same tone, the
 * same densities, the same panel treatment, the same configured actions and the same
 * wording as the web state. What differs is what the platform can be asked for.
 *
 * A configured action describes a destination rather than a callback, so it is the
 * platform's URL handler that follows one, through the same helper the framework's
 * link uses; an action that runs a React handler is passed as a child, exactly as on
 * the web. There is no `as` prop here: the web lets a consumer choose the element a
 * state is drawn as, and the platform has one container, so there is nothing to
 * choose.
 *
 * The badge exists to hold an icon, so it is drawn only when one is given, which is
 * what the web state does with the same prop.
 */

import {
  type ActionConfig,
  type Color,
  type EmptyStateRole,
  resolveConfigCascade,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { useAsheeConfig } from "../../../provider/AsheeUIProvider";
import {
  NATIVE_ANNOUNCEMENT_LIVE_REGION,
  resolveNativeAnnouncementRole,
} from "../../../shared/announcement";
import {
  NATIVE_EMPTY_STATE_ACTIONS_CLASS,
  NATIVE_EMPTY_STATE_CLASS,
  NATIVE_EMPTY_STATE_HEADING_CLASS,
  NATIVE_EMPTY_STATE_ICON_CLASS,
  NATIVE_EMPTY_STATE_ICON_SIZE_CLASS,
  NATIVE_EMPTY_STATE_ICON_TEXT_CLASS,
  NATIVE_EMPTY_STATE_PANEL_CLASS,
  NATIVE_EMPTY_STATE_SIZE_CLASS,
} from "../../../styles/empty-state";
import { classNames } from "../../../utils/class-names";
import {
  type UnsupportedElementProps,
  useUnsupportedElementProps,
} from "../../../utils/unsupported-element-props";
import { openDestination } from "../../../utils/open-destination";
import { Button } from "../../forms/button/Button";
import { Typography } from "../../typography/text/Text";
import {
  FALLBACK_NATIVE_EMPTY_STATE_CONFIG,
  type NativeEmptyStateConfig,
} from "./empty-state-config";

/**
 * Props for the native EmptyState.
 */
export interface EmptyStateProps
  extends NativeEmptyStateConfig,
    // The platform's `View` has a `role` too, naming an accessibility role from the
    // platform's own vocabulary. The framework's `role` says how a state is announced,
    // and the component states that itself, so the platform's is left out rather than
    // colliding with it.
    Omit<ViewProps, "children" | "style" | "role">,
    UnsupportedElementProps {
  /** Icon shown above the title, inside a badge coloured by the state's tone. */
  icon?: ReactNode;

  /** What the region is and, where useful, why it is empty. */
  title: ReactNode;

  /** What the reader can do about it. */
  description?: ReactNode;

  /** The emphasised action, for example the one that creates the first item. */
  primaryAction?: ActionConfig;

  /** The supporting action, typically a link to the documentation. */
  secondaryAction?: ActionConfig;

  /**
   * How the state is announced.
   * It resolves instance → `components.emptystate` → `"none"`. Leave `"none"` for
   * a state that is part of the screen's initial markup; pass `"status"` or
   * `"alert"` for a state that replaces content after an asynchronous result, so
   * the change is announced.
   */
  role?: EmptyStateRole;

  /**
   * Actions that carry a React handler.
   * A configured action describes a destination rather than a callback, so an action
   * that runs one is passed here and rendered in the same row as the configured ones.
   */
  actions?: ReactNode;

  /** Content below the actions. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
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
 * A region with nothing in it.
 *
 * EmptyState covers the empty and the "no results" presentations of a region. A
 * region that could not be filled because something failed is `ErrorState`, which
 * composes this state with the failure's tone, a retry and the technical detail.
 * Loading is deliberately not one of the presentations either: a loading region is
 * a `Skeleton` or a `Spinner`, and pretending an in-progress region is empty would
 * tell the reader the wrong thing.
 *
 * @param props - The state's options and the platform's view props.
 * @param props.title - What the region is.
 * @param props.icon - Icon shown above the title.
 * @param props.description - What the reader can do about it.
 * @param props.primaryAction - The emphasised action.
 * @param props.secondaryAction - The supporting action.
 * @param props.type - Tone of the state. Defaults to the configured value.
 * @param props.size - Density. Defaults to the configured value.
 * @param props.panel - Draw the state as a panel. Defaults to the configured value.
 * @param props.role - How the state is announced. Defaults to none.
 * @param props.actions - Actions that carry a React handler.
 * @param props.className - Extra classes applied last.
 * @returns The rendered state.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="No campaigns match that filter"
 *   description="Try a different name, or clear the filter to see everything."
 *   primaryAction={{ label: "See all campaigns", href: "https://example.com/campaigns" }}
 * />
 * ```
 *
 * @see NativeEmptyStateConfig - The configuration type for component defaults.
 * @see ErrorState - The same presentation for content that could not be loaded.
 * @see LoadingState - The presentation for content that has not arrived yet.
 */
export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  type,
  size,
  panel,
  role,
  actions,
  as,
  titleAs,
  className,
  style,
  children,
  ...rest
}: EmptyStateProps) {
  useUnsupportedElementProps("EmptyState", { as, titleAs });

  const config = useAsheeConfig();

  const resolved = resolveConfigCascade<
    NativeEmptyStateConfig,
    Required<NativeEmptyStateConfig>
  >(
    { type, size, panel, role },
    config.components.emptystate,
    FALLBACK_NATIVE_EMPTY_STATE_CONFIG,
  );

  const announcementRole = resolved.role === "none" ? undefined : resolved.role;

  return (
    <View
      // A state that is part of the screen takes no role: it is not a change, and
      // announcing it would interrupt a reader with news that is not news.
      accessibilityRole={
        announcementRole
          ? resolveNativeAnnouncementRole(announcementRole)
          : undefined
      }
      accessibilityLiveRegion={
        announcementRole
          ? NATIVE_ANNOUNCEMENT_LIVE_REGION[announcementRole]
          : undefined
      }
      className={classNames(
        NATIVE_EMPTY_STATE_CLASS,
        NATIVE_EMPTY_STATE_SIZE_CLASS[resolved.size],
        resolved.panel && NATIVE_EMPTY_STATE_PANEL_CLASS,
        className,
      )}
      style={style}
      {...rest}>
      {icon && (
        <View
          className={classNames(
            NATIVE_EMPTY_STATE_ICON_CLASS[resolved.type],
            NATIVE_EMPTY_STATE_ICON_SIZE_CLASS[resolved.size],
            NATIVE_EMPTY_STATE_ICON_TEXT_CLASS[resolved.type],
          )}>
          {icon}
        </View>
      )}

      <View className={NATIVE_EMPTY_STATE_HEADING_CLASS}>
        <Typography role="heading-sm" align="center">
          {title}
        </Typography>
        {description && (
          <Typography role="body-sm" tone="muted" align="center">
            {description}
          </Typography>
        )}
      </View>

      {(primaryAction || secondaryAction || actions) && (
        <View className={NATIVE_EMPTY_STATE_ACTIONS_CLASS}>
          {primaryAction && (
            <Button
              variant={primaryAction.variant ?? "solid"}
              color={primaryAction.color as Color | undefined}
              size={primaryAction.size ?? resolved.size}
              radius={primaryAction.radius}
              onPress={pressFor(primaryAction)}>
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant ?? "bordered"}
              color={secondaryAction.color as Color | undefined}
              size={secondaryAction.size ?? resolved.size}
              radius={secondaryAction.radius}
              onPress={pressFor(secondaryAction)}>
              {secondaryAction.label}
            </Button>
          )}
          {actions}
        </View>
      )}

      {children}
    </View>
  );
}
