/**
 * FeatureGrid component for AsheeUI.
 *
 * This file provides the `FeatureGrid` pattern: a heading and a responsive grid
 * of feature cards, each with an optional icon and an optional destination. It
 * composes the framework's own `Section`, `Container`, `Grid`, `Card` and
 * `Typography` components rather than restating their styling.
 */

"use client";

import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { resolveConfigCascade } from "../../utils/resolve-token";
import { Card } from "../card/Card";
import { Container } from "../container/Container";
import { Grid } from "../grid/Grid";
import { Section } from "../section/Section";
import { SectionHeading } from "../section-kit/SectionHeading";
import { Typography } from "../typography/Typography";
import {
  FALLBACK_FEATURE_GRID_CONFIG,
  type FeatureGridConfig,
} from "./feature-grid-config";
import {
  FEATURE_CARD_BODY_CLASS,
  FEATURE_HEADING_CLASS,
  FEATURE_ICON_CLASS,
} from "./feature-grid-styles";

/**
 * One feature in the grid.
 */
export interface FeatureItem {
  /**
   * Stable identifier for the feature.
   * Defaults to its position in the list.
   */
  id?: string | number;

  /**
   * Icon shown above the feature title.
   */
  icon?: ReactNode;

  /**
   * Name of the feature.
   */
  title: ReactNode;

  /**
   * Explanation of the feature.
   */
  description?: ReactNode;

  /**
   * Destination of the feature.
   * With one, the whole card becomes a link.
   */
  href?: string;
}

/**
 * Substitution for the link each feature card renders.
 */
export interface FeatureGridLink {
  /**
   * Component that replaces the anchor, such as a framework router link.
   */
  component?: ElementType;

  /**
   * Additional props for that component.
   */
  props?: Record<string, unknown>;
}

type BaseFeatureGridProps = FeatureGridConfig &
  Omit<HTMLAttributes<HTMLElement>, "color" | "title">;

/**
 * Props for the FeatureGrid component.
 */
export interface FeatureGridProps extends BaseFeatureGridProps {
  /** Short label above the heading. */
  eyebrow?: ReactNode;

  /** Heading of the band. */
  title?: ReactNode;

  /** Supporting sentence under the heading. */
  description?: ReactNode;

  /** The features to show. */
  items: FeatureItem[];

  /** Substitution applied to the link of every feature card. */
  link?: FeatureGridLink;

  /**
   * Element to render the band as.
   * Defaults to `section`.
   *
   * @default "section"
   */
  as?: ElementType;

  /** Content below the grid. */
  children?: ReactNode;
}

/**
 * A band of features laid out in a responsive grid.
 *
 * Each feature renders through the public `Card`, so a feature grid inherits the
 * framework's card variants, radius, hover and focus treatment and its
 * router-link substitution. The grid is one column on a phone, two on a tablet
 * and three from the `lg` breakpoint by default, and every part of that is
 * configurable through `components.featuregrid`.
 *
 * @param props - FeatureGrid configuration options and element attributes.
 * @param props.items - The features to show.
 * @param props.title - Heading of the band.
 * @param props.eyebrow - Short label above the heading.
 * @param props.description - Supporting sentence under the heading.
 * @param props.columns - Columns from the smallest viewport. Defaults to 1.
 * @param props.columnsMd - Columns from `md` upwards. Defaults to 2.
 * @param props.columnsLg - Columns from `lg` upwards. Defaults to 3.
 * @param props.gap - Space between cards. Defaults to "lg".
 * @param props.align - Heading alignment. Defaults to "center".
 * @param props.link - Substitution for the feature card links.
 * @param props.as - Element to render. Defaults to "section".
 * @returns The rendered band.
 *
 * @example
 * ```tsx
 * <FeatureGrid
 *   eyebrow="Why teams switch"
 *   title="Everything the campaign needs"
 *   items={[
 *     { title: "Templates", description: "Reusable messages." },
 *     { title: "Scheduling", description: "Send at the right time." },
 *   ]}
 * />
 * ```
 *
 * @see Card - The surface each feature renders in.
 */
export const FeatureGrid = forwardRef<HTMLElement, FeatureGridProps>(
  (
    {
      eyebrow,
      title,
      description,
      items,
      link,
      columns,
      columnsMd,
      columnsLg,
      gap,
      spacing,
      background,
      align,
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

    const resolved = resolveConfigCascade<
      FeatureGridConfig,
      Required<FeatureGridConfig>
    >(
      {
        columns,
        columnsMd,
        columnsLg,
        gap,
        spacing,
        background,
        align,
        containerSize,
        contained,
      },
      config.components?.featuregrid,
      FALLBACK_FEATURE_GRID_CONFIG,
    );

    const body = (
      <>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          align={resolved.align}
          className={FEATURE_HEADING_CLASS}
        />
        <Grid
          columns={resolved.columns}
          columnsMd={resolved.columnsMd}
          columnsLg={resolved.columnsLg}
          gap={resolved.gap}
          as="ul">
          {items.map((item, index) => (
            <li key={item.id ?? index} className="min-w-0">
              <Card
                variant="bordered"
                size="md"
                className="h-full"
                link={
                  item.href
                    ? {
                        component: link?.component,
                        componentProps: { ...link?.props, href: item.href },
                      }
                    : undefined
                }>
                <div className={FEATURE_CARD_BODY_CLASS}>
                  {item.icon && (
                    <div className={FEATURE_ICON_CLASS}>{item.icon}</div>
                  )}
                  <Typography as="h3" role="heading-sm">
                    {item.title}
                  </Typography>
                  {item.description && (
                    <Typography role="body-sm" tone="muted">
                      {item.description}
                    </Typography>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </Grid>
        {children}
      </>
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

FeatureGrid.displayName = "FeatureGrid";
