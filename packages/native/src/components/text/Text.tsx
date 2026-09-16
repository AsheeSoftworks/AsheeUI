/**
 * Text component for the native package.
 *
 * The component satisfies the framework's text contract: the same roles, tones
 * and alignment as the web `Typography`, resolved against the platform's own text
 * styles. It is a `Text`, so it composes with anything that expects one, and it
 * states the role rather than a size, so a screen keeps one typographic scale
 * instead of a set of remembered font sizes.
 */

import { resolveCascade } from "@asheeui/shared";
import type { ReactNode } from "react";
import {
  Text as NativeText,
  type TextProps as PlatformTextProps,
} from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import {
  FALLBACK_NATIVE_TEXT_CONFIG,
  type NativeTextConfig,
  type NativeTextRole,
  type NativeTextTone,
} from "./text-config";
import {
  TEXT_ALIGN_CLASS,
  TEXT_ROLE_CLASS,
  TEXT_TONE_CLASS,
} from "./text-styles";

/**
 * Props for the native Text.
 */
export interface TextProps
  extends NativeTextConfig,
    // The platform's `role` is the accessibility role; the framework's `role` is the
    // typography role. The component states the typography role and does not expose
    // the accessibility one, so the two are kept from colliding here.
    Omit<PlatformTextProps, "children" | "style" | "role"> {
  /** The text to render. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;
}

/**
 * Semantic text rendering.
 *
 * @param props - The text's options and the platform's text props.
 * @param props.role - Semantic typography role. Defaults to the configured value.
 * @param props.tone - Tone of the text. Defaults to the configured value.
 * @param props.align - Horizontal alignment. Defaults to the configured value.
 * @param props.truncate - Truncate to one line. Defaults to the configured value.
 * @returns The rendered text.
 *
 * @example
 * ```tsx
 * <Text role="heading-lg">Campaigns</Text>
 * <Text role="body-sm" tone="muted">Updated a moment ago</Text>
 * ```
 *
 * @see Badge - A compact status label rather than a line of text.
 */
export function Text({
  role,
  tone,
  align,
  truncate,
  className,
  children,
  ...rest
}: TextProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.text;

  const resolvedRole = resolveCascade<NativeTextRole>(
    role,
    sectionConfig?.role,
    undefined,
    FALLBACK_NATIVE_TEXT_CONFIG.role,
  );
  const resolvedTone = resolveCascade<NativeTextTone>(
    tone,
    sectionConfig?.tone,
    undefined,
    FALLBACK_NATIVE_TEXT_CONFIG.tone,
  );
  const resolvedAlign = align ?? sectionConfig?.align;
  const resolvedTruncate = resolveCascade<boolean>(
    truncate,
    sectionConfig?.truncate,
    undefined,
    FALLBACK_NATIVE_TEXT_CONFIG.truncate,
  );

  return (
    <NativeText
      // The platform truncates with a line count rather than with a class, so
      // truncation is expressed the platform's way.
      numberOfLines={resolvedTruncate ? 1 : undefined}
      className={classNames(
        TEXT_ROLE_CLASS[resolvedRole],
        TEXT_TONE_CLASS[resolvedTone],
        resolvedAlign ? TEXT_ALIGN_CLASS[resolvedAlign] : undefined,
        className,
      )}
      {...rest}>
      {children}
    </NativeText>
  );
}
