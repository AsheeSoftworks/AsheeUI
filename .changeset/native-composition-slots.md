---
"@asheeui/native": minor
---

The native button, badge, card and image accept the web's composition props, so a button with an
icon, a badge with a label and a card with a picture and a body render on a device.

**Button.** `startContent` and `endContent` draw on either side of the label, and `icon` takes a
square from the size axis instead of the padding a label needs (`NATIVE_BUTTON_ICON_SIZE_CLASS`).
`type="submit"` and `type="reset"` run the enclosing form's handlers through a small form context,
because the platform has no form element or submit event; a button outside a form does nothing
form-related. `href` is followed through the platform's URL handler when the consumer gave no handler
of its own. `animate` draws the framework's press scale through `Animated`, gated on the platform's
own reduced-motion setting rather than on a media query.

**Badge.** `label` is the web's name for the children, and `startContent`/`endContent` frame it.

**Card.** `image` carries the shared `CardImageConfig` plus the source and its alternative text, with
top/bottom/background placement; `src` and `alt` are accepted beside it, and `body` sits beside
`children`. `isClickable` is the web's name for `isPressable`, and `isDisabled` refuses the press and
reports the state.

**Image.** `loading` is accepted so a shared picture compiles and is a documented no-op: a device
fetches a picture when its view mounts, and a list mounts a row when it scrolls into view. B17 makes
the no-op speak; this batch only accepts it.

The plan's `Touch` list named `packages/core/src/components/forms/button/button-styles.ts` for the
icon square. That file does not exist: C1/C2 moved every class string out of core, and the core
charter forbids adding one back. The table lives in the native style dictionary, which is the only
package that compiles it, so this changeset names native alone.
