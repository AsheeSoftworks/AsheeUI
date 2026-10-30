/**
 * Tooltip component for AsheeUI.
 * This file provides the main Tooltip component implementation, which renders
 * a floating tooltip that appears on hover or focus of a child element. It
 * supports configurable placement, delay, offset, radius, arrow, and styling
 * through the standard AsheeUI cascade system. The component uses Floating UI
 * for positioning and accessibility.
 */
"use client";

import {
  type Color,
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
  type Variant,
} from "@asheeui/core";
import {
  arrow,
  autoUpdate,
  FloatingArrow,
  FloatingPortal,
  flip,
  offset as floatingOffset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
} from "@floating-ui/react";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type Ref,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import { useFloatingZIndex } from "../../../libs/use-floating-z-index";
import { resolveVariantClass } from "../../../shared/variant";
import {
  TOOLTIP_FONT_CLASS,
  TOOLTIP_PADDING_X_CLASS,
  TOOLTIP_PADDING_Y_CLASS,
} from "../../../styles/portable";
import { RADIUS_CLASS } from "../../../styles/radius";
import { cn } from "../../../utils/cn";
import {
  FALLBACK_TOOLTIP_CONFIG,
  type TooltipConfig,
  type TooltipPlacement,
  type TooltipSizeKey,
} from "./tooltip-config";

type BaseTooltipProps = TooltipConfig;

/**
 * Configuration options for the Tooltip component.
 */
export interface TooltipProps extends BaseTooltipProps {
  /**
   * The content to display inside the tooltip.
   * A `null`, `undefined`, boolean or empty-string value is no hint at all and leaves the
   * trigger on its own; anything else is content, so `0` — a remaining count — is shown.
   */
  content: ReactNode;

  /**
   * The single element that triggers the tooltip.
   *
   * It has to be an element rather than text: the hint opens on the trigger's hover or on
   * its focus, and a string can be neither hovered as a control nor reached with a
   * keyboard, so a hint on one would be pointer-only. Pass a focusable element — a button,
   * a link, a field — and give it its own accessible name, because the hint describes the
   * control rather than naming it.
   */
  children: ReactElement;

  /**
   * Whether the tooltip is disabled.
   * When true, the tooltip does not appear on hover or focus.
   *
   * @default false
   */
  isDisabled?: boolean | undefined;
}

