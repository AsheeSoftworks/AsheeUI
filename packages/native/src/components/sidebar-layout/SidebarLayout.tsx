/**
 * SidebarLayout component for the native package.
 *
 * The component satisfies the framework's sidebar-layout contract: a shell holding a header, a
 * navigation column, a content column and a footer, with the side the column sits on, its width and
 * the web's stickiness resolving through the configuration cascade. The navigation is a node the
 * consumer supplies, so the shell owns no application navigation state.
 *
 * What the platform states differently is what it has for a column. The web places the two columns
 * side by side from the `lg` breakpoint and lets the browser reflow; the platform has no media
 * query, so the shell asks `useBreakpoint` the same width once and states the direction it means:
 * stacked on a phone, and beside the content from `lg` upwards, with the separator following the
 * direction the window produced rather than a breakpoint variant. Stickiness is the web's way of
 * keeping the column in view while the document scrolls; a native shell places the column outside
 * the consumer's own scrolling region, so the option resolves through the shared contract and
 * states nothing. And the web's landmark name becomes the name the platform states on the column
 * itself, because a platform screen has no landmark vocabulary but does let a view be named.
 */

import {
  NATIVE_SIDEBAR_LAYOUT_ASIDE_CLASS,
  NATIVE_SIDEBAR_LAYOUT_ASIDE_END_BORDER_CLASS,
  NATIVE_SIDEBAR_LAYOUT_ASIDE_END_CLASS,
  NATIVE_SIDEBAR_LAYOUT_ASIDE_STACKED_BORDER_CLASS,
  NATIVE_SIDEBAR_LAYOUT_ASIDE_START_BORDER_CLASS,
  NATIVE_SIDEBAR_LAYOUT_ASIDE_STICKY_CLASS,
  NATIVE_SIDEBAR_LAYOUT_CLASS,
  NATIVE_SIDEBAR_LAYOUT_CONTENT_CLASS,
  NATIVE_SIDEBAR_LAYOUT_ROW_CLASS,
  NATIVE_SIDEBAR_LAYOUT_ROW_SPLIT_CLASS,
  NATIVE_SIDEBAR_LAYOUT_WIDTH_CLASS,
  resolveConfigCascade,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { useBreakpoint } from "../../hooks/use-breakpoint";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import {
  FALLBACK_NATIVE_SIDEBAR_LAYOUT_CONFIG,
  type NativeSidebarLayoutConfig,
} from "./sidebar-layout-config";

/**
 * Props for the native SidebarLayout.
 */
export interface SidebarLayoutProps
  extends NativeSidebarLayoutConfig,
    Omit<ViewProps, "children" | "style"> {
  /** The navigation column, typically the framework's native `Sidebar`. */
  sidebar: ReactNode;

  /** Content above both columns, typically the framework's native `Navbar`. */
  header?: ReactNode;

  /** Content below both columns. */
  footer?: ReactNode;

  /**
   * Name of the navigation column.
   *
   * The web gives it to an `aside` landmark; the platform has no landmark vocabulary, so the same
   * name is stated on the column itself, which is what a reader is told when it moves into it.
   *
   * @default "Sidebar"
   */
  sidebarLabel?: string;

  /** The content column. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * An application shell with a navigation column.
 *
 * The shell stacks its navigation above its content on a phone and places it beside the content
 * once the window is wide enough for two columns, which is the same arrangement the web's shell
 * reaches from `lg` upwards. It stacks the navigation rather than hiding it behind a control: the
 * whole shell then stays reachable, with no panel to get wrong.
 *
 * @param props - The shell's options and the platform's view props.
 * @param props.sidebar - The navigation column.
 * @param props.header - Content above both columns.
 * @param props.footer - Content below both columns.
 * @param props.sidebarLabel - Name of the navigation column. Defaults to "Sidebar".
 * @param props.side - Side the column sits on. Defaults to "start".
 * @param props.sidebarWidth - Width of the column, once the columns sit side by side. Defaults to
 * "md"; the width resolves and states nothing while the column is stacked, because a stacked
 * column is as wide as the screen.
 * @param props.stickySidebar - Whether the web keeps the column in view. Defaults to true. The
 * platform places the column outside the consumer's scrolling region, so the option resolves and
 * states nothing here.
 * @param props.className - Extra classes applied last.
 * @returns The rendered shell.
 *
 * @example
 * ```tsx
 * <SidebarLayout
 *   header={<Navbar brand="Ashee SMS" links={links} />}
 *   sidebar={<Sidebar title="Workspace" items={items} activeId="campaigns" />}
 *   footer={<Footer />}>
 *   <Text role="heading-lg">Campaigns</Text>
 * </SidebarLayout>
 * ```
 *
 * @see Sidebar - The navigation the column usually holds.
 * @see DocsLayout - The documentation page, with an article and a table of contents.
 */
export function SidebarLayout({
  sidebar,
  header,
  footer,
  sidebarLabel = "Sidebar",
  side,
  sidebarWidth,
  stickySidebar,
  className,
  style,
  children,
  ...rest
}: SidebarLayoutProps) {
  const config = useAsheeNativeConfig();
  const { isAtLeast } = useBreakpoint();

  const resolved = resolveConfigCascade<
    NativeSidebarLayoutConfig,
    Required<NativeSidebarLayoutConfig>
  >(
    { side, sidebarWidth, stickySidebar },
    config.components.sidebarlayout,
    FALLBACK_NATIVE_SIDEBAR_LAYOUT_CONFIG,
  );

  const atEnd = resolved.side === "end";
  // The web says `lg` as a variant prefix and lets the browser reflow the row; the platform asks the
  // window the same width and states the direction itself.
  const sideBySide = isAtLeast("lg");

  return (
    <View
      className={classNames(NATIVE_SIDEBAR_LAYOUT_CLASS, className)}
      style={style}
      {...rest}>
      {header}

      <View
        testID="sidebar-layout-row"
        className={classNames(
          NATIVE_SIDEBAR_LAYOUT_ROW_CLASS,
          sideBySide && NATIVE_SIDEBAR_LAYOUT_ROW_SPLIT_CLASS,
        )}>
        <View
          accessibilityLabel={sidebarLabel}
          testID="sidebar-layout-sidebar"
          className={classNames(
            NATIVE_SIDEBAR_LAYOUT_ASIDE_CLASS,
            atEnd && NATIVE_SIDEBAR_LAYOUT_ASIDE_END_CLASS,
            sideBySide
              ? atEnd
                ? NATIVE_SIDEBAR_LAYOUT_ASIDE_END_BORDER_CLASS
                : NATIVE_SIDEBAR_LAYOUT_ASIDE_START_BORDER_CLASS
              : NATIVE_SIDEBAR_LAYOUT_ASIDE_STACKED_BORDER_CLASS,
            sideBySide &&
              NATIVE_SIDEBAR_LAYOUT_WIDTH_CLASS[resolved.sidebarWidth],
            resolved.stickySidebar && NATIVE_SIDEBAR_LAYOUT_ASIDE_STICKY_CLASS,
          )}>
          {sidebar}
        </View>

        <View
          testID="sidebar-layout-content"
          className={NATIVE_SIDEBAR_LAYOUT_CONTENT_CLASS}>
          {children}
        </View>
      </View>

      {footer}
    </View>
  );
}
