/**
 * Hero component for AsheeUI.
 *
 * This file provides the `Hero` pattern: the leading statement of a marketing
 * page or a landing page, with an eyebrow, a title, a description, up to two
 * configured actions and an optional media slot. It is built from the
 * framework's own layout components and the shared section kit, so a hero and
 * the sections below it share one rhythm and one set of tokens.
 */

"use client";

import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import type { ActionConfig } from "../../shared";
import { cn } from "../../utils";
import { resolveConfigCascade } from "../../utils/resolve-token";
import { Container } from "../container/Container";
import { Section } from "../section/Section";
import { ActionGroup } from "../section-kit/ActionGroup";
import { SectionHeading } from "../section-kit/SectionHeading";
import { FALLBACK_HERO_CONFIG, type HeroConfig } from "./hero-config";
import {
  HERO_CENTERED_CLASS,
  HERO_DESCRIPTION_MEASURE_CLASS,
  HERO_LAYOUT_CLASS,
  HERO_MEDIA_CLASS,
  HERO_MEDIA_FIRST_CLASS,
  HERO_TEXT_COLUMN_CLASS,
} from "./hero-styles";

type BaseHeroProps = HeroConfig &
  Omit<HTMLAttributes<HTMLElement>, "color" | "title">;

/**
 * Props for the Hero component.
 */
export interface HeroProps extends BaseHeroProps {
  /**
   * Short label above the title, for example the product category.
   */
  eyebrow?: ReactNode;

  /**
   * The headline.
   */
  title: ReactNode;

  /**
   * Supporting sentence under the headline.
   */
  description?: ReactNode;

  /**
   * The emphasised action of the hero.
   */
  primaryAction?: ActionConfig;

  /**
   * The supporting action of the hero.
   */
  secondaryAction?: ActionConfig;

  /**
   * Content placed beside the text column from the `lg` breakpoint upwards,
   * typically an illustration or a product screenshot.
   */
  media?: ReactNode;

  /**
   * Element to render the hero band as.
   * Defaults to `section`.
   *
   * @default "section"
   */
  as?: ElementType;

  /**
   * Content below the actions, for example a row of customer logos.
   */
  children?: ReactNode;
}

/**
 * The leading statement of a page.
 *
 * Hero places an eyebrow, a headline, a description and up to two configured
 * actions, with media beside them when the consumer provides any. It stays a
 * single component rather than a set of headline, subtitle and action
 * components, because the arrangement between them is the point.
 *
 * The hero is a `section` landmark and is named by its own heading, so a reader
 * navigating by region hears the headline rather than an unnamed region.
 *
 * @param props - Hero configuration options and element attributes.
 * @param props.title - The headline.
 * @param props.eyebrow - Short label above the headline.
 * @param props.description - Supporting sentence under the headline.
 * @param props.primaryAction - The emphasised action.
 * @param props.secondaryAction - The supporting action.
 * @param props.media - Content beside the text column.
 * @param props.align - Text alignment. Defaults to "start".
 * @param props.spacing - Vertical padding. Defaults to "xl".
 * @param props.background - Background treatment. Defaults to "none".
 * @param props.mediaPosition - Side the media occupies. Defaults to "end".
 * @param props.containerSize - Maximum content width. Defaults to "lg".
 * @param props.contained - Respect the framework's width and gutter.
 * Defaults to true.
 * @param props.as - Element to render. Defaults to "section".
 * @returns The rendered hero.
 *
 * @example
 * ```tsx
 * <Hero
 *   eyebrow="Everything in one place"
 *   title="Run your campaigns from a single workspace"
 *   description="Messages, templates and results, without switching tools."
 *   primaryAction={{ label: "Start free", href: "/signup" }}
 *   media={<Image src="/dashboard.png" alt="The campaign dashboard" />}
 * />
 * ```
 *
 * @see Section - The band a hero is built on.
 * @see CTA - The closing band of the same page.
 */
export const Hero = forwardRef<HTMLElement, HeroProps>(
  (
    {
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
      as,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();

    const resolved = resolveConfigCascade<HeroConfig, Required<HeroConfig>>(
      { align, spacing, background, mediaPosition, containerSize, contained },
      config.components?.hero,
      FALLBACK_HERO_CONFIG,
    );

    const centered = resolved.align === "center";

    const text = (
      <div
        className={cn(
          HERO_TEXT_COLUMN_CLASS,
          centered && HERO_CENTERED_CLASS,
          !media && HERO_DESCRIPTION_MEASURE_CLASS,
        )}>
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
          align={resolved.align}
        />
        {children}
      </div>
    );

    const body = media ? (
      <div className={HERO_LAYOUT_CLASS}>
        {text}
        <div
          className={cn(
            HERO_MEDIA_CLASS,
            resolved.mediaPosition === "start" && HERO_MEDIA_FIRST_CLASS,
          )}>
          {media}
        </div>
      </div>
    ) : (
      text
    );

    return (
      <Section
        ref={ref}
        as={as}
        spacing={resolved.spacing}
        background={resolved.background}
        contained={false}
        className={className}
        {...rest}>
        {resolved.contained ? (
          <Container size={resolved.containerSize}>{body}</Container>
        ) : (
          body
        )}
      </Section>
    );
  },
);

Hero.displayName = "Hero";
