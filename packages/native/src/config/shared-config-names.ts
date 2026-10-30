/**
 * The platform's fallbacks and defaults, under the names the web renderer publishes.
 *
 * A fallback is a *value*, and the value is the platform's (`LAW-2`): a native button
 * defaults to density `lg` because a thumb needs the room, where the web's `md` is sized
 * for a pointer. The *name* is the shared one, so a consumer's configuration, a shared test
 * or a generated document writes one spelling on both renderers — and `@asheeui/web`
 * publishes the same list of names.
 *
 * Every export here is the same reference as the platform-suffixed constant its component
 * module declares, and the test beside this file asserts it. A copy would let the two drift
 * the first time one changed; a reference cannot.
 *
 * The platform spellings stay exported for one minor, marked deprecated where they are
 * declared. When they go, this module goes with them and each component module keeps its
 * own declaration — which is why nothing here owns a value.
 */

import {
  defaultNativeAccordionConfig,
  FALLBACK_NATIVE_ACCORDION_CONFIG,
} from "../components/data-display/accordion/accordion-config";
import {
  defaultNativeAvatarConfig,
  FALLBACK_NATIVE_AVATAR_CONFIG,
} from "../components/data-display/avatar/avatar-config";
import {
  defaultNativeBadgeConfig,
  FALLBACK_NATIVE_BADGE_CONFIG,
} from "../components/data-display/badge/badge-config";
import {
  defaultNativeCardConfig,
  FALLBACK_NATIVE_CARD_CONFIG,
} from "../components/data-display/card/card-config";
import {
  defaultNativeCarouselConfig,
  FALLBACK_NATIVE_CAROUSEL_CONFIG,
} from "../components/data-display/carousel/carousel-config";
import {
  defaultNativeChipConfig,
  FALLBACK_NATIVE_CHIP_CONFIG,
} from "../components/data-display/chip/chip-config";
import {
  defaultNativeClipboardConfig,
  FALLBACK_NATIVE_CLIPBOARD_CONFIG,
} from "../components/data-display/clipboard/clipboard-config";
import {
  defaultNativeImageConfig,
  FALLBACK_NATIVE_IMAGE_CONFIG,
} from "../components/data-display/image/image-config";
import {
  defaultNativeMarqueeConfig,
  FALLBACK_NATIVE_MARQUEE_CONFIG,
} from "../components/data-display/marquee/marquee-config";
import {
  defaultNativeDataTableConfig,
  defaultNativeTableConfig,
  FALLBACK_NATIVE_DATA_TABLE_CONFIG,
  FALLBACK_NATIVE_TABLE_CONFIG,
} from "../components/data-display/row-list/row-list-config";
import {
  defaultNativeAlertConfig,
  FALLBACK_NATIVE_ALERT_CONFIG,
} from "../components/feedback/alert/alert-config";
import {
  defaultNativeEmptyStateConfig,
  FALLBACK_NATIVE_EMPTY_STATE_CONFIG,
} from "../components/feedback/empty-state/empty-state-config";
import {
  defaultNativeErrorStateConfig,
  FALLBACK_NATIVE_ERROR_STATE_CONFIG,
} from "../components/feedback/error-state/error-state-config";
import {
  defaultNativeLoadingStateConfig,
  FALLBACK_NATIVE_LOADING_STATE_CONFIG,
} from "../components/feedback/loading-state/loading-state-config";
import {
  defaultNativeSkeletonConfig,
  FALLBACK_NATIVE_SKELETON_CONFIG,
} from "../components/feedback/skeleton/skeleton-config";
import {
  defaultNativeSpinnerConfig,
  FALLBACK_NATIVE_SPINNER_CONFIG,
} from "../components/feedback/spinner/spinner-config";
import {
  defaultNativeToastConfig,
  FALLBACK_NATIVE_TOAST_CONFIG,
} from "../components/feedback/toast/toast-config";
import {
  defaultNativeAutocompleteConfig,
  FALLBACK_NATIVE_AUTOCOMPLETE_CONFIG,
} from "../components/forms/autocomplete/autocomplete-config";
import {
  defaultNativeButtonConfig,
  FALLBACK_NATIVE_BUTTON_CONFIG,
} from "../components/forms/button/button-config";
import {
  defaultNativeCalendarConfig,
  FALLBACK_NATIVE_CALENDAR_CONFIG,
} from "../components/forms/calendar/calendar-config";
import {
  defaultNativeDropmenuConfig,
  FALLBACK_NATIVE_DROPMENU_CONFIG,
} from "../components/forms/dropmenu/dropmenu-config";
import {
  defaultNativeFileUploadConfig,
  FALLBACK_NATIVE_FILE_UPLOAD_CONFIG,
} from "../components/forms/file-upload/file-upload-config";
import {
  defaultNativeFormConfig,
  FALLBACK_NATIVE_FORM_CONFIG,
} from "../components/forms/form/form-config";
import {
  defaultNativeInputConfig,
  FALLBACK_NATIVE_INPUT_CONFIG,
} from "../components/forms/input/input-config";
import {
  defaultNativeMultiSelectConfig,
  FALLBACK_NATIVE_MULTI_SELECT_CONFIG,
} from "../components/forms/multi-select/multi-select-config";
import {
  defaultNativePinInputConfig,
  FALLBACK_NATIVE_PIN_INPUT_CONFIG,
} from "../components/forms/pin-input/pin-input-config";
import {
  defaultNativeRadioConfig,
  FALLBACK_NATIVE_RADIO_CONFIG,
} from "../components/forms/radio/radio-config";
import {
  defaultNativeSearchInputConfig,
  FALLBACK_NATIVE_SEARCH_INPUT_CONFIG,
} from "../components/forms/search-input/search-input-config";
import {
  defaultNativeStepperConfig,
  FALLBACK_NATIVE_STEPPER_CONFIG,
} from "../components/forms/stepper/stepper-config";
import {
  defaultNativeSwitchConfig,
  FALLBACK_NATIVE_SWITCH_CONFIG,
} from "../components/forms/switch/switch-config";
import {
  defaultNativeTextareaConfig,
  FALLBACK_NATIVE_TEXTAREA_CONFIG,
} from "../components/forms/textarea/textarea-config";
import {
  defaultNativeAuthLayoutConfig,
  FALLBACK_NATIVE_AUTH_LAYOUT_CONFIG,
} from "../components/layouts/auth-layout/auth-layout-config";
import {
  defaultNativeDocsLayoutConfig,
  FALLBACK_NATIVE_DOCS_LAYOUT_CONFIG,
} from "../components/layouts/docs-layout/docs-layout-config";
import {
  defaultNativeMarketingLayoutConfig,
  FALLBACK_NATIVE_MARKETING_LAYOUT_CONFIG,
} from "../components/layouts/marketing-layout/marketing-layout-config";
import {
  defaultNativePageConfig,
  FALLBACK_NATIVE_PAGE_CONFIG,
} from "../components/layouts/page/page-config";
import {
  defaultNativeSidebarLayoutConfig,
  FALLBACK_NATIVE_SIDEBAR_LAYOUT_CONFIG,
} from "../components/layouts/sidebar-layout/sidebar-layout-config";
import {
  defaultNativeSplitConfig,
  FALLBACK_NATIVE_SPLIT_CONFIG,
} from "../components/layouts/split/split-config";
import {
  defaultNativeCtaConfig,
  FALLBACK_NATIVE_CTA_CONFIG,
} from "../components/marketing/cta/cta-config";
import {
  defaultNativeFeatureGridConfig,
  FALLBACK_NATIVE_FEATURE_GRID_CONFIG,
} from "../components/marketing/feature-grid/feature-grid-config";
import {
  defaultNativeHeroConfig,
  FALLBACK_NATIVE_HERO_CONFIG,
} from "../components/marketing/hero/hero-config";
import {
  defaultNativePricingCardConfig,
  FALLBACK_NATIVE_PRICING_CARD_CONFIG,
} from "../components/marketing/pricing-card/pricing-card-config";
import {
  defaultNativeTestimonialsConfig,
  FALLBACK_NATIVE_TESTIMONIALS_CONFIG,
} from "../components/marketing/testimonials/testimonials-config";
import {
  defaultNativeFooterConfig,
  FALLBACK_NATIVE_FOOTER_CONFIG,
} from "../components/navigation/footer/footer-config";
import {
  defaultNativeLinkConfig,
  FALLBACK_NATIVE_LINK_CONFIG,
} from "../components/navigation/link/link-config";
import {
  defaultNativeNavbarConfig,
  FALLBACK_NATIVE_NAVBAR_CONFIG,
} from "../components/navigation/navbar/navbar-config";
import {
  defaultNativePaginationConfig,
  FALLBACK_NATIVE_PAGINATION_CONFIG,
} from "../components/navigation/pagination/pagination-config";
import {
  defaultNativeSidebarConfig,
  FALLBACK_NATIVE_SIDEBAR_CONFIG,
} from "../components/navigation/sidebar/sidebar-config";
import {
  defaultNativeTabsConfig,
  FALLBACK_NATIVE_TABS_CONFIG,
} from "../components/navigation/tabs/tabs-config";
import {
  defaultNativeDrawerConfig,
  FALLBACK_NATIVE_DRAWER_CONFIG,
} from "../components/overlays/drawer/drawer-config";
import {
  defaultNativeModalConfig,
  FALLBACK_NATIVE_MODAL_CONFIG,
} from "../components/overlays/modal/modal-config";
import {
  defaultNativeTooltipConfig,
  FALLBACK_NATIVE_TOOLTIP_CONFIG,
} from "../components/overlays/tooltip/tooltip-config";
import {
  defaultNativeTextConfig,
  FALLBACK_NATIVE_TEXT_CONFIG,
} from "../components/typography/text/text-config";
import {
  defaultNativeCenteredConfig,
  defaultNativeContainerConfig,
  defaultNativeGridConfig,
  defaultNativeSectionConfig,
  defaultNativeStackConfig,
  FALLBACK_NATIVE_CENTERED_CONFIG,
  FALLBACK_NATIVE_CONTAINER_CONFIG,
  FALLBACK_NATIVE_GRID_CONFIG,
  FALLBACK_NATIVE_SECTION_CONFIG,
  FALLBACK_NATIVE_STACK_CONFIG,
} from "../layout/layout-config";

