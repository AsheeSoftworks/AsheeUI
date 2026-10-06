/**
 * DocsLayout component for the native package.
 *
 * The component satisfies the framework's docs-layout contract: a documentation page, holding
 * navigation, an article and an optional table of contents, with a header and a footer around
 * them, and with the names of its regions and the shape of its navigation resolving through the
 * configuration cascade. Every region is a node the consumer supplies, so nothing about the
 * navigation or the article is decided here.
 *
 * What the platform states differently is what it can stack. The web builds the page from a
 * navigation column, an article column and a third column for the contents, and arranges them
 * with the framework's own split layout; a phone has one column and a tablet has no reason to
 * give a third of its width to a list of headings, so the composition shows the same three
 * regions as stacked sections, in the order the web's own flow gives them at its narrow widths,
 * and is the scrolling region itself, because three sections do not fit a screen at once.
 *
 * The platform also has no landmarks. The web names its navigation and contents with `aria-label`
 * so a reader can move between regions; a platform screen has no landmark vocabulary, so those
 * names become the titles that head the sections instead — the reader is shown what the region is
 * rather than told, which is the platform's own way of naming one. The web's skip link and the
 * stickiness of the contents are a document's answers to questions a platform screen does not
 * have, so both options resolve through the shared contract and change nothing here.
 */

import {
  NATIVE_DOCS_LAYOUT_ARTICLE_CLASS,
  NATIVE_DOCS_LAYOUT_BODY_CLASS,
  NATIVE_DOCS_LAYOUT_BODY_SIZE,
  NATIVE_DOCS_LAYOUT_CLASS,
  NATIVE_DOCS_LAYOUT_CONTENT_CLASS,
  NATIVE_DOCS_LAYOUT_NAVIGATION_CLASS,
  NATIVE_DOCS_LAYOUT_REGION_CLASS,
  resolveConfigCascade,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type { ScrollViewProps, StyleProp, ViewStyle } from "react-native";
import { ScrollView, View } from "react-native";
import { Container } from "../../layout/Container";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_DOCS_LAYOUT_CONFIG,
  type NativeDocsLayoutConfig,
} from "./docs-layout-config";

/**
 * Props for the native DocsLayout.
 */
export interface DocsLayoutProps
  extends NativeDocsLayoutConfig,
    Omit<ScrollViewProps, "children" | "style"> {
  /**
   * The documentation navigation, typically a `Sidebar` of sections and pages.
   */
  navigation: ReactNode;

  /**
   * The table of contents of the current article.
   * Left out, the composition is a navigation section and an article; supplied, the contents are
   * stacked under the article.
   */
  toc?: ReactNode;

  /**
   * Content above every region, typically a `Navbar` with the site's brand and search.
   */
  header?: ReactNode;

  /**
   * Content below every region.
   */
  footer?: ReactNode;

  /**
   * The article.
   */
  children?: ReactNode;

  /**
   * Identifier of the article region.
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
 * The arrangement a documentation page is built in.
 *
 * @param props - The composition's options and the platform's scroll props.
 * @param props.navigation - The documentation navigation.
 * @param props.toc - The table of contents of the current article.
 * @param props.header - Content above every region.
 * @param props.footer - Content below every region.
 * @param props.children - The article.
 * @param props.mainId - Identifier of the article region. Defaults to "main-content".
 * @param props.navigationLabel - Title of the navigation section. Defaults to "Documentation".
 * @param props.tocLabel - Title of the contents section. Defaults to "On this page".
 * @param props.navigationWidth - Width of the web's navigation column. Defaults to "md". The
 * platform stacks the navigation, so the option resolves and changes nothing here.
 * @param props.stickyToc - Whether the web keeps the contents in view. Defaults to true. The
 * platform scrolls its sections as a whole, so the option resolves and changes nothing here.
 * @param props.skipLink - Whether the web renders a skip link. Defaults to true. The platform has
 * no focus order to skip through, so the option resolves and nothing is invented for it.
 * @param props.skipLinkLabel - Wording of that link. Defaults to "Skip to content".
 * @param props.className - Extra classes applied last.
 * @returns The rendered page.
 *
 * @example
 * ```tsx
 * <DocsLayout
 *   header={<Navbar brand="Ashee" />}
 *   navigation={<Sidebar items={sections} activeKey="layout" />}
 *   toc={<Contents items={headings} />}>
 *   <Text role="heading-lg">Layout</Text>
 *   <Text role="body-md">A page is composed from the layout layer.</Text>
 * </DocsLayout>
 * ```
 *
 * @see SidebarLayout - The application shell, for a page with a navigation column.
 */
export function DocsLayout({
  navigation,
  toc,
  header,
  footer,
  children,
  mainId = "main-content",
  navigationLabel,
  tocLabel,
  navigationWidth,
  stickyToc,
  skipLink,
  skipLinkLabel,
  className,
  style,
  ...rest
}: DocsLayoutProps) {
  const config = useAsheeNativeConfig();

  const resolved = resolveConfigCascade<
    NativeDocsLayoutConfig,
    Required<NativeDocsLayoutConfig>
  >(
    {
      navigationLabel,
      tocLabel,
      navigationWidth,
      stickyToc,
      skipLink,
      skipLinkLabel,
    },
    config.components.docslayout,
    FALLBACK_NATIVE_DOCS_LAYOUT_CONFIG,
  );

  return (
    <ScrollView
      className={classNames(NATIVE_DOCS_LAYOUT_CLASS, className)}
      style={style}
      {...rest}>
      <View className={NATIVE_DOCS_LAYOUT_CONTENT_CLASS}>
        {header}

        <View
          testID="docs-layout-navigation"
          className={NATIVE_DOCS_LAYOUT_REGION_CLASS}>
          <Container size={NATIVE_DOCS_LAYOUT_BODY_SIZE}>
            <Text role="heading-sm">{resolved.navigationLabel}</Text>

            <View className={NATIVE_DOCS_LAYOUT_NAVIGATION_CLASS}>
              {navigation}
            </View>
          </Container>
        </View>

        <View
          // The platform's own identifier for a view, which is what its reader can be pointed
          // at; the web's `id` and a skip link are a keyboard's way of doing it.
          nativeID={mainId}
          testID="docs-layout-article"
          className={NATIVE_DOCS_LAYOUT_ARTICLE_CLASS}>
          <Container size={NATIVE_DOCS_LAYOUT_BODY_SIZE}>
            <View className={NATIVE_DOCS_LAYOUT_BODY_CLASS}>{children}</View>
          </Container>
        </View>

        {toc && (
          <View
            testID="docs-layout-toc"
            className={NATIVE_DOCS_LAYOUT_REGION_CLASS}>
            <Container size={NATIVE_DOCS_LAYOUT_BODY_SIZE}>
              <Text role="heading-sm">{resolved.tocLabel}</Text>

              <View className={NATIVE_DOCS_LAYOUT_NAVIGATION_CLASS}>{toc}</View>
            </Container>
          </View>
        )}

        {footer}
      </View>
    </ScrollView>
  );
}
