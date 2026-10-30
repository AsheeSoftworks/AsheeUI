/**
 * Saying that an option a shared screen writes does nothing on a device.
 *
 * A `K` prop (`NATIVE-IMPOSSIBLE-REPORT.md` §5.1) is kept so a shared file compiles, and it is
 * a no-op because the platform has no mechanism for it. Keeping it silently is the one
 * outcome that is not allowed: a consumer reads a component's props as a description of what
 * it does, and a prop that is accepted and ignored is a description that lies.
 *
 * The message names the **substitute**, not only the refusal, because a warning that says
 * "not supported" leaves the reader to guess what to do instead. `NATIVE-IMPOSSIBLE-REPORT.md`
 * R2 states that as the rule.
 *
 * The warning is once per `(component, prop)` for the process, in development only. Per
 * render would be a warning on every keystroke; per module would lose the prop that was
 * actually used. Absence is never warned about — a prop the consumer did not write is not a
 * decision the consumer made.
 */

/**
 * The props this process has already warned about.
 *
 * The key is `component.prop` rather than the component alone: a screen may use `Page.as`
 * and `Section.as`, and each is a separate thing to learn.
 */
const warned = new Set<string>();

/**
 * Warn that a prop is accepted and does nothing.
 *
 * @param component - The component's public name, as a consumer writes it.
 * @param prop - The prop that does nothing.
 * @param substitute - What to do instead, stated as an instruction rather than a refusal.
 *
 * @example
 * ```ts
 * warnUnsupportedProp(
 *   "Page",
 *   "stickyNavigation",
 *   "place the navigation outside the scrolling container",
 * );
 * ```
 */
export function warnUnsupportedProp(
  component: string,
  prop: string,
  substitute: string,
): void {
  if (process.env.NODE_ENV === "production") return;

  const key = `${component}.${prop}`;
  if (warned.has(key)) return;
  warned.add(key);

  console.warn(
    `[@asheeui] ${component}.${prop} does nothing on a device: ${substitute}.`,
  );
}

/**
 * Warn for each prop that was stated, and do nothing for the ones that were not.
 *
 * A component calls this with the props it destructured; `undefined` means the consumer did
 * not write the prop, so there is nothing to warn about.
 *
 * @param component - The component's public name.
 * @param stated - The props and their substitutes, keyed by prop name.
 * @param values - What the consumer wrote, keyed by prop name.
 *
 * @example
 * ```ts
 * useUnsupportedProps("Dropmenu", {
 *   name: { value: name, substitute: "read the field's value from state" },
 * });
 * ```
 */
export function useUnsupportedProps(
  component: string,
  stated: Record<
    string,
    { value: unknown; substitute: string } | undefined
  >,
): void {
  for (const [prop, entry] of Object.entries(stated)) {
    if (entry === undefined || entry.value === undefined) continue;
    warnUnsupportedProp(component, prop, entry.substitute);
  }
}
