import {
  defaultBreakpointConfig,
  defaultColorConfig,
  defaultRadiusConfig,
  defaultScrollbarConfig,
  defaultShadowConfig,
  defaultSpacingConfig,
  defaultTypographyConfig,
} from "@ashee/theme";
import { defaultAccordionConfig } from "../components/complex/accordion/default-accordion-config";
import { defaultAutocompleteConfig } from "../components/complex/autocomplete/default-autocomplete-config";
import { defaultCardConfig } from "../components/complex/card/default-card-config";
import { defaultCarouselConfig } from "../components/complex/carousel/default-carousel-config";
import { defaultChipConfig } from "../components/complex/chip/default-chip-config";
import { defaultDrawerConfig } from "../components/complex/drawer/default-drawer-config";
import { defaultKeyboardConfig } from "../components/complex/keyboard/default-keyboard-config";
import { defaultMarqueeConfig } from "../components/complex/marquee/default-marquee-config";
import { defaultModalConfig } from "../components/complex/modal/default-modal-config";
import { defaultMultiSelectConfig } from "../components/complex/multi-select/default-multi-select-config";
import { defaultResizableScreenConfig } from "../components/complex/resizable-screen/default-resizable-screen-config";
import { defaultSidebarConfig } from "../components/complex/sidebar/default-sidebar-config";
import { defaultTableConfig } from "../components/complex/table/default-table-config";
import { defaultTabsConfig } from "../components/complex/tabs/default-tabs-config";
import { defaultToastConfig } from "../components/complex/toast/default-toast-config";
import { defaultTooltipConfig } from "../components/complex/tooltip/default-tooltip-config";
import { defaultButtonConfig } from "../components/primitive/button/default-button-config";
import { defaultContainerConfig } from "../components/primitive/container/default-container-config";
import { defaultDatePickerConfig } from "../components/primitive/date-picker/default-date-picker-config";
import { defaultFlexConfig } from "../components/primitive/flex/default-flex-config";
import { defaultGridConfig } from "../components/primitive/grid/default-grid-config";
import { defaultHeadingConfig } from "../components/primitive/heading/default-heading-config";
import { defaultImageConfig } from "../components/primitive/image/default-image-config";
import { defaultInputConfig } from "../components/primitive/input/default-input-config";
import { defaultLinkConfig } from "../components/primitive/link/default-link-config";
import { defaultRadioConfig } from "../components/primitive/radio/default-radio-config";
import { defaultSelectConfig } from "../components/primitive/select/default-select-config";
import { defaultSpinnerConfig } from "../components/primitive/spinner/default-spinner-config";
import { defaultSwitchConfig } from "../components/primitive/switch/default-switch-config";
import { defaultTextConfig } from "../components/primitive/text/default-text-config";
import { defaultTextAreaConfig } from "../components/primitive/textarea/default-textarea-config";
import type { ComponentConfigRegistry } from "../registry";
import type { Config } from "./config";

export const defaultComponentConfig: ComponentConfigRegistry = {
  container: defaultContainerConfig,
  flex: defaultFlexConfig,
  grid: defaultGridConfig,
  heading: defaultHeadingConfig,
  text: defaultTextConfig,
  button: defaultButtonConfig,
  spinner: defaultSpinnerConfig,
  input: defaultInputConfig,
  textarea: defaultTextAreaConfig,
  switch: defaultSwitchConfig,
  radio: defaultRadioConfig,
  datePicker: defaultDatePickerConfig,
  select: defaultSelectConfig,
  image: defaultImageConfig,
  link: defaultLinkConfig,

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
  accordion: defaultAccordionConfig,
  marquee: defaultMarqueeConfig,
  carousel: defaultCarouselConfig,
  card: defaultCardConfig,
  chip: defaultChipConfig,
  autocomplete: defaultAutocompleteConfig,
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
    defaultColor: "danger",
    scrollbar: defaultScrollbarConfig,
    spacing: defaultSpacingConfig,
  },
  components: defaultComponentConfig,
};
