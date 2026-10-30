/**
 * The words the framework itself says.
 *
 * A control the framework draws — the close control on a layer, for example — needs a
 * name, and the name is a design decision rather than a renderer's wording: "Close" on one
 * platform and "Cancel" on the other would be two names for one control. Stating the word
 * once in core is what lets both renderers draw the same control with the same label, and
 * what lets a consumer override it with one prop.
 */

/**
 * The accessible name of a layer's built-in close control.
 *
 * A layer names its control for the thing it dismisses (`Close dialog`, `Close drawer`) by
 * suffixing this word; a consumer that wants another name passes `closeLabel`.
 */
export const CLOSE_LABEL = "Close";