export const defaultAccordionConfig = defaultNativeAccordionConfig;
export const defaultAlertConfig = defaultNativeAlertConfig;
export const defaultAuthLayoutConfig = defaultNativeAuthLayoutConfig;
export const defaultAutocompleteConfig = defaultNativeAutocompleteConfig;
export const defaultAvatarConfig = defaultNativeAvatarConfig;
export const defaultBadgeConfig = defaultNativeBadgeConfig;
export const defaultButtonConfig = defaultNativeButtonConfig;
export const defaultCalendarConfig = defaultNativeCalendarConfig;
export const defaultCardConfig = defaultNativeCardConfig;
export const defaultCarouselConfig = defaultNativeCarouselConfig;
export const defaultCenteredConfig = defaultNativeCenteredConfig;
export const defaultChipConfig = defaultNativeChipConfig;
export const defaultClipboardConfig = defaultNativeClipboardConfig;
export const defaultContainerConfig = defaultNativeContainerConfig;
export const defaultCtaConfig = defaultNativeCtaConfig;
export const defaultDataTableConfig = defaultNativeDataTableConfig;
export const defaultDocsLayoutConfig = defaultNativeDocsLayoutConfig;
export const defaultDrawerConfig = defaultNativeDrawerConfig;
export const defaultDropmenuConfig = defaultNativeDropmenuConfig;
export const defaultEmptyStateConfig = defaultNativeEmptyStateConfig;
export const defaultErrorStateConfig = defaultNativeErrorStateConfig;
export const defaultFeatureGridConfig = defaultNativeFeatureGridConfig;
export const defaultFileUploadConfig = defaultNativeFileUploadConfig;
export const defaultFooterConfig = defaultNativeFooterConfig;
export const defaultFormConfig = defaultNativeFormConfig;
export const defaultGridConfig = defaultNativeGridConfig;
export const defaultHeroConfig = defaultNativeHeroConfig;
export const defaultImageConfig = defaultNativeImageConfig;
export const defaultInputConfig = defaultNativeInputConfig;
export const defaultLinkConfig = defaultNativeLinkConfig;
export const defaultLoadingStateConfig = defaultNativeLoadingStateConfig;
export const defaultMarketingLayoutConfig = defaultNativeMarketingLayoutConfig;
export const defaultMarqueeConfig = defaultNativeMarqueeConfig;
export const defaultModalConfig = defaultNativeModalConfig;
export const defaultMultiSelectConfig = defaultNativeMultiSelectConfig;
export const defaultNavbarConfig = defaultNativeNavbarConfig;
export const defaultPageConfig = defaultNativePageConfig;
export const defaultPaginationConfig = defaultNativePaginationConfig;
export const defaultPinInputConfig = defaultNativePinInputConfig;
export const defaultPricingCardConfig = defaultNativePricingCardConfig;
export const defaultRadioConfig = defaultNativeRadioConfig;
export const defaultSearchInputConfig = defaultNativeSearchInputConfig;
export const defaultSectionConfig = defaultNativeSectionConfig;
export const defaultSidebarConfig = defaultNativeSidebarConfig;
export const defaultSidebarLayoutConfig = defaultNativeSidebarLayoutConfig;
export const defaultSkeletonConfig = defaultNativeSkeletonConfig;
export const defaultSpinnerConfig = defaultNativeSpinnerConfig;
export const defaultSplitConfig = defaultNativeSplitConfig;
export const defaultStackConfig = defaultNativeStackConfig;
export const defaultStepperConfig = defaultNativeStepperConfig;
export const defaultSwitchConfig = defaultNativeSwitchConfig;
export const defaultTableConfig = defaultNativeTableConfig;
export const defaultTabsConfig = defaultNativeTabsConfig;
export const defaultTestimonialsConfig = defaultNativeTestimonialsConfig;
export const defaultTextareaConfig = defaultNativeTextareaConfig;
export const defaultTextConfig = defaultNativeTextConfig;
export const defaultToastConfig = defaultNativeToastConfig;
export const defaultTooltipConfig = defaultNativeTooltipConfig;
export const FALLBACK_ACCORDION_CONFIG = FALLBACK_NATIVE_ACCORDION_CONFIG;
export const FALLBACK_ALERT_CONFIG = FALLBACK_NATIVE_ALERT_CONFIG;
export const FALLBACK_AUTH_LAYOUT_CONFIG = FALLBACK_NATIVE_AUTH_LAYOUT_CONFIG;
export const FALLBACK_AUTOCOMPLETE_CONFIG = FALLBACK_NATIVE_AUTOCOMPLETE_CONFIG;
export const FALLBACK_AVATAR_CONFIG = FALLBACK_NATIVE_AVATAR_CONFIG;
export const FALLBACK_BADGE_CONFIG = FALLBACK_NATIVE_BADGE_CONFIG;
export const FALLBACK_BUTTON_CONFIG = FALLBACK_NATIVE_BUTTON_CONFIG;
export const FALLBACK_CALENDAR_CONFIG = FALLBACK_NATIVE_CALENDAR_CONFIG;
export const FALLBACK_CARD_CONFIG = FALLBACK_NATIVE_CARD_CONFIG;
export const FALLBACK_CAROUSEL_CONFIG = FALLBACK_NATIVE_CAROUSEL_CONFIG;
export const FALLBACK_CENTERED_CONFIG = FALLBACK_NATIVE_CENTERED_CONFIG;
export const FALLBACK_CHIP_CONFIG = FALLBACK_NATIVE_CHIP_CONFIG;
export const FALLBACK_CLIPBOARD_CONFIG = FALLBACK_NATIVE_CLIPBOARD_CONFIG;
export const FALLBACK_CONTAINER_CONFIG = FALLBACK_NATIVE_CONTAINER_CONFIG;
export const FALLBACK_CTA_CONFIG = FALLBACK_NATIVE_CTA_CONFIG;
export const FALLBACK_DATA_TABLE_CONFIG = FALLBACK_NATIVE_DATA_TABLE_CONFIG;
export const FALLBACK_DOCS_LAYOUT_CONFIG = FALLBACK_NATIVE_DOCS_LAYOUT_CONFIG;
export const FALLBACK_DRAWER_CONFIG = FALLBACK_NATIVE_DRAWER_CONFIG;
export const FALLBACK_DROPMENU_CONFIG = FALLBACK_NATIVE_DROPMENU_CONFIG;
export const FALLBACK_EMPTY_STATE_CONFIG = FALLBACK_NATIVE_EMPTY_STATE_CONFIG;
export const FALLBACK_ERROR_STATE_CONFIG = FALLBACK_NATIVE_ERROR_STATE_CONFIG;
export const FALLBACK_FEATURE_GRID_CONFIG = FALLBACK_NATIVE_FEATURE_GRID_CONFIG;
export const FALLBACK_FILE_UPLOAD_CONFIG = FALLBACK_NATIVE_FILE_UPLOAD_CONFIG;
export const FALLBACK_FOOTER_CONFIG = FALLBACK_NATIVE_FOOTER_CONFIG;
export const FALLBACK_FORM_CONFIG = FALLBACK_NATIVE_FORM_CONFIG;
export const FALLBACK_GRID_CONFIG = FALLBACK_NATIVE_GRID_CONFIG;
export const FALLBACK_HERO_CONFIG = FALLBACK_NATIVE_HERO_CONFIG;
export const FALLBACK_IMAGE_CONFIG = FALLBACK_NATIVE_IMAGE_CONFIG;
export const FALLBACK_INPUT_CONFIG = FALLBACK_NATIVE_INPUT_CONFIG;
export const FALLBACK_LINK_CONFIG = FALLBACK_NATIVE_LINK_CONFIG;
export const FALLBACK_LOADING_STATE_CONFIG =
  FALLBACK_NATIVE_LOADING_STATE_CONFIG;
