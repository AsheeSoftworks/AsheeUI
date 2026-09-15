/**
 * CTA component for AsheeUI.
 *
 * This file provides the `CTA` pattern: the closing band of a marketing page,
 * with an optional panel, a heading and up to two configured actions. It uses
 * the same layout components and section kit as {@link Hero}, so the two ends of
 * a page agree on rhythm.
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
import { type CtaConfig, FALLBACK_CTA_CONFIG } from "./cta-config";
import {
  CTA_CENTERED_CLASS,
  CTA_INNER_CLASS,
  CTA_PANEL_CLASS,
} from "./cta-styles";

type BaseCtaProps = CtaConfig &
  Omit<HTMLAttributes<HTMLElement>, "color" | "title">;

/**
 * Props for the CTA component.
 */
export interface CtaProps extends BaseCtaProps {
  /**
   * Short label above the title.
   */
  eyebrow?: ReactNode;

  /**
   * The headline of the band.
   */
  title: ReactNode;

  /**
   * Supporting sentence under the headline.
   */
  description?: ReactNode;

  /**
   * The emphasised action of the band.
   */
  primaryAction?: ActionConfig;

  /**
   * The supporting action of the band.
   */
  secondaryAction?: ActionConfig;

  /**
   * Element to render the band as.
   * Defaults to `section`.
   *
   * @default "section"
   */
  as?: ElementType;

  /**
   * Content below the actions, for example a small print line.
   */
  children?: ReactNode;
}

/**
 * A closing call to action.
 *
 * CTA is the band a page ends on: one statement, one or two actions, and
 * optionally a panel that lifts it off the page. It deliberately does not own a
 * form: a consumer that wants an email field in the band places its own controls
 * through `children`, so the framework never couples a layout pattern to an
 * application's subscription flow.
 *
 * @param props - CTA configuration options and element attributes.
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
 * @param props.contained - Respect the framework's width and gutter.
 * Defaults to true.
 * @param props.as - Element to render. Defaults to "section".
 * @returns The rendered band.
 *
 * @example
 * ```tsx
 * <CTA
 *   eyebrow="Ready when you are"
 *   title="Send your first campaign today"
 *   description="No card required, and no setup call."
 *   primaryAction={{ label: "Create an account", href: "/signup" }}
 *   secondaryAction={{ label: "Talk to sales", href: "/contact", variant: "ghost" }}
 * />
 * ```
 *
 * @see Hero - The leading band of the same page.
 */
export const CTA = forwardRef<HTMLElement, CtaProps>(
  (
    {
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
      as,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();

    const resolved = resolveConfigCascade<CtaConfig, Required<CtaConfig>>(
      { align, spacing, background, panel, containerSize, contained },
      config.components?.cta,
      FALLBACK_CTA_CONFIG,
    );

    const body = (
      <div className={CTA_PANEL_CLASS[resolved.panel]}>
        <div
          className={cn(
            CTA_INNER_CLASS,
            resolved.align === "center" && CTA_CENTERED_CLASS,
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
            align={resolved.align}
          />
          {children}
        </div>
      </div>
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

CTA.displayName = "CTA";
