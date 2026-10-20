/**
 * CTA component for AsheeUI.
 *
 * This file provides the `CTA` pattern: the closing band of a marketing page,
 * with an optional panel, a heading and up to two configured actions. It uses
 * the same layout components and section kit as {@link Hero}, so the two ends of
 * a page agree on rhythm.
 */

"use client";

import type { ActionConfig } from "@asheeui/core";
import {
  CTA_CENTERED_CLASS,
  CTA_INNER_CLASS,
  CTA_PANEL_CLASS,
  cn,
  resolveClassKey,
  resolveConfigCascade,
} from "@asheeui/core";
import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useId,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import { Container } from "../../layouts/container/Container";
import { Section } from "../../layouts/section/Section";
import { ActionGroup } from "../../layouts/section-kit/ActionGroup";
import { SectionHeading } from "../../layouts/section-kit/SectionHeading";
import { type CtaConfig, FALLBACK_CTA_CONFIG } from "./cta-config";

type BaseCtaProps = CtaConfig &
  Omit<HTMLAttributes<HTMLElement>, "color" | "title">;

/**
 * Props for the CTA component.
 */
export interface CtaProps extends BaseCtaProps {
  /**
   * Short label above the title.
   */
  eyebrow?: ReactNode | undefined;

  /**
   * The headline of the band.
   */
  title: ReactNode;

  /**
   * Supporting sentence under the headline.
   */
  description?: ReactNode | undefined;

  /**
   * Element the headline renders as.
   *
   * Defaults to `h2`, because a closing band is a section of a page rather than
   * the page's own title: a page that puts a hero and a CTA on the same screen
   * gains one `h1`, not two. A page whose CTA really is the only heading passes
   * `titleAs="h1"`, and a CTA nested under an existing section heading passes
   * `h3` or lower.
   *
   * @default "h2"
   */
  titleAs?: ElementType | undefined;

  /**
   * The emphasised action of the band.
   */
  primaryAction?: ActionConfig | undefined;

  /**
   * The supporting action of the band.
   */
  secondaryAction?: ActionConfig | undefined;

  /**
   * Element to render the band as.
   * Defaults to `section`.
   *
   * @default "section"
   */
  as?: ElementType | undefined;

  /**
   * Content below the actions, for example a small print line.
   */
  children?: ReactNode | undefined;
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
 * The band is a `section` landmark, and it names itself with its own headline:
 * it points `aria-labelledby` at the heading it renders, so a reader navigating
 * by region hears the headline rather than an unnamed region. A consumer's own
 * `aria-labelledby` wins over the generated one.
 *
 * @param props - CTA configuration options and element attributes.
 * @param props.title - The headline of the band.
 * @param props.eyebrow - Short label above the headline.
 * @param props.description - Supporting sentence under the headline.
 * @param props.primaryAction - The emphasised action.
 * @param props.secondaryAction - The supporting action.
 * @param props.titleAs - Element the headline renders as. Defaults to "h2".
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
      titleAs,
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
    // The band names itself with the headline it renders, so it is a region
    // rather than an unnamed `section`. `useId` keeps the pair stable across
    // the server render and the hydration.
    const headingId = useId();

    const resolved = resolveConfigCascade<CtaConfig, Required<CtaConfig>>(
      { align, spacing, background, panel, containerSize, contained },
      config.components?.cta,
      FALLBACK_CTA_CONFIG,
    );

    const body = (
      <div
        className={resolveClassKey(
          resolved.panel,
          CTA_PANEL_CLASS,
          "bordered",
        )}>
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
            titleAs={titleAs}
            titleId={headingId}
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
        aria-labelledby={headingId}
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