export const FALLBACK_MARKETING_LAYOUT_CONFIG =
  FALLBACK_NATIVE_MARKETING_LAYOUT_CONFIG;
export const FALLBACK_MARQUEE_CONFIG = FALLBACK_NATIVE_MARQUEE_CONFIG;
export const FALLBACK_MODAL_CONFIG = FALLBACK_NATIVE_MODAL_CONFIG;
export const FALLBACK_MULTI_SELECT_CONFIG = FALLBACK_NATIVE_MULTI_SELECT_CONFIG;
export const FALLBACK_NAVBAR_CONFIG = FALLBACK_NATIVE_NAVBAR_CONFIG;
export const FALLBACK_PAGE_CONFIG = FALLBACK_NATIVE_PAGE_CONFIG;
export const FALLBACK_PAGINATION_CONFIG = FALLBACK_NATIVE_PAGINATION_CONFIG;
export const FALLBACK_PIN_INPUT_CONFIG = FALLBACK_NATIVE_PIN_INPUT_CONFIG;
export const FALLBACK_PRICING_CARD_CONFIG = FALLBACK_NATIVE_PRICING_CARD_CONFIG;
export const FALLBACK_RADIO_CONFIG = FALLBACK_NATIVE_RADIO_CONFIG;
export const FALLBACK_SEARCH_INPUT_CONFIG = FALLBACK_NATIVE_SEARCH_INPUT_CONFIG;
export const FALLBACK_SECTION_CONFIG = FALLBACK_NATIVE_SECTION_CONFIG;
export const FALLBACK_SIDEBAR_CONFIG = FALLBACK_NATIVE_SIDEBAR_CONFIG;
export const FALLBACK_SIDEBAR_LAYOUT_CONFIG =
  FALLBACK_NATIVE_SIDEBAR_LAYOUT_CONFIG;
