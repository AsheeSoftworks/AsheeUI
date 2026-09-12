/**
 * Stacking-context utilities for AsheeUI floating elements.
 * This file provides the layering standard used by every floating component.
 *
 * Floating elements are portaled to `document.body`, which places them in the
 * root stacking context, so their `z-index` competes with app-level chrome
 * such as custom navbars. To layer correctly against both AsheeUI's own
 * components and arbitrary client components, a floating element derives its
 * `z-index` from the trigger's own stacking context:
 *
 *   floating z-index = outermost stacking context z-index of the trigger
 *                      + the component's layer delta
 *
 * The delta only orders AsheeUI's internal layers relative to each other
 * (dropdown < popover < tooltip). All elevation is carried by the derived
 * base, so an anchored popup stays above its own container (for example a
 * navbar) without ever outranking unrelated app chrome.
 */

/**
 * Layer deltas for anchored floating elements (elements bound to a trigger).
 * Deltas are intentionally small integers so an anchored popup can never
 * leapfrog unrelated app chrome such as a high `z-index` navbar.
 */
export const ASHEE_LAYER = {
  /** Select, MultiSelect, Autocomplete, and the shared SelectMenu. */
  dropdown: 10,
  /** DatePicker and other floating panels. */
  popover: 20,
  /** Tooltips. */
  tooltip: 30,
} as const;

/**
 * Fixed rungs for app-level overlays, which are not anchored to a trigger and
 * should sit above page chrome.
 */
export const ASHEE_GLOBAL_LAYER = {
  /** Modal and Drawer. */
  overlay: 1000,
  /** Docked surfaces such as the on-screen keyboard. */
  docked: 1500,
  /** Toasts. */
  toast: 2000,
} as const;

/**
 * Resolves the parent element of a node, hopping across shadow DOM boundaries
 * so stacking-context detection keeps working inside web components.
 *
 * @param element - The element whose parent is requested.
 * @returns The parent element, or null at the top of the tree.
 */
function getParentElement(element: Element): Element | null {
  if (element.parentElement) {
    return element.parentElement;
  }
  const root = element.getRootNode();
  return root instanceof ShadowRoot ? root.host : null;
}

/**
 * Determines whether an element establishes a stacking context, using the
 * conditions documented for CSS stacking contexts.
 *
 * @param element - The element to test.
 * @param computed - Optional precomputed style for the element.
 * @returns True when the element creates a stacking context.
 */
export function establishesStackingContext(
  element: Element,
  computed: CSSStyleDeclaration = window.getComputedStyle(element),
): boolean {
  // `fixed` and `sticky` always create a stacking context, regardless of the
  // element's `z-index`.
  if (computed.position === "fixed" || computed.position === "sticky") {
    return true;
  }

  // Positioned elements with an explicit z-index.
  if (
    (computed.position === "absolute" || computed.position === "relative") &&
    computed.zIndex !== "auto"
  ) {
    return true;
  }

  if (computed.opacity !== "1") return true;
  if (computed.transform !== "none") return true;
  if (computed.filter !== "none") return true;
  if (computed.getPropertyValue("backdrop-filter") !== "none") return true;
  if (computed.getPropertyValue("perspective") !== "none") return true;
  if (computed.getPropertyValue("clip-path") !== "none") return true;
  if (computed.getPropertyValue("mix-blend-mode") !== "normal") return true;
  if (computed.getPropertyValue("isolation") === "isolate") return true;
  if (
    /transform|opacity|filter/.test(computed.getPropertyValue("will-change"))
  ) {
    return true;
  }
  if (
    /layout|paint|strict|content/.test(computed.getPropertyValue("contain"))
  ) {
    return true;
  }

  return false;
}

/**
 * Resolves the `z-index` of the outermost stacking context that contains the
 * reference element — the context that governs where the reference's subtree
 * sits in the root stacking order.
 *
 * Walking outward matters: stacking contexts are atomic in their parent, so
 * only the outermost context ancestor decides the subtree's position.
 *
 * @param reference - The trigger element.
 * @returns The context's `z-index`, or 0 when the reference lives in the
 * plain root flow.
 */
export function resolveBaseZIndex(
  reference: Element | null | undefined,
): number {
  if (typeof window === "undefined" || !reference) {
    return 0;
  }

  let base = 0;
  let element = getParentElement(reference);

  while (
    element &&
    element !== document.body &&
    element !== document.documentElement
  ) {
    const computed = window.getComputedStyle(element);
    if (establishesStackingContext(element, computed)) {
      // The outermost context wins, so each match overwrites the previous
      // one. `auto` means the context participates in the root flow at 0.
      const parsed = Number.parseInt(computed.zIndex, 10);
      base = Number.isNaN(parsed) ? 0 : parsed;
    }
    element = getParentElement(element);
  }

  return Math.max(base, 0);
}

/**
 * Resolves the `z-index` a portaled floating element should use so it renders
 * above its trigger's stacking context without outranking unrelated app
 * chrome.
 *
 * @param reference - The trigger element.
 * @param layerDelta - The component's layer delta from `ASHEE_LAYER`.
 * @returns The derived `z-index`.
 */
export function resolveFloatingZIndex(
  reference: Element | null | undefined,
  layerDelta: number,
): number {
  return resolveBaseZIndex(reference) + layerDelta;
}
