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
  resolveConfigCascade,
  TESTIMONIAL_HEADING_CLASS,
  TESTIMONIAL_PERSON_CLASS,
  TESTIMONIAL_QUOTE_CLASS,
  type TestimonialItem,
} from "@asheeui/core";
import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useId,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import { Avatar } from "../../data-display/avatar/Avatar";
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
  FALLBACK_TESTIMONIALS_CONFIG,
  type TestimonialsConfig,
} from "./testimonials-config";

export type { TestimonialItem };

type BaseTestimonialsProps = TestimonialsConfig &
  Omit<HTMLAttributes<HTMLElement>, "color" | "title">;

/**
 * Props for the Testimonials component.
 */
export interface TestimonialsProps extends BaseTestimonialsProps {
  /** Short label above the heading. */
  eyebrow?: ReactNode | undefined;

  /** Heading of the band. */
  title?: ReactNode | undefined;

  /** Supporting sentence under the heading. */
  description?: ReactNode | undefined;

  /** The quotes to show. */
  items: TestimonialItem[];

  /**
   * Element the heading renders as.
   *
   * Defaults to `h2`. A wall nested under an existing section heading passes
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

  /** Content below the quotes. */
  children?: ReactNode | undefined;
}

/**
 * A band of attributed customer quotes.
 *
 * Testimonials renders each quote as a `figure` with its attribution in a
 * `figcaption`, inside a list element, so a screen reader announces the set. The
 * picture goes through `Avatar`, so its substitution API and its initials
 * fallback apply without the consumer doing anything. The avatar is passed an
 * empty `alt`, which hides it from assistive technology: the `figcaption` already
 * prints the person's name, so naming the picture too would announce the same
 * person twice.
 *
 * The band is a `section` landmark, and it names itself with the heading it
 * renders: it points `aria-labelledby` at that heading, so a reader navigating
 * by region hears the heading rather than an unnamed region. A band rendered
 * without a `title` has nothing to be named by, so it stays unnamed. A
 * consumer's own `aria-labelledby` wins over the generated one.
 *
 * @param props - Testimonials configuration options and element attributes.
 * @param props.items - The quotes to show.
 * @param props.title - Heading of the band.
 * @param props.eyebrow - Short label above the heading.
 * @param props.description - Supporting sentence under the heading.
 * @param props.titleAs - Element the heading renders as. Defaults to "h2".
 * @param props.headingSize - Size of the heading. Defaults to "md".
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
              <Card variant="bordered" size="md" className="h-full">
                <figure className={TESTIMONIAL_QUOTE_CLASS}>
                  <Typography as="blockquote" role="body-md">
                    {item.quote}
                  </Typography>
                  <figcaption className={TESTIMONIAL_PERSON_CLASS}>
                    <Avatar
                      name={item.name}
                      src={item.avatarSrc}
                      // The caption already prints the name, so the picture is
                      // decoration: an empty alt hides it from assistive
                      // technology while the initials still derive from `name`.
                      alt=""
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

Testimonials.displayName = "Testimonials";
