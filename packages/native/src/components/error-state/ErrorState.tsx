/**
 * ErrorState component for the native package.
 *
 * The component satisfies the framework's failed-region contract: it composes the
 * framework's empty presentation with the error tone, a retry control and a
 * disclosure that holds the technical detail, so a reader is told what failed, what
 * they can do about it, and where the detail is if they need it.
 *
 * The detail is behind a control a reader presses rather than in the open, because it
 * is written for a developer rather than for the reader of the message. The web uses
 * the platform's own `details` element; the platform has none, so the same disclosure
 * is kept in local state. What it holds is not application state and never leaves the
 * component.
 *
 * A retry is a React handler rather than a configured action, because a configured
 * action describes a destination. It is rendered in the same row as any configured
 * actions, so the two arrangements agree.
 */

import {
  type ActionConfig,
  NATIVE_ERROR_STATE_DETAIL_BODY_CLASS,
  NATIVE_ERROR_STATE_DETAIL_BODY_TEXT_CLASS,
  NATIVE_ERROR_STATE_DETAIL_CLASS,
  NATIVE_ERROR_STATE_DETAIL_SUMMARY_CLASS,
  resolveConfigCascade,
} from "@asheeui/core";
import { type ReactNode, useState } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { Pressable, View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { Button } from "../button/Button";
import { EmptyState } from "../empty-state/EmptyState";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_ERROR_STATE_CONFIG,
  type NativeErrorStateConfig,
} from "./error-state-config";

/**
 * Props for the native ErrorState.
 */
export interface ErrorStateProps
  extends NativeErrorStateConfig,
    // The platform's `View` has a `role` too, naming an accessibility role from the
    // platform's own vocabulary. The framework's `role` says how a failure is announced,
    // and the component states that itself, so the platform's is left out rather than
    // colliding with it.
    Omit<ViewProps, "children" | "style" | "role"> {
  /** What failed, in the reader's terms. */
  title: ReactNode;

  /** What the reader can do about it. */
  description?: ReactNode;

  /**
   * The technical detail, typically the message a request returned.
   * It is rendered inside a disclosure rather than in the open, because it is written
   * for a developer rather than for the reader.
   */
  detail?: ReactNode;

  /**
   * Called when the reader asks to try again.
   * Its presence is what renders the retry control.
   */
  onRetry?: () => void;

  /**
   * The emphasised action, when the way out is a destination rather than a retry.
   */
  primaryAction?: ActionConfig;

  /** The supporting action. */
  secondaryAction?: ActionConfig;

  /** Icon shown above the title. */
  icon?: ReactNode;

  /** Content below the actions. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A region whose content could not be loaded.
 *
 * The state is announced as an alert by default, because it usually replaces content
 * after a request failed and therefore has to be announced. A state that is part of
 * the screen from the start, such as a not-found screen, passes `role="none"` so it is
 * not announced as a change that just happened.
 *
 * @param props - The state's options and the platform's view props.
 * @param props.title - What failed.
 * @param props.description - What the reader can do about it.
 * @param props.detail - The technical message, inside a disclosure.
 * @param props.onRetry - Called when the reader asks to try again.
 * @param props.primaryAction - The emphasised action.
 * @param props.secondaryAction - The supporting action.
 * @param props.icon - Icon shown above the title.
 * @param props.size - Density. Defaults to the configured value.
 * @param props.panel - Draw the state as a panel. Defaults to the configured value.
 * @param props.role - How the state is announced. Defaults to the configured value.
 * @param props.retryLabel - Wording of the retry control. Defaults to the configured value.
 * @param props.detailLabel - Wording of the disclosure. Defaults to the configured value.
 * @param props.className - Extra classes applied last.
 * @returns The rendered state.
 *
 * @example
 * ```tsx
 * <ErrorState
 *   title="Invoices could not be loaded"
 *   description="The request timed out. Trying again usually works."
 *   detail={message}
 *   onRetry={refetch}
 * />
 * ```
 *
 * @see EmptyState - The presentation for a region that has nothing in it.
 * @see LoadingState - The presentation for a region that has not arrived yet.
 */
export function ErrorState({
  title,
  description,
  detail,
  onRetry,
  primaryAction,
  secondaryAction,
  icon,
  size,
  panel,
  role,
  retryLabel,
  detailLabel,
  className,
  style,
  children,
  ...rest
}: ErrorStateProps) {
  const config = useAsheeNativeConfig();

  const resolved = resolveConfigCascade<
    NativeErrorStateConfig,
    Required<NativeErrorStateConfig>
  >(
    { size, panel, role, retryLabel, detailLabel },
    config.components.errorstate,
    FALLBACK_NATIVE_ERROR_STATE_CONFIG,
  );

  // The disclosure is the component's own, and only its own: it says whether a reader
  // has opened the detail, which is not something an application configures.
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <EmptyState
      {...rest}
      className={className}
      style={style}
      type="error"
      size={resolved.size}
      panel={resolved.panel}
      role={resolved.role === "none" ? undefined : resolved.role}
      icon={icon}
      title={title}
      description={description}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      actions={
        onRetry ? (
          <Button
            variant="solid"
            color="danger"
            size={resolved.size}
            onPress={onRetry}>
            {resolved.retryLabel}
          </Button>
        ) : undefined
      }>
      {detail && (
        <View className={NATIVE_ERROR_STATE_DETAIL_CLASS}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={resolved.detailLabel}
            accessibilityState={{ expanded: isDetailOpen }}
            onPress={() => setIsDetailOpen((isOpen) => !isOpen)}
            className={NATIVE_ERROR_STATE_DETAIL_SUMMARY_CLASS}>
            <Text role="label">{resolved.detailLabel}</Text>
          </Pressable>

          {isDetailOpen && (
            <View className={NATIVE_ERROR_STATE_DETAIL_BODY_CLASS}>
              <Text
                role="caption"
                className={classNames(
                  NATIVE_ERROR_STATE_DETAIL_BODY_TEXT_CLASS,
                )}>
                {detail}
              </Text>
            </View>
          )}
        </View>
      )}
      {children}
    </EmptyState>
  );
}
