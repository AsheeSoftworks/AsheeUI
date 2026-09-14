/**
 * Alert component for AsheeUI.
 * This file provides the Alert component, an inline message whose colour,
 * variant and radius resolve through the standard AsheeUI cascade system.
 */

"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { CheckIcon } from "../../icons/CheckIcon";
import { CloseIcon } from "../../icons/CloseIcon";
import { ErrorIcon } from "../../icons/ErrorIcon";
import { InfoIcon } from "../../icons/InfoIcon";
import { WarningIcon } from "../../icons/WarningIcon";
import { useAsheeConfig } from "../../libs/context";
import type { Radius, Variant } from "../../shared";
import { RADIUS_CLASS, resolveVariantClass } from "../../shared";
import { cn } from "../../utils";
import { resolveCascade, resolveClassKey } from "../../utils/resolve-token";
import {
  ALERT_BASE_CLASS,
  ALERT_DISMISS_CLASS,
  ALERT_ICON_CLASS,
  ALERT_TYPE_COLOR,
  ALERT_TYPE_ICON_CLASS,
  ALERT_TYPE_ROLE,
} from "./alert-styles";
import {
  type AlertConfig,
  type AlertType,
  FALLBACK_ALERT_CONFIG,
} from "./alert-config";

type BaseAlertProps = AlertConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "color" | "title" | "content">;

/**
 * Configuration options for the Alert component.
 */
export interface AlertProps extends BaseAlertProps {
  /**
   * Intent of the alert.
   * Selects the colour and the urgency of the announcement.
   *
   * @default "info"
   */
  type?: AlertType;

  /**
   * Short heading for the message.
   */
  title?: ReactNode;

  /**
   * Message body.
   */
  children?: ReactNode;

  /**
   * Leading content, shown in place of the intent's default icon.
   */
  icon?: ReactNode;

  /**
   * Whether the alert can be dismissed by the consumer.
   * The dismiss control appears only when this is true and `onClose` is given.
   *
   * @default false
   */
  isClosable?: boolean;

  /**
   * Called when the dismiss control is used.
   */
  onClose?: () => void;

  /**
   * Name of the dismiss control, for assistive technology.
   *
   * @default "Dismiss alert"
   */
  closeLabel?: string;
}

/**
 * The default icon for each intent.
 *
 * @param type - The alert's intent.
 * @returns The icon element for that intent.
 */
function getDefaultIcon(type: AlertType): ReactNode {
  switch (type) {
    case "success":
      return <CheckIcon />;
    case "error":
      return <ErrorIcon />;
    case "warning":
      return <WarningIcon />;
    default:
      return <InfoIcon />;
  }
}

/**
 * An inline message or validation summary.
 *
 * Alert presents a message next to the surface it relates to: a form summary,
 * a failed step, or a statement the consumer should not miss. Its colour,
 * variant and radius resolve through the standard AsheeUI cascade: prop,
 * component config, global theme defaults, and the built-in fallback.
 *
 * The intent decides how urgently the message is announced. `error` and
 * `warning` are exposed as an alert, which interrupts assistive technology;
 * `info` and `success` are exposed as a status, which waits for a pause. Pass
 * `role` to override that choice.
 *
 * An alert never moves focus, never takes focus, and never appears above the
 * page: when a message has to interrupt with a modal surface, use `Modal`
 * instead. The dismiss control carries an accessible name and is the only
 * focusable element the component adds.
 *
 * @param props - Alert configuration options and div attributes.
 * @param props.type - Intent. Defaults to "info".
 * @param props.title - Short heading for the message.
 * @param props.children - Message body.
 * @param props.icon - Leading content, in place of the default icon.
 * @param props.isClosable - Whether a dismiss control is shown. Defaults to false.
 * @param props.onClose - Called when the dismiss control is used.
 * @param props.closeLabel - Name of the dismiss control. Defaults to "Dismiss alert".
 * @param props.variant - Visual style variant. Defaults to the configured value.
 * @param props.radius - Corner rounding. Defaults to "md".
 * @param props.role - Announcement role, overriding the intent's default.
 * @param props.className - Extra classes applied last.
 *
 * @example
 * ```tsx
 * <Alert type="error" title="Payment failed">
 *   The card was declined. Check the details and try again.
 * </Alert>
 * ```
 *
 * @see AlertConfig - The configuration type for component defaults.
 * @see ToastProvider - For messages that appear above the page instead of inline.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      type,
      variant,
      radius,
      title,
      children,
      icon,
      isClosable = false,
      onClose,
      closeLabel = "Dismiss alert",
      role,
      className,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.alert as AlertConfig | undefined;

    const resolvedType = resolveCascade<AlertType>(
      type,
      sectionConfig?.type,
      undefined,
      FALLBACK_ALERT_CONFIG.type,
    );

    const rawVariant = resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant as AlertConfig["variant"],
      FALLBACK_ALERT_CONFIG.variant,
    );

    // An alert has no underline treatment, so a global "underlined" default
    // resolves to the bordered treatment instead.
    const resolvedVariant: Variant =
      rawVariant === "underlined" ? "bordered" : rawVariant;

    const resolvedRadiusKey = resolveCascade<Radius>(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_ALERT_CONFIG.radius,
    );

    const radiusClass = resolveClassKey(
      resolvedRadiusKey as Radius,
      RADIUS_CLASS,
      FALLBACK_ALERT_CONFIG.radius,
    );

    return (
      <div
        ref={ref}
        role={role ?? ALERT_TYPE_ROLE[resolvedType]}
        className={cn(
          ALERT_BASE_CLASS,
          radiusClass,
          resolveVariantClass(resolvedVariant, ALERT_TYPE_COLOR[resolvedType]),
          className,
        )}
        {...props}>
        {/* The icon is decoration: the message text carries the information. */}
        <span
          aria-hidden="true"
          className={cn(ALERT_ICON_CLASS, ALERT_TYPE_ICON_CLASS[resolvedType])}>
          {icon ?? getDefaultIcon(resolvedType)}
        </span>

        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          {title && <span className="font-medium">{title}</span>}
          {children && <div className="text-current/80">{children}</div>}
        </div>

        {isClosable && onClose && (
          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className={ALERT_DISMISS_CLASS}>
            <CloseIcon className="size-3.5" />
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";
