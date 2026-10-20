/**
 * Behaviour tests for the section kit's action group.
 *
 * The group is the row a band's actions sit in. These tests state what the
 * component's own comment promises: configured actions and any `children` land
 * in that row, and a group with neither renders nothing.
 */

import { describe, expect, it } from "vitest";
import { renderWithProvider } from "../../../test";
import { ActionGroup } from "./ActionGroup";

describe("ActionGroup", () => {
  it("renders configured actions through the framework Button", () => {
    const { getByRole } = renderWithProvider(
      <ActionGroup
        primaryAction={{ label: "Start free", href: "/signup" }}
        secondaryAction={{ label: "Read the docs", href: "/docs" }}
      />,
    );

    expect(getByRole("link", { name: "Start free" })).toBeDefined();
    expect(getByRole("link", { name: "Read the docs" })).toBeDefined();
  });

  it("renders children inside its row, after the configured actions", () => {
    // This is the placement the component documents: a handler-carrying button
    // passed here lands in the same row as the configured actions. The bands
    // place their own children below the row instead, and say so on their own
    // props.
    const { container, getByText } = renderWithProvider(
      <ActionGroup primaryAction={{ label: "Start free", href: "/signup" }}>
        <button type="button">Talk to us</button>
      </ActionGroup>,
    );
    const row = container.querySelector(".gap-3") as HTMLElement;

    expect(row.contains(getByText("Talk to us"))).toBe(true);
    expect(row.querySelectorAll("a, button")).toHaveLength(2);
  });

  it("renders nothing when it has neither actions nor children", () => {
    const { container } = renderWithProvider(<ActionGroup />);

    expect(container.innerHTML).toBe("");
  });
});
