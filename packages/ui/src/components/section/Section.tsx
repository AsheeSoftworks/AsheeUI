/**
 * Section component for AsheeUI.
 *
 * This file provides the `Section` layout component: a full-width band with a
 * vertical rhythm, an optional background treatment, an optional separator and
 * an optional inner container. It is the second step of the framework's
 * composition ladder, and the element the marketing components are built on.
 */

"use client";

import { type ElementType, forwardRef, type HTMLAttributes } from "react";
import { useAsheeConfig } from "../../libs/context";
import { SPACE_PADDING_Y_CLASS, type Space } from "../../shared";
import { cn } from "../../utils";
import { resolveCascade } from "../../utils/resolve-token";
import { Container } from "../container/Container";
import type { ContainerSize } from "../container/container-config";
import {
  FALLBACK_SECTION_CONFIG,
  type SectionBackground,
  type SectionConfig,
} from "./section-config";
import {
  SECTION_BACKGROUND_CLASS,
  SECTION_BASE_CLASS,
  SECTION_DIVIDER_CLASS,
} from "./section-styles";

type BaseSectionProps = SectionConfig &
  Omit<HTMLAttributes<HTMLElement>, "color">;

/**
 * Props for the Section component.
 */
export interface SectionProps extends BaseSectionProps {
  /**
   * Element to render.
   * Defaults to `section`, which is the correct landmark when the section
   * carries a heading. A section used purely for spacing should render a `div`
   * through this prop, so the page does not gain an unnamed region.
   *
   * @default "section"
   */
  as?: ElementType;

  /**
   * Vertical padding, from the shared spacing scale.
   * Resolved through the standard cascade: prop, then
   * `components.section.spacing`, then the framework fallback.
   *
   * @default "lg"
   */
  spacing?: Space;
}

/**
 * A full-width band with vertical rhythm.
 *
 * Section owns the vertical space between parts of a page and the background
 * behind them. It does not own the maximum width unless asked to, so it composes
 * either way round: a Section can contain a Container, or a Page can place a
 * Container around several Sections.
 *
 * @param props - Section configuration options and element attributes.
 * @param props.spacing - Vertical padding. Defaults to "lg".
 * @param props.background - Background treatment. Defaults to "none".
 * @param props.contained - Wrap the children in a Container. Defaults to false.
 * @param props.containerSize - Container width when contained. Defaults to "lg".
 * @param props.divider - Draw a separator above the section. Defaults to false.
 * @param props.as - Element to render. Defaults to "section".
 * @returns The rendered section.
 *
 * @example
 * ```tsx
 * <Section spacing="xl" background="muted" contained>
 *   <Typography role="heading-xl">Everything your team needs</Typography>
 * </Section>
 * ```
 *
 * @see Container - Maximum width and gutter.
 * @see PageContent - The application-page equivalent.
 */
export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      as,
      spacing,
      background,
      contained,
      containerSize,
      divider,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.section;

    const resolvedSpacing = resolveCascade<Space>(
      spacing,
      sectionConfig?.spacing,
      undefined,
      FALLBACK_SECTION_CONFIG.spacing,
    );

    const resolvedBackground = resolveCascade<SectionBackground>(
      background,
      sectionConfig?.background,
      undefined,
      FALLBACK_SECTION_CONFIG.background,
    );

    const resolvedContained = resolveCascade<boolean>(
      contained,
      sectionConfig?.contained,
      undefined,
      FALLBACK_SECTION_CONFIG.contained,
    );

    const resolvedContainerSize = resolveCascade<ContainerSize>(
      containerSize,
      sectionConfig?.containerSize,
      undefined,
      FALLBACK_SECTION_CONFIG.containerSize,
    );

    const resolvedDivider = resolveCascade<boolean>(
      divider,
      sectionConfig?.divider,
      undefined,
      FALLBACK_SECTION_CONFIG.divider,
    );

    const Component: ElementType = as ?? "section";

    return (
      <Component
        ref={ref}
        className={cn(
          SECTION_BASE_CLASS,
          SPACE_PADDING_Y_CLASS[resolvedSpacing],
          SECTION_BACKGROUND_CLASS[resolvedBackground],
          resolvedDivider && SECTION_DIVIDER_CLASS,
          className,
        )}
        {...rest}>
        {resolvedContained ? (
          <Container size={resolvedContainerSize}>{children}</Container>
        ) : (
          children
        )}
      </Component>
    );
  },
);

Section.displayName = "Section";
