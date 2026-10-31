/**
 * Native smoke test for the theme package.
 *
 * The web suite proves the controlled behaviour; this proves the same gallery renders through the
 * native provider, lists a runtime theme from the `themes` prop and selects it with the native
 * controller.
 */
import { AsheeUIProvider, useTheme } from "asheeui";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { Text } from "react-native";
import { THEME_PRESETS } from "../lib/presets";
import { ThemeGallery } from "./ThemeGallery";

const ocean = THEME_PRESETS[0] as (typeof THEME_PRESETS)[number];
const themes = { ocean: ocean.definition };

/** The gallery's select callback has to be the controller's, which needs the provider. */
function GalleryHarness() {
  const { setTheme } = useTheme();
  return <ThemeGallery themes={themes} onSelect={setTheme} />;
}

/** The controller's selection, read from a native component. */
function Probe() {
  const { theme } = useTheme();
  return <Text testID="selection">{theme}</Text>;
}

describe("ThemeGallery on native", () => {
  it("selects a runtime theme through the native provider", async () => {
    await render(
      <AsheeUIProvider config={{ defaultTheme: "light" }} themes={themes}>
        <GalleryHarness />
        <Probe />
      </AsheeUIProvider>,
    );

    fireEvent.press(screen.getByText("Use"));

    await waitFor(() => {
      expect(screen.getByTestId("selection").props.children).toBe("ocean");
    });
  });
});
