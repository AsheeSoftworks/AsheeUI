/**
 * PricingCard component for the native package.
 *
 * The component satisfies the framework's pricing-card contract: one plan, its amount, its
 * feature list and its actions, in the framework's own `Card` and the framework's own
 * `Text`. A pricing table is a layout decision, so the card is the unit and a screen places
 * several of them in a `Stack`, exactly as the web places several in a `Grid`.
 *
 * What the platform decides differently is what it can draw. The web marks an included
 * feature with a drawing and an excluded one with another; this package ships no icon set,
 * so the two markers are characters. The web marks the recommended plan with a ring over
 * the card's border; the platform's card states its accent as a border colour, so the mark
 * is the card's own `color` — the same accent every other surface in the framework uses. An
 * elevated plan has no shadow to take on the platform either, so it keeps the raised
 * surface's own colour, which is the web's `elevated` surface without the shadow.
 *
 * The exclusion is stated in words as well as in style, on both platforms: a muted marker
 * says "not included" to a sighted reader, and the wording beside it says the same thing to
 * a reader who cannot see the marker.
 */

import {
  type ActionConfig,
  NATIVE_PRICING_BADGE_CLASS,
  NATIVE_PRICING_BADGE_TEXT_CLASS,
  NATIVE_PRICING_BODY_CLASS,
  NATIVE_PRICING_EXCLUDED_GLYPH,
  NATIVE_PRICING_FEATURE_CLASS,
  NATIVE_PRICING_FEATURE_EXCLUDED_CLASS,
  NATIVE_PRICING_FEATURE_INCLUDED_CLASS,
  NATIVE_PRICING_FEATURE_MARKER_CLASS,
  NATIVE_PRICING_FEATURES_CLASS,
  NATIVE_PRICING_HIGHLIGHTED_CLASS,
  NATIVE_PRICING_INCLUDED_GLYPH,
  NATIVE_PRICING_PRICE_CLASS,
  NATIVE_VISUALLY_HIDDEN_CLASS,
  type PricingFeatureItem,
  resolveConfigCascade,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { Card } from "../card/Card";
import { ActionGroup } from "../section-kit/ActionGroup";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_PRICING_CARD_CONFIG,
  type NativePricingCardConfig,
} from "./pricing-card-config";

/**
 * Props for the native PricingCard.
 */
