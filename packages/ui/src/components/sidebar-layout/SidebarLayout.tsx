/**
 * SidebarLayout component for AsheeUI.
 *
 * This file provides the `SidebarLayout` application shell: a header, a
 * persistent navigation column and a content column, arranged as one page. It
 * takes the navigation as a node rather than owning it, so a consumer passes its
 * own `Sidebar`, its own link component and its own items, and the shell stays
 * free of application navigation state.
 */

"use client";

import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { cn } from "../../utils";
import { resolveConfigCascade } from "../../utils/resolve-token";
import {
  FALLBACK_SIDEBAR_LAYOUT_CONFIG,
  type SidebarLayoutConfig,
} from "./sidebar-layout-config";
import {
  SIDEBAR_LAYOUT_ASIDE_CLASS,
  SIDEBAR_LAYOUT_ASIDE_END_BORDER_CLASS,
  SIDEBAR_LAYOUT_ASIDE_END_CLASS,
  SIDEBAR_LAYOUT_ASIDE_START_BORDER_CLASS,
  SIDEBAR_LAYOUT_ASIDE_STICKY_CLASS,
  SIDEBAR_LAYOUT_CLASS,
  SIDEBAR_LAYOUT_CONTENT_CLASS,
  SIDEBAR_LAYOUT_WIDTH_CLASS,
} from "./sidebar-layout-styles";

type BaseSidebarLayoutProps = SidebarLayoutConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "color">;

/**
 * Props for the SidebarLayout component.
 */
export interface SidebarLayoutProps extends BaseSidebarLayoutProps {
  /** The navigation column, typically the framework's `Sidebar`. */
  sidebar: ReactNode;

  /** Content above both columns, typically the framework's `Navbar`. */
  header?: ReactNode;

  /** Content below both columns. */
  footer?: ReactNode;

  /**
   * Name of the navigation landmark the sidebar is rendered in.
   * A shell usually holds one, so the name distinguishes it from the page's
   * other navigation regions.
   *
   * @default "Sidebar"
   */
  sidebarLabel?: string;

  /**
   * Element to render the shell as.
   * Defaults to a `div`.
   *
   * @default "div"
   */
  as?: ElementType;
}

/**
 * An application shell with a persistent navigation column.
 *
 * The shell is a single column on a narrow screen and two columns from the `lg`
 * breakpoint, with the navigation column sticky and independently scrollable on
 * a wide screen. It deliberately stacks the navigation above the content on a
 * narrow screen rather than hiding it behind an off-canvas drawer: the whole page
 * then stays reachable with the keyboard, with no focus trap to get wrong.
 *
 * @param props - SidebarLayout configuration options and element attributes.
 * @param props.sidebar - The navigation column.
 * @param props.header - Content above both columns.
 * @param props.footer - Content below both columns.
 * @param props.sidebarLabel - Name of the navigation landmark. Defaults to
 * "Sidebar".
 * @param props.side - Side the navigation column sits on. Defaults to "start".
 * @param props.sidebarWidth - Width of the navigation column. Defaults to "md".
 * @param props.stickySidebar - Keep the column in view. Defaults to true.
 * @param props.as - Element to render. Defaults to "div".
 * @returns The rendered shell.
 *
 * @example
 * ```tsx
 * <SidebarLayout
 *   header={<Navbar brand="Ashee SMS" links={links} />}
 *   sidebar={<Sidebar items={items} activeKey="campaigns" />}>
 *   <PageContent>
 *     <Typography role="heading-lg">Campaigns</Typography>
 *   </PageContent>
 * </SidebarLayout>
 * ```
 *
 * @see Sidebar - The navigation the column usually holds.
 * @see Page - The single-column shell, for a page without navigation.
 */
export const SidebarLayout = forwardRef<HTMLDivElement, SidebarLayoutProps>(
  (
    {
      sidebar,
      header,
      footer,
      sidebarLabel = "Sidebar",
      side,
      sidebarWidth,
      stickySidebar,
      as,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();

    const resolved = resolveConfigCascade<
      SidebarLayoutConfig,
      Required<SidebarLayoutConfig>
    >(
      { side, sidebarWidth, stickySidebar },
      config.components?.sidebarlayout,
      FALLBACK_SIDEBAR_LAYOUT_CONFIG,
    );

    const atEnd = resolved.side === "end";
    const Component: ElementType = as ?? "div";

    return (
      <Component
        ref={ref}
        className={cn(SIDEBAR_LAYOUT_CLASS, className)}
        {...rest}>
        {header}
        <div className="flex w-full flex-1 flex-col lg:flex-row">
          <aside
            aria-label={sidebarLabel}
            className={cn(
              SIDEBAR_LAYOUT_ASIDE_CLASS,
              SIDEBAR_LAYOUT_WIDTH_CLASS[resolved.sidebarWidth],
              atEnd
                ? SIDEBAR_LAYOUT_ASIDE_END_CLASS
                : SIDEBAR_LAYOUT_ASIDE_START_BORDER_CLASS,
              atEnd ? SIDEBAR_LAYOUT_ASIDE_END_BORDER_CLASS : undefined,
              resolved.stickySidebar && SIDEBAR_LAYOUT_ASIDE_STICKY_CLASS,
            )}>
            {sidebar}
          </aside>
          <div className={SIDEBAR_LAYOUT_CONTENT_CLASS}>{children}</div>
        </div>
        {footer}
      </Component>
    );
  },
);

SidebarLayout.displayName = "SidebarLayout";
