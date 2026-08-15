"use client";

import { useSettings } from "@ashee/settings";
import { type Radius, useResponsiveVars } from "@ashee/theme";
import { cn } from "@ashee/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import {
  type ChangeEvent,
  forwardRef,
  type InputHTMLAttributes,
  useId,
  useMemo,
  useState,
} from "react";
import { useAsheeConfig } from "../../../context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import type { Color } from "../../../shared/variant";
import { resolveScale } from "../../../utils/resolve-token";
import type { FieldSizeKey, FieldStatus } from "../field/field-config";
import { defaultRadioSizeScale } from "./default-radio-config";
import { flattenRadioSizeScale } from "./flatten-radio-size-scale";
import type { RadioConfig, RadioSizeScale, RadioVariant } from "./radio-config";
import { useRadioGroupContext } from "./radio-context";

const RADIO_COLOR_CLASS: Record<
  Color,
  { border: string; bg: string; cardBg: string }
> = {
  none: {
    border: "border-background",
    bg: "bg-background",
    cardBg: "bg-background/10",
  },
  default: {
    border: "border-secondary",
    bg: "bg-background",
    cardBg: "bg-secondary/10",
  },
  primary: {
    border: "border-primary",
    bg: "bg-primary",
    cardBg: "bg-primary/10",
  },
  secondary: {
    border: "border-secondary",
    bg: "bg-secondary",
    cardBg: "bg-secondary/10",
  },
  danger: { border: "border-danger", bg: "bg-danger", cardBg: "bg-danger/10" },
  warning: {
    border: "border-warning",
    bg: "bg-warning",
    cardBg: "bg-warning/10",
  },
  success: {
    border: "border-success",
    bg: "bg-success",
    cardBg: "bg-success/10",
  },
};

const STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "border-border",
  error: "border-danger",
  warning: "border-warning",
  success: "border-success",
};

export interface RadioProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "onChange" | "children"
  > {
  value: string;
  size?: FieldSizeKey;
  color?: Color;
  radius?: keyof Radius;
  variant?: RadioVariant;
  animation?: AnimationProp;
  status?: FieldStatus;
  label?: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (
    checked: boolean,
    value: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      value,
      size,
      color,
      radius,
      variant,
      animation,
      status,
      label,
      description,
      id,
      name: directName,
      className,
      disabled: directDisabled,
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const { settings } = useSettings();
    const group = useRadioGroupContext();
    const sectionConfig = config.components?.radio as RadioConfig | undefined;

    const generatedId = useId();
    const radioId = id ?? generatedId;

    // Derived properties from Group context or Direct props
    const resolvedName = directName ?? group?.name;
    const isDisabled = directDisabled ?? group?.disabled ?? false;
    const resolvedVariant =
      variant ?? group?.variant ?? sectionConfig?.variant ?? "default";
    const resolvedStatus = status ?? group?.status ?? "default";
    const isCard = resolvedVariant === "card";

    // Controlled / Uncontrolled evaluation
    const [uncontrolledChecked, setUncontrolledChecked] =
      useState(defaultChecked);
    const isChecked = group
      ? group.value === value
      : (controlledChecked ?? uncontrolledChecked);

    // Size token resolution
    const sizeScale = (sectionConfig?.size ??
      defaultRadioSizeScale) as RadioSizeScale;
    const resolvedSizeKey = size ?? group?.size ?? sizeScale.default;
    const responsiveVars = useMemo(
      () => flattenRadioSizeScale(sizeScale),
      [sizeScale],
    );
    useResponsiveVars(
      "ashee-radio-tokens",
      responsiveVars,
      config.theme.breakpoints,
    );

    // Style token resolution
    const resolvedColor = (color ??
      group?.color ??
      sectionConfig?.color ??
      config.theme.defaultColor ??
      "primary") as Color;

    const resolvedRadiusKey = typeof radius === "string" ? radius : undefined;
    const resolvedSectionRadiusKey =
      typeof sectionConfig?.radius === "string"
        ? sectionConfig.radius
        : undefined;

    // Determine key for radius check
    const effectiveRadiusKey =
      resolvedRadiusKey ??
      resolvedSectionRadiusKey ??
      config.theme.radius.default;

    // Outer card container radius resolution (override "full" to "xl" for cards)
    const cardRadiusKey =
      isCard && effectiveRadiusKey === "full" ? "xl" : effectiveRadiusKey;

    const resolvedCardRadius = resolveScale(
      cardRadiusKey,
      undefined,
      config.theme.radius.default,
      config.theme.radius.values,
    );

    const resolvedRadius = resolveScale(
      resolvedRadiusKey,
      resolvedSectionRadiusKey,
      config.theme.radius.default,
      config.theme.radius.values,
    );

    const colorClasses =
      RADIO_COLOR_CLASS[resolvedColor] ?? RADIO_COLOR_CLASS.primary;
    const motionProps = resolveAnimation(
      animation ?? (sectionConfig?.animation as AnimationProp | undefined),
      settings.enableAnimations,
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (isDisabled) return;
      if (group) {
        group.onChange?.(value);
      } else {
        if (controlledChecked === undefined) {
          setUncontrolledChecked(true);
        }
      }
      onChange?.(e.target.checked, value, e);
    };

    return (
      <label
        htmlFor={radioId}
        className={cn(
          "inline-flex items-start select-none cursor-pointer transition-all duration-150",
          isCard ? "p-3 border bg-background" : "gap-2",
          isCard &&
            (isChecked
              ? `${colorClasses.border} ${colorClasses.cardBg}`
              : STATUS_BORDER_CLASS[resolvedStatus]),
          isDisabled && "opacity-50 pointer-events-none cursor-not-allowed",
          className,
        )}
        style={{
          borderRadius: isCard ? resolvedCardRadius : undefined,
          gap: `var(--ashee-radio-${resolvedSizeKey}-gap)`,
        }}>
        {/* Hidden Native Radio Input */}
        <input
          ref={ref}
          id={radioId}
          type="radio"
          name={resolvedName}
          value={value}
          checked={isChecked}
          disabled={isDisabled}
          onChange={handleChange}
          className="sr-only peer"
          {...(rest as unknown as InputHTMLAttributes<HTMLInputElement>)}
        />

        {/* Outer Radio Box / Circle */}
        <div
          className={cn(
            "shrink-0 flex items-center justify-center border-2 transition-all mt-0.5",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
            isChecked
              ? colorClasses.border
              : STATUS_BORDER_CLASS[resolvedStatus],
          )}
          style={{
            width: `var(--ashee-radio-${resolvedSizeKey}-outer-s)`,
            height: `var(--ashee-radio-${resolvedSizeKey}-outer-s)`,
            borderRadius: resolvedRadius,
          }}>
          {/* Animated Inner Radio Indicator */}
          <motion.span
            className={cn("rounded-full", colorClasses.bg)}
            style={{
              width: `var(--ashee-radio-${resolvedSizeKey}-inner-s)`,
              height: `var(--ashee-radio-${resolvedSizeKey}-inner-s)`,
              borderRadius: resolvedRadius,
            }}
            initial={false}
            animate={{
              scale: isChecked ? 1 : 0,
              opacity: isChecked ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            {...(motionProps as HTMLMotionProps<"span">)}
          />
        </div>

        {/* Text Container */}
        {(label || description) && (
          <div className="flex flex-col min-w-0">
            {label && (
              <span
                className="font-medium text-foreground leading-snug"
                style={{
                  fontSize: `var(--ashee-radio-${resolvedSizeKey}-font-s)`,
                }}>
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs sm:text-sm text-muted-foreground leading-snug mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  },
);
Radio.displayName = "Radio";
