/**
 * Class name helper for the native package.
 *
 * The native implementation composes NativeWind class strings the same way the
 * web implementation composes Tailwind ones: the component's base classes first,
 * the resolved classes next, the consumer's own classes last. One helper keeps
 * that order identical everywhere, so a consumer's class always wins.
 */

/**
 * Join class names, dropping the empty ones.
 *
 * @param values - The class names, in the order they should apply.
 * @returns The joined class string.
 *
 * @example
 * ```tsx
 * classNames("flex-row", isDisabled && "opacity-50", className);
 * ```
 */
export function classNames(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}
