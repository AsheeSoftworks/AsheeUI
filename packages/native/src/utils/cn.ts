/**
 * The class-name merge for the native renderer.
 *
 * The web renderer composes classes with `tailwind-merge`, which is a model of Tailwind's
 * *scales*: it knows that `p-2` and `p-4` are the same property, that they hold different
 * values, and it rewrites the survivor accordingly. That model is wrong here. NativeWind
 * compiles a class into style props, and a different value per platform is the one thing
 * this framework promises — `p-2` is 8 dp on a device and 0.5 rem in a browser. Merging on
 * native therefore compares property *families* only: the same property, the last one
 * wins, and no value is ever touched, added or rewritten.
 *
 * Four rules, in order:
 *
 * - A utility that states the same property as an earlier one replaces it, and takes the
 *   later position, so the survivor is where the consumer wrote it.
 * - A variant is part of the identity. `active:opacity-90` and `opacity-100` are not the
 *   same declaration, so both survive — that is what a state's class is for.
 * - A utility this module does not model is kept rather than dropped. The table below
 *   names the families the framework's own dictionaries use; a class outside it behaves
 *   exactly as it did under the join this replaces, which is why an incomplete table can
 *   cost bytes but can never cost a style.
 * - Families that share a prefix are kept apart, because they are different declarations:
 *   `text-sm` is a size where `text-primary` is a colour, `border` is a width where
 *   `border-border` is a colour, and `bg-linear-to-r` is an image where `bg-primary` is a
 *   colour. Collapsing them would drop a declaration the consumer never overrode.
 */

/** A family key: the variant chain plus the property the utility states. */
type Family = string;

/** Sizes that may follow `text-`, which makes it a font size rather than a colour. */
const TEXT_SIZE =
  /^(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)(?:$|[/[])/;

/** Words that follow `text-` and align the text. */
const TEXT_ALIGN = /^(?:start|end|left|right|center|justify)$/;

/** Words that follow `text-` and wrap it, which is neither a size nor a colour. */
const TEXT_WRAP = /^(?:wrap|nowrap|balance|pretty|ellipsis|clip)$/;

/** Widths that may follow `border` or `ring`: a bare length, not a colour. */
const BORDER_WIDTH = /^(?:\d+|\[[^\]]+\])$/;

/** Styles that may follow `border`, which are neither a width nor a colour. */
const BORDER_STYLE = /^(?:solid|dashed|dotted|double|none|hidden)$/;

/** Sides a border or a radius can name. */
const SIDE = /^(t|r|b|l|tl|tr|br|bl|x|y)(?:-|$)/;

/**
 * The property a utility states, or undefined when this module does not model it.
 *
 * The prefixes are checked longest first, so `rounded-t-lg` reaches the corner rules
 * before the plain `rounded` one.
 *
 * @param utility - The class without its variant chain.
 * @returns The property, or undefined when the class is unknown.
 */