export const FALLBACK_SKELETON_CONFIG = FALLBACK_NATIVE_SKELETON_CONFIG;
export const FALLBACK_SPINNER_CONFIG = FALLBACK_NATIVE_SPINNER_CONFIG;
export const FALLBACK_SPLIT_CONFIG = FALLBACK_NATIVE_SPLIT_CONFIG;
export const FALLBACK_STACK_CONFIG = FALLBACK_NATIVE_STACK_CONFIG;
export const FALLBACK_STEPPER_CONFIG = FALLBACK_NATIVE_STEPPER_CONFIG;
export const FALLBACK_SWITCH_CONFIG = FALLBACK_NATIVE_SWITCH_CONFIG;
export const FALLBACK_TABLE_CONFIG = FALLBACK_NATIVE_TABLE_CONFIG;
export const FALLBACK_TABS_CONFIG = FALLBACK_NATIVE_TABS_CONFIG;
export const FALLBACK_TESTIMONIALS_CONFIG = FALLBACK_NATIVE_TESTIMONIALS_CONFIG;
export const FALLBACK_TEXT_CONFIG = FALLBACK_NATIVE_TEXT_CONFIG;
export const FALLBACK_TEXTAREA_CONFIG = FALLBACK_NATIVE_TEXTAREA_CONFIG;
export const FALLBACK_TOAST_CONFIG = FALLBACK_NATIVE_TOAST_CONFIG;
export const FALLBACK_TOOLTIP_CONFIG = FALLBACK_NATIVE_TOOLTIP_CONFIG;
