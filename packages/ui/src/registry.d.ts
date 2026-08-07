import "@ashee/config";

import type { ButtonConfig } from "./components/primitive/button/button-config";
import type { InputConfig } from "./components/primitive/input/input-config";
import type { TextAreaConfig } from "./components/primitive/textarea/textarea-config";
import type { ContainerConfig } from "./container/container-config";
import type { FlexConfig } from "./flex/flex-config";
import type { GridConfig } from "./grid/grid-config";
import type { HeadingConfig } from "./heading/heading-config";
import type { ParagraphConfig } from "./paragraph/paragraph-config";

declare module "@ashee/config" {
  interface ComponentConfigRegistry {
    container: ContainerConfig;
    flex: FlexConfig;
    grid: GridConfig;
    heading: HeadingConfig;
    paragraph: ParagraphConfig;
    button: ButtonConfig;
    input: InputConfig;
    textarea: TextAreaConfig;
  }
}