function propertyOf(utility: string): string | undefined {
  // The families whose prefix decides everything: the first match wins.
  const prefixes: Array<readonly [string, Family]> = [
    ["min-w-", "min-width"],
    ["min-h-", "min-height"],
    ["max-w-", "max-width"],
    ["max-h-", "max-height"],
    ["gap-x-", "column-gap"],
    ["gap-y-", "row-gap"],
    ["gap-", "gap"],
    ["space-x-", "space-x"],
    ["space-y-", "space-y"],
    ["size-", "size"],
    ["basis-", "flex-basis"],
    ["px-", "padding-inline"],
    ["py-", "padding-block"],
    ["pt-", "padding-top"],
    ["pr-", "padding-right"],
    ["pb-", "padding-bottom"],
    ["pl-", "padding-left"],
    ["ps-", "padding-inline-start"],
    ["pe-", "padding-inline-end"],
    ["p-", "padding"],
    ["mx-", "margin-inline"],
    ["my-", "margin-block"],
    ["mt-", "margin-top"],
    ["mr-", "margin-right"],
    ["mb-", "margin-bottom"],
    ["ml-", "margin-left"],
    ["ms-", "margin-inline-start"],
    ["me-", "margin-inline-end"],
    ["m-", "margin"],
    ["inset-x-", "inset-inline"],
    ["inset-y-", "inset-block"],
    ["inset-", "inset"],
    ["top-", "top"],
    ["right-", "right"],
    ["bottom-", "bottom"],
    ["left-", "left"],
    ["z-", "z-index"],
    ["opacity-", "opacity"],
    ["shadow", "box-shadow"],
    ["overflow-x-", "overflow-x"],
    ["overflow-y-", "overflow-y"],
    ["overflow-", "overflow"],
    ["object-", "object-fit"],
    ["aspect-", "aspect-ratio"],
    ["grid-cols-", "grid-template-columns"],
    ["grid-rows-", "grid-template-rows"],
    ["col-span-", "grid-column"],
    ["row-span-", "grid-row"],
    ["items-", "align-items"],
    ["justify-", "justify-content"],
    ["self-", "align-self"],
    ["order-", "order"],
    ["tracking-", "letter-spacing"],
    ["leading-", "line-height"],
    ["duration-", "transition-duration"],
    ["delay-", "transition-delay"],
    ["ease-", "transition-timing-function"],
    ["animate-", "animation"],
    ["translate-x-", "translate-x"],
    ["translate-y-", "translate-y"],
    ["rotate-", "rotate"],
    ["scale-", "scale"],
    ["cursor-", "cursor"],
    ["select-", "user-select"],
    ["pointer-events-", "pointer-events"],
    ["decoration-", "text-decoration-color"],
    ["underline-offset-", "text-underline-offset"],
    ["whitespace-", "white-space"],
    ["backdrop-blur", "backdrop-filter"],
    ["break-", "word-break"],
    ["truncate", "text-overflow"],
    ["tabular-nums", "font-variant-numeric"],
    ["uppercase", "text-transform"],
    ["lowercase", "text-transform"],
    ["capitalize", "text-transform"],
    ["normal-case", "text-transform"],
    ["sr-only", "screen-reader"],
  ];

  for (const [prefix, family] of prefixes) {
    if (utility === prefix || utility.startsWith(prefix)) return family;
  }

  // `text-` states three properties, so the word after it decides which.
  if (utility.startsWith("text-")) {
    const rest = utility.slice("text-".length);
    if (TEXT_SIZE.test(rest)) return "font-size";
    if (TEXT_ALIGN.test(rest)) return "text-align";
    if (TEXT_WRAP.test(rest)) return "text-wrap";
    return "color";
  }

  // `bg-` states a colour, an image, a size and a position. A gradient is an image, so it
  // does not replace a background colour and a background colour does not replace it.
  if (utility.startsWith("bg-")) {
    const rest = utility.slice("bg-".length);
    if (/^(?:linear|radial|conic|gradient)(?:-|$)/.test(rest))
      return "background-image";
    if (/^(?:cover|contain|auto)$/.test(rest)) return "background-size";
    if (/^(?:center|top|right|bottom|left)(?:-|$)/.test(rest)) {
      return "background-position";
    }
    return "background-color";
  }

  // A border states a width, a style, a colour and four sides, and the side may carry any
  // of the first three. `border` alone is a width; `border-border` is a colour.
  if (utility === "border" || utility.startsWith("border-")) {
    const rest = utility === "border" ? "" : utility.slice("border-".length);
    const side = rest.match(SIDE);

    if (side) {
      const tail = rest.slice(side[0].length).replace(/^-/, "");
      const edge = `border-${side[1]}`;
      if (tail === "" || BORDER_WIDTH.test(tail)) return `${edge}-width`;
      if (BORDER_STYLE.test(tail)) return `${edge}-style`;
      return `${edge}-color`;
    }

    if (rest === "" || BORDER_WIDTH.test(rest)) return "border-width";
    if (BORDER_STYLE.test(rest)) return "border-style";
    return "border-color";
  }

  // A radius names a corner or all four. A corner's radius is its own declaration.
  if (utility === "rounded" || utility.startsWith("rounded-")) {
    const rest = utility === "rounded" ? "" : utility.slice("rounded-".length);
    const corner = rest.match(/^(tl|tr|br|bl|t|r|b|l|s|e)(?:-|$)/);
    if (corner) return `border-${corner[1]}-radius`;
    return "border-radius";
  }

  // A ring is a box shadow of its own: its width, its colour and its offset are separate
  // declarations, and a ring and a shadow coexist rather than replace each other.
  if (utility === "ring" || utility.startsWith("ring-")) {
    const rest = utility === "ring" ? "" : utility.slice("ring-".length);
    if (rest === "" || BORDER_WIDTH.test(rest)) return "ring-width";
    if (rest.startsWith("offset")) return "ring-offset";
    if (rest === "inset") return "ring-inset";
    return "ring-color";
  }

  // A divider is a border on the children, per axis, with its own colour.
  if (utility === "divide-x" || utility.startsWith("divide-x-"))
    return "divide-x";
  if (utility === "divide-y" || utility.startsWith("divide-y-"))
    return "divide-y";
  if (utility.startsWith("divide-")) return "divide-color";

  // `flex` alone is a display; `flex-` prefixed utilities are a direction, a wrap or the
  // shorthand the layout uses.
  if (utility === "flex") return "display";
  if (utility.startsWith("flex-")) {
    if (/^(?:row|col)(?:-reverse)?$/.test(utility.slice("flex-".length))) {
      return "flex-direction";
    }
    if (/^(?:wrap|nowrap)(?:-reverse)?$/.test(utility.slice("flex-".length))) {
      return "flex-wrap";
    }
    return "flex";
  }

  // Display is one property with many utilities, and so is position.
  if (
    [
      "block",
      "inline",
      "inline-block",
      "inline-flex",
      "grid",
      "hidden",
      "contents",
    ].includes(utility)
  ) {
    return "display";
  }
  if (["static", "fixed", "absolute", "relative", "sticky"].includes(utility)) {
    return "position";
  }

  // `font-sans` is a family where `font-medium` is a weight.
  if (utility.startsWith("font-")) {
    return /^(?:sans|serif|mono)$/.test(utility.slice("font-".length))
      ? "font-family"
      : "font-weight";
  }

  // `from-` and `to-` are a gradient's stops, and `w-`/`h-` are the box's size.
  if (utility.startsWith("from-")) return "gradient-from";
  if (utility.startsWith("to-")) return "gradient-to";
  if (utility === "w" || utility.startsWith("w-")) return "width";
  if (utility === "h" || utility.startsWith("h-")) return "height";

  // Transitions and their multiple properties.
  if (utility === "transition") return "transition-property";
  if (utility.startsWith("transition-")) return "transition-property";

  return undefined;
}

