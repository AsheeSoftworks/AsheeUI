/**
 * The semantic text component for the native package.
 *
 * The component satisfies the framework's text contract: the same roles, tones
 * and alignment as the web `Typography`, resolved against the platform's own text
 * styles. It renders the platform's `Text`, so it composes with anything that expects
 * one, and it states the role rather than a size, so a screen keeps one typographic
 * scale instead of a set of remembered font sizes.
 *
 * It answers to both names. `Typography` is the canonical one — the name the web
 * renderer publishes and the name a shared component writes — and `Text` is kept at the
 * bottom of this module as an alias of the same reference, because it is the platform's
 * own word for a line of text and a screen written against it should not have to change.
 */

import { deprecatedAlias, deprecateMany, resolveCascade } from "@asheeui/core";
import type { ReactNode } from "react";
import {
  Text as NativeText,
  type TextProps as PlatformTextProps,
} from "react-native";
import { useAsheeConfig } from "../../../provider/AsheeUIProvider";
import { classNames } from "../../../utils/class-names";
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
 * <Typography role="heading-lg">Campaigns</Typography>
 * <Typography role="body-sm" tone="muted">Updated a moment ago</Typography>
 * ```
 *
 * @see Badge - A compact status label rather than a line of text.
 */
export function Typography({
  role,
  tone,
  align,
  truncate,
  className,
  children,
  ...rest
}: TextProps) {
  const config = useAsheeConfig();
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

// ─── Deprecated: the platform-suffixed spelling, removed in the next major ───

deprecateMany("@asheeui/native/typography", [
  { from: "Text", to: "Typography", since: "2.8.0" },
]);

/** The component under the platform's own word for a line of text. */
export const Text = deprecatedAlias(Typography);
