/**
 * FeatureGrid component for AsheeUI.
 *
 * This file provides the `FeatureGrid` pattern: a heading and a responsive grid
 * of feature cards, each with an optional icon and an optional destination. It
 * composes the framework's own `Section`, `Container`, `Grid`, `Card` and
 * `Typography` components rather than restating their styling.
 */

"use client";

import type { FeatureItem } from "@asheeui/core";
import { resolveConfigCascade } from "@asheeui/core";
import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useId,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import {
  FEATURE_CARD_BODY_CLASS,
  FEATURE_HEADING_CLASS,
  FEATURE_ICON_CLASS,
} from "../../../styles/feature-grid";
import { Card } from "../../data-display/card/Card";
import { Container } from "../../layouts/container/Container";
import { Grid } from "../../layouts/grid/Grid";
import { Section } from "../../layouts/section/Section";
import {
  SectionHeading,
  type SectionHeadingSize,
} from "../../layouts/section-kit/SectionHeading";
import { Typography } from "../../typography/Typography";
import {
  FALLBACK_FEATURE_GRID_CONFIG,
  type FeatureGridConfig,
} from "./feature-grid-config";

/**
 * One feature in the grid.
 *
 * The description is the framework's, declared in `@asheeui/core`, because the native
 * renderer reads the same one. It is re-exported here so a consumer importing the web
 * component keeps naming one type.
 */
export type { FeatureItem };

/**
 * Substitution for the link each feature card renders.
 */
export interface FeatureGridLink {
  /**
   * Component that replaces the anchor, such as a framework router link.
   */
  component?: ElementType | undefined;

  /**
   * Props for that component, applied to every feature card that has a
   * destination. The feature's own destination is added to them unless
   * `mapProps` states it instead, and a `className` here is merged into the
   * card's classes rather than replacing them.
   */
  props?: Record<string, unknown> | undefined;

  /**
   * Maps one feature to the props its link component receives.
   *
   * By default the framework passes `{ ...props, href: item.href }`, which is
   * the web's own anchor vocabulary. A router that names its destination
   * differently states it here, so the adapter stays with the consumer that
   * knows the router rather than with the band:
   *
   * ```tsx
   * <FeatureGrid
   *   items={items}
   *   link={{ component: Link, mapProps: (item) => ({ to: item.href }) }}
   * />
   * ```
   *
   * The returned props are merged over `props` and replace the default `href`
   * injection.
   *
   * @param item - The feature whose card is being linked.
   * @param index - Position of the feature in `items`.
   * @returns The props passed to the link component.
   */
  mapProps?:
    | ((item: FeatureItem, index: number) => Record<string, unknown>)
    | undefined;
}

type BaseFeatureGridProps = FeatureGridConfig &
  Omit<HTMLAttributes<HTMLElement>, "color" | "title">;

/**
 * Props for the FeatureGrid component.
 */
export interface FeatureGridProps extends BaseFeatureGridProps {
  /** Short label above the heading. */
  eyebrow?: ReactNode | undefined;

  /** Heading of the band. */
  title?: ReactNode | undefined;

  /** Supporting sentence under the heading. */
  description?: ReactNode | undefined;

  /** The features to show. */
  items: FeatureItem[];

  /** Substitution applied to the link of every feature card. */
  link?: FeatureGridLink | undefined;

  /**
   * Element the heading renders as.
   *
   * Defaults to `h2`. A grid nested under an existing section heading passes
   * `h3`, so the outline stays in order.
   *
   * @default "h2"
   */
  titleAs?: ElementType | undefined;

  /**
   * Size of the heading, which selects its typography role.
   *
   * @default "md"
   */
  headingSize?: SectionHeadingSize | undefined;

  /**
   * Element to render the band as.
   * Defaults to `section`.
   *
   * @default "section"
   */
  as?: ElementType | undefined;

  /** Content below the grid. */
  children?: ReactNode | undefined;
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
 * The band is a `section` landmark, and it names itself with the heading it
 * renders: it points `aria-labelledby` at that heading, so a reader navigating
 * by region hears the heading rather than an unnamed region. A band rendered
 * without a `title` has nothing to be named by, so it stays unnamed. A
 * consumer's own `aria-labelledby` wins over the generated one.
 *
 * @param props - FeatureGrid configuration options and element attributes.
 * @param props.items - The features to show.
 * @param props.title - Heading of the band.
 * @param props.eyebrow - Short label above the heading.
 * @param props.description - Supporting sentence under the heading.
 * @param props.titleAs - Element the heading renders as. Defaults to "h2".
 * @param props.headingSize - Size of the heading. Defaults to "md".
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
      titleAs,
      headingSize,
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
    // The band names itself with the heading it renders, so it is a region
    // rather than an unnamed `section`. `useId` keeps the pair stable across
    // the server render and the hydration.
    const headingId = useId();
    const hasTitle = title !== undefined && title !== null;

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
          titleAs={titleAs}
          size={headingSize}
          titleId={hasTitle ? headingId : undefined}
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
                        componentProps: {
                          ...link?.props,
                          ...(link?.mapProps
                            ? link.mapProps(item, index)
                            : { href: item.href }),
                        },
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
        aria-labelledby={hasTitle ? headingId : undefined}
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
