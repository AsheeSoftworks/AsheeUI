/**
 * Testimonials component for AsheeUI.
 *
 * This file provides the `Testimonials` pattern: a heading and a responsive grid
 * of attributed quotes, each rendered in the framework's own `Card` and credited
 * through the framework's `Avatar`. The quotes are a list of figures, so
 * assistive technology hears a set of attributed quotations rather than a wall
 * of unattributed text.
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
import { Avatar } from "../avatar/Avatar";
import { Card } from "../card/Card";
import { Container } from "../container/Container";
import { Grid } from "../grid/Grid";
import { Section } from "../section/Section";
import { SectionHeading } from "../section-kit/SectionHeading";
import { Typography } from "../typography/Typography";
import {
  FALLBACK_TESTIMONIALS_CONFIG,
  type TestimonialsConfig,
} from "./testimonials-config";
import {
  TESTIMONIAL_HEADING_CLASS,
  TESTIMONIAL_PERSON_CLASS,
  TESTIMONIAL_QUOTE_CLASS,
} from "./testimonials-styles";

/**
 * One attributed quote.
 */
export interface TestimonialItem {
  /** Stable identifier for the quote. Defaults to its position in the list. */
  id?: string | number;

  /** What the person said. */
  quote: ReactNode;

  /** Name of the person. */
  name: string;

  /** Role or organisation of the person. */
  role?: string;

  /** Picture of the person, passed to the framework's `Avatar`. */
  avatarSrc?: string;

  /** Component that replaces the avatar picture, such as a framework image. */
  avatarComponent?: ElementType;

  /** Additional props for that component. */
  avatarComponentProps?: Record<string, unknown>;
}

type BaseTestimonialsProps = TestimonialsConfig &
  Omit<HTMLAttributes<HTMLElement>, "color" | "title">;

/**
 * Props for the Testimonials component.
 */
export interface TestimonialsProps extends BaseTestimonialsProps {
  /** Short label above the heading. */
  eyebrow?: ReactNode;

  /** Heading of the band. */
  title?: ReactNode;

  /** Supporting sentence under the heading. */
  description?: ReactNode;

  /** The quotes to show. */
  items: TestimonialItem[];

  /**
   * Element to render the band as.
   * Defaults to `section`.
   *
   * @default "section"
   */
  as?: ElementType;

  /** Content below the quotes. */
  children?: ReactNode;
}

/**
 * A band of attributed customer quotes.
 *
 * Testimonials renders each quote as a `figure` with its attribution in a
 * `figcaption`, inside a list element, so a screen reader announces the set. The
 * picture goes through `Avatar`, so its substitution API and its initials
 * fallback apply without the consumer doing anything.
 *
 * @param props - Testimonials configuration options and element attributes.
 * @param props.items - The quotes to show.
 * @param props.title - Heading of the band.
 * @param props.eyebrow - Short label above the heading.
 * @param props.description - Supporting sentence under the heading.
 * @param props.columns - Columns from the smallest viewport. Defaults to 1.
 * @param props.columnsMd - Columns from `md` upwards. Defaults to 2.
 * @param props.columnsLg - Columns from `lg` upwards. Defaults to 3.
 * @param props.gap - Space between quotes. Defaults to "lg".
 * @param props.align - Heading alignment. Defaults to "center".
 *
 * @returns The rendered band.
 *
 * @example
 * ```tsx
 * <Testimonials
 *   title="Teams send more with Ashee"
 *   items={[{ quote: "Twice as fast.", name: "Ama Boateng", role: "Growth" }]}
 * />
 * ```
 *
 * @see Card - The surface each quote renders in.
 */
export const Testimonials = forwardRef<HTMLElement, TestimonialsProps>(
  (
    {
      eyebrow,
      title,
      description,
      items,
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
      TestimonialsConfig,
      Required<TestimonialsConfig>
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
      config.components?.testimonials,
      FALLBACK_TESTIMONIALS_CONFIG,
    );

    const body = (
      <>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          align={resolved.align}
          className={TESTIMONIAL_HEADING_CLASS}
        />
        <Grid
          columns={resolved.columns}
          columnsMd={resolved.columnsMd}
          columnsLg={resolved.columnsLg}
          gap={resolved.gap}
          as="ul">
          {items.map((item, index) => (
            <li key={item.id ?? index} className="min-w-0">
              <Card variant="bordered" size="md" className="h-full">
                <figure className={TESTIMONIAL_QUOTE_CLASS}>
                  <Typography as="blockquote" role="body-md">
                    {item.quote}
                  </Typography>
                  <figcaption className={TESTIMONIAL_PERSON_CLASS}>
                    <Avatar
                      name={item.name}
                      src={item.avatarSrc}
                      size="sm"
                      component={item.avatarComponent}
                      componentProps={item.avatarComponentProps}
                    />
                    <span className="flex min-w-0 flex-col">
                      <Typography role="label">{item.name}</Typography>
                      {item.role && (
                        <Typography role="caption" tone="muted">
                          {item.role}
                        </Typography>
                      )}
                    </span>
                  </figcaption>
                </figure>
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

Testimonials.displayName = "Testimonials";
