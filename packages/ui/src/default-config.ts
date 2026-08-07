import type { ComponentConfigRegistry } from "@ashee/config";
import { defaultButtonConfig } from "./components/primitive/button/default-button-config";
import { defaultContainerConfig } from "./components/primitive/container/default-container-config";
import { defaultFlexConfig } from "./components/primitive/flex/default-flex-config";
import { defaultGridConfig } from "./components/primitive/grid/default-grid-config";
import { defaultHeadingConfig } from "./components/primitive/heading/default-heading-config";
import { defaultInputConfig } from "./components/primitive/input/default-input-config";
import { defaultParagraphConfig } from "./components/primitive/paragraph/default-paragraph-config";
import { defaultTextAreaConfig } from "./components/primitive/textarea/default-textarea-config";

export const defaultComponentConfig: Partial<ComponentConfigRegistry> = {
  container: defaultContainerConfig,
  flex: defaultFlexConfig,
  grid: defaultGridConfig,
  heading: defaultHeadingConfig,
  paragraph: defaultParagraphConfig,
  button: defaultButtonConfig,
  input: defaultInputConfig,
  textarea: defaultTextAreaConfig,
};
