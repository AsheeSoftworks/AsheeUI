import { AsheeUIProvider, useTheme } from "asheeui";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContrastBadge } from "./ContrastBadge";
import { ThemeSwitcher } from "./ThemeSwitcher";

describe("ContrastBadge", () => {
  it("states the ratio and WCAG level", () => {
    render(
      <AsheeUIProvider>
        <ContrastBadge foreground="#000000" background="#ffffff" />
      </AsheeUIProvider>,
    );

    expect(screen.getByText("21.0:1 · AAA")).toBeTruthy();
  });

  it("says when a colour is outside the portable set", () => {
    render(
      <AsheeUIProvider>
        <ContrastBadge foreground="oklch(0.7 0.1 150)" background="#ffffff" />
      </AsheeUIProvider>,
    );

    expect(screen.getByText(/not a portable colour/i)).toBeTruthy();
  });
});

/** A probe for the controller's selection, which the switcher changes. */
function Selection() {
  const { theme } = useTheme();
  return <span data-testid="selection">{theme}</span>;
}

describe("ThemeSwitcher", () => {
  it("changes the controller's selection", async () => {
    render(
      <AsheeUIProvider>
        <ThemeSwitcher />
        <Selection />
      </AsheeUIProvider>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "dark" }));

    await waitFor(() => {
      expect(screen.getByTestId("selection").textContent).toBe("dark");
    });
  });
});
