/**
 * The element-shaped props a shared component may write and a device cannot honour.
 *
 * A browser composes with elements: a page is a `<main>`, a section a `<section>`, a title an
 * `<h2>`, and an id lets a skip link reach it. A device has none of that. The props are kept
 * so a shared screen compiles, and the role the element implied is carried by an
 * accessibility role instead — which is what `NATIVE-IMPOSSIBLE-REPORT.md` §5.1 tells a
 * reader to do.
 *
 * The hook exists so the eight-odd layout components state the same four substitutes once
 * rather than each inventing a message.
 */

import type { ElementType } from "react";
import { useUnsupportedProps } from "./unsupported-prop";

/**
 * The element props a layout or a message surface may accept.
 */
export interface UnsupportedElementProps {
  /** The element the web renders. A device draws the component's own view. */
  as?: ElementType;

  /** The heading element the web renders a title as. */
  titleAs?: ElementType;

  /** The id the web gives a heading so another element can reference it. */
  titleId?: string;

  /** The id of the element a skip control targets. */
  targetId?: string;
}

/**
 * Warn about whichever element props were stated.
 *
 * @param component - The component's public name.
 * @param props - The element props the consumer wrote.
 */
export function useUnsupportedElementProps(
  component: string,
  { as, titleAs, titleId, targetId }: UnsupportedElementProps,
): void {
  useUnsupportedProps(component, {
    as: {
      value: as,
      substitute:
        "the component's role is carried by accessibilityRole; a device has no elements",
    },
    titleAs: {
      value: titleAs,
      substitute:
        "the title is the platform's own text; a device has no heading elements",
    },
    titleId: {
      value: titleId,
      substitute: "ids address DOM elements; nothing references them on a device",
    },
    targetId: {
      value: targetId,
      substitute:
        "a skip control has no element to target; place the reader with setAccessibilityFocus",
    },
  });
}
