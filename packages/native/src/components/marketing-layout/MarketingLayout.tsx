/**
 * MarketingLayout component for the native package.
 *
 * The component satisfies the framework's marketing-layout contract: the arrangement a
 * marketing page is built in, holding navigation, a main region of sections and a footer,
 * with every region taken as a node. A consumer passes the framework's own navigation, hero,
 * feature grid, call to action and footer, and nothing about their content is decided here.
 *
 * What the platform states differently is what it has to scroll. The web is a document that
 * grows with what it holds, so its shell is a full-height column and the document scrolls;
 * a native screen is given its height by the platform, so the composition is the scrolling
 * region itself and the regions stack inside it, in the order the web shows them.
 *
 * Two things the platform keeps in its own vocabulary. The web's skip link is a keyboard
 * reader's way past the navigation; a platform screen has no focus order to skip through, so
 * the option resolves through the shared contract and renders nothing. And the web names its
 * main region with an `id`, so a link can point at it; the platform names a view with
 * `nativeID`, which is the identifier its own reader can be pointed at, so `mainId` becomes
 * that.
 */

import {
  NATIVE_MARKETING_LAYOUT_BACKGROUND_CLASS,
  NATIVE_MARKETING_LAYOUT_CLASS,
  NATIVE_MARKETING_LAYOUT_CONTENT_CLASS,
  NATIVE_MARKETING_LAYOUT_MAIN_CLASS,
  resolveConfigCascade,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type { ScrollViewProps, StyleProp, ViewStyle } from "react-native";
import { ScrollView, View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import {
  FALLBACK_NATIVE_MARKETING_LAYOUT_CONFIG,
  type NativeMarketingLayoutConfig,
} from "./marketing-layout-config";

/**
 * Props for the native MarketingLayout.
 */
export interface MarketingLayoutProps
  extends NativeMarketingLayoutConfig,
    Omit<ScrollViewProps, "children" | "style" | "contentContainerStyle"> {
  /**
   * The page's navigation, above the main region.
   * The framework's own navigation is the platform's header, which announces itself as one.
   */
  navigation?: ReactNode;

  /**
   * The page's footer, below the main region.
   * The framework's own footer announces itself as the page's footer.
   */
  footer?: ReactNode;

  /**
   * The page's sections, in the order they appear: a hero, then the supporting sections,
   * then the closing call to action.
   */
  children?: ReactNode;

  /**
   * Identifier of the main region.
   * A page with more than one composition on it gives each one its own.
   *
   * @default "main-content"
   */
  mainId?: string;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * The arrangement a marketing page is built in.
 *
 * The composition states the page's structure once: navigation first, then the main region
 * holding the sections, then the footer, all inside one scrolling region so the page scrolls
 * as a whole. Which sections exist, in what order, and whether they appear at all stay the
 * consumer's decision, because they are passed as children.
 *
 * The composition paints the page background and takes the screen's height. It adds no width
 * and no rhythm of its own: `Section`, `Container` and `Grid` inside the sections decide
 * those, which is what keeps a section usable on its own.
 *
 * @param props - The composition's options and the platform's scroll props.
 * @param props.navigation - The navigation, above the main region.
 * @param props.footer - The footer, below the main region.
 * @param props.children - The sections, in order.
 * @param props.mainId - Identifier of the main region. Defaults to "main-content".
 * @param props.skipLink - Whether the web renders a skip link. Defaults to true. The
 * platform has no focus order to skip through, so it renders nothing here.
 * @param props.skipLinkLabel - Wording of that link. Defaults to "Skip to content".
 * @param props.background - Background to paint. Defaults to "default".
 * @returns The rendered page.
 *
 * @example
 * ```tsx
 * <MarketingLayout
 *   navigation={<Header title="Ashee" />}
 *   footer={<Footer brand="Ashee" groups={groups} />}>
 *   <Hero title="A complete UI system" primaryAction={start} />
 *   <FeatureGrid title="Everything a page needs" items={features} />
 *   <CTA title="Start building" primaryAction={start} />
 * </MarketingLayout>
 * ```
 *
 * @see SidebarLayout - The application shell, for a page with a navigation column.
 */
export function MarketingLayout({
  navigation,
  footer,
  children,
  mainId = "main-content",
  skipLink,
  skipLinkLabel,
  background,
  className,
  style,
  ...rest
}: MarketingLayoutProps) {
  const config = useAsheeNativeConfig();

  const resolved = resolveConfigCascade<
    NativeMarketingLayoutConfig,
    Required<NativeMarketingLayoutConfig>
  >(
    { skipLink, skipLinkLabel, background },
    config.components.marketinglayout,
    FALLBACK_NATIVE_MARKETING_LAYOUT_CONFIG,
  );

  return (
    <ScrollView
      className={classNames(
        NATIVE_MARKETING_LAYOUT_CLASS,
        NATIVE_MARKETING_LAYOUT_BACKGROUND_CLASS[resolved.background],
        className,
      )}
      style={style}
      {...rest}>
      <View className={NATIVE_MARKETING_LAYOUT_CONTENT_CLASS}>
        {navigation}

        <View
          // The platform's own identifier for a view, which is what its reader can be
          // pointed at; the web's `id` and a skip link are a keyboard's way of doing it.
          nativeID={mainId}
          className={NATIVE_MARKETING_LAYOUT_MAIN_CLASS}>
          {children}
        </View>

        {footer}
      </View>
    </ScrollView>
  );
}
