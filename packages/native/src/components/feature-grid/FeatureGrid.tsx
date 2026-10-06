/**
 * FeatureGrid component for the native package.
 *
 * The component satisfies the framework's feature-grid contract: a heading and a
 * responsive grid of feature cards, each with an optional icon and an optional
 * destination. It composes the platform's own `Section`, `Container`, `Grid`, `Card`
 * and `Text` rather than restating their styling, so a feature card looks like every
 * other card on the platform.
 *
 * What differs from the web is where the responsiveness lives. The web states a column
 * count per breakpoint as class variants; the platform has no variants, so the grid
 * reads the window it measures and picks the count, which is the same rule the layout
 * kit's grid follows. A feature that carries a destination is a pressable card whose
 * press follows the destination through the platform's URL handler, because the
 * platform has no anchor a router could replace.
 */

import {
  type FeatureItem,
  NATIVE_FEATURE_CARD_BODY_CLASS,
  NATIVE_FEATURE_HEADING_CLASS,
  NATIVE_FEATURE_ICON_CLASS,
  NATIVE_FEATURE_ICON_TONE_CLASS,
  resolveConfigCascade,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { Container } from "../../layout/Container";
import { Grid } from "../../layout/Grid";
import { Section } from "../../layout/Section";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { openDestination } from "../../utils/open-destination";
import { Card } from "../card/Card";
import { SectionHeading } from "../section-kit/SectionHeading";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_FEATURE_GRID_CONFIG,
  type NativeFeatureGridConfig,
} from "./feature-grid-config";

/**
 * Props for the native FeatureGrid.
 */
export interface FeatureGridProps
  extends NativeFeatureGridConfig,
    Omit<ViewProps, "children" | "style"> {
  /** The features to show. */
  items: FeatureItem[];

  /** Heading of the band. */
  title?: ReactNode;

  /** Short label above the heading. */
  eyebrow?: ReactNode;

  /** Supporting sentence under the heading. */
  description?: ReactNode;

  /** Content below the grid. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A band of features laid out in a responsive grid.
 *
 * Each feature renders through the public native `Card`, so a feature grid inherits the
 * framework's card surfaces, radius and press behaviour. The grid is one column on a
 * phone, two on a tablet and three from the `lg` window by default, and every part of
 * that is configurable through `components.featuregrid`.
 *
 * @param props - The grid's options and the platform's view props.
 * @param props.items - The features to show.
 * @param props.title - Heading of the band.
 * @param props.eyebrow - Short label above the heading.
 * @param props.description - Supporting sentence under the heading.
 * @param props.columns - Columns from the smallest window. Defaults to 1.
 * @param props.columnsMd - Columns from `md` upwards. Defaults to 2.
 * @param props.columnsLg - Columns from `lg` upwards. Defaults to 3.
 * @param props.gap - Space between cards. Defaults to "lg".
 * @param props.align - Heading alignment. Defaults to "center".
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
export function FeatureGrid({
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
}: FeatureGridProps) {
  const config = useAsheeNativeConfig();

  const resolved = resolveConfigCascade<
    NativeFeatureGridConfig,
    Required<NativeFeatureGridConfig>
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
    config.components.featuregrid,
    FALLBACK_NATIVE_FEATURE_GRID_CONFIG,
  );

  const body = (
    <>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        align={resolved.align}
        className={NATIVE_FEATURE_HEADING_CLASS}
      />
      <Grid
        columns={resolved.columns}
        columnsMd={resolved.columnsMd}
        columnsLg={resolved.columnsLg}
        gap={resolved.gap}>
        {items.map((item, index) => {
          const { href } = item;

          return (
            <Card
              key={item.id ?? index}
              variant="bordered"
              size="md"
              // A destination is what makes a card a control here, which is the same
              // rule the web card follows with an anchor.
              isPressable={Boolean(href)}
              onPress={href ? () => openDestination(href) : undefined}>
              <View className={NATIVE_FEATURE_CARD_BODY_CLASS}>
                {item.icon && (
                  <View
                    className={classNames(
                      NATIVE_FEATURE_ICON_CLASS,
                      NATIVE_FEATURE_ICON_TONE_CLASS,
                    )}>
                    {item.icon}
                  </View>
                )}
                <Text role="heading-sm">{item.title}</Text>
                {item.description && (
                  <Text role="body-sm" tone="muted">
                    {item.description}
                  </Text>
                )}
              </View>
            </Card>
          );
        })}
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
