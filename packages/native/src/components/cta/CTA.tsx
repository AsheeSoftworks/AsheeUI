/**
 * CTA component for the native package.
 *
 * The component satisfies the framework's call-to-action contract: the same heading,
 * supporting sentence, up to two configured actions and optional panel as the web
 * band, built from the platform's own layout kit and the shared band vocabulary.
 *
 * The panel is the one place the two platforms state a difference on purpose. The web
 * steps its padding up at a breakpoint, because a wide window can afford a taller band;
 * the platform has one window, so it states the density the web states at its smallest
 * step. A panel that padded itself for a desktop would crowd the band it sits in on a
 * phone.
 *
 * The band deliberately owns no form. A consumer that wants an email field in the band
 * places its own controls through `children`, so the framework never couples a layout
 * pattern to an application's subscription flow. A configured action describes a
 * destination rather than a callback, so it is the platform's URL handler that follows
 * one.
 */

import {
  type ActionConfig,
  NATIVE_CTA_CENTERED_CLASS,
  NATIVE_CTA_INNER_CLASS,
  NATIVE_CTA_PANEL_CLASS,
  resolveConfigCascade,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { ActionGroup } from "../section-kit/ActionGroup";
import { SectionHeading } from "../section-kit/SectionHeading";
import { FALLBACK_NATIVE_CTA_CONFIG, type NativeCtaConfig } from "./cta-config";

/**
 * Props for the native CTA.
 */
export interface CtaProps
  extends NativeCtaConfig,
    Omit<ViewProps, "children" | "style"> {
  /** Short label above the title. */
  eyebrow?: ReactNode;

  /** The headline of the band. */
  title: ReactNode;

  /** Supporting sentence under the headline. */
  description?: ReactNode;

  /** The emphasised action of the band. */
  primaryAction?: ActionConfig;

  /** The supporting action of the band. */
  secondaryAction?: ActionConfig;

  /**
   * Actions that carry a React handler.
   * A configured action describes a destination rather than a callback, so an action
   * that runs one is passed here and rendered in the same row as the configured ones.
   */
  actions?: ReactNode;

  /** Content below the actions, for example the band's own form. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * The closing band of a page or a screen.
 *
 * @param props - The CTA's options and the platform's view props.
 * @param props.title - The headline of the band.
 * @param props.eyebrow - Short label above the headline.
 * @param props.description - Supporting sentence under the headline.
 * @param props.primaryAction - The emphasised action.
 * @param props.secondaryAction - The supporting action.
 * @param props.align - Content alignment. Defaults to "center".
 * @param props.spacing - Vertical padding. Defaults to "lg".
 * @param props.background - Background treatment. Defaults to "none".
 * @param props.panel - Panel treatment. Defaults to "bordered".
 * @param props.containerSize - Maximum content width. Defaults to "lg".
 * @param props.contained - Respect the framework's width and gutter. Defaults to true.
 * @returns The rendered band.
 *
 * @example
 * ```tsx
 * <CTA
 *   eyebrow="Ready when you are"
 *   title="Send your first campaign today"
 *   description="No card required, and no setup call."
 *   primaryAction={{ label: "Create an account", href: "https://example.com/signup" }}
 *   secondaryAction={{ label: "Talk to sales", href: "https://example.com/contact" }}
 * />
 * ```
 *
 * @see Hero - The leading band of the same screen.
 */
export function CTA({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  align,
  spacing,
  background,
  panel,
  containerSize,
  contained,
  actions,
  className,
  style,
  children,
  ...rest
}: CtaProps) {
  const config = useAsheeNativeConfig();

  const resolved = resolveConfigCascade<
    NativeCtaConfig,
    Required<NativeCtaConfig>
  >(
    { align, spacing, background, panel, containerSize, contained },
    config.components.cta,
    FALLBACK_NATIVE_CTA_CONFIG,
  );

  const body = (
    <View className={NATIVE_CTA_PANEL_CLASS[resolved.panel]}>
      <View
        className={classNames(
          NATIVE_CTA_INNER_CLASS,
          resolved.align === "center" && NATIVE_CTA_CENTERED_CLASS,
        )}>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          align={resolved.align}
          size="lg"
        />
        <ActionGroup
          primaryAction={primaryAction}
          secondaryAction={secondaryAction}
          align={resolved.align}>
          {actions}
        </ActionGroup>
        {children}
      </View>
    </View>
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