export interface PricingCardProps
  extends NativePricingCardConfig,
    Omit<ViewProps, "children" | "style"> {
  /** Name of the plan. */
  name: ReactNode;

  /** The amount, shown as the card's leading figure. */
  price: ReactNode;

  /** Billing period shown beside the amount, for example "/month". */
  period?: ReactNode;

  /** One sentence about who the plan is for. */
  description?: ReactNode;

  /** Short label above the plan name, for example "Most popular". */
  badge?: ReactNode;

  /** The plan's feature lines. */
  features?: PricingFeatureItem[];

  /** The emphasised action, typically the plan's signup. */
  primaryAction?: ActionConfig;

  /** The supporting action, typically a sales contact. */
  secondaryAction?: ActionConfig;

  /** Content below the actions. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * One plan in a pricing table.
 *
 * The amount is a required prop and renders as text rather than being parsed as a number,
 * so a plan can say "Free", "$12" or "Custom" without the framework pretending to
 * understand currency. A recommended plan is marked by the card's accent and carries the
 * reason in its `badge`, so the recommendation is never communicated by colour alone.
 *
 * @param props - The plan's options and the platform's view props.
 * @param props.name - Name of the plan, announced as a heading.
 * @param props.price - The amount.
 * @param props.period - Billing period shown beside the amount.
 * @param props.description - One sentence about the plan.
 * @param props.badge - Short label above the plan name.
 * @param props.features - The plan's feature lines.
 * @param props.primaryAction - The emphasised action.
 * @param props.secondaryAction - The supporting action.
 * @param props.variant - Surface treatment. Defaults to "bordered".
 * @param props.size - Card density. Defaults to "lg".
 * @param props.highlighted - Mark the plan as recommended. Defaults to false.
 * @returns The rendered card.
 *
 * @example
 * ```tsx
 * <PricingCard
 *   badge="Most popular"
 *   name="Growth"
 *   price="$29"
 *   period="/month"
 *   highlighted
 *   features={[{ label: "10,000 messages" }]}
 *   primaryAction={{ label: "Choose Growth", href: "https://example.com/signup" }}
 * />
 * ```
 *
 * @see Card - The surface the plan renders in.
 */
export function PricingCard({
  name,
  price,
  period,
  description,
  badge,
  features,
  primaryAction,
  secondaryAction,
  variant,
  size,
  highlighted,
  className,
  style,
  children,
  ...rest
}: PricingCardProps) {
  const config = useAsheeNativeConfig();

  const resolved = resolveConfigCascade<
    NativePricingCardConfig,
    Required<NativePricingCardConfig>
  >(
    { variant, size, highlighted },
    config.components.pricingcard,
    FALLBACK_NATIVE_PRICING_CARD_CONFIG,
  );

  return (
    <Card
      // An elevated plan keeps the raised surface's own colour: the platform's card paints
      // no shadow, so a bordered surface would be the wrong treatment rather than a plain one.
      variant={resolved.variant === "elevated" ? "solid" : "bordered"}
      color={resolved.highlighted ? "primary" : undefined}
      size={resolved.size}
      className={classNames(
        resolved.highlighted && NATIVE_PRICING_HIGHLIGHTED_CLASS,
        className,
      )}
      style={style}
      {...rest}>
      <View className={NATIVE_PRICING_BODY_CLASS}>
        {badge ? (
          <View className={NATIVE_PRICING_BADGE_CLASS}>
            <Text role="label" className={NATIVE_PRICING_BADGE_TEXT_CLASS}>
              {badge}
            </Text>
          </View>
        ) : null}

        {/* The plan's name heads the card, so a reader can move between plans. */}
        <Text role="heading-md" accessibilityRole="header">
          {name}
        </Text>

        {description ? (
          <Text role="body-sm" tone="muted">
            {description}
          </Text>
        ) : null}

        <View className={NATIVE_PRICING_PRICE_CLASS}>
          <Text role="heading-xl">{price}</Text>
          {period ? (
            <Text role="body-sm" tone="muted">
              {period}
            </Text>
          ) : null}
        </View>

        {features && features.length > 0 ? (
          <View className={NATIVE_PRICING_FEATURES_CLASS}>
            {features.map((feature, index) => {
              const excluded = feature.included === false;

              return (
                <View
                  key={feature.id ?? index}
                  className={NATIVE_PRICING_FEATURE_CLASS}>
                  <Text
                    className={classNames(
                      NATIVE_PRICING_FEATURE_MARKER_CLASS,
                      excluded
                        ? NATIVE_PRICING_FEATURE_EXCLUDED_CLASS
                        : NATIVE_PRICING_FEATURE_INCLUDED_CLASS,
                    )}>
                    {excluded
                      ? NATIVE_PRICING_EXCLUDED_GLYPH
                      : NATIVE_PRICING_INCLUDED_GLYPH}
                  </Text>
                  <Text role="body-sm" tone={excluded ? "muted" : "default"}>
                    {feature.label}
                  </Text>
                  {/* The marker says it in style; the wording says it in words, so the
                      meaning never depends on the drawing alone. */}
                  {excluded ? (
                    <Text className={NATIVE_VISUALLY_HIDDEN_CLASS}>
                      {" "}
                      (not included)
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : null}

        <ActionGroup
          primaryAction={primaryAction}
          secondaryAction={secondaryAction}
          className="w-full"
        />

        {children}
      </View>
    </Card>
  );
}
