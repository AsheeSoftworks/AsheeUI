import {
  defaultBreakpointConfig,
  defaultColorConfig,
  defaultRadiusConfig,
  defaultScrollbarConfig,
  defaultShadowConfig,
  defaultSpacingConfig,
  defaultTypographyConfig,
} from "@ashee/theme";
import { defaultButtonConfig } from "./components/primitive/button/default-button-config";
import { defaultContainerConfig } from "./components/primitive/container/default-container-config";
import { defaultFlexConfig } from "./components/primitive/flex/default-flex-config";
import { defaultGridConfig } from "./components/primitive/grid/default-grid-config";
import { defaultHeadingConfig } from "./components/primitive/heading/default-heading-config";
import { defaultInputConfig } from "./components/primitive/input/default-input-config";
import { defaultParagraphConfig } from "./components/primitive/paragraph/default-paragraph-config";
import { defaultSpinnerConfig } from "./components/primitive/spinner/default-spinner-config";
import { defaultTextAreaConfig } from "./components/primitive/textarea/default-textarea-config";
import type { Config } from "./config";
import type { ComponentConfigRegistry } from "./registry";

export const defaultComponentConfig: Partial<ComponentConfigRegistry> = {
  container: defaultContainerConfig,
  flex: defaultFlexConfig,
  grid: defaultGridConfig,
  heading: defaultHeadingConfig,
  paragraph: defaultParagraphConfig,
  button: defaultButtonConfig,
  spinner: defaultSpinnerConfig,
  input: defaultInputConfig,
  textarea: defaultTextAreaConfig,
};

export const defaultConfig: Config = {
  theme: {
    color: defaultColorConfig,
    radius: defaultRadiusConfig,
    typography: defaultTypographyConfig,
    shadow: defaultShadowConfig,
    breakpoints: defaultBreakpointConfig,
    defaultTheme: "system",
    defaultVariant: "solid",
    defaultColor: "primary",
    scrollbar: defaultScrollbarConfig,
    spacing: defaultSpacingConfig,
  },
  components: defaultComponentConfig,
};
