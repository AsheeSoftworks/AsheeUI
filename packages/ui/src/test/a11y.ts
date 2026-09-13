/**
 * Accessibility helper (`TEST-023`, `TEST-026`).
 *
 * Reusable role, name, and state assertions so component tests state the
 * accessibility contract instead of repeating DOM plumbing. Automated
 * assertions here support but never replace explicit keyboard and focus
 * behaviour tests (`TEST-027`).
 */

import { type screen, within } from "@testing-library/react";
import { expect } from "vitest";

/**
 * `getByRole` argument tuple, derived from the testing library so the helper
 * accepts exactly what the query accepts without widening any types.
 */
type GetByRoleParams = Parameters<typeof screen.getByRole>;

/**
 * Assert that `container` exposes an element with the given accessible role
 * and return it.
 *
 * @param container - Element to search within.
 * @param role - Accessible role, plus optional query options such as `name`.
 * @returns The matched element.
 * @throws When no element with the role exists.
 */
export function expectRole(
  container: HTMLElement,
  ...role: GetByRoleParams
): HTMLElement {
  return within(container).getByRole(...role);
}

/**
 * Assert an element's accessible name.
 *
 * @param element - Element to assert.
 * @param name - Expected accessible name.
 */
export function expectAccessibleName(
  element: HTMLElement,
  name: string | RegExp,
): void {
  expect(element).toHaveAccessibleName(name);
}

/**
 * Assert the exposed state of an interactive element. Only the states the
 * caller provides are checked.
 *
 * @param element - Element to assert.
 * @param state - Expected states.
 */
export function expectState(
  element: HTMLElement,
  state: {
    disabled?: boolean;
    expanded?: boolean;
    selected?: boolean;
    checked?: boolean;
    current?: string;
  },
): void {
  if (state.disabled !== undefined) {
    if (state.disabled) {
      expect(element).toBeDisabled();
    } else {
      expect(element).toBeEnabled();
    }
  }
  if (state.expanded !== undefined) {
    expect(element).toHaveAttribute("aria-expanded", String(state.expanded));
  }
  if (state.selected !== undefined) {
    expect(element).toHaveAttribute("aria-selected", String(state.selected));
  }
  if (state.checked !== undefined) {
    if (state.checked) {
      expect(element).toBeChecked();
    } else {
      expect(element).not.toBeChecked();
    }
  }
  if (state.current !== undefined) {
    expect(element).toHaveAttribute("aria-current", state.current);
  }
}

/**
 * Assert that a description relationship points at `description`.
 *
 * @param element - Element carrying `aria-describedby`.
 * @param description - Element that must be referenced.
 */
export function expectDescribedBy(
  element: HTMLElement,
  description: HTMLElement,
): void {
  const describedBy = element.getAttribute("aria-describedby");
  expect(describedBy).toBeTruthy();
  expect(describedBy?.split(/\s+/)).toContain(description.id);
}