/**
 * A floating tooltip that appears on hover or focus of a child element.
 *
 * Tooltip renders a floating popup with additional information that appears
 * when the user hovers or focuses the trigger element. It supports configurable
 * placement, delay, offset, radius, arrow, and styling through the standard
 * AsheeUI cascade system.
 *
 * The component uses Floating UI for positioning and accessibility, and
 * automatically handles viewport edge detection and flipping. It is fully
 * accessible with keyboard focus support.
 *
 * @param props - Tooltip configuration options.
 * @param props.content - The content to display inside the tooltip. Absent and empty
 * values are no hint; a `0` is content.
 * @param props.children - The single element that triggers the tooltip. Its hover and its
 * focus both open the hint, so it has to be an element a keyboard reader can reach.
 * @param props.isDisabled - Whether the tooltip is disabled. Defaults to false.
 * @param props.variant - Visual style variant. Not registered by the component, so it
 * resolves from the application's `defaultVariant` and `"solid"` is only the fallback the
 * cascade reaches when nothing else supplies a value.
 * @param props.color - Theme accent color. Not registered either: it resolves from the
 * application's `defaultColor`, so an unconfigured application renders `"primary"` and
 * `"secondary"` is only the fallback.
 * @param props.size - Size scale. Defaults to "md".
 * @param props.placement - Placement relative to the trigger. Defaults to "top".
 * @param props.delay - Delay before showing/hiding. Defaults to 200.
 * @param props.offset - Offset from the trigger. Defaults to 8.
 * @param props.radius - Corner rounding. Like `variant` and `color` it is not registered,
 * so it follows the application's `defaultRadius` (`"xs"` out of the box); `"md"` is only
 * the fallback.
 * @param props.showArrow - Whether to show a pointer arrow. Defaults to false.
 * @param props.portal - Whether to render the tooltip through `FloatingPortal`
 * at the document body level. Defaults to false, which renders the tooltip in
 * place so it follows the trigger's stacking context.
 * @param props.zIndex - Layer delta added to the trigger's detected stacking
 * context z-index. Defaults to `ASHEE_LAYER.tooltip`.
 * @param props.className - Extra classes for the tooltip.
 *
 * @example
 * ```tsx
 * import { Tooltip, Button } from "@asheeui/web";
 *
 * export function Example() {
 *   return (
 *     <Tooltip content="This is a tooltip">
 *       <Button>Hover me</Button>
 *     </Tooltip>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom placement and arrow
 * <Tooltip
 *   content="Delete this item"
 *   placement="bottom"
 *   showArrow
 *   color="danger"
 * >
 *   <TrashIcon />
 * </Tooltip>
 * ```
 *
 * @see TooltipConfig - The configuration type for component defaults.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      variant,
      color,
      size,
      placement,
      delay,
      offset: offsetProp,
      radius,
      showArrow,
      portal,
      zIndex,
      isDisabled = false,
      className,
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.tooltip;
    const arrowRef = useRef<SVGSVGElement>(null);

    const [isOpen, setIsOpen] = useState(false);

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedSizeKey = resolveCascade<TooltipSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_TOOLTIP_CONFIG.size,
    );

    const resolvedPlacement = resolveCascade<TooltipPlacement>(
      placement,
      sectionConfig?.placement,
      undefined,
      FALLBACK_TOOLTIP_CONFIG.placement,
    );

    const resolvedVariantKey = resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant,
      FALLBACK_TOOLTIP_CONFIG.variant,
    );

    const resolvedColorKey = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor,
      FALLBACK_TOOLTIP_CONFIG.color,
    );

    const resolvedDelay = resolveCascade<
      number | { open?: number; close?: number }
    >(delay, sectionConfig?.delay, undefined, FALLBACK_TOOLTIP_CONFIG.delay);

    const resolvedOffset = resolveCascade<number>(
      offsetProp,
      sectionConfig?.offset,
      undefined,
      FALLBACK_TOOLTIP_CONFIG.offset,
    );

    const resolvedShowArrow = resolveCascade<boolean>(
      showArrow,
      sectionConfig?.showArrow,
      undefined,
      FALLBACK_TOOLTIP_CONFIG.showArrow,
    );

    const resolvedPortal = resolveCascade<boolean>(
      portal,
      sectionConfig?.portal,
      undefined,
      FALLBACK_TOOLTIP_CONFIG.portal,
    );

    const resolvedZIndex = resolveCascade<number>(
      zIndex,
      sectionConfig?.zIndex,
      undefined,
      FALLBACK_TOOLTIP_CONFIG.zIndex,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_TOOLTIP_CONFIG.radius,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const paddingXClass = resolveClassKey(
      resolvedSizeKey,
      TOOLTIP_PADDING_X_CLASS,
      FALLBACK_TOOLTIP_CONFIG.size,
    );

    const paddingYClass = resolveClassKey(
      resolvedSizeKey,
      TOOLTIP_PADDING_Y_CLASS,
      FALLBACK_TOOLTIP_CONFIG.size,
    );

    const fontClass = resolveClassKey(
      resolvedSizeKey,
      TOOLTIP_FONT_CLASS,
      FALLBACK_TOOLTIP_CONFIG.size,
    );

    const radiusClass = resolveClassKey(
      resolvedRadiusKey,
      RADIUS_CLASS,
      FALLBACK_TOOLTIP_CONFIG.radius,
    );

    // ─── Floating UI Setup ───────────────────────────────────────────────────

    const middleware = [
      floatingOffset(resolvedOffset),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
    ];

    if (resolvedShowArrow) {
      middleware.push(arrow({ element: arrowRef }));
    }

    const { refs, floatingStyles, context } = useFloating({
      open: isOpen && !isDisabled,
      onOpenChange: setIsOpen,
      placement: resolvedPlacement,
      whileElementsMounted: autoUpdate,
      middleware,
    });

    const hover = useHover(context, {
      delay: resolvedDelay,
      enabled: !isDisabled,
    });
    const focus = useFocus(context, { enabled: !isDisabled });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "tooltip" });

    const { getReferenceProps, getFloatingProps } = useInteractions([
      hover,
      focus,
      dismiss,
      role,
    ]);

    const floatingZIndex = useFloatingZIndex(
      refs.reference,
      isOpen && resolvedPortal,
      resolvedZIndex,
    );

    const childProps = (children.props ?? {}) as Record<string, unknown>;

    // The trigger's own `ref`, wherever the running React keeps it: 19 makes `ref` an
    // ordinary prop, so a consumer's ref arrives in `children.props`, while earlier
    // versions still hold it on the element itself.
    const childRef =
      (childProps.ref as Ref<Element> | undefined) ??
      (children as unknown as { ref?: Ref<Element> }).ref;

    // The two refs are chained rather than one replacing the other. Spreading the child's
    // props after `refs.setReference` used to hand the trigger to the consumer's ref alone,
    // which left the hint with no reference to measure and pinned it at the origin.
    const referenceRef = useMergeRefs([refs.setReference, childRef]);

    // Nothing to say, or nothing to say it about: the trigger renders on its own, with the
    // props it was given and no hint attached.
    if (isDisabled || !hasContent(content)) {
      return <>{children}</>;
    }

    const referenceProps = getReferenceProps({
      ...childProps,
      // Floating UI's merge order lets the props given here win, so the hint's own id has
      // to be composed with the description the trigger may already state — otherwise a
      // field with a description loses it for as long as the hint is open.
      "aria-describedby": composeDescribedBy(
        childProps["aria-describedby"],
        isOpen ? context.floatingId : undefined,
      ),
      ref: referenceRef,
    });

    const trigger = isValidElement(children) ? (
      cloneElement(children, referenceProps)
    ) : (
      // Unreachable through the type, which asks for an element: an untyped consumer that
      // passes text anyway still gets a tab stop, so the hint is not pointer-only.
      // biome-ignore lint/a11y/noNoninteractiveTabindex: the trigger the type demands is an element; this tab stop only exists for a child the type already refuses.
      <span {...referenceProps} className="inline-flex" tabIndex={0}>
        {children}
      </span>
    );

    // Shared by both rendering modes below. When `portal` is enabled the node is
    // appended to `document.body` and needs a `z-index` derived from the
    // trigger's stacking context, so it stays above its own container (for
    // example a navbar) without outranking the rest of the app. When rendering
    // in place, no `z-index` is applied: the node already follows the trigger's
    // stacking context.
    const floatingNode = (
      <div
        ref={(node) => {
          refs.setFloating(node);
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        style={
          resolvedPortal
            ? { ...floatingStyles, zIndex: floatingZIndex }
            : floatingStyles
        }
        className="pointer-events-none"
        {...getFloatingProps()}>
        <div
          className={cn(
            "font-medium border whitespace-nowrap select-none bg-background shadow-md transition-all duration-150 ease-out animate-in fade-in-0 zoom-in-95",
            paddingXClass,
            paddingYClass,
            fontClass,
            radiusClass,
            resolveVariantClass(resolvedVariantKey, resolvedColorKey),
            sectionConfig?.className,
            className,
          )}>
          {content}
          {resolvedShowArrow && (
            // The pointer carries the bubble's own surface and border rather than a
            // separate colour: filled with the border token it read as a wedge lying on
            // top of the hint. Floating UI paints two paths, so the outline takes the
            // border and the fill path's inner stroke takes the surface, which is what
            // closes the seam where the two meet.
            <FloatingArrow
              ref={arrowRef}
              context={context}
              strokeWidth={1}
              className="fill-background [&>path:first-of-type]:stroke-border [&>path:last-of-type]:stroke-background"
            />
          )}
        </div>
      </div>
    );

    return (
      <>
        {trigger}
        {resolvedPortal ? (
          <FloatingPortal>{isOpen && floatingNode}</FloatingPortal>
        ) : (
          isOpen && floatingNode
        )}
      </>
    );
  },
);

Tooltip.displayName = "Tooltip";

/**
 * Whether a hint says anything.
 *
 * `content` is a node, so only an absent or empty one means "no hint": a `0` — a remaining
 * count — is content the caller meant to say, and so is any element. A boolean is not,
 * because React draws nothing for one, so `content={hasMore && "3 left"}` does not leave
 * an empty bubble behind.
 *
 * @param content - The hint's content.
 * @returns `true` when the hint has something to say.
 */
function hasContent(content: ReactNode): boolean {
  if (content === null || content === undefined) return false;
  if (typeof content === "boolean") return false;
  if (typeof content === "string") return content.length > 0;

  return true;
}

/**
 * Compose the description an element already states with the hint's own id.
 *
 * A trigger is allowed to arrive with `aria-describedby` of its own — a field beside its
 * help text, say — and opening a hint must add to that rather than replace it. Duplicate
 * ids are dropped, so a hint reopened on an element that already names it does not repeat
 * itself.
 *
 * @param existing - The element's own `aria-describedby`, as it arrived in its props.
 * @param floatingId - The id of the hint, or `undefined` while it is closed.
 * @returns The composed description, or `undefined` when there is nothing to describe with.
 */
function composeDescribedBy(
  existing: unknown,
  floatingId: string | undefined,
): string | undefined {
  const ids =
    typeof existing === "string"
      ? existing.split(/\s+/).filter((id) => id.length > 0)
      : [];

  if (floatingId !== undefined && !ids.includes(floatingId)) {
    ids.push(floatingId);
  }

  return ids.length > 0 ? ids.join(" ") : undefined;
}
