import { defaultAccordionConfig } from "../components/complex/accordion/accordion-config";
import { defaultAutocompleteConfig } from "../components/complex/autocomplete/autocomplete-config";
import { defaultCardConfig } from "../components/complex/card/card-config";
import { defaultCarouselConfig } from "../components/complex/carousel/carousel-config";
import { defaultChipConfig } from "../components/complex/chip/chip-config";
import { defaultDrawerConfig } from "../components/complex/drawer/drawer-config";
import { defaultKeyboardConfig } from "../components/complex/keyboard/default-keyboard-config";
import { defaultMarqueeConfig } from "../components/complex/marquee/marquee-config";
import { defaultModalConfig } from "../components/complex/modal/modal-config";
import { defaultMultiSelectConfig } from "../components/complex/multi-select/multi-select-config";
import { defaultResizableScreenConfig } from "../components/complex/resizable-screen/resizable-screen-config";
import { defaultSidebarConfig } from "../components/complex/sidebar/sidebar-config";
import { defaultTableConfig } from "../components/complex/table/table-config";
import { defaultTabsConfig } from "../components/complex/tabs/tabs-config";
import { defaultToastConfig } from "../components/complex/toast/toast-config";
import { defaultTooltipConfig } from "../components/complex/tooltip/tooltip-config";
import { defaultButtonConfig } from "../components/primitive/button/button-config";
import { defaultContainerConfig } from "../components/primitive/container/container-config";
import { defaultDatePickerConfig } from "../components/primitive/date-picker/date-picker-config";
import { defaultFlexConfig } from "../components/primitive/flex/flex-config";
import { defaultGridConfig } from "../components/primitive/grid/grid-config";
import { defaultHeadingConfig } from "../components/primitive/heading/heading-config";
import { defaultImageConfig } from "../components/primitive/image/image-config";
import { defaultInputConfig } from "../components/primitive/input/input-config";
import { defaultLinkConfig } from "../components/primitive/link/link-config";
import { defaultRadioConfig } from "../components/primitive/radio/radio-config";
import { defaultSelectConfig } from "../components/primitive/select/select-config";
import { defaultSpinnerConfig } from "../components/primitive/spinner/spinner-config";
import { defaultSwitchConfig } from "../components/primitive/switch/switch-config";
import { defaultTextConfig } from "../components/primitive/text/text-config";
import { defaultTextAreaConfig } from "../components/primitive/textarea/textarea-config";
import type { ComponentConfigRegistry } from "../registry";
import { defaultColorConfig } from "../theme/color/default-color-config";
import { defaultShadowConfig } from "../theme/shadow/default-shadow-config";
import { defaultRadiusConfig } from "../theme/token/radius/default-radius-config";
import { defaultSpacingConfig } from "../theme/token/spacing/default-spacing-config";
import { defaultTypographyConfig } from "../theme/typography/default-typography-config";
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
    spacing: defaultSpacingConfig,
    defaultTheme: "system",
    defaultVariant: "solid",
    defaultColor: "primary",
  },
  components: defaultComponentConfig,
};
