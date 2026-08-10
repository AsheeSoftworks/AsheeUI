import {
  defaultBreakpointConfig,
  defaultColorConfig,
  defaultRadiusConfig,
  defaultScrollbarConfig,
  defaultShadowConfig,
  defaultSpacingConfig,
  defaultTypographyConfig,
} from "@ashee/theme";
import { defaultDrawerConfig } from "./components/complex/drawer/default-drawer-config";
import { defaultKeyboardConfig } from "./components/complex/keyboard/default-keyboard-config";
import { defaultModalConfig } from "./components/complex/modal/default-modal-config";
import { defaultMultiSelectConfig } from "./components/complex/multi-select/default-multi-select-config";
import { defaultResizableScreenConfig } from "./components/complex/resizable-screen/default-resizable-screen-config";
import { defaultSidebarConfig } from "./components/complex/sidebar/default-sidebar-config";
import { defaultTableConfig } from "./components/complex/table/default-table-config";
import { defaultTabsConfig } from "./components/complex/tabs/default-tabs-config";
import { defaultToastConfig } from "./components/complex/toast/default-toast-config";
import { defaultTooltipConfig } from "./components/complex/tooltip/default-tooltip-config";
import { defaultButtonConfig } from "./components/primitive/button/default-button-config";
import { defaultButtonDropdownConfig } from "./components/primitive/button-dropdown/default-button-dropdown-config";
import { defaultContainerConfig } from "./components/primitive/container/default-container-config";
import { defaultDatePickerConfig } from "./components/primitive/date-picker/default-date-picker-config";
import { defaultFlexConfig } from "./components/primitive/flex/default-flex-config";
import { defaultGridConfig } from "./components/primitive/grid/default-grid-config";
import { defaultHeadingConfig } from "./components/primitive/heading/default-heading-config";
import { defaultInputConfig } from "./components/primitive/input/default-input-config";
import { defaultParagraphConfig } from "./components/primitive/paragraph/default-paragraph-config";
import { defaultRadioConfig } from "./components/primitive/radio/default-radio-config";
import { defaultSelectConfig } from "./components/primitive/select/default-select-config";
import { defaultSpinnerConfig } from "./components/primitive/spinner/default-spinner-config";
import { defaultSwitchConfig } from "./components/primitive/switch/default-switch-config";
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
  switch: defaultSwitchConfig,
  radio: defaultRadioConfig,
  datePicker: defaultDatePickerConfig,
  select: defaultSelectConfig,
  buttonDropdown: defaultButtonDropdownConfig,

  tooltip: defaultTooltipConfig,
  multiSelect: defaultMultiSelectConfig,
  resizableScreen: defaultResizableScreenConfig,
  tabs: defaultTabsConfig,
  table: defaultTableConfig,
  drawer: defaultDrawerConfig,
  sidebar: defaultSidebarConfig,
  modal: defaultModalConfig,
  toast: defaultToastConfig,
  keyboard: defaultKeyboardConfig,
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
