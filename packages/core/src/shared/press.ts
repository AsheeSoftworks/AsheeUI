/**
 * One act, two names.
 *
 * A press is `onPress` on a device and `onClick` in a browser, and a text change is
 * `onChange` in a browser — carrying an event — and `onChangeText` or `onValueChange` on a
 * device — carrying the value. A shared file cannot choose between the names, because the
 * name is the platform's, so both renderers accept both spellings and these two functions
 * are the one place that decides what "both" means.
 *
 * The alternative the functions reject is a second implementation in each renderer: two
 * guards over the same act drift the first time one platform adds a state the other does
 * not have, and a consumer copying `<Input onChange={…}>` from a web page to a device has
 * no way to see which spelling the platform honours.
 *
 * The `onChange` event handed over is a shim, not a DOM event. It has `target.value`, which
 * is the part a web form reads, and nothing else: `preventDefault` and `stopPropagation`
 * would do nothing here, and a consumer that relies on either is on the web. That limit is
 * stated rather than hidden, because a control that silently accepts a method it will not
 * run is worse than one that never offered it.
 */

/**
 * The two names one press has.
 *
 * The event is generic because the web's is a DOM event and the platform's is not: the
 * caller states what it can hand over, and a handler that ignores it — the common case —
 * does not have to know. On a device the event is the platform's own press event, which
 * the `Pressable` that reported it already has.
 */
export interface PressHandlers<E = unknown> {
  /** The browser's name for the act, and the one this framework recommends in shared files. */
  onClick?: (event: E) => void;

  /** The platform's name for the act, which the documentation keeps canonical on native. */
  onPress?: () => void;
}

/**
 * Run whichever handler the caller gave, or both when both were given.
 *
 * `onClick` runs first, which is the order the web button already documents and the order
 * a consumer sees when it passes both: the DOM's event reaches the handler that asked for
 * the event before the platform's value-only callback runs.
 *
 * @param handlers - The names the caller supplied; either, both, or neither.
 * @param event - What the press reports, handed to `onClick`.
 *
 * @example
 * ```tsx
 * <Pressable onPress={() => resolvePress({ onClick, onPress }, PRESS_EVENT)} />
 * ```
 */
export function resolvePress<E>(handlers: PressHandlers<E>, event: E): void {
  handlers.onClick?.(event);
  handlers.onPress?.();
}

/**
 * The names one text change has.
 *
 * `onChange` is the DOM's, and its event is narrowed to the one field a shared form reads.
 * `onChangeText` and `onValueChange` are the platform's; both carry the next value, because
 * a native handler that had to unwrap an event would be the web's shape on a platform that
 * does not have one.
 */
export interface ChangeHandlers {
  /**
   * The browser's change event, narrowed to the value.
   *
   * The shim has `target.value` and nothing else: `preventDefault` and `stopPropagation`
   * do nothing, because there is no default action or propagation to stop.
   */
  onChange?: (event: { target: { value: string } }) => void;

  /** The value, under the platform's most specific name. */
  onChangeText?: (value: string) => void;

  /** The value, under the name the picker family already used. */
  onValueChange?: (value: string) => void;
}

/**
 * Report one change through every name the caller gave, in a fixed order.
 *
 * Every handler runs rather than the first one found: the names are different spellings of
 * one event, and a consumer that passed two of them asked for both. The order is
 * `onChange` → `onChangeText` → `onValueChange`, which is the order a web field already
 * reports them in, so a consumer that mixes the spellings sees the same sequence on both
 * platforms.
 *
 * @param handlers - The names the caller supplied.
 * @param value - The field's next value.
 */
export function resolveChange(handlers: ChangeHandlers, value: string): void {
  handlers.onChange?.({ target: { value } });
  handlers.onChangeText?.(value);
  handlers.onValueChange?.(value);
}
