/**
 * Tests for the web ColorSwatch.
 *
 * A swatch is either one image with a name or decoration; those are the two contracts that matter.
 * The colour itself is data, so it lands in `style` rather than in a class.
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ColorSwatch } from "./ColorSwatch";

describe("ColorSwatch", () => {
  it("paints the colour and keeps the token shape", () => {
    render(<ColorSwatch color="#047857" data-testid="swatch" />);

    const swatch = screen.getByTestId("swatch");
    expect(swatch.style.backgroundColor).toBe("rgb(4, 120, 87)");
    expect(swatch.className).toContain("size-6");
    expect(swatch.className).toContain("rounded-sm");
  });

  it("is an image with a name when it is labelled", () => {
    render(<ColorSwatch color="#047857" label="Emerald" />);

    expect(screen.getByRole("img", { name: "Emerald" })).toBeTruthy();
  });

  it("is hidden from assistive technology when it is decoration", () => {
    render(<ColorSwatch color="#047857" data-testid="swatch" />);

    const swatch = screen.getByTestId("swatch");
    expect(swatch.getAttribute("aria-hidden")).toBe("true");
    expect(swatch.getAttribute("aria-label")).toBeNull();
  });

  it("lets the consumer override the size and radius", () => {
    render(<ColorSwatch color="#047857" size="lg" radius="full" data-testid="swatch" />);

    const swatch = screen.getByTestId("swatch");
    expect(swatch.className).toContain("size-8");
    expect(swatch.className).toContain("rounded-full");
  });
});
