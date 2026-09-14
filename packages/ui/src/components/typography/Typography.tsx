/**
 * Typography component for AsheeUI.
 *
 * This file provides the `Typography` component, the public abstraction over
 * the framework's typography roles. It renders the semantic element a role
 * implies, applies that role's complete static class string, and lets any part
 * of the treatment be overridden per instance or through configuration.
 *
 * Colour is applied through `tone`, which resolves framework colour tokens, so
 * consumers never need Tailwind colour utilities for standard text. Consumers
 * may still pass their own Tailwind classes through `className`, because
 * AsheeUI remains Tailwind-native.
 *
 * @see `docs/docs/asheeui-typography-specification-proposal.md` for the approved specification.
 */

"use client";

import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import {
  TYPOGRAPHY_ALIGN_CLASS,
  TYPOGRAPHY_ROLE_DEFAULT_ELEMENT,
  TYPOGRAPHY_TONE_CLASS,
  type TypographyAlign,
  type TypographyLeading,
  type TypographyRole,
  type TypographySize,
  type TypographyTone,
  type TypographyTracking,
  type TypographyWeight,
} from "../../shared";
import { cn } from "../../utils";
import { resolveCascade } from "../../utils/resolve-token";
import {
  FALLBACK_TYPOGRAPHY_CONFIG,
  type TypographyConfig,
} from "./typography-config";
import { resolveTypographyRoleClass } from "./typography-styles";

/**
 * Typography props. Combines the component configuration with the shared
 * typography options and standard element attributes.
 *
 * The ARIA `role` attribute is intentionally not part of the inherited
 * attributes: `role` here is the typography role, and letting both exist would
 * make the prop ambiguous. Consumers who need an explicit ARIA role can wrap the
 * component or render a semantic element through `as`.
 */
export interface TypographyProps
  extends TypographyConfig,
    Omit<HTMLAttributes<HTMLElement>, "color" | "role"> {
  /**
   * Element to render.
   * Defaults to the semantic element implied by the resolved role.
   */
  as?: ElementType;

  /**
   * Size token override. Replaces the size part of the role's treatment.
   */
  size?: TypographySize;

  /**
   * Font-weight token override.
   */
  weight?: TypographyWeight;

  /**
   * Line-height token override.
   */
  leading?: TypographyLeading;

  /**
   * Letter-spacing token override.
   */
  tracking?: TypographyTracking;

  /**
   * Content to render.
   */
  children?: ReactNode;
}

/**
 * Semantic text rendering.
 *
 * Resolution order follows the standard AsheeUI cascade: instance prop, then
 * `components.typography` configuration, then the framework fallback. A role
 * supplies size, weight, leading and tracking together; any explicit token prop
 * replaces just that part of the treatment.
 *
 * @param props - Typography options and element attributes.
 * @returns The rendered semantic element.
 *
 * @example
 * ```tsx
 * <Typography role="heading-lg">Dashboard</Typography>
 * <Typography role="body-md" tone="muted" as="h2">A muted paragraph rendered as a heading</Typography>
 * ```
 *
 * @see TYPOGRAPHY_ROLE_TOKEN - The documented role table.
 */
export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      as,
      role,
      tone,
      align,
      truncate,
      size,
      weight,
      leading,
      tracking,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.typography as
      | TypographyConfig
      | undefined;

    const resolvedRole = resolveCascade<TypographyRole>(
      role,
      sectionConfig?.role,
      undefined,
      FALLBACK_TYPOGRAPHY_CONFIG.role,
    );

    const resolvedTone = resolveCascade<TypographyTone>(
      tone,
      sectionConfig?.tone,
      undefined,
      FALLBACK_TYPOGRAPHY_CONFIG.tone,
    );

    const resolvedAlign = resolveCascade<TypographyAlign | undefined>(
      align,
      sectionConfig?.align,
      undefined,
      undefined,
    );

    const resolvedTruncate = resolveCascade<boolean>(
      truncate,
      sectionConfig?.truncate,
      undefined,
      FALLBACK_TYPOGRAPHY_CONFIG.truncate,
    );

    // Instance token props win over configured role overrides.
    const configuredOverrides = sectionConfig?.roles?.[resolvedRole];
    const mergedOverrides = {
      size: size ?? configuredOverrides?.size,
      weight: weight ?? configuredOverrides?.weight,
      leading: leading ?? configuredOverrides?.leading,
      tracking: tracking ?? configuredOverrides?.tracking,
    };
    const hasOverrides =
      mergedOverrides.size !== undefined ||
      mergedOverrides.weight !== undefined ||
      mergedOverrides.leading !== undefined ||
      mergedOverrides.tracking !== undefined;

    const resolvedRoleClass = hasOverrides
      ? resolveTypographyRoleClass(resolvedRole, mergedOverrides)
      : resolveTypographyRoleClass(resolvedRole);

    const resolvedClassName = cn(
      resolvedRoleClass,
      resolvedAlign ? TYPOGRAPHY_ALIGN_CLASS[resolvedAlign] : undefined,
      resolvedTruncate && "truncate",
      TYPOGRAPHY_TONE_CLASS[resolvedTone],
      sectionConfig?.className,
      className,
    );

    const Component = (as ??
      TYPOGRAPHY_ROLE_DEFAULT_ELEMENT[resolvedRole]) as ElementType;

    return (
      <Component ref={ref} className={resolvedClassName} {...props}>
        {children}
      </Component>
    );
  },
);

Typography.displayName = "Typography";
