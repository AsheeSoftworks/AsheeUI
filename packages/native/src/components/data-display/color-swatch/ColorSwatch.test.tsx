/**
 * Tests for the native ColorSwatch.
 *
 * The platform's accessibility tree is the contract: a labelled swatch is one image, an
 * unlabelled one is decoration. The colour is a style value, not a class.
 */

import { render, screen } from "@testing-library/react-native";
import { ColorSwatch } from "./ColorSwatch";

describe("ColorSwatch", () => {
  it("paints the colour", async () => {
    await render(<ColorSwatch color="#047857" testID="swatch" />);

    const swatch = screen.getByTestId("swatch");
    expect(swatch.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: "#047857" })]),
    );
  });

  it("is one image with a name when labelled", async () => {
    await render(<ColorSwatch color="#047857" label="Emerald" />);

    expect(screen.getByLabelText("Emerald")).toBeTruthy();
    expect(screen.getByRole("image")).toBeTruthy();
  });

  it("is decorative without a label", async () => {
    await render(<ColorSwatch color="#047857" testID="swatch" />);

    const swatch = screen.getByTestId("swatch");
    expect(swatch.props.accessibilityLabel).toBeUndefined();
    expect(swatch.props.accessible).toBe(false);
  });
});
