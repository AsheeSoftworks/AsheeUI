/**
 * LoadingState component for the native package.
 *
 * The component satisfies the framework's loading-region contract: the same label,
 * the same densities, the same panel treatment, the same room claimed before the
 * content arrives, and the same wording as the web state.
 *
 * It is deliberately not an `EmptyState` with a spinner in it. A region that is
 * loading is not empty, and telling a reader that it is would be telling them the
 * wrong thing; what the two share is the way a state is announced, not the state
 * itself.
 *
 * The region announces itself once. The spinner inside it is the framework's own,
 * left unlabelled, which keeps it out of assistive technology: the region carries the
 * news, so a reader hears "Loading invoices" rather than a progress indicator
 * followed by the same sentence.
 */

import {
  NATIVE_ANNOUNCEMENT_LIVE_REGION,
  NATIVE_LOADING_STATE_CLASS,
  NATIVE_LOADING_STATE_PANEL_CLASS,
  NATIVE_LOADING_STATE_SIZE_CLASS,
  resolveConfigCascade,
  SPACE_MIN_HEIGHT_CLASS,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { Spinner } from "../spinner/Spinner";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_LOADING_STATE_CONFIG,
  type NativeLoadingStateConfig,
} from "./loading-state-config";

/**
 * Props for the native LoadingState.
 */
export interface LoadingStateProps
  extends NativeLoadingStateConfig,
    Omit<ViewProps, "children" | "style"> {
  /** Supporting sentence under the label, for example what is being fetched. */
  description?: ReactNode;

  /**
   * Element that replaces the framework's spinner, for a progress bar or a
   * consumer's own indicator.
   */
  indicator?: ReactNode;

  /** Content below the label, for example a cancel control. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A region whose content has not arrived yet.
 *
 * The state is announced politely, so assistive technology is told that something is
 * in progress rather than being left with a silent gap. It claims room by default, so
 * the screen does not jump when the content arrives, and it says what is loading
 * rather than only that something is.
 *
 * @param props - The state's options and the platform's view props.
 * @param props.label - Text shown and announced. Defaults to the configured value.
 * @param props.description - Supporting sentence.
 * @param props.indicator - Element that replaces the framework's spinner.
 * @param props.size - Density of the indicator and the room. Defaults to the configured value.
 * @param props.panel - Draw the state as a panel. Defaults to the configured value.
 * @param props.minHeight - Room the state claims. Defaults to the configured value.
 * @param props.className - Extra classes applied last.
 * @returns The rendered state.
 *
 * @example
 * ```tsx
 * <LoadingState label="Loading invoices" description="This usually takes a moment." />
 * ```
 *
 * @see Skeleton - The placeholder form, for content whose shape is known.
 * @see EmptyState - The presentation for a region that has nothing in it.
 */
export function LoadingState({
  label,
  description,
  indicator,
  size,
  panel,
  minHeight,
  className,
  style,
  children,
  ...rest
}: LoadingStateProps) {
  const config = useAsheeNativeConfig();

  const resolved = resolveConfigCascade<
    NativeLoadingStateConfig,
    Required<NativeLoadingStateConfig>
  >(
    { label, size, panel, minHeight },
    config.components.loadingstate,
    FALLBACK_NATIVE_LOADING_STATE_CONFIG,
  );

  return (
    <View
      // The region is grouped into one announcement, and it waits for a pause
      // rather than interrupting: a reader is told that something is in progress,
      // not that something has gone wrong.
      accessible
      accessibilityLiveRegion={NATIVE_ANNOUNCEMENT_LIVE_REGION.status}
      className={classNames(
        NATIVE_LOADING_STATE_CLASS,
        NATIVE_LOADING_STATE_SIZE_CLASS[resolved.size],
        SPACE_MIN_HEIGHT_CLASS[resolved.minHeight],
        resolved.panel && NATIVE_LOADING_STATE_PANEL_CLASS,
        className,
      )}
      style={style}
      {...rest}>
      {indicator ?? <Spinner size={resolved.size} />}
      <Text role="body-sm" tone="muted" align="center">
        {resolved.label}
      </Text>
      {description && (
        <Text role="caption" tone="muted" align="center">
          {description}
        </Text>
      )}
      {children}
    </View>
  );
}
