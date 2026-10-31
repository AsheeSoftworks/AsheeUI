/**
 * The form a control submits.
 *
 * A browser gives a `<button type="submit">` the form around it and runs the form's submit
 * event; a device has neither the attribute nor the event. What it does have is the React
 * tree, so the form states what submitting and resetting mean in a context and a control
 * inside it asks.
 *
 * The context lives beside the form rather than in it because the button imports it: a
 * `Button` that imported `Form.tsx` would make the form and the control import each other,
 * and a cycle resolved differently by two bundlers is a defect that only appears in one of
 * them. This module has no imports of its own children, so it closes the loop safely.
 */

import { createContext, useContext } from "react";

/**
 * What a control inside a form can ask it to do.
 */
export interface FormControl {
  /** Run the form's submit handler, as the browser would on a submit button. */
  submit(): void;

  /** Run the form's reset handler, as the browser would on a reset button. */
  reset(): void;
}

/**
 * The enclosing form, or `null` when a control stands alone.
 *
 * A control outside a form is not a mistake — the same `Button` is used everywhere — so the
 * context defaults to `null` and the control simply does nothing form-related.
 */
export const FormContext = createContext<FormControl | null>(null);

/**
 * Read the enclosing form.
 *
 * @returns The form's control surface, or `null` when there is no form around the caller.
 */
export function useFormContext(): FormControl | null {
  return useContext(FormContext);
}
