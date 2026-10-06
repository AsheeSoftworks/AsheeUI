/**
 * Hero component for the native package.
 *
 * The component satisfies the framework's hero contract: the same eyebrow, headline,
 * supporting sentence, up to two configured actions and optional media slot as the web
 * hero, built from the platform's own layout kit and the shared band vocabulary.
 *
 * What differs is the arrangement, and the difference is the platform's rather than a
 * second opinion about design. The web places its text and media in a two-column grid
 * from the `lg` breakpoint and moves the media across with an order class, because a
 * stylesheet can do that. The platform has no column count and no order, so the
 * component measures the window itself: a phone stacks the media under the text, a
 * window with room for two columns puts them beside each other, and the side the media
 * takes is decided by where it sits in the tree — which is why `mediaPosition` moves
 * the element rather than a class.
 *
 * A configured action describes a destination rather than a callback, so it is the
 * platform's URL handler that follows one; an action that runs a React handler is
 * passed through `actions`, exactly as on the web. The band options — how wide the
 * content may grow, the vertical room, the background, the alignment, whether the hero
 * draws its own column — are the shared ones, so a hero configured for the web is
 * configured for the platform.
 */

import {
  type ActionConfig,
  NATIVE_HERO_BASE_CLASS,
  NATIVE_HERO_COLUMN_CLASS,
  NATIVE_HERO_MEDIA_CLASS,
  NATIVE_HERO_ROW_CLASS,
  NATIVE_HERO_TEXT_COLUMN_CLASS,
  resolveConfigCascade,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { useBreakpoint } from "../../hooks/use-breakpoint";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { ActionGroup } from "../section-kit/ActionGroup";
import { SectionHeading } from "../section-kit/SectionHeading";
import {
  FALLBACK_NATIVE_HERO_CONFIG,
  type NativeHeroConfig,
} from "./hero-config";

/**
 * Props for the native Hero.
 */
export interface HeroProps
  extends NativeHeroConfig,
    Omit<ViewProps, "children" | "style"> {
  /** Short label above the title, for example the product category. */
  eyebrow?: ReactNode;

  /** The headline. */
  title: ReactNode;

  /** Supporting sentence under the headline. */
  description?: ReactNode;

  /** The emphasised action of the band. */
  primaryAction?: ActionConfig;

  /** The supporting action of the band. */
  secondaryAction?: ActionConfig;

  /** Content placed beside the text column once the window has room for it. */
  media?: ReactNode;

  /**
   * Actions that carry a React handler.
   * A configured action describes a destination rather than a callback, so an action
   * that runs one is passed here and rendered in the same row as the configured ones.
   */
  actions?: ReactNode;

  /** Content below the actions, inside the text column. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * The leading statement of a page or a screen.
 *
 * @param props - The hero's options and the platform's view props.
 * @param props.title - The headline.
 * @param props.eyebrow - Short label above the headline.
 * @param props.description - Supporting sentence under the headline.
 * @param props.primaryAction - The emphasised action.
 * @param props.secondaryAction - The supporting action.
 * @param props.media - Content beside the text column.
 * @param props.align - Text alignment. Defaults to "start".
 * @param props.spacing - Vertical padding. Defaults to "xl".
 * @param props.background - Background treatment. Defaults to "none".
 * @param props.mediaPosition - Side the media takes when the window is wide.
 * Defaults to "end".
 * @param props.containerSize - Maximum content width. Defaults to "lg".
 * @param props.contained - Respect the framework's width and gutter. Defaults to true.
 * @returns The rendered hero.
 *
 * @example
 * ```tsx
 * <Hero
 *   eyebrow="Everything in one place"
 *   title="Run your campaigns from a single workspace"
 *   description="Messages, templates and results, without switching tools."
 *   primaryAction={{ label: "Start free", href: "https://example.com/signup" }}
 *   media={<Image source={dashboard} />}
 * />
 * ```
 *
 * @see Section - The band a hero is built on.
 * @see CTA - The closing band of the same screen.
 */
export function Hero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  media,
  align,
  spacing,
  background,
  mediaPosition,
  containerSize,
  contained,
  actions,
  className,
  style,
  children,
  ...rest
}: HeroProps) {
  const config = useAsheeNativeConfig();
  const { isAtLeast } = useBreakpoint();

  const resolved = resolveConfigCascade<
    NativeHeroConfig,
    Required<NativeHeroConfig>
  >(
    { align, spacing, background, mediaPosition, containerSize, contained },
    config.components.hero,
    FALLBACK_NATIVE_HERO_CONFIG,
  );

  const text = (
    <View className={NATIVE_HERO_TEXT_COLUMN_CLASS}>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        align={resolved.align}
        size="xl"
      />
      <ActionGroup
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
        align={resolved.align}>
        {actions}
      </ActionGroup>
      {children}
    </View>
  );

  const mediaColumn = <View className={NATIVE_HERO_MEDIA_CLASS}>{media}</View>;
  const mediaFirst = resolved.mediaPosition === "start";

  const body = media ? (
    <View
      className={classNames(
        NATIVE_HERO_BASE_CLASS,
        // The platform decides the arrangement from the window it measures: the
        // framework's `md` window is the first one with room for two columns.
        isAtLeast("md") ? NATIVE_HERO_ROW_CLASS : NATIVE_HERO_COLUMN_CLASS,
      )}>
      {mediaFirst && mediaColumn}
      {text}
      {!mediaFirst && mediaColumn}
    </View>
  ) : (
    text
  );

  return (
    <Section
      spacing={resolved.spacing}
      background={resolved.background}
      className={className}
      style={style}
      {...rest}>
      {resolved.contained ? (
        <Container size={resolved.containerSize}>{body}</Container>
      ) : (
        body
      )}
    </Section>
  );
}