/**
 * Split a class into its variant chain and the utility it applies.
 *
 * A variant chain ends at the last top-level colon: colons inside an arbitrary value
 * (`bg-[url(data:image/png)]`) belong to the value, not to the chain.
 *
 * @param token - One class from a class string.
 * @returns The variant chain, with its trailing colon, and the utility.
 */
function splitVariants(token: string): {
  variants: string;
  utility: string;
} {
  let depth = 0;
  let separator = -1;

  for (let index = 0; index < token.length; index += 1) {
    const character = token[index];

    if (character === "[" || character === "(") depth += 1;
    else if (character === "]" || character === ")") depth -= 1;
    else if (character === ":" && depth === 0) separator = index;
  }

  return separator === -1
    ? { variants: "", utility: token }
    : {
        variants: token.slice(0, separator + 1),
        utility: token.slice(separator + 1),
      };
}

/**
 * The identity a class takes part in: its variant chain and the property it states.
 *
 * @param token - One class from a class string.
 * @returns The family, or undefined when the class is not modelled.
 */
function familyOf(token: string): Family | undefined {
  const { variants, utility } = splitVariants(token);
  const property = propertyOf(utility);

  return property === undefined ? undefined : `${variants}${property}`;
}

/**
 * Join class names, keeping the last of each property.
 *
 * @param values - The class names, in the order they should apply.
 * @returns The joined class string.
 *
 * @example
 * ```tsx
 * cn("p-2", isCompact ? "p-1" : "p-4", "bg-primary", className);
 * // the later padding and background win; an unknown class is always kept
 * ```
 */
export function cn(
  ...values: Array<string | false | null | undefined>
): string {
  const kept: string[] = [];
  const familyPosition = new Map<Family, number>();

  for (const value of values) {
    if (!value) continue;

    for (const token of value.split(/\s+/)) {
      if (!token) continue;

      const family = familyOf(token);
      const previous =
        family === undefined ? undefined : familyPosition.get(family);

      // The earlier class states the same property, so it is the one that goes; the
      // survivor stays where the consumer wrote it.
      if (previous !== undefined) kept[previous] = "";

      if (family !== undefined) familyPosition.set(family, kept.length);

      kept.push(token);
    }
  }

  return kept.filter(Boolean).join(" ");
}
