/**
 * The semantic text component for the native package.
 *
 * The component satisfies the framework's typography contract: the same roles, tones,
 * alignment and the four token overrides as the web `Typography`, resolved against the
 * platform's own text styles. It renders the platform's `Text`, so it composes with
 * anything that expects one, and it states the role rather than a size, so a screen keeps
 * one typographic scale instead of a set of remembered font sizes.
 *
 * **One role table.** B15 deleted this component's private `TEXT_ROLE_CLASS`. A role now
 * resolves through core's `TYPOGRAPHY_ROLE_TOKEN` — the table the web reads too — and the
 * platform only maps the tokens to the utilities it compiles. That is what closes the
 * "native re-declared the role table" divergence `CORE-MIGRATION-REPORT.md` §5 row 6
 * records, and the test that compares both renderers' resolved roles is the proof.
 *
 * It answers to both names. `Typography` is the canonical one — the name the web
 * renderer publishes and the name a shared component writes — and `Text` is kept at the
 * bottom of this module as an alias of the same reference, because it is the platform's
 * own word for a line of text and a screen written against it should not have to change.
 */

import {
  deprecatedAlias,
  deprecateMany,
  resolveCascade,
  TYPOGRAPHY_ROLE_TOKEN,
  type TypographyAlign,
  type TypographyConfig,
  type TypographyLeading,
  type TypographyRoleTokens,
  type TypographySize,
  type TypographyTracking,
  type TypographyWeight,
} from "@asheeui/core";
import type { ElementType, ReactNode } from "react";
import {
  Text as NativeText,
  type StyleProp,
  type TextProps as PlatformTextProps,
  type TextStyle,
} from "react-native";
import { useAsheeConfig } from "../../../provider/AsheeUIProvider";
import { classNames } from "../../../utils/class-names";
import {
  defaultNativeTextConfig,
  FALLBACK_NATIVE_TEXT_CONFIG,
  type NativeTextConfig,
  type NativeTextRole,
  type NativeTextTone,
} from "./text-config";
import {
  composeNativeTypographyClass,
  NATIVE_TYPOGRAPHY_ALIGN_CLASS,
  NATIVE_TYPOGRAPHY_TONE_CLASS,
  nativeLineHeight,
} from "./text-styles";

/**
 * Whether the process has already said one of the migration messages.
 *
 * Both are once per process: a typography component renders on every screen, and a warning
 * per render is a warning the reader filters out.
 */
const warned = new Set<string>();

/**
 * Say something once, in development only.
 *
 * @param key - The message's key.
 * @param message - What to say.
 */
function warnOnce(key: string, message: string): void {
  if (process.env.NODE_ENV === "production" || warned.has(key)) return;
  warned.add(key);
  console.warn(message);
}

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

  /**
   * The element to render, under the web's name.
   *
   * A device has no elements: every role draws the platform's `Text` and the meaning
   * reaches assistive technology through an accessibility role. The prop is accepted so a
   * shared component compiles, warns once in development, and changes nothing — the
   * impossibility report's I4-1, and the same no-op `Card.titleAs` is.
   */
  as?: ElementType;

  /** Size token override. Replaces the size part of the role's treatment. */
  size?: TypographySize;

  /** Font-weight token override. */
  weight?: TypographyWeight;

  /** Line-height token override. */
  leading?: TypographyLeading;

  /** Letter-spacing token override. */
  tracking?: TypographyTracking;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<TextStyle>;
}

/**
 * Semantic text rendering.
 *
 * @param props - The text's options and the platform's text props.
 * @param props.role - Semantic typography role. Defaults to the configured value.
 * @param props.tone - Tone of the text. Defaults to the configured value.
 * @param props.align - Horizontal alignment. Defaults to the configured value.
 * @param props.truncate - Truncate to one line. Defaults to the configured value.
 * @param props.size - Size token override.
 * @param props.weight - Weight token override.
 * @param props.leading - Line-height token override.
 * @param props.tracking - Letter-spacing token override.
 * @returns The rendered text.
 *
 * @example
 * ```tsx
 * <Typography role="heading-lg">Campaigns</Typography>
 * <Typography role="body-sm" tone="muted">Updated a moment ago</Typography>
 * <Typography role="body-md" size="xl" weight="bold">Larger body copy</Typography>
 * ```
 *
 * @see Badge - A compact status label rather than a line of text.
 */
export function Typography({
  role,
  tone,
  align,
  truncate,
  size,
  weight,
  leading,
  tracking,
  as,
  className,
  style,
  children,
  ...rest
}: TextProps) {
  const config = useAsheeConfig();

  const typographyConfig = config.components.typography as
    | TypographyConfig
    | undefined;
  const legacyConfig = config.components.text as TypographyConfig | undefined;

  // The registered defaults are not a consumer's choice: `components.text` always carries
  // them, so the warning fires only when a value differs from what this renderer registers.
  const usesLegacySection =
    legacyConfig !== undefined &&
    Object.entries(legacyConfig).some(
      ([key, value]) =>
        (defaultNativeTextConfig as Record<string, unknown>)[key] !== value,
    );

  if (usesLegacySection) {
    warnOnce(
      "typography-section",
      "[@asheeui] `components.text` is deprecated; state the same options under `components.typography`. The old section keeps working for one minor.",
    );
  }

  // The shared section wins when it states anything; otherwise the old one is read, so a
  // native-only configuration keeps working exactly as it did.
  const sectionConfig =
    typographyConfig && Object.keys(typographyConfig).length > 0
      ? typographyConfig
      : legacyConfig;

  if (as !== undefined) {
    warnOnce(
      "typography-as",
      "[@asheeui] `Typography.as` is accepted for compatibility and does nothing on a device: the platform draws its own text element and the role carries the meaning.",
    );
  }

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
  const resolvedAlign = (align ??
    sectionConfig?.align) as TypographyAlign | undefined;
  const resolvedTruncate = resolveCascade<boolean>(
    truncate,
    sectionConfig?.truncate,
    undefined,
    FALLBACK_NATIVE_TEXT_CONFIG.truncate,
  );

  // The instance prop wins over the configured retuning, which wins over the role table.
  // That is the web's order, and the reason one configuration means the same thing on a
  // device.
  const configuredOverrides = sectionConfig?.roles?.[resolvedRole];
  const base = TYPOGRAPHY_ROLE_TOKEN[resolvedRole];
  const tokens: TypographyRoleTokens = {
    size: size ?? configuredOverrides?.size ?? base.size,
    weight: weight ?? configuredOverrides?.weight ?? base.weight,
    leading: leading ?? configuredOverrides?.leading ?? base.leading,
    tracking: tracking ?? configuredOverrides?.tracking ?? base.tracking,
  };

  return (
    <NativeText
      // The platform truncates with a line count rather than with a class, so
      // truncation is expressed the platform's way.
      numberOfLines={resolvedTruncate ? 1 : undefined}
      // A unitless `leading-*` is a browser multiplier; the platform's line height is a
      // number of density-independent pixels, so the multiplier is applied here.
      style={[{ lineHeight: nativeLineHeight(tokens) }, style]}
      className={classNames(
        composeNativeTypographyClass(tokens),
        NATIVE_TYPOGRAPHY_TONE_CLASS[resolvedTone],
        resolvedAlign ? NATIVE_TYPOGRAPHY_ALIGN_CLASS[resolvedAlign] : undefined,
        sectionConfig?.className,
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
