/**
 * Page components for the native package.
 *
 * This file provides the four parts of an application screen: `Page` (the full-height
 * shell), `PageHeader` (a bar at the top), `PageContent` (the area that fills the height
 * between the two bars) and `PageFooter`. Together they are the application-page layer of
 * the framework's composition ladder, each usable on its own, and each reading the same
 * `components.page` configuration so one entry describes a whole screen.
 *
 * What the platform decides differently is what it can decide. The web's header sticks to
 * the top of the viewport with a scroll-linked position and blurs whatever scrolls behind
 * it; a native screen's scrolling region belongs to the consumer's `ScrollView`, so a bar
 * that must stay put is placed outside it — the platform's own way of pinning a bar — and
 * the bar paints the theme's background solidly, because there is no backdrop to blur.
 */

import {
  NATIVE_PAGE_CLASS,
  NATIVE_PAGE_CONTENT_CLASS,
  NATIVE_PAGE_DIVIDER_CLASS,
  NATIVE_PAGE_FOOTER_CLASS,
  NATIVE_PAGE_FOOTER_DIVIDER_CLASS,
  NATIVE_PAGE_FOOTER_INNER_CLASS,
  NATIVE_PAGE_HEADER_CLASS,
  NATIVE_PAGE_HEADER_INNER_CLASS,
  NATIVE_PAGE_HEADER_STICKY_CLASS,
  resolveConfigCascade,
  SPACE_PADDING_Y_CLASS,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { Container } from "../../layout/Container";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import {
  FALLBACK_NATIVE_PAGE_CONFIG,
  type NativePageConfig,
} from "./page-config";

/**
 * Resolve the shared page-part options through the standard cascade.
 *
 * The four parts answer the same five questions — nesting, width, rhythm, stickiness and
 * separators — so they resolve them the same way, and a single `components.page` entry
 * restyles a whole screen.
 *
 * @param props - The options passed to the part.
 * @returns The resolved options.
 */
function usePagePart(props: NativePageConfig): Required<NativePageConfig> {
  const config = useAsheeNativeConfig();

  return resolveConfigCascade<NativePageConfig, Required<NativePageConfig>>(
    props,
    config.components.page,
    FALLBACK_NATIVE_PAGE_CONFIG,
  );
}

/**
 * Props for the native Page shell.
 *
 * The shell states its own shape and takes no part options of its own: containment, width,
 * rhythm and the separators belong to the parts inside it, and a question about nesting
 * asked of the shell would have nothing to answer with. `components.page` still configures
 * the shell's parts.
 */
export interface PageProps extends Omit<ViewProps, "children" | "style"> {
  /** The bars and the content area the shell holds. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * The application-screen shell.
 *
 * Page is a full-height column that applies the theme background to everything inside it.
 * It adds no width, no gutter and no rhythm of its own: those belong to `Container`,
 * `PageContent` and `Section`.
 *
 * @param props - The platform's view props.
 * @param props.children - The header, the content area and the footer.
 * @returns The rendered shell.
 *
 * @example
 * ```tsx
 * <Page>
 *   <PageHeader>
 *     <Text role="heading-md">Invoices</Text>
 *   </PageHeader>
 *   <PageContent>...</PageContent>
 *   <PageFooter>
 *     <Text role="caption" tone="muted">Ashee Softworks</Text>
 *   </PageFooter>
 * </Page>
 * ```
 *
 * @see Split - Adds a second column to a screen.
 */
export function Page({ className, style, children, ...rest }: PageProps) {
  return (
    <View
      className={classNames(NATIVE_PAGE_CLASS, className)}
      style={style}
      {...rest}>
      {children}
    </View>
  );
}

/**
 * Props for the native PageHeader.
 */
export interface PageHeaderProps
  extends NativePageConfig,
    Omit<ViewProps, "children" | "style"> {
  /** The bar's content: a title, a breadcrumb, a search field or a set of actions. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * The bar at the top of a screen.
 *
 * PageHeader keeps a screen's title and its actions together above the content, and it is
 * contained by default, so a consumer adds the content and gets the framework's width and
 * gutter. The bar announces itself as the platform's header, which is what the web's
 * `header` landmark is called here.
 *
 * `sticky` is resolved like every other option, and it is the one option the platform
 * cannot honour in place: a native screen has no scroll-linked positioning, so the bar is
 * rendered where it is placed and a bar that must stay in view belongs outside the
 * scrolling region. See `NATIVE_PAGE_HEADER_STICKY_CLASS`.
 *
 * @param props - The part's options and the platform's view props.
 * @param props.sticky - Keep the bar in view. Defaults to the configured value.
 * @param props.contained - Wrap the content in a Container. Defaults to true.
 * @param props.containerSize - Container width when contained. Defaults to "lg".
 * @param props.divider - Draw a rule below the bar. Defaults to true.
 * @returns The rendered bar.
 *
 * @example
 * ```tsx
 * <PageHeader divider>
 *   <Text role="heading-md">Invoices</Text>
 *   <Button size="sm">New invoice</Button>
 * </PageHeader>
 * ```
 */
export function PageHeader({
  sticky,
  contained,
  containerSize,
  divider,
  className,
  style,
  children,
  ...rest
}: PageHeaderProps) {
  const resolved = usePagePart({ sticky, contained, containerSize, divider });
  const inner = (
    <View className={NATIVE_PAGE_HEADER_INNER_CLASS}>{children}</View>
  );

  return (
    <View
      accessibilityRole="header"
      className={classNames(
        NATIVE_PAGE_HEADER_CLASS,
        resolved.sticky && NATIVE_PAGE_HEADER_STICKY_CLASS,
        resolved.divider && NATIVE_PAGE_DIVIDER_CLASS,
        className,
      )}
      style={style}
      {...rest}>
      {resolved.contained ? (
        <Container size={resolved.containerSize}>{inner}</Container>
      ) : (
        inner
      )}
    </View>
  );
}

/**
 * Props for the native PageContent.
 */
export interface PageContentProps
  extends NativePageConfig,
    Omit<ViewProps, "children" | "style"> {
  /** The screen's content: sections, grids, forms, whatever the screen is for. */
  children?: ReactNode;

  /**
   * Extra classes appended last, so a consumer's own classes win.
   * They land where the web puts them: on the padded column inside the container, not on
   * the area that fills the screen.
   */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * The area that fills the space between the bars.
 *
 * PageContent is the part that grows to whatever height the screen has left, and it is
 * contained by default, so a screen gets the framework's maximum width and gutter without
 * any extra markup. The web renders it as the document's `main` landmark; the platform's
 * screen reader has no landmark to jump to, so the area announces nothing rather than
 * claiming a role the platform does not have.
 *
 * @param props - The part's options and the platform's view props.
 * @param props.spacing - Vertical padding of the column. Defaults to "md".
 * @param props.contained - Wrap the content in a Container. Defaults to true.
 * @param props.containerSize - Container width when contained. Defaults to "lg".
 * @returns The rendered content area.
 *
 * @example
 * ```tsx
 * <PageContent spacing="lg">
 *   <Grid columns={1} columnsLg={3} gap="lg">...</Grid>
 * </PageContent>
 * ```
 */
export function PageContent({
  contained,
  containerSize,
  spacing,
  className,
  style,
  children,
  ...rest
}: PageContentProps) {
  const resolved = usePagePart({ contained, containerSize, spacing });

  const inner = (
    <View
      className={classNames(
        SPACE_PADDING_Y_CLASS[resolved.spacing],
        "flex w-full flex-col",
        className,
      )}>
      {children}
    </View>
  );

  return (
    <View className={NATIVE_PAGE_CONTENT_CLASS} style={style} {...rest}>
      {resolved.contained ? (
        <Container size={resolved.containerSize}>{inner}</Container>
      ) : (
        inner
      )}
    </View>
  );
}

/**
 * Props for the native PageFooter.
 */
export interface PageFooterProps
  extends NativePageConfig,
    Omit<ViewProps, "children" | "style"> {
  /** The bar's content: a legal line, a build identifier or a status summary. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * The bar at the bottom of an application screen.
 *
 * PageFooter is the application counterpart of the marketing `Footer`. It carries a short
 * legal line, a build identifier or a status summary rather than navigation groups, and it
 * is the last element of a page shell. The web renders it as the document's `footer`
 * landmark; the platform announces nothing for the same reason the content area does not.
 *
 * @param props - The part's options and the platform's view props.
 * @param props.contained - Wrap the content in a Container. Defaults to true.
 * @param props.containerSize - Container width when contained. Defaults to "lg".
 * @param props.divider - Draw a rule above the bar. Defaults to true.
 * @returns The rendered bar.
 *
 * @example
 * ```tsx
 * <PageFooter>
 *   <Text role="caption" tone="muted">Version 1.1.0</Text>
 * </PageFooter>
 * ```
 *
 * @see Footer - The marketing footer, with navigation groups and social links.
 */
export function PageFooter({
  contained,
  containerSize,
  divider,
  className,
  style,
  children,
  ...rest
}: PageFooterProps) {
  const resolved = usePagePart({ contained, containerSize, divider });
  const inner = (
    <View className={NATIVE_PAGE_FOOTER_INNER_CLASS}>{children}</View>
  );

  return (
    <View
      className={classNames(
        NATIVE_PAGE_FOOTER_CLASS,
        resolved.divider && NATIVE_PAGE_FOOTER_DIVIDER_CLASS,
        className,
      )}
      style={style}
      {...rest}>
      {resolved.contained ? (
        <Container size={resolved.containerSize}>{inner}</Container>
      ) : (
        inner
      )}
    </View>
  );
}
