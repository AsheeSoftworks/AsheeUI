import type { ButtonConfig } from "./components/primitive/button/button-config";
import type { ContainerConfig } from "./components/primitive/container/container-config";
import type { FlexConfig } from "./components/primitive/flex/flex-config";
import type { GridConfig } from "./components/primitive/grid/grid-config";
import type { HeadingConfig } from "./components/primitive/heading/heading-config";
import type { InputConfig } from "./components/primitive/input/input-config";
import type { ParagraphConfig } from "./components/primitive/paragraph/paragraph-config";
import type { SpinnerConfig } from "./components/primitive/spinner/spinner-config";
import type { TextAreaConfig } from "./components/primitive/textarea/textarea-config";

export interface ComponentConfigRegistry {
  container: ContainerConfig;
  flex: FlexConfig;
  grid: GridConfig;
  heading: HeadingConfig;
  paragraph: ParagraphConfig;
  button: ButtonConfig;
  spinner: SpinnerConfig;
  input: InputConfig;
  textarea: TextAreaConfig;
}
