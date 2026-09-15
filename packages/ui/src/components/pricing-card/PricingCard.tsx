/**
 * PricingCard component for AsheeUI.
 *
 * This file provides the `PricingCard` pattern: one plan, its price, its feature
 * list and its actions, rendered in the framework's own `Card` with the
 * framework's typography. A pricing table is a layout decision, so the card is
 * the unit and a consumer places several of them in a `Grid`.
 */

"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { CheckIcon } from "../../icons/CheckIcon";
import { CloseIcon } from "../../icons/CloseIcon";
import { useAsheeConfig } from "../../libs/context";
import type { ActionConfig } from "../../shared";
import { cn } from "../../utils";
import { resolveConfigCascade } from "../../utils/resolve-token";
import { Card } from "../card/Card";
import { ActionGroup } from "../section-kit/ActionGroup";
import { Typography } from "../typography/Typography";
import {
  FALLBACK_PRICING_CARD_CONFIG,
  type PricingCardConfig,
} from "./pricing-card-config";
import {
  PRICING_BADGE_CLASS,
  PRICING_BODY_CLASS,
  PRICING_FEATURE_CLASS,
  PRICING_FEATURE_EXCLUDED_CLASS,
  PRICING_FEATURE_INCLUDED_CLASS,
  PRICING_FEATURES_CLASS,
  PRICING_HIGHLIGHTED_CLASS,
  PRICING_PRICE_CLASS,
} from "./pricing-card-styles";

/**
 * One line of a plan's feature list.
 */
export interface PricingFeatureItem {
  /** Stable identifier for the line. Defaults to its position in the list. */
  id?: string | number;

  /** What the line says. */
  label: ReactNode;

  /**
   * Whether the plan includes this line.
   * An excluded line also carries the wording "(not included)" for assistive
   * technology, so the meaning never depends on the visual treatment alone.
   *
   * @default true
   */
  included?: boolean;
}

type BasePricingCardProps = PricingCardConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "color" | "title">;

/**
 * Props for the PricingCard component.
 */
export interface PricingCardProps extends BasePricingCardProps {
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
}

/**
 * One plan in a pricing table.
 *
 * The amount is a required prop and renders as text rather than being parsed as
 * a number, so a plan can say "Free", "$12" or "Custom" without the framework
 * pretending to understand currency. A recommended plan is marked visually and
 * carries the reason in its `badge`, so the recommendation is never communicated
 * by colour alone.
 *
 * @param props - PricingCard configuration options and element attributes.
 * @param props.name - Name of the plan.
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
 *
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
 *   primaryAction={{ label: "Choose Growth", href: "/signup" }}
 * />
 * ```
 *
 * @see Grid - Places several plans in a table.
 * @see Card - The surface the plan renders in.
 */
export const PricingCard = forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
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
      children,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();

    const resolved = resolveConfigCascade<
      PricingCardConfig,
      Required<PricingCardConfig>
    >(
      { variant, size, highlighted },
      config.components?.pricingcard,
      FALLBACK_PRICING_CARD_CONFIG,
    );

    return (
      <Card
        ref={ref}
        variant={resolved.variant}
        size={resolved.size}
        title={name}
        description={description}
        header={
          badge ? (
            <span className={PRICING_BADGE_CLASS}>{badge}</span>
          ) : undefined
        }
        className={cn(
          "h-full",
          resolved.highlighted && PRICING_HIGHLIGHTED_CLASS,
          className,
        )}
        {...rest}>
        <div className={PRICING_BODY_CLASS}>
          <p className={PRICING_PRICE_CLASS}>
            <Typography as="span" role="heading-xl">
              {price}
            </Typography>
            {period && (
              <Typography as="span" role="body-sm" tone="muted">
                {period}
              </Typography>
            )}
          </p>

          {features && features.length > 0 && (
            <ul className={PRICING_FEATURES_CLASS}>
              {features.map((feature, index) => {
                const excluded = feature.included === false;

                return (
                  <li
                    key={feature.id ?? index}
                    className={PRICING_FEATURE_CLASS}>
                    {excluded ? (
                      <CloseIcon className={PRICING_FEATURE_EXCLUDED_CLASS} />
                    ) : (
                      <CheckIcon className={PRICING_FEATURE_INCLUDED_CLASS} />
                    )}
                    <Typography
                      role="body-sm"
                      tone={excluded ? "muted" : "default"}>
                      {feature.label}
                      {excluded && (
                        <span className="sr-only"> (not included)</span>
                      )}
                    </Typography>
                  </li>
                );
              })}
            </ul>
          )}

          <ActionGroup
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
            className="w-full"
          />

          {children}
        </div>
      </Card>
    );
  },
);

PricingCard.displayName = "PricingCard";
