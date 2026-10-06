/**
 * Testimonials component for the native package.
 *
 * The component satisfies the framework's testimonials contract: a heading and a
 * responsive grid of attributed quotes, each rendered in the framework's own `Card` and
 * credited through the framework's `Avatar`. It composes the platform's own `Section`,
 * `Container`, `Grid`, `Card`, `Avatar` and `Text` rather than restating their styling, so
 * a quote looks like every other card on the platform.
 *
 * What differs is where the attribution's meaning lives. The web renders each quote as a
 * `figure` with its `figcaption` inside a list, so a browser announces a set of attributed
 * quotations. The platform has no list and no figure: its reader announces what it reaches,
 * in the order it reaches it, so the band keeps the quote and its attribution in one
 * surface and in that order — the words first, then who said them — which is the same
 * promise stated the way the platform can keep it.
 */

import {
  NATIVE_TESTIMONIAL_HEADING_CLASS,
  NATIVE_TESTIMONIAL_PERSON_CLASS,
  NATIVE_TESTIMONIAL_PERSON_TEXT_CLASS,
  NATIVE_TESTIMONIAL_QUOTE_CLASS,
  resolveConfigCascade,
  type TestimonialItem,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { Container } from "../../layout/Container";
import { Grid } from "../../layout/Grid";
import { Section } from "../../layout/Section";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { Avatar } from "../avatar/Avatar";
import { Card } from "../card/Card";
import { SectionHeading } from "../section-kit/SectionHeading";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_TESTIMONIALS_CONFIG,
  type NativeTestimonialsConfig,
} from "./testimonials-config";

/**
 * Props for the native Testimonials band.
 */
export interface TestimonialsProps
  extends NativeTestimonialsConfig,
    Omit<ViewProps, "children" | "style"> {
  /** The quotes to show. */
  items: TestimonialItem[];

  /** Short label above the heading. */
  eyebrow?: ReactNode;

  /** Heading of the band. */
  title?: ReactNode;

  /** Supporting sentence under the heading. */
  description?: ReactNode;

  /** Content below the quotes. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A band of attributed customer quotes.
 *
 * Each quote renders through the public native `Card`, and its picture through the public
 * native `Avatar`, so a band inherits the framework's surfaces and the avatar's substitution
 * API and initials fallback without the consumer doing anything. The grid is one column on a
 * phone, two on a tablet and three from the `lg` window by default, and every part of that
 * is configurable through `components.testimonials`.
 *
 * @param props - The band's options and the platform's view props.
 * @param props.items - The quotes to show.
 * @param props.title - Heading of the band.
 * @param props.eyebrow - Short label above the heading.
 * @param props.description - Supporting sentence under the heading.
 * @param props.columns - Columns from the smallest window. Defaults to 1.
 * @param props.columnsMd - Columns from `md` upwards. Defaults to 2.
 * @param props.columnsLg - Columns from `lg` upwards. Defaults to 3.
 * @param props.gap - Space between quotes. Defaults to "lg".
 * @param props.align - Heading alignment. Defaults to "center".
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
 * @see Avatar - The picture and the initials fallback each attribution carries.
 */
export function Testimonials({
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
  className,
  style,
  children,
  ...rest
}: TestimonialsProps) {
  const config = useAsheeNativeConfig();

  const resolved = resolveConfigCascade<
    NativeTestimonialsConfig,
    Required<NativeTestimonialsConfig>
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
    config.components.testimonials,
    FALLBACK_NATIVE_TESTIMONIALS_CONFIG,
  );

  const body = (
    <>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        align={resolved.align}
        className={NATIVE_TESTIMONIAL_HEADING_CLASS}
      />
      <Grid
        columns={resolved.columns}
        columnsMd={resolved.columnsMd}
        columnsLg={resolved.columnsLg}
        gap={resolved.gap}>
        {items.map((item, index) => (
          <Card
            key={item.id ?? index}
            variant="bordered"
            size="md"
            className="h-full">
            {/* The words come first and the attribution follows, which is how a reader
                hears a quotation the platform has no figure element to state. */}
            <View className={NATIVE_TESTIMONIAL_QUOTE_CLASS}>
              <Text role="body-md">{item.quote}</Text>
              <View className={NATIVE_TESTIMONIAL_PERSON_CLASS}>
                <Avatar
                  name={item.name}
                  src={item.avatarSrc}
                  size="sm"
                  component={item.avatarComponent}
                  componentProps={item.avatarComponentProps}
                />
                <View className={NATIVE_TESTIMONIAL_PERSON_TEXT_CLASS}>
                  <Text role="label">{item.name}</Text>
                  {item.role ? (
                    <Text role="caption" tone="muted">
                      {item.role}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>
          </Card>
        ))}
      </Grid>
      {children}
    </>
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
