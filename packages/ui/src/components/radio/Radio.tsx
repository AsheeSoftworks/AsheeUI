"use client";

import {
  type ChangeEvent,
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useCallback,
  useId,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, type Radius } from "../../shared/radius";
import type { Color } from "../../shared/variant";
import { cn } from "../../utils";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import type { FieldSizeKey, FieldStatus } from "../field/field-config";
import {
  FALLBACK_RADIO_CONFIG,
  type RadioConfig,
  type RadioVariant,
} from "./radio-config";
import { useRadioGroupContext } from "./radio-context";
import {
  RADIO_COLOR_CLASS,
  RADIO_FONT_SIZE_CLASS,
  RADIO_GAP_CLASS,
  RADIO_INNER_SIZE_CLASS,
  RADIO_OUTER_SIZE_CLASS,
  RADIO_STATUS_BORDER_CLASS,
} from "./radio-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

export interface RadioProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "onChange" | "children" | "color"
  > {
  value: string;
  size?: FieldSizeKey;
  color?: Color;
  radius?: Radius;
  variant?: RadioVariant;
  status?: FieldStatus;
  label?: ReactNode;
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (
    checked: boolean,
    value: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
}

// ─── Component Implementation ─────────────────────────────────────────────────

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      value,
      size,
      color,
      radius,
      variant,
      status,
      label,
      description,
      id,
      name: directName,
      className,
      style,
      disabled: directDisabled,
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const group = useRadioGroupContext();
    const sectionConfig = config.components?.radio as RadioConfig | undefined;

    const generatedId = useId();
    const radioId = id ?? generatedId;

    // Derived properties from Group context or Direct props
    const resolvedName = directName ?? group?.name;
    const isDisabled = directDisabled ?? group?.disabled ?? false;

    // Controlled / Uncontrolled State Evaluation
    const [uncontrolledChecked, setUncontrolledChecked] =
      useState(defaultChecked);
    const isChecked = group
      ? group.value === value
      : (controlledChecked ?? uncontrolledChecked);

    // ─── 1. Token Resolvers (4-Tier Cascade: Prop -> Group -> Section -> Fallback)

    const resolvedSizeKey = resolveCascade<FieldSizeKey>(
      size ?? group?.size,
      sectionConfig?.size,
      undefined,
      FALLBACK_RADIO_CONFIG.size,
    );

    const resolvedVariant = resolveCascade<RadioVariant>(
      variant ?? group?.variant,
      sectionConfig?.variant,
      undefined,
      FALLBACK_RADIO_CONFIG.variant,
    );

    const resolvedColor = resolveCascade<Color>(
      color ?? group?.color,
      sectionConfig?.color,
      config.defaultColor,
      FALLBACK_RADIO_CONFIG.color,
    );

    const resolvedStatus =
      status ?? group?.status ?? FALLBACK_RADIO_CONFIG.status;

    const isCard = resolvedVariant === "card";

    // Radius Key Resolution
    const rawRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      undefined,
      FALLBACK_RADIO_CONFIG.radius,
    );

    // Override "full" radius to "xl" for card container background
    const effectiveCardRadiusKey =
      isCard && rawRadiusKey === "full" ? "xl" : rawRadiusKey;

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const outerSizeClass = resolveClassKey(
      resolvedSizeKey,
      RADIO_OUTER_SIZE_CLASS,
      FALLBACK_RADIO_CONFIG.size,
    );

    const innerSizeClass = resolveClassKey(
      resolvedSizeKey,
      RADIO_INNER_SIZE_CLASS,
      FALLBACK_RADIO_CONFIG.size,
    );

    const fontSizeClass = resolveClassKey(
      resolvedSizeKey,
      RADIO_FONT_SIZE_CLASS,
      FALLBACK_RADIO_CONFIG.size,
    );

    const gapClass = resolveClassKey(
      resolvedSizeKey,
      RADIO_GAP_CLASS,
      FALLBACK_RADIO_CONFIG.size,
    );

    const radiusClass = resolveClassKey(
      rawRadiusKey,
      RADIUS_CLASS,
      FALLBACK_RADIO_CONFIG.radius,
    );

    const cardRadiusClass = resolveClassKey(
      effectiveCardRadiusKey,
      RADIUS_CLASS,
      "xl",
    );

    const colorClasses =
      RADIO_COLOR_CLASS[resolvedColor] ?? RADIO_COLOR_CLASS.primary;

    const statusBorderClass =
      RADIO_STATUS_BORDER_CLASS[resolvedStatus] ??
      RADIO_STATUS_BORDER_CLASS.default;

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (isDisabled) return;
        if (group) {
          group.onChange?.(value);
        } else {
          if (controlledChecked === undefined) {
            setUncontrolledChecked(true);
          }
        }
        onChange?.(e.target.checked, value, e);
      },
      [controlledChecked, group, isDisabled, onChange, value],
    );

    return (
      <label
        className={cn(
          "relative inline-flex items-start select-none cursor-pointer transition-all duration-150 shrink-0",
          gapClass,
          isCard ? cn("p-3 border bg-background", cardRadiusClass) : "",
          isCard &&
            (isChecked
              ? `${colorClasses.border} ${colorClasses.cardBg}`
              : statusBorderClass),
          isDisabled && "opacity-50 pointer-events-none cursor-not-allowed",
          className,
        )}
        style={style}>
        {/* Native Radio Input */}
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
          {...rest}
        />

        {/* Outer Radio Box / Circle */}
        <div
          className={cn(
            "shrink-0 flex items-center justify-center border-2 transition-all duration-150 mt-0.5",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
            outerSizeClass,
            radiusClass,
            isChecked ? colorClasses.border : statusBorderClass,
          )}>
          {/* Animated Inner Radio Indicator */}
          <span
            className={cn(
              innerSizeClass,
              radiusClass,
              colorClasses.bg,
              "transition-all duration-200 ease-in-out transform-gpu",
              isChecked ? "scale-100 opacity-100" : "scale-0 opacity-0",
            )}
          />
        </div>

        {/* Text Container */}
        {(label || description) && (
          <div className="flex flex-col min-w-0">
            {label && (
              <span
                className={cn(
                  "font-medium text-foreground leading-snug",
                  fontSizeClass,
                )}>
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs sm:text-sm text-foreground/70 leading-snug mt-0.5">
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
