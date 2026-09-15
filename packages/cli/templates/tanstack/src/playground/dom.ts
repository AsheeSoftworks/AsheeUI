/**
 * DOM expectation helpers used by the gallery contract.
 *
 * Every helper records a problem description instead of throwing, so one run
 * reports every broken part of a section rather than only the first one. The
 * helpers only use DOM APIs that exist both in a container and after parsing
 * server markup, which is what lets one contract run against both.
 */

import type { Report } from "./types";

/**
 * Starts a report for one part of the gallery.
 *
 * @param where - Description of the markup being checked.
 * @returns An empty report.
 */
export function createReport(where: string): Report {
  return { where, problems: [] };
}

/**
 * Reads an element's text with its whitespace collapsed.
 *
 * @param element - Element to read, or `null`.
 * @returns The collapsed text, or an empty string.
 */
export function textOf(element: Element | null): string {
  return element?.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

/**
 * Requires an element to exist.
 *
 * @param report - Report receiving the problem.
 * @param root - Tree to search.
 * @param selector - CSS selector for the element.
 * @param description - What the element is, in a sentence.
 * @returns The element, or `null` when it is missing.
 */
export function requireElement(
  report: Report,
  root: ParentNode,
  selector: string,
  description: string,
): Element | null {
  const element = root.querySelector(selector);

  if (!element) {
    report.problems.push(
      `${report.where}: expected ${description} (${selector}), found none`,
    );
  }

  return element;
}

/**
 * Requires an element's text to contain a phrase.
 *
 * @param report - Report receiving the problem.
 * @param root - Tree to search.
 * @param selector - CSS selector for the element.
 * @param expected - Phrase the text must contain.
 * @param description - What the element is, in a sentence.
 * @returns The element, or `null` when it is missing.
 */
export function requireText(
  report: Report,
  root: ParentNode,
  selector: string,
  expected: string,
  description: string,
): Element | null {
  const element = requireElement(report, root, selector, description);

  if (element && !textOf(element).includes(expected)) {
    report.problems.push(
      `${report.where}: expected ${description} to read "${expected}", found "${textOf(element)}"`,
    );
  }

  return element;
}

/**
 * Requires an element to carry an attribute with an exact value.
 *
 * @param report - Report receiving the problem.
 * @param root - Tree to search.
 * @param selector - CSS selector for the element.
 * @param attribute - Attribute name.
 * @param value - Required value.
 * @param description - What the element is, in a sentence.
 */
export function requireAttribute(
  report: Report,
  root: ParentNode,
  selector: string,
  attribute: string,
  value: string,
  description: string,
): void {
  const element = requireElement(report, root, selector, description);

  if (element && element.getAttribute(attribute) !== value) {
    report.problems.push(
      `${report.where}: expected ${description} to have ${attribute}="${value}", found ${attribute}="${element.getAttribute(attribute)}"`,
    );
  }
}

/**
 * Requires an element to be absent, which is how a decorative or hidden part of
 * a section is checked.
 *
 * @param report - Report receiving the problem.
 * @param root - Tree to search.
 * @param selector - CSS selector that must not match.
 * @param description - What must be absent, in a sentence.
 */
export function requireAbsent(
  report: Report,
  root: ParentNode,
  selector: string,
  description: string,
): void {
  if (root.querySelector(selector)) {
    report.problems.push(
      `${report.where}: expected no ${description}, found one`,
    );
  }
}

/**
 * Names the section a check belongs to and narrows checking to it.
 *
 * A missing section is itself a problem, so a contract can never pass by
 * searching a tree that does not contain the section it describes.
 *
 * @param root - The gallery's rendered tree.
 * @param id - Section identifier.
 * @returns The report and the element to search within.
 */
export function createSectionReport(
  root: ParentNode,
  id: string,
): { report: Report; scope: ParentNode } {
  const report = createReport(id);
  const scope = root.querySelector(`[data-gallery-section="${id}"]`);

  if (!scope) {
    report.problems.push(
      `${id}: the section is missing from the rendered gallery`,
    );
  }

  return { report, scope: scope ?? root };
}

/**
 * Reads an element's accessible name from the markup: `aria-label`,
 * `aria-labelledby`, a `<label for>`, or a wrapping label.
 *
 * This is deliberately a markup approximation rather than a full accessibility
 * tree. It covers the naming mechanisms the framework documents, and it fails
 * loudly rather than silently passing when an element is named in none of them.
 *
 * @param root - Tree to search for labelling elements.
 * @param element - Element whose name is read.
 * @returns The name, or an empty string when the element has none.
 */
export function accessibleNameOf(root: ParentNode, element: Element): string {
  const label = element.getAttribute("aria-label");

  if (label) return label.trim();

  const labelledBy = element.getAttribute("aria-labelledby");

  if (labelledBy) {
    return labelledBy
      .split(/\s+/)
      .map((id) => textOf(root.querySelector(`#${id}`)))
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  const id = element.getAttribute("id");

  if (id) {
    const labelFor = root.querySelector(`label[for="${id}"]`);

    if (labelFor) return textOf(labelFor);
  }

  const wrapping = element.closest("label");

  return wrapping ? textOf(wrapping) : "";
}

/**
 * Requires an element to be named, the way assistive technology reads it.
 *
 * @param report - Report receiving the problem.
 * @param root - Tree to search.
 * @param selector - CSS selector for the element.
 * @param expected - Phrase the accessible name must contain.
 * @param description - What the element is, in a sentence.
 */
export function requireName(
  report: Report,
  root: ParentNode,
  selector: string,
  expected: string,
  description: string,
): void {
  const element = requireElement(report, root, selector, description);

  if (!element) return;

  const name = accessibleNameOf(root, element);

  if (!name.includes(expected)) {
    report.problems.push(
      `${report.where}: expected ${description} to be named "${expected}", found "${name}"`,
    );
  }
}

/**
 * Requires the tree's own text to contain a phrase.
 *
 * Sections that render their content as bare text, such as a chip, need their
 * contract checked against the section element itself rather than a descendant.
 *
 * @param report - Report receiving the problem.
 * @param root - Tree whose own text is read.
 * @param expected - Phrase the text must contain.
 * @param description - What the group is, in a sentence.
 */
export function requireOwnText(
  report: Report,
  root: ParentNode,
  expected: string,
  description: string,
): void {
  const text = textOf(root as Element);

  if (!text.includes(expected)) {
    report.problems.push(
      `${report.where}: expected ${description} to read "${expected}", found "${text}"`,
    );
  }
}

/**
 * Requires at least one element matching a selector to contain a phrase.
 *
 * Sections render several instances of one component, so a check has to say
 * which text it expects somewhere in the group rather than on the first match.
 *
 * @param report - Report receiving the problem.
 * @param root - Tree to search.
 * @param selector - CSS selector for the elements.
 * @param expected - Phrase the text must contain.
 * @param description - What the group is, in a sentence.
 */
export function requireAnyText(
  report: Report,
  root: ParentNode,
  selector: string,
  expected: string,
  description: string,
): void {
  const elements = Array.from(root.querySelectorAll(selector));

  if (elements.length === 0) {
    report.problems.push(
      `${report.where}: expected ${description} (${selector}), found none`,
    );
    return;
  }

  if (!elements.some((element) => textOf(element).includes(expected))) {
    report.problems.push(
      `${report.where}: expected ${description} to read "${expected}", found "${elements
        .map((element) => textOf(element))
        .join(" | ")}"`,
    );
  }
}

/**
 * Requires an element to carry every attribute in a list, whatever its value.
 *
 * @param report - Report receiving the problem.
 * @param root - Tree to search.
 * @param selector - CSS selector for the element.
 * @param attributes - Attribute names that must be present.
 * @param description - What the element is, in a sentence.
 */
export function requireAttributes(
  report: Report,
  root: ParentNode,
  selector: string,
  attributes: string[],
  description: string,
): void {
  const element = requireElement(report, root, selector, description);

  for (const attribute of attributes) {
    if (element && !element.hasAttribute(attribute)) {
      report.problems.push(
        `${report.where}: expected ${description} to carry ${attribute}`,
      );
    }
  }
}
